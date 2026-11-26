// Nexalia – server dell'app per Home Assistant
// Nessuna dipendenza esterna: Node 22 (http, fetch e WebSocket integrati).
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const VERSIONE = "1.10.2";
const PORTA = Number(process.env.PORTA || 8099);
const DATI = process.env.NEXALIA_DATI || "/data";
const WWW = path.join(__dirname, "www");
const TOKEN = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN || "";
const HA_HTTP = process.env.HA_HTTP || "http://supervisor/core";
const HA_WS = process.env.HA_WS || "ws://supervisor/core/websocket";
const LICENZE = process.env.NEXALIA_LICENZE || "https://licenze.nexaliahome.com";
const CLOUDFLARED = process.env.CLOUDFLARED || "/usr/bin/cloudflared";
const FILE_CONFIG = path.join(DATI, "nexalia.json");
const GIORNI_OFFLINE = 7;

// Ora locale della casa (il contenitore lavora in UTC): usa il fuso orario impostato in Home Assistant
function adesso() {
  const tz = global.fusoHA || "Europe/Rome";
  let t;
  try { t = new Date().toLocaleString("sv-SE", { timeZone: tz, hour12: false }); } catch (e) { t = new Date().toISOString().replace("T", " ").slice(0, 19); }
  const [data, orario] = t.split(" ");
  const g = new Date(data + "T12:00:00Z").getUTCDay(); // 0 = domenica
  return { data, hhmm: orario.slice(0, 5), hms: orario.slice(0, 8), giorno: g };
}
const log = (...a) => console.log(adesso().hms, ...a);

// ---------------------------------------------------------------- configurazione salvata
const CONFIG_BASE = {
  id_casa: null,
  stanze: [],            // [{id, nome, icona, entita:[entity_id]}]  vuoto = usa le aree di HA
  nascoste: [],          // entità da non mostrare
  posizioni: {},         // casa 3D: {entity_id: {x, y}}  (percentuali nella stanza)
  pianta: {},            // casa 3D: {stanza_id: {x, y, w, h}} in celle
  energia: { solare: "", rete: "", batteria: "", batteria_livello: "", casa: "", contatore_kw: 3, differibili: [] },
  agente: { notifica: "", spegni_luci_uscita: false, avvisa_consumi: true, avvisa_finestre_pioggia: true },
  raccolta: { attiva: false, ora: "20:00", calendario: {} },   // calendario: {"1":"Organico", ...} giorno settimana 1-7 -> tipo (sera prima)
  aspetto: { nome_casa: "" },
  assist: { agente: "", voce: false, nascondi: false, tts_motore: "", tts_voce: "", altoparlante: "", personalita: "", prompt: "" }, // voce di Home Assistant (Piper, cloud…) e carattere dell'assistente AI
  personalizza: {},      // {entity_id: {nome, icona, gruppo}}
  sezioni_ordine: [],
  generali: { admin: "", intestazione_fissa: true },
  pastiglie: { attive: ["sicurezza", "posta", "rifiuti", "porte", "finestre", "serrature", "aggiornamenti", "clima", "pioggia_adesso"], meteo: "", sensori_meteo: false, temperatura: "", umidita: "", vento: "", pioggia: "", pioggia_oggi: "", posta: "", rifiuti_ora: 18 },
  antifurto: { entita: "", modi: ["armed_home", "armed_away", "armed_night"], scattato: "", scattato_valore: "", sirena: "", zona: "", tasti: [] },
  widget: { compatte: "auto", popup_avvisi: true, elenco: [], avvisi: [] },
  azioni: [],            // [{tipo, icona, nome, entita, lista:[], conferma}]
  sez_gen: {},           // {sezione: {campi:{chiave: entità}, aggiunte:[], escluse:[], extra:{}}}
  mie_sezioni: [],       // [{id, nome, icona, entita:[]}]
  mie_entita: [],        // [{scheda, icona, nome, entita}]: entità in più, in fondo alla scheda scelta
  stanze_cfg: { piani: [], vista: "tessere", stanze: [] }, // stanze come GdAHome: nome, icona, piano, all'aperto, ordine
  home: { riquadri: ["stanze", "diario", "preferiti", "consumo", "persone", "aperture", "allarme"], preferiti: [] },
  sezioni: ["agente", "stanze", "comandi", "energia", "sicurezza", "persone", "scenari", "raccolta"],
  tema: "scuro",
  licenza: { codice: "", stato: "gratuita", scadenza: null, indirizzo: null, tunnel_token: null, ultimo_ok: null, messaggio: "" },
};

function carica() {
  let c = {};
  try { c = JSON.parse(fs.readFileSync(FILE_CONFIG, "utf8")); } catch (e) {}
  const out = JSON.parse(JSON.stringify(CONFIG_BASE));
  for (const k of Object.keys(c)) {
    if (out[k] && typeof out[k] === "object" && !Array.isArray(out[k]) && c[k] && typeof c[k] === "object" && !Array.isArray(c[k])) Object.assign(out[k], c[k]);
    else out[k] = c[k];
  }
  if (!out.id_casa) out.id_casa = crypto.randomBytes(16).toString("hex");
  return out;
}
let config = carica();
function salva() {
  try {
    fs.mkdirSync(DATI, { recursive: true });
    fs.writeFileSync(FILE_CONFIG + ".tmp", JSON.stringify(config, null, 1));
    fs.renameSync(FILE_CONFIG + ".tmp", FILE_CONFIG);
  } catch (e) { log("Salvataggio fallito:", e.message); }
}
salva();

const completa = () => config.licenza.stato === "attiva";

// config inviata alla plancia: senza il token del tunnel
function configPubblica() {
  const c = JSON.parse(JSON.stringify(config));
  delete c.licenza.tunnel_token;
  delete c.id_casa;
  c.licenza.completa = completa();
  return c;
}

// ---------------------------------------------------------------- collegamento a Home Assistant
const ha = { ws: null, pronto: false, id: 1, attese: new Map(), stati: {}, aree: [], dispositivi: [], entita: [], config: {}, servizi: {} };
const clientiSSE = new Set();

function inviaSSE(tipo, dati) {
  const riga = `event: ${tipo}\ndata: ${JSON.stringify(dati)}\n\n`;
  for (const r of clientiSSE) { try { r.write(riga); } catch (e) {} }
}

function wsChiama(msg, timeout = 20000) {
  return new Promise((ok, ko) => {
    if (!ha.ws || !ha.pronto) return ko(new Error("Home Assistant non collegato"));
    const id = ha.id++;
    const t = setTimeout(() => { ha.attese.delete(id); ko(new Error("Home Assistant non risponde")); }, timeout);
    ha.attese.set(id, { ok: (r) => { clearTimeout(t); ok(r); }, ko: (e) => { clearTimeout(t); ko(e); } });
    ha.ws.send(JSON.stringify({ ...msg, id }));
  });
}

async function haRest(metodo, percorso, corpo) {
  const r = await fetch(HA_HTTP + percorso, {
    method: metodo,
    headers: { authorization: "Bearer " + TOKEN, "content-type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!r.ok) throw new Error("Home Assistant: " + r.status + " " + (await r.text()).slice(0, 200));
  const t = r.headers.get("content-type") || "";
  return t.includes("json") ? r.json() : r.text();
}

// cambia le istruzioni (prompt) di un agente AI di Home Assistant passando dalla sua riconfigurazione, come si fa a mano
async function scriviPrompt(agente, prompt) {
  const reg = await wsChiama({ type: "config/entity_registry/get", entity_id: agente });
  if (!reg || !reg.config_entry_id) throw new Error("Questo assistente non è un agente AI configurabile");
  const val = (sch) => { const d = {}; for (const c of sch || []) { const v = c.description && c.description.suggested_value != null ? c.description.suggested_value : c.default; if (v != null) d[c.name] = v; } return d; };
  let passo;
  if (reg.config_subentry_id) {
    const sub = (await wsChiama({ type: "config_entries/subentries/list", entry_id: reg.config_entry_id })).find((x) => x.subentry_id === reg.config_subentry_id) || {};
    passo = await haRest("POST", "/api/config/config_entries/subentries/flow", { handler: [reg.config_entry_id, sub.subentry_type || "conversation"], subentry_id: reg.config_subentry_id });
    for (let i = 0; i < 5 && passo.type === "form"; i++) {
      const dati = val(passo.data_schema); if ((passo.data_schema || []).some((c) => c.name === "prompt")) dati.prompt = prompt;
      passo = await haRest("POST", "/api/config/config_entries/subentries/flow/" + passo.flow_id, dati);
    }
  } else {
    passo = await haRest("POST", "/api/config/config_entries/options/flow", { handler: reg.config_entry_id });
    for (let i = 0; i < 5 && passo.type === "form"; i++) {
      const dati = val(passo.data_schema); if ((passo.data_schema || []).some((c) => c.name === "prompt")) dati.prompt = prompt;
      passo = await haRest("POST", "/api/config/config_entries/options/flow/" + passo.flow_id, dati);
    }
  }
  if (!["create_entry", "abort"].includes(passo.type) || (passo.type === "abort" && passo.reason !== "reconfigure_successful")) throw new Error("Home Assistant non ha accettato le istruzioni (" + (passo.reason || passo.type) + ")");
  return { esito: passo.type };
}

async function caricaRegistri() {
  const [stati, aree, disp, ent, cfg, serv] = await Promise.all([
    wsChiama({ type: "get_states" }),
    wsChiama({ type: "config/area_registry/list" }).catch(() => []),
    wsChiama({ type: "config/device_registry/list" }).catch(() => []),
    wsChiama({ type: "config/entity_registry/list" }).catch(() => []),
    wsChiama({ type: "get_config" }).catch(() => ({})),
    wsChiama({ type: "get_services" }).catch(() => ({})),
  ]);
  ha.stati = {};
  for (const s of stati) ha.stati[s.entity_id] = s;
  ha.aree = aree.map((a) => ({ id: a.area_id, nome: a.name, icona: a.icon || null }));
  ha.dispositivi = disp.map((d) => ({ id: d.id, area: d.area_id, nome: d.name_by_user || d.name, produttore: d.manufacturer, modello: d.model }));
  ha.entita = ent.map((e) => ({ id: e.entity_id, area: e.area_id, dispositivo: e.device_id, nascosta: !!(e.hidden_by || e.disabled_by), categoria: e.entity_category || null }));
  ha.config = { nome: cfg.location_name, unita: cfg.unit_system, lingua: cfg.language, fuso: cfg.time_zone, versione: cfg.version };
  if (cfg.time_zone) global.fusoHA = cfg.time_zone;
  ha.servizi = Object.fromEntries(Object.entries(serv).map(([d, s]) => [d, Object.keys(s)]));
  inviaSSE("ricarica", {});
}

function collegaHA() {
  if (!TOKEN) { log("Manca il token di Home Assistant: la plancia non può leggere i dispositivi."); return; }
  let ws;
  try { ws = new WebSocket(HA_WS); } catch (e) { log("WebSocket:", e.message); return setTimeout(collegaHA, 5000); }
  ha.ws = ws; ha.pronto = false;
  ws.onmessage = async (ev) => {
    let m; try { m = JSON.parse(typeof ev.data === "string" ? ev.data : ev.data.toString()); } catch (e) { return; }
    const lista = Array.isArray(m) ? m : [m];
    for (const msg of lista) {
      if (msg.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: TOKEN }));
      else if (msg.type === "auth_ok") {
        ha.pronto = true; log("Collegato a Home Assistant", msg.ha_version || "");
        try {
          await wsChiama({ type: "subscribe_events", event_type: "state_changed" });
          for (const e of ["area_registry_updated", "entity_registry_updated", "device_registry_updated"]) await wsChiama({ type: "subscribe_events", event_type: e });
          await caricaRegistri();
          setTimeout(() => { try { controllaUscita(); controllaAllarme(); controllaConsumi(); } catch (e) {} }, 8000);
        } catch (e) { log("Iscrizione eventi fallita:", e.message); }
      } else if (msg.type === "auth_invalid") { log("Token di Home Assistant rifiutato"); }
      else if (msg.type === "result") {
        const a = ha.attese.get(msg.id); if (!a) continue; ha.attese.delete(msg.id);
        msg.success ? a.ok(msg.result) : a.ko(new Error((msg.error && msg.error.message) || "Errore Home Assistant"));
      } else if (msg.type === "event" && msg.event) {
        const e = msg.event;
        if (e.event_type === "state_changed") {
          const { entity_id, new_state, old_state } = e.data;
          if (new_state) ha.stati[entity_id] = new_state; else delete ha.stati[entity_id];
          inviaSSE("stato", { id: entity_id, s: new_state });
          try { agenteCambio(entity_id, old_state, new_state); } catch (er) { log("Agente:", er.message); }
          try { if (old_state && new_state && old_state.state !== new_state.state) avvisiAlexa(entity_id, new_state); } catch (er) {}
        } else { clearTimeout(ha.tRicarica); ha.tRicarica = setTimeout(() => caricaRegistri().catch(() => {}), 1500); }
      }
    }
  };
  ws.onclose = () => {
    ha.pronto = false;
    for (const a of ha.attese.values()) a.ko(new Error("Collegamento chiuso"));
    ha.attese.clear();
    log("Home Assistant scollegato, riprovo tra 5 secondi");
    setTimeout(collegaHA, 5000);
  };
  ws.onerror = () => {};
}

// ---------------------------------------------------------------- agente
const diario = []; // [{t, tipo:"info"|"fatto"|"avviso", icona, titolo, testo, stanza}]
function annota(voce) {
  const v = { t: Date.now(), tipo: "info", ...voce };
  diario.unshift(v); if (diario.length > 150) diario.pop();
  inviaSSE("diario", v);
  return v;
}
const nome = (id) => (ha.stati[id] && ha.stati[id].attributes.friendly_name) || id;
const dominio = (id) => id.split(".")[0];
const classe = (id) => (ha.stati[id] && ha.stati[id].attributes.device_class) || "";
function areaDi(id) {
  for (const st of config.stanze) if ((st.entita || []).includes(id)) return st.nome;
  const e = ha.entita.find((x) => x.id === id); if (!e) return "";
  let a = e.area; if (!a && e.dispositivo) { const d = ha.dispositivi.find((x) => x.id === e.dispositivo); a = d && d.area; }
  const ar = ha.aree.find((x) => x.id === a); return ar ? ar.nome : "";
}
async function servizio(dom, srv, dati) {
  return wsChiama({ type: "call_service", domain: dom, service: srv, service_data: dati || {} });
}
async function notifica(titolo, testo, categoria = "casa") {
  annunciaEcho(testo || titolo, categoria);
  const n = config.agente.notifica;
  try {
    if (n && n.startsWith("notify.")) await servizio("notify", n.slice(7), { title: titolo, message: testo });
    else await servizio("persistent_notification", "create", { title: titolo, message: testo, notification_id: "nexalia_" + Date.now() });
  } catch (e) { log("Notifica non inviata:", e.message); }
}
function numero(id) { const s = ha.stati[id]; if (!s) return null; const v = parseFloat(s.state); if (isNaN(v)) return null; const u = (s.attributes.unit_of_measurement || "").toLowerCase(); return u === "kw" ? v * 1000 : v; }

const APERTURE = ["door", "window", "garage_door", "opening"];
const PERICOLI = { smoke: "fumo", gas: "gas", moisture: "acqua", carbon_monoxide: "monossido", problem: "un problema" };
let ultimoAvvisoConsumi = 0;

function agenteCambio(id, vecchio, nuovo) {
  if (!nuovo || !vecchio || vecchio.state === nuovo.state) return;
  const d = dominio(id), c = classe(id), stanza = areaDi(id), s = nuovo.state;
  if (d === "person") {
    if (s === "home") { annota({ icona: "persone", titolo: nome(id) + " è rientrato a casa", stanza: "Casa" }); annunciaEcho(nome(id) + " è arrivato a casa", "persone"); }
    else if (vecchio.state === "home") {
      annota({ icona: "persone", titolo: nome(id) + " è uscito", testo: s !== "not_home" ? "Ora è in " + s : "", stanza: "Casa" });
      const tutti = Object.values(ha.stati).filter((x) => x.entity_id.startsWith("person."));
      if (tutti.length && tutti.every((p) => p.state !== "home")) uscitiTutti();
    }
  } else if (d === "binary_sensor" && PERICOLI[c] && s === "on") {
    const v = annota({ tipo: "avviso", icona: "allerta", titolo: "Rilevato " + PERICOLI[c] + (stanza ? " in " + stanza.toLowerCase() : ""), testo: nome(id), stanza });
    notifica("Nexalia – attenzione", v.titolo, "urgenti");
  } else if (d === "binary_sensor" && APERTURE.includes(c) && s === "on" && !accessorio(id)) {
    const allarme = Object.values(ha.stati).find((x) => x.entity_id.startsWith("alarm_control_panel.") && x.state.startsWith("armed"));
    if (allarme) {
      const v = annota({ tipo: "avviso", icona: "sicurezza", titolo: nome(id) + " aperta con l'allarme inserito", stanza });
      notifica("Nexalia – allarme", v.titolo, "sicurezza");
    } else if (config.agente.avvisa_finestre_pioggia && c === "window" && piove()) {
      annota({ tipo: "avviso", icona: "goccia", titolo: "Sta piovendo e " + nome(id).toLowerCase() + " è aperta", stanza });
    }
  } else if (d === "alarm_control_panel") {
    const t = { armed_away: "Allarme inserito (totale)", armed_home: "Allarme inserito (in casa)", armed_night: "Allarme inserito (notte)", disarmed: "Allarme disinserito", triggered: "ALLARME SCATTATO" }[s];
    if (t) { const v = annota({ tipo: s === "triggered" ? "avviso" : "info", icona: "sicurezza", titolo: t }); if (s === "triggered") notifica("Nexalia – allarme", v.titolo + ": " + nome(id), "urgenti"); else annunciaEcho(t, "sicurezza"); }
  } else if (d === "weather" && config.agente.avvisa_finestre_pioggia && ["rainy", "pouring", "lightning-rainy"].includes(s)) {
    const aperte = Object.values(ha.stati).filter((x) => x.entity_id.startsWith("binary_sensor.") && x.attributes.device_class === "window" && x.state === "on" && !accessorio(x.entity_id));
    if (aperte.length) { const v = annota({ tipo: "avviso", icona: "goccia", titolo: "Inizia a piovere: " + aperte.length + (aperte.length === 1 ? " finestra aperta" : " finestre aperte"), testo: aperte.map((x) => x.attributes.friendly_name).join(", ") }); notifica("Nexalia", v.titolo); }
  }
  if (config.energia.casa && id === config.energia.casa) controllaConsumi();
  if (d === "person" || d === "alarm_control_panel" || d === "light" || (d === "binary_sensor" && ["window", "door", "garage_door"].includes(c))) controllaUscita();
  if (d === "alarm_control_panel") controllaAllarme();
}

function piove() { return Object.values(ha.stati).some((x) => x.entity_id.startsWith("weather.") && ["rainy", "pouring", "lightning-rainy"].includes(x.state)); }

// luci/interruttori di smart speaker e display (Echo Show ecc.): non sono vere luci
function accessorio(id) {
  const e = ha.entita.find((x) => x.id === id);
  if (/\b(echo|alexa)\b|non disturbare|do not disturb/i.test(nome(id) + " " + id)) return true;
  if (!e || !e.dispositivo) return false;
  const d = ha.dispositivi.find((x) => x.id === e.dispositivo) || {};
  if (/amazon|echo|alexa|google home|nest (hub|mini|audio)|sonos|homepod/i.test([d.produttore, d.modello, d.nome].join(" "))) return true;
  return ha.entita.some((x) => x.dispositivo === e.dispositivo && /^(media_player|assist_satellite|camera)\./.test(x.id));
}

// ---------------------------------------------------------------- Richieste dell'agente
// L'agente non fa mai nulla da solo: quando vede qualcosa che non va lo mostra sulla plancia e chiede. Agisce solo se tocchi un pulsante.
const richieste = new Map(); // chiave -> { chiave, t, livello, icona, titolo, testo, azioni:[{etichetta, tipo:"servizio"|"vai", dominio, servizio, dati, vai}] }
function chiedi(r) {
  const v = { t: Date.now(), livello: "attenzione", icona: "agente", azioni: [], ...r };
  const gia = richieste.get(v.chiave);
  richieste.set(v.chiave, v); inviaSSE("richieste", [...richieste.values()]);
  if (!gia) { annota({ tipo: "avviso", icona: v.icona, titolo: v.titolo, testo: v.testo || "" }); notifica("Nexalia", v.titolo + (v.testo ? " – " + v.testo : ""), v.livello === "urgente" ? "urgenti" : "casa"); }
  return v;
}
function chiudiRichiesta(chiave) { if (richieste.delete(chiave)) inviaSSE("richieste", [...richieste.values()]); }
const tuttiFuori = () => { const p = Object.values(ha.stati).filter((x) => x.entity_id.startsWith("person.")); return p.length > 0 && p.every((x) => x.state !== "home"); };
const centrale = () => { const c = (config.antifurto || {}).entita; if (c && ha.stati[c]) return c; const x = Object.values(ha.stati).find((y) => y.entity_id.startsWith("alarm_control_panel.")); return x ? x.entity_id : null; };
const apertureAperte = () => Object.values(ha.stati).filter((x) => x.entity_id.startsWith("binary_sensor.") && ["window", "door", "garage_door"].includes(x.attributes.device_class) && x.state === "on" && !accessorio(x.entity_id));
function controllaUscita() {
  if (!tuttiFuori()) { for (const k of ["antifurto_fuori", "aperture_fuori", "luci_fuori"]) chiudiRichiesta(k); return; }
  const c = centrale();
  if (c && ha.stati[c].state === "disarmed") {
    const modo = ((config.antifurto || {}).modi || []).includes("armed_away") ? "alarm_arm_away" : "alarm_arm_away";
    chiedi({ chiave: "antifurto_fuori", icona: "sicurezza", titolo: "Siete usciti tutti e l'antifurto non è inserito", testo: "Vuoi che lo inserisca?", azioni: [{ etichetta: "Inserisci l'antifurto", tipo: "servizio", dominio: "alarm_control_panel", servizio: modo, dati: { entity_id: c } }] });
  } else chiudiRichiesta("antifurto_fuori");
  const ap = apertureAperte();
  if (ap.length) chiedi({ chiave: "aperture_fuori", icona: "finestra", titolo: "Siete tutti fuori e " + (ap.length === 1 ? nome(ap[0].entity_id).toLowerCase() + " è aperta" : ap.length + " porte o finestre sono aperte"), testo: ap.length > 1 ? ap.map((x) => x.attributes.friendly_name).join(", ") : "", azioni: [{ etichetta: "Vedi in Sicurezza", tipo: "vai", vai: "sicurezza" }] });
  else chiudiRichiesta("aperture_fuori");
  const accese = Object.values(ha.stati).filter((x) => x.entity_id.startsWith("light.") && x.state === "on" && !accessorio(x.entity_id));
  if (accese.length) chiedi({ chiave: "luci_fuori", icona: "luci", titolo: "Siete tutti fuori e " + (accese.length === 1 ? "una luce è accesa" : accese.length + " luci sono accese"), testo: "Le spengo?", azioni: [{ etichetta: "Spegni " + (accese.length === 1 ? "la luce" : "le luci"), tipo: "servizio", dominio: "light", servizio: "turn_off", dati: { entity_id: accese.map((x) => x.entity_id) } }] });
  else chiudiRichiesta("luci_fuori");
}
async function uscitiTutti() { controllaUscita(); }

async function controllaConsumi() {
  if (!config.agente.avvisa_consumi) return;
  const w = numero(config.energia.casa), lim = (Number(config.energia.contatore_kw) || 3) * 1000;
  if (w == null) return;
  if (w < lim * 0.85) return chiudiRichiesta("consumi");
  if (w < lim * 0.92 || (richieste.has("consumi") && Date.now() - ultimoAvvisoConsumi < 10 * 60000)) return;
  ultimoAvvisoConsumi = Date.now();
  const diff = (config.energia.differibili || []).filter((id) => ha.stati[id] && ha.stati[id].state === "on");
  chiedi({ chiave: "consumi", icona: "energia", livello: w >= lim ? "urgente" : "attenzione", titolo: "Consumi a " + (w / 1000).toFixed(1).replace(".", ",") + " kW: " + (w >= lim ? "oltre" : "vicino al") + " limite di " + config.energia.contatore_kw + " kW", testo: diff.length ? "Vuoi che spenga qualcosa?" : "Spegni qualche elettrodomestico per non far saltare il contatore.", azioni: diff.slice(0, 3).map((id) => ({ etichetta: "Spegni " + nome(id).toLowerCase(), tipo: "servizio", dominio: dominio(id), servizio: "turn_off", dati: { entity_id: id } })) });
}
function controllaAllarme() {
  const c = centrale();
  if (c && ha.stati[c].state === "triggered") chiedi({ chiave: "allarme", livello: "urgente", icona: "sicurezza", titolo: "L'antifurto sta suonando!", testo: nome(c), azioni: [{ etichetta: "Guarda le telecamere", tipo: "vai", vai: "sicurezza" }, { etichetta: "Disinserisci", tipo: "servizio", dominio: "alarm_control_panel", servizio: "alarm_disarm", dati: { entity_id: c } }] });
  else chiudiRichiesta("allarme");
}

// ---------------------------------------------------------------- Alexa: gli Echo dicono le notifiche
const sezX = (id) => ((config.sez_gen || {})[id] || {});
const minuti = (hhmm) => { const m = String(hhmm || "").match(/^(\d{1,2}):(\d{2})$/); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
function inFascia(da, a, ora) { const x = minuti(da), y = minuti(a), z = minuti(ora); if (x == null || y == null || z == null) return false; return x <= y ? z >= x && z < y : z >= x || z < y; }
async function diQualcosa(testo, echi, modo) {
  const lista = (echi || []).filter((e) => ha.stati[e]);
  if (!lista.length || !testo) return;
  try { await servizio("notify", "alexa_media", { message: testo, target: lista, data: { type: modo === "voce" ? "tts" : "announce" } }); }
  catch (e) { log("Echo non raggiungibili:", e.message); }
}
function annunciaEcho(testo, categoria) {
  const x = sezX("notifiche").extra || {};
  if (!x.attiva || !(x.categorie || []).includes(categoria)) return;
  if (x.notte && categoria !== "urgenti" && inFascia(x.notte_da || "23:00", x.notte_a || "07:00", adesso().hhmm)) return;
  diQualcosa(testo, x.echi, x.modo);
}
// avvisi personalizzati degli Echo: a orario o quando un'entità cambia
const avvisiDetti = new Set();
function avvisiAlexa(id, nuovo) {
  const av = (sezX("avvisi_alexa").extra || {}).avvisi || [], x = sezX("notifiche").extra || {};
  for (const a of av) {
    if (a.tipo !== "cambio" || a.entita !== id || !nuovo) continue;
    if (String(nuovo.state) !== String(a.valore || "on")) continue;
    diQualcosa(a.testo, (a.echi && a.echi.length) ? a.echi : x.echi, x.modo);
  }
}
// piscina: filtrazione giornaliera; irrigazione: programma
const irrigazioneInCorso = new Set();
async function annaffia(motivo) {
  const ir = sezX("irrigazione"), zone = (ir.elementi || []).filter((z) => z.entita && ha.stati[z.entita]);
  if (!zone.length || irrigazioneInCorso.size) return;
  annota({ icona: "goccia", titolo: "Irrigazione partita", testo: motivo, stanza: "Giardino" });
  for (const z of zone) {
    irrigazioneInCorso.add(z.entita);
    const d = dominio(z.entita);
    try { await servizio(d === "valve" ? "valve" : "homeassistant", d === "valve" ? "open_valve" : "turn_on", { entity_id: z.entita }); } catch (e) {}
    await new Promise((r) => setTimeout(r, Math.max(1, Number(z.minuti) || 10) * 60000));
    try { await servizio(d === "valve" ? "valve" : "homeassistant", d === "valve" ? "close_valve" : "turn_off", { entity_id: z.entita }); } catch (e) {}
    irrigazioneInCorso.delete(z.entita);
  }
  annota({ tipo: "fatto", icona: "goccia", titolo: "Irrigazione finita", stanza: "Giardino" });
}
let ultimoAutoIrriga = "";
setInterval(() => {
  if (!ha.pronto) return;
  const { hhmm, data: oggi, giorno } = adesso();
  // avvisi Alexa a orario
  for (const a of (sezX("avvisi_alexa").extra || {}).avvisi || []) {
    if (a.tipo !== "orario" || a.ora !== hhmm) continue;
    if ((a.giorni || []).length && !a.giorni.map(Number).includes(giorno)) continue;
    const k = oggi + hhmm + a.testo; if (avvisiDetti.has(k)) continue; avvisiDetti.add(k);
    diQualcosa(a.testo, (a.echi && a.echi.length) ? a.echi : (sezX("notifiche").extra || {}).echi, (sezX("notifiche").extra || {}).modo);
  }
  // piscina
  for (const v of sezX("piscina").elementi || []) {
    if (!v.filtra || !v.pompa || !ha.stati[v.pompa] || minuti(v.ora_inizio) == null) continue;
    const t = numero(v.temperatura), ore = v.ore_auto && t != null ? Math.max(2, Math.min(24, Math.round(t / 2))) : Number(v.ore) || 8;
    const inizio = minuti(v.ora_inizio), fine = (inizio + ore * 60) % 1440, ora = minuti(hhmm);
    if (ora === inizio) { servizio("homeassistant", "turn_on", { entity_id: v.pompa }).catch(() => {}); annota({ icona: "goccia", titolo: "Filtrazione " + (v.nome || "piscina") + " avviata", testo: ore + " ore" }); }
    if (ora === fine) { servizio("homeassistant", "turn_off", { entity_id: v.pompa }).catch(() => {}); annota({ icona: "goccia", titolo: "Filtrazione " + (v.nome || "piscina") + " finita" }); }
  }
  // irrigazione
  const ir = sezX("irrigazione").extra || {};
  if (ir.attivo) {
    const umid = numero(ir.umidita_suolo), prob = numero(ir.prob_pioggia);
    if ((ir.orari || []).includes(hhmm)) {
      if (umid != null && ir.salta_sopra !== "" && ir.salta_sopra != null && umid >= Number(ir.salta_sopra)) annota({ icona: "goccia", titolo: "Irrigazione saltata", testo: "Terreno già bagnato (" + Math.round(umid) + "%)" });
      else if (prob != null && prob >= (Number(ir.prob_max) || 70)) annota({ icona: "goccia", titolo: "Irrigazione saltata", testo: "Probabilità di pioggia " + Math.round(prob) + "%" });
      else annaffia("Programma delle " + hhmm);
    } else if (umid != null && ir.avvia_sotto !== "" && ir.avvia_sotto != null && umid < Number(ir.avvia_sotto) && ultimoAutoIrriga !== oggi) { ultimoAutoIrriga = oggi; annaffia("Terreno secco (" + Math.round(umid) + "%)"); }
  }
}, 30000);

// promemoria raccolta + batterie, ogni minuto
let ultimoPromemoria = "", ultimoControlloBatterie = "";
setInterval(() => {
  const { hhmm, data: oggi, giorno } = adesso();
  const r = config.raccolta;
  if (r.attiva && hhmm === r.ora && ultimoPromemoria !== oggi) {
    ultimoPromemoria = oggi;
    const domani = ((giorno + 1) % 7) || 7; // 1 = lunedì ... 7 = domenica
    const tipo = r.calendario[String(domani)];
    if (tipo) { const v = annota({ tipo: "avviso", icona: "raccolta", titolo: "Stasera porta fuori: " + tipo, testo: "Domani mattina passa la raccolta.", stanza: "Raccolta" }); notifica("Nexalia – raccolta", v.titolo); }
  }
  if (hhmm === "09:00" && ultimoControlloBatterie !== oggi) {
    ultimoControlloBatterie = oggi;
    const scariche = Object.values(ha.stati).filter((x) => x.attributes.device_class === "battery" && x.entity_id.startsWith("sensor.") && parseFloat(x.state) <= 15);
    if (scariche.length) annota({ tipo: "avviso", icona: "batteria", titolo: scariche.length === 1 ? "Una batteria è quasi scarica" : scariche.length + " batterie quasi scariche", testo: scariche.map((x) => x.attributes.friendly_name + " " + x.state + "%").join(" · ") });
  }
}, 30000);

// ---------------------------------------------------------------- licenza e accesso da fuori casa
let tunnel = null, tunnelStato = "spento";
function avviaTunnel() {
  fermaTunnel();
  const tk = config.licenza.tunnel_token;
  if (!tk || !completa()) return;
  if (!fs.existsSync(CLOUDFLARED)) { tunnelStato = "mancante"; log("cloudflared non trovato"); return; }
  tunnelStato = "avvio";
  tunnel = spawn(CLOUDFLARED, ["tunnel", "--no-autoupdate", "run", "--token", tk], { stdio: ["ignore", "pipe", "pipe"] });
  const leggi = (b) => { const t = b.toString(); if (/Registered tunnel connection|Connection .* registered/i.test(t)) tunnelStato = "attivo"; };
  tunnel.stdout.on("data", leggi); tunnel.stderr.on("data", leggi);
  tunnel.on("exit", (c) => { const era = tunnel; tunnel = null; tunnelStato = "spento"; if (era && !era.voluto && completa()) { log("Tunnel chiuso (" + c + "), riavvio tra 15 s"); setTimeout(avviaTunnel, 15000); } });
}
function fermaTunnel() { if (tunnel) { tunnel.voluto = true; tunnel.kill(); tunnel = null; } tunnelStato = "spento"; }

async function chiamaLicenze(percorso, corpo) {
  const r = await fetch(LICENZE + percorso, { method: "POST", headers: { "content-type": "application/json", "user-agent": "Nexalia/" + VERSIONE }, body: JSON.stringify(corpo) });
  const d = await r.json().catch(() => ({ ok: false, errore: "Risposta non valida dal server licenze" }));
  return { http: r.status, ...d };
}

async function attivaLicenza(codice) {
  codice = String(codice || "").trim().toUpperCase();
  if (!/^NXL-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(codice)) return { ok: false, errore: "Il codice ha la forma NXL-XXXX-XXXX" };
  const d = await chiamaLicenze("/api/attiva", { codice, id_casa: config.id_casa });
  if (!d.ok) return { ok: false, errore: d.errore || "Attivazione non riuscita" };
  Object.assign(config.licenza, { codice, stato: "attiva", scadenza: d.scadenza, indirizzo: d.indirizzo, tunnel_token: d.tunnel_token, ultimo_ok: Date.now(), messaggio: "" });
  salva(); avviaTunnel();
  annota({ tipo: "fatto", icona: "sicurezza", titolo: "Licenza completa attivata", testo: "L'accesso da fuori casa è pronto: trovi il collegamento in Impostazioni." });
  return { ok: true };
}

async function disattivaLicenza() {
  const codice = config.licenza.codice;
  let d = { ok: true };
  if (codice) d = await chiamaLicenze("/api/disattiva", { codice, id_casa: config.id_casa }).catch((e) => ({ ok: false, errore: e.message }));
  fermaTunnel();
  config.licenza = { ...CONFIG_BASE.licenza };
  salva();
  return { ok: true, avviso: d.ok ? "" : d.errore };
}

async function verificaLicenza() {
  const l = config.licenza;
  if (!l.codice) return;
  try {
    const d = await chiamaLicenze("/api/verifica", { codice: l.codice, id_casa: config.id_casa });
    if (d.ok) { Object.assign(l, { stato: "attiva", scadenza: d.scadenza, indirizzo: d.indirizzo || l.indirizzo, ultimo_ok: Date.now(), messaggio: "" }); if (!tunnel) avviaTunnel(); }
    else if (d.stato === "scaduta") { fermaTunnel(); Object.assign(l, { stato: "scaduta", scadenza: d.scadenza, messaggio: "Licenza scaduta il " + d.scadenza + ". Rinnovala per riavere tutte le sezioni." }); }
    else if (d.http === 404 || d.stato === "revocata" || d.stato === "non_valida") { fermaTunnel(); Object.assign(l, { stato: "gratuita", messaggio: "La licenza non è più valida su questa casa." }); }
    salva();
  } catch (e) {
    // server non raggiungibile: si continua per qualche giorno
    if (l.stato === "attiva" && l.ultimo_ok && Date.now() - l.ultimo_ok > GIORNI_OFFLINE * 86400000) {
      fermaTunnel(); l.stato = "gratuita"; l.messaggio = "Nessun contatto con il server licenze da " + GIORNI_OFFLINE + " giorni."; salva();
    }
  }
}
setInterval(verificaLicenza, 6 * 3600000);

// ---------------------------------------------------------------- aggiornamenti
// Controlla su GitHub se c'è una versione nuova: la segnala con una notifica in Home Assistant e nella plancia,
// e chiede al Supervisor di ricaricare lo store, così compare subito anche in Impostazioni › Aggiornamenti.
const REPO_RAW = "https://raw.githubusercontent.com/seremau14/nexalia/main/nexalia/";
let aggiornamento = null; // { versione, note, link }
const piuNuova = (a, b) => { const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
async function supervisor(metodo, percorso) {
  const r = await fetch("http://supervisor" + percorso, { method: metodo, headers: { authorization: "Bearer " + TOKEN } });
  return r.ok ? r.json().catch(() => ({})) : null;
}
let slugApp = null;
async function linkApp() {
  if (!slugApp) { try { const d = await supervisor("GET", "/addons/self/info"); slugApp = d && d.data && d.data.slug; } catch (e) {} }
  return slugApp ? "/config/app/" + slugApp + "/info" : "/config/apps/installed";
}
async function controllaAggiornamenti() {
  try {
    const cfgTxt = await (await fetch(REPO_RAW + "config.yaml", { headers: { "cache-control": "no-cache" } })).text();
    const m = cfgTxt.match(/^version:\s*"?([0-9.]+)"?/m);
    if (!m) return;
    const nuova = m[1];
    if (!piuNuova(nuova, VERSIONE)) {
      aggiornamento = null;
      if (config.avviso_aggiornamento) { delete config.avviso_aggiornamento; salva(); servizio("persistent_notification", "dismiss", { notification_id: "nexalia_aggiornamento" }).catch(() => {}); }
      return;
    }
    let note = "";
    try {
      const ch = await (await fetch(REPO_RAW + "CHANGELOG.md")).text();
      const blocco = ch.split(/^## /m).find((b) => b.startsWith(nuova));
      if (blocco) note = blocco.split("\n").slice(1).join("\n").trim();
    } catch (e) {}
    const link = await linkApp();
    aggiornamento = { versione: nuova, note, link };
    inviaSSE("aggiornamento", aggiornamento);
    supervisor("POST", "/store/reload").catch(() => {});
    if (config.avviso_aggiornamento !== nuova) {
      config.avviso_aggiornamento = nuova; salva();
      await servizio("persistent_notification", "create", {
        notification_id: "nexalia_aggiornamento",
        title: "Nexalia " + nuova + " disponibile",
        message: "È disponibile una nuova versione di Nexalia (tu hai la " + VERSIONE + ").\n\n" + (note ? note + "\n\n" : "") + "[Aggiorna ora](" + link + ")",
      }).catch(() => {});
      annota({ tipo: "info", icona: "agente", titolo: "Nexalia " + nuova + " è disponibile", testo: "Aggiornala da Impostazioni › Applicazioni › Nexalia." });
    }
  } catch (e) { /* GitHub non raggiungibile: riprovo più tardi */ }
}
setTimeout(controllaAggiornamenti, 90000);
setInterval(controllaAggiornamenti, 6 * 3600000);

// ---------------------------------------------------------------- contatore anonimo delle installazioni
// Invia una volta al giorno solo: un codice casuale non riconducibile alla casa, la versione e se la licenza è completa.
// Si disattiva dalle opzioni dell'app ("statistiche_anonime").
function statisticheAttive() {
  try { const o = JSON.parse(fs.readFileSync(path.join(DATI, "options.json"), "utf8")); return o.statistiche_anonime !== false; } catch (e) { return true; }
}
async function contaInstallazione() {
  if (!statisticheAttive()) return;
  const id = crypto.createHash("sha256").update("nexalia-installazione:" + config.id_casa).digest("hex");
  try { await chiamaLicenze("/api/ping", { id, versione: VERSIONE, completa: completa() }); } catch (e) {}
}
setTimeout(contaInstallazione, 60000);
setInterval(contaInstallazione, 24 * 3600000);

// ---------------------------------------------------------------- server web
const TIPI = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".json": "application/json", ".woff2": "font/woff2", ".ico": "image/x-icon" };
const json = (res, d, st = 200) => { res.writeHead(st, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }); res.end(JSON.stringify(d)); };
function corpo(req, max = 2e6) {
  return new Promise((ok, ko) => {
    let b = ""; req.on("data", (c) => { b += c; if (b.length > max) { ko(new Error("Troppo grande")); req.destroy(); } });
    req.on("end", () => { try { ok(b ? JSON.parse(b) : {}); } catch (e) { ko(new Error("JSON non valido")); } });
  });
}

const CHIAVI_MODIFICABILI = ["mie_entita", "stanze_cfg", "sez_gen", "mie_sezioni", "generali", "pastiglie", "antifurto", "widget", "azioni", "aspetto", "assist", "personalizza", "sezioni_ordine", "home", "stanze", "nascoste", "posizioni", "pianta", "energia", "agente", "raccolta", "sezioni", "tema"];

// utente di Home Assistant che sta guardando (Home Assistant lo passa a Nexalia con l'ingress)
function utenteDi(req) {
  const h = (k) => { try { return decodeURIComponent(String(req.headers[k] || "")); } catch (e) { return String(req.headers[k] || ""); } };
  return { id: h("x-remote-user-id"), nome: h("x-remote-user-name"), visibile: h("x-remote-user-display-name") };
}
function puoConfigurare(req) {
  const a = String((config.generali && config.generali.admin) || "").trim().toLowerCase();
  if (!a) return true;
  const u = utenteDi(req);
  return [u.nome, u.visibile, u.id].some((x) => x && x.toLowerCase() === a);
}
async function api(req, res, p) {
  if (p === "/api/stato" && req.method === "GET") {
    return json(res, {
      versione: VERSIONE, collegato: ha.pronto, utente: utenteDi(req), configuratore: puoConfigurare(req),
      ha: { stati: Object.values(ha.stati), aree: ha.aree, dispositivi: ha.dispositivi, entita: ha.entita, config: ha.config, servizi: ha.servizi },
      config: configPubblica(), diario, tunnel: tunnelStato, aggiornamento,
    });
  }
  if (p === "/api/eventi") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive", "x-accel-buffering": "no" });
    res.write("retry: 3000\n\n"); clientiSSE.add(res);
    const k = setInterval(() => res.write(": ping\n\n"), 25000);
    req.on("close", () => { clearInterval(k); clientiSSE.delete(res); });
    return;
  }
  if (p === "/api/servizio" && req.method === "POST") {
    const b = await corpo(req);
    if (!/^[a-z_]+$/.test(b.dominio || "") || !/^[a-z0-9_]+$/.test(b.servizio || "")) return json(res, { ok: false, errore: "Servizio non valido" }, 400);
    await servizio(b.dominio, b.servizio, b.dati || {});
    return json(res, { ok: true });
  }
  if (p === "/api/assist" && req.method === "POST") {
    const b = await corpo(req);
    const agente = config.assist && /^conversation\.[a-z0-9_]+$/.test(config.assist.agente || "") ? config.assist.agente : undefined;
    const r = await wsChiama({ type: "conversation/process", text: String(b.testo || "").slice(0, 500), language: ha.config.lingua || "it", conversation_id: b.conversazione || undefined, agent_id: agente }, 60000);
    const sp = r && r.response && r.response.speech && r.response.speech.plain && r.response.speech.plain.speech;
    return json(res, { ok: true, risposta: sp || "Fatto.", conversazione: r.conversation_id });
  }
  // voci di Home Assistant: motori tts.* e le loro voci nella lingua della casa
  if (p === "/api/voci" && req.method === "GET") {
    const motori = Object.keys(ha.stati).filter((id) => id.startsWith("tts."));
    const out = [];
    for (const m of motori) {
      let voci = [];
      try {
        const e = await wsChiama({ type: "tts/engine/get", engine_id: m });
        const lingue = ((e.provider || {}).supported_languages || []).filter((l) => l.toLowerCase().startsWith((ha.config.lingua || "it").slice(0, 2)));
        for (const l of lingue.slice(0, 3)) { const v = await wsChiama({ type: "tts/engine/voices", engine_id: m, language: l }); for (const x of (v.voices || [])) voci.push({ id: x.voice_id, nome: x.name, lingua: l }); }
        if (!lingue.length) continue;
      } catch (e) {}
      out.push({ id: m, nome: (ha.stati[m].attributes || {}).friendly_name || m, voci });
    }
    return json(res, { ok: true, motori: out });
  }
  // fa parlare la plancia con la voce di Home Assistant: restituisce l'audio
  if (p === "/api/parla" && req.method === "POST") {
    const b = await corpo(req), a = config.assist || {};
    const motore = /^tts\.[a-z0-9_]+$/.test(b.motore || a.tts_motore || "") ? (b.motore || a.tts_motore) : null;
    if (!motore) return json(res, { ok: false, errore: "Nessuna voce di Home Assistant scelta" }, 400);
    const voce = String(b.voce !== undefined ? b.voce : a.tts_voce || "");
    const lingua = String(b.lingua || "") || undefined;
    const alto = b.qui ? "" : String(b.altoparlante !== undefined ? b.altoparlante : a.altoparlante || "");
    if (/^media_player\.[a-z0-9_]+$/.test(alto)) { // parla da un altoparlante di casa invece che dall'apparecchio
      await servizio("tts", "speak", { entity_id: motore, media_player_entity_id: alto, message: String(b.testo || "").slice(0, 600), language: lingua, options: voce ? { voice: voce } : undefined });
      return json(res, { ok: true, altoparlante: alto });
    }
    const r = await haRest("POST", "/api/tts_get_url", { engine_id: motore, message: String(b.testo || "").slice(0, 600), language: lingua, options: voce ? { voice: voce } : undefined });
    const audio = await fetch(HA_HTTP + r.path, { headers: { authorization: "Bearer " + TOKEN } });
    if (!audio.ok) return json(res, { ok: false, errore: "Audio non disponibile" }, 502);
    res.writeHead(200, { "content-type": audio.headers.get("content-type") || "audio/mpeg", "cache-control": "no-store" });
    return res.end(Buffer.from(await audio.arrayBuffer()));
  }
  // carattere dell'assistente: scrive le istruzioni nell'agente AI di Home Assistant (Anthropic, OpenAI, Google…)
  if (p === "/api/personalita" && req.method === "POST") {
    if (!puoConfigurare(req)) return json(res, { ok: false, errore: "Solo l'amministratore" }, 403);
    const b = await corpo(req), agente = String(b.agente || (config.assist || {}).agente || "");
    if (!/^conversation\.[a-z0-9_]+$/.test(agente)) return json(res, { ok: false, errore: "Scegli prima un assistente AI qui sopra" }, 400);
    try { return json(res, { ok: true, ...(await scriviPrompt(agente, String(b.prompt || "").slice(0, 4000))) }); }
    catch (e) { return json(res, { ok: false, errore: e.message }, 500); }
  }
  if (p === "/api/richieste" && req.method === "GET") return json(res, { ok: true, richieste: [...richieste.values()] });
  if (p === "/api/richieste" && req.method === "POST") {
    const b = await corpo(req), r = richieste.get(String(b.chiave || ""));
    if (!r) return json(res, { ok: true, gia: true });
    if (b.azione === "ignora") { chiudiRichiesta(r.chiave); annota({ icona: r.icona, titolo: "Ok, lascio stare: " + r.titolo.charAt(0).toLowerCase() + r.titolo.slice(1) }); return json(res, { ok: true }); }
    const az = r.azioni[Number(b.azione)];
    if (!az || az.tipo !== "servizio") return json(res, { ok: false, errore: "Azione non valida" }, 400);
    try { await servizio(az.dominio, az.servizio, az.dati); }
    catch (e) { return json(res, { ok: false, errore: /code|codice/i.test(e.message) ? "Serve il codice dell'antifurto: inseriscilo dalla sezione Sicurezza" : e.message }, 500); }
    chiudiRichiesta(r.chiave); annota({ tipo: "fatto", icona: r.icona, titolo: "Fatto su tua richiesta: " + az.etichetta.toLowerCase() });
    return json(res, { ok: true });
  }
  if (p === "/api/previsioni" && req.method === "GET") {
    const u = new URL(req.url, "http://x"); const id = u.searchParams.get("id"), tipo = u.searchParams.get("tipo") === "hourly" ? "hourly" : "daily";
    if (!/^weather\.[a-z0-9_]+$/.test(id || "")) return json(res, { ok: false }, 400);
    try { const r = await wsChiama({ type: "call_service", domain: "weather", service: "get_forecasts", service_data: { type: tipo }, target: { entity_id: id }, return_response: true }); return json(res, { ok: true, previsioni: ((r.response || {})[id] || {}).forecast || [] }); }
    catch (e) { return json(res, { ok: false, errore: e.message }); }
  }
  if (p === "/api/calendario" && req.method === "GET") {
    const u = new URL(req.url, "http://x"); const id = u.searchParams.get("id"), giorni = Math.min(60, Number(u.searchParams.get("giorni") || 14));
    if (!/^calendar\.[a-z0-9_]+$/.test(id || "")) return json(res, { ok: false }, 400);
    try { const da = new Date(), a = new Date(Date.now() + giorni * 86400000); const ev = await haRest("GET", `/api/calendars/${id}?start=${encodeURIComponent(da.toISOString())}&end=${encodeURIComponent(a.toISOString())}`); return json(res, { ok: true, eventi: (ev || []).slice(0, 50).map((e) => ({ titolo: e.summary, inizio: e.start && (e.start.dateTime || e.start.date), fine: e.end && (e.end.dateTime || e.end.date), luogo: e.location || "" })) }); }
    catch (e) { return json(res, { ok: false, errore: e.message }); }
  }
  if (p === "/api/todo" && req.method === "GET") {
    const u = new URL(req.url, "http://x"); const id = u.searchParams.get("id");
    if (!/^todo\.[a-z0-9_]+$/.test(id || "")) return json(res, { ok: false }, 400);
    try { const r = await wsChiama({ type: "todo/item/list", entity_id: id }); return json(res, { ok: true, voci: (r.items || []).map((x) => ({ uid: x.uid, testo: x.summary, fatto: x.status === "completed" })) }); }
    catch (e) { return json(res, { ok: false, errore: e.message }); }
  }
  if (p === "/api/annaffia" && req.method === "POST") { if (irrigazioneInCorso.size) return json(res, { ok: false, errore: "L'irrigazione è già in corso" }); annaffia("Avviata a mano dalla plancia"); return json(res, { ok: true }); }
  if (p === "/api/annuncio" && req.method === "POST") {
    const b = await corpo(req); const x = sezX("notifiche").extra || {};
    await diQualcosa(String(b.testo || "Prova di Nexalia").slice(0, 300), (b.echi && b.echi.length) ? b.echi : x.echi, x.modo);
    return json(res, { ok: true });
  }
  if (p === "/api/storico" && req.method === "GET") {
    const u = new URL(req.url, "http://x"); const id = u.searchParams.get("id"); const ore = Math.min(24 * 31, Number(u.searchParams.get("ore") || 24));
    if (!/^[a-z_]+\.[a-z0-9_]+$/.test(id || "")) return json(res, { ok: false }, 400);
    const da = new Date(Date.now() - ore * 3600000).toISOString();
    const d = await haRest("GET", `/api/history/period/${encodeURIComponent(da)}?filter_entity_id=${id}&minimal_response&no_attributes`);
    return json(res, { ok: true, punti: (d[0] || []).map((x) => [x.last_changed || x.lu * 1000, parseFloat(x.state !== undefined ? x.state : x.s)]).filter((x) => !isNaN(x[1])) });
  }
  if (p.startsWith("/api/camera/") && req.method === "GET") {
    const id = decodeURIComponent(p.slice(12));
    if (!/^camera\.[a-z0-9_]+$/.test(id)) { res.writeHead(400); return res.end(); }
    const r = await fetch(HA_HTTP + "/api/camera_proxy/" + id, { headers: { authorization: "Bearer " + TOKEN } });
    res.writeHead(r.status, { "content-type": r.headers.get("content-type") || "image/jpeg", "cache-control": "no-store" });
    return res.end(Buffer.from(await r.arrayBuffer()));
  }
  if (p === "/api/config" && req.method === "PUT") {
    const b = await corpo(req);
    if (!puoConfigurare(req) && Object.keys(b).some((k) => !["home", "nascoste"].includes(k))) return json(res, { ok: false, errore: "Solo l'amministratore della plancia può cambiare le impostazioni" }, 403);
    for (const k of CHIAVI_MODIFICABILI) if (k in b) config[k] = b[k];
    if (!completa()) { config.posizioni = config.posizioni || {}; }
    salva();
    inviaSSE("config", configPubblica());
    return json(res, { ok: true, config: configPubblica() });
  }
  if (p === "/api/automazione" && req.method === "POST") {
    const b = await corpo(req);
    if (!b.alias || !Array.isArray(b.trigger) || !Array.isArray(b.action)) return json(res, { ok: false, errore: "Scenario incompleto" }, 400);
    const id = "nexalia_" + Date.now();
    await haRest("POST", "/api/config/automation/config/" + id, { id, alias: String(b.alias).slice(0, 80), description: "Creato con Nexalia", mode: "single", trigger: b.trigger, condition: b.condition || [], action: b.action });
    await servizio("automation", "reload", {}).catch(() => {});
    annota({ tipo: "fatto", icona: "scenari", titolo: "Nuovo scenario: " + b.alias });
    return json(res, { ok: true, id });
  }
  if (p === "/api/automazione" && req.method === "DELETE") {
    const b = await corpo(req);
    if (!/^[A-Za-z0-9_]+$/.test(b.id || "")) return json(res, { ok: false }, 400);
    await haRest("DELETE", "/api/config/automation/config/" + b.id);
    return json(res, { ok: true });
  }
  if (p === "/api/backup" && req.method === "GET") {
    if (!completa()) return json(res, { ok: false, errore: "Il backup è incluso nella licenza completa" }, 403);
    const c = JSON.parse(JSON.stringify(config)); delete c.licenza; delete c.id_casa;
    res.writeHead(200, { "content-type": "application/json", "content-disposition": `attachment; filename="nexalia-backup-${new Date().toISOString().slice(0, 10)}.json"` });
    return res.end(JSON.stringify({ nexalia: VERSIONE, data: new Date().toISOString(), config: c }, null, 1));
  }
  if (p === "/api/reset" && req.method === "POST") {
    if (!puoConfigurare(req)) return json(res, { ok: false, errore: "Solo l'amministratore della plancia" }, 403);
    const tieni = { id_casa: config.id_casa, licenza: config.licenza };
    config = Object.assign(JSON.parse(JSON.stringify(CONFIG_BASE)), tieni);
    salva(); inviaSSE("config", configPubblica());
    annota({ tipo: "info", icona: "agente", titolo: "Configurazione azzerata", testo: "La licenza resta attiva." });
    return json(res, { ok: true, config: configPubblica() });
  }
  if (p === "/api/backup" && req.method === "POST") {
    if (!puoConfigurare(req)) return json(res, { ok: false, errore: "Solo l'amministratore della plancia" }, 403);
    if (!completa()) return json(res, { ok: false, errore: "Il ripristino è incluso nella licenza completa" }, 403);
    const b = await corpo(req, 5e6);
    if (!b.config) return json(res, { ok: false, errore: "File di backup non valido" }, 400);
    for (const k of CHIAVI_MODIFICABILI) if (k in b.config) config[k] = b.config[k];
    salva(); inviaSSE("config", configPubblica());
    return json(res, { ok: true });
  }
  if (p === "/api/licenza/attiva" && req.method === "POST") { const b = await corpo(req); const r = await attivaLicenza(b.codice); inviaSSE("config", configPubblica()); return json(res, r, r.ok ? 200 : 400); }
  if (p === "/api/licenza/disattiva" && req.method === "POST") { const r = await disattivaLicenza(); inviaSSE("config", configPubblica()); return json(res, r); }
  if (p === "/api/licenza/verifica" && req.method === "POST") { await verificaLicenza(); inviaSSE("config", configPubblica()); return json(res, { ok: true, config: configPubblica(), tunnel: tunnelStato }); }
  if (p === "/api/aggiornamenti" && req.method === "POST") { await controllaAggiornamenti(); return json({ ok: true, aggiornamento }); }
  if (p === "/api/diario" && req.method === "DELETE") { diario.length = 0; return json(res, { ok: true }); }
  return json(res, { ok: false, errore: "Non trovato" }, 404);
}

const server = http.createServer(async (req, res) => {
  // HA Ingress: accetta solo il proxy del Supervisor (o localhost in prova)
  const ip = req.socket.remoteAddress || "";
  if (!process.env.NEXALIA_PROVA && !/^(::ffff:)?(172\.30\.32\.2|127\.0\.0\.1)$|^::1$/.test(ip)) { res.writeHead(403); return res.end("Accesso consentito solo da Home Assistant"); }
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  try {
    if (p.startsWith("/api/")) return await api(req, res, p);
    if (p === "/") p = "/index.html";
    const f = path.normalize(path.join(WWW, p));
    if (!f.startsWith(WWW) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("Non trovato"); }
    if (p === "/index.html") {
      // la versione nei link obbliga il browser a scaricare i file nuovi dopo ogni aggiornamento
      const html = fs.readFileSync(f, "utf8").replace(/((?:href|src)="[a-z0-9_-]+\.(?:css|js))"/g, `$1?v=${VERSIONE}"`);
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      return res.end(html);
    }
    res.writeHead(200, { "content-type": TIPI[path.extname(f)] || "application/octet-stream", "cache-control": "no-cache" });
    fs.createReadStream(f).pipe(res);
  } catch (e) {
    log("Errore", p, e.message);
    if (!res.headersSent) json(res, { ok: false, errore: e.message }, 500); else res.end();
  }
});

server.listen(PORTA, () => {
  log("Nexalia " + VERSIONE + " in ascolto sulla porta " + PORTA);
  collegaHA();
  if (completa()) { avviaTunnel(); verificaLicenza(); }
});
process.on("SIGTERM", () => { fermaTunnel(); process.exit(0); });
