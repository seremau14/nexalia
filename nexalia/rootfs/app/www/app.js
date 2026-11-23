/* Nexalia – plancia per Home Assistant */
"use strict";

// ------------------------------------------------------------------ icone
const IC = {
  casa: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
  agente: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  luci: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
  tapparelle: "M4 4h16v16H4zM4 8h16M4 12h16M4 16h16",
  clima: "M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",
  movimento: "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9",
  porte: "M6 21V3h12v18M3 21h18M14.5 12h.01",
  finestra: "M4 3h16v18H4zM12 3v18M4 12h16",
  energia: "M13 2L4 14h7l-1 8 9-12h-7z",
  telecamere: "M3 7h12v10H3zM15 10l6-3v10l-6-3z",
  sicurezza: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  scenari: "M4 6h16M4 12h10M4 18h6M17 15l3 3-3 3",
  raccolta: "M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3",
  allerta: "M12 3l9.5 17h-19zM12 10v4M12 17h.01",
  stanze: "M3 3h18v18H3zM3 12h9M12 3v18",
  solare: "M3 15h18l-2-8H5zM9 7l-1 8M15 7l1 8M4 11h16M12 18v3M8 21h8",
  batteria: "M3 8h16v8H3zM21 11v2M7 11v2M11 11v2",
  rete: "M12 2v4M5 6h14l-3 7H8zM9 13l-3 9M15 13l3 9M7 18h10",
  presa: "M7 3v4M17 3v4M5 7h14v5a7 7 0 0 1-14 0zM12 19v3",
  goccia: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  media: "M3 5h18v12H3zM8 21h8M10 9l5 2.5-5 2.5z",
  robot: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  persone: "M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14.3c2.1.7 3.5 2.8 3.5 5.7",
  lucchetto: "M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3",
  ventola: "M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M12 10.5C12 6 13 3 16 3s3 4-4 7.5M13.5 12c4.5 0 7.5 1 7.5 4s-4 3-7.5-4M12 13.5c0 4.5-1 7.5-4 7.5s-3-4 4-7.5M10.5 12C6 12 3 11 3 8s4-3 7.5 4",
  sensore: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  cubo: "M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12v10M12 12L3 7",
  impostazioni: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  comandi: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4",
  piu: "M12 5v14M5 12h14",
  matita: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  cestino: "M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3",
  freccia: "M5 12h14M13 6l6 6-6 6",
  play: "M7 4.5v15l12.5-7.5z",
  su: "M6 15l6-6 6 6", giu: "M6 9l6 6 6-6", stop: "M7 7h10v10H7z",
  chiudi: "M6 6l12 12M18 6L6 18",
  invio: "M4 12l16-8-6 16-2-7z",
  stella: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z",
  occhio: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  nascondi: "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
  meteo: "M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10a4 4 0 0 1-.5 8z",
  globo: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
};
document.getElementById("icone").innerHTML = Object.entries(IC).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join("");
const ico = (n, c = "") => `<svg class="ic ${c}"><use href="#i-${n}"/></svg>`;

// ------------------------------------------------------------------ stato
const S = { stati: {}, aree: [], dispositivi: [], entita: [], cfg: null, diario: [], collegato: false, scheda: localStorage.getItem("nx_scheda") || "agente", stanza: null, tunnel: "spento", versione: "" };
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const dom = (id) => id.split(".")[0];
const st = (id) => S.stati[id];
const pers = (id) => (S.cfg && S.cfg.personalizza && S.cfg.personalizza[id]) || {};
function nomeE(id) {
  if (pers(id).nome) return pers(id).nome;
  return nomeOriginale(id);
}
function nomeOriginale(id) {
  const s = st(id); const n = (s && s.attributes.friendly_name) || id;
  const m = n.match(/^(.+?)\s+(socket|switch|presa|interruttore|relay|outlet|channel|canale|plug|l)\s*\d*$/i);
  return m ? m[1].trim() : n;
}
const attr = (id, k) => { const s = st(id); return s ? s.attributes[k] : undefined; };
const num = (id) => { const s = st(id); if (!s) return null; const v = parseFloat(s.state); return isNaN(v) ? null : v; };
const watt = (id) => { const v = num(id); if (v == null) return null; return (attr(id, "unit_of_measurement") || "").toLowerCase() === "kw" ? v * 1000 : v; };
const fmtW = (w) => w == null ? "—" : Math.abs(w) >= 1000 ? (w / 1000).toFixed(2).replace(".", ",") + " kW" : Math.round(w) + " W";
const fmt1 = (v) => v == null ? "—" : String(Math.round(v * 10) / 10).replace(".", ",");
const completa = () => S.cfg && S.cfg.licenza.completa;
const ora = (t) => new Date(t).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

async function api(percorso, opz = {}) {
  const r = await fetch(percorso, { method: opz.metodo || "GET", headers: opz.corpo ? { "content-type": "application/json" } : {}, body: opz.corpo ? JSON.stringify(opz.corpo) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.errore || "Errore " + r.status);
  return d;
}
function parla(t) {
  if (!S.cfg.assist || !S.cfg.assist.voce || !window.speechSynthesis || !t) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "it-IT"; const v = speechSynthesis.getVoices().filter((x) => x.lang && x.lang.startsWith("it")); const b = v.find((x) => /natural|neural|premium|enhanced|google/i.test(x.name)) || v[0]; if (b) u.voice = b; speechSynthesis.speak(u); } catch (e) {}
}
function avviso(testo, tipo = "") {
  const el = document.createElement("div"); el.className = "avviso " + tipo; el.textContent = testo;
  $("#avvisi").appendChild(el); setTimeout(() => el.remove(), 3800);
}
async function chiama(dominio, servizio, dati) {
  try { await api("api/servizio", { metodo: "POST", corpo: { dominio, servizio, dati } }); }
  catch (e) { avviso(e.message, "err"); }
}
async function salvaCfg(parz) {
  Object.assign(S.cfg, parz);
  try { const d = await api("api/config", { metodo: "PUT", corpo: parz }); S.cfg = d.config; }
  catch (e) { avviso("Non salvato: " + e.message, "err"); }
}

// ------------------------------------------------------------------ stanze e dispositivi
const DOMINI_UTILI = ["light", "switch", "fan", "cover", "climate", "lock", "media_player", "sensor", "binary_sensor", "camera", "input_boolean", "vacuum", "humidifier", "water_heater", "valve", "alarm_control_panel", "button", "scene", "script"];
function areaEntita(id) {
  const e = S.entita.find((x) => x.id === id); if (!e) return null;
  if (e.area) return e.area;
  const d = e.dispositivo && S.dispositivi.find((x) => x.id === e.dispositivo);
  return d ? d.area : null;
}
// Tipo di dispositivo: le entità di telecamere e smart speaker/display (Echo Show, Nest, Sonos, telecamere Tapo…)
// non sono luci, prese o finestre della casa (faretto della telecamera, schermo dell'Echo, copriobiettivo…).
let ACCESSORI = null, TIPO_DISP = null;
function calcolaAccessori() {
  const perDisp = {};
  for (const e of S.entita) if (e.dispositivo) (perDisp[e.dispositivo] = perDisp[e.dispositivo] || []).push(e.id);
  const disp = {}; for (const d of S.dispositivi) disp[d.id] = d;
  const out = new Map(); TIPO_DISP = {};
  for (const [did, ids] of Object.entries(perDisp)) {
    const d = disp[did] || {};
    const testo = [d.produttore, d.modello, d.nome].join(" ");
    let tipo = null;
    if (/amazon|echo|alexa|google home|nest (hub|mini|audio)|sonos|homepod/i.test(testo) || ids.some((x) => /^(media_player|assist_satellite)\./.test(x))) tipo = "Multimedia";
    else if (ids.some((x) => /^camera\./.test(x))) tipo = "Telecamere";
    TIPO_DISP[did] = tipo;
    if (tipo) for (const x of ids) if (/^(light|switch|binary_sensor|button)\./.test(x)) out.set(x, tipo);
  }
  for (const id of Object.keys(S.stati)) if (!out.has(id) && /^(light|switch)\./.test(id) && /\b(echo|alexa)\b|non disturbare|do not disturb|riproduzione casuale|shuffle|repeat|ripeti/i.test(nomeE(id) + " " + id)) out.set(id, "Multimedia");
  ACCESSORI = out;
}
const forzato = (id) => pers(id).gruppo || "";
const accessorio = (id) => { const f = forzato(id); if (f) return ["multimedia", "telecamere"].includes(f); if (!ACCESSORI) calcolaAccessori(); return ACCESSORI.has(id); };
const gruppoAccessorio = (id) => { const f = forzato(id); if (f) return { multimedia: "Multimedia", telecamere: "Telecamere" }[f]; if (!ACCESSORI) calcolaAccessori(); return ACCESSORI.get(id); };
const eLuce = (id) => { const f = forzato(id); if (f) return f === "luci" && ["light", "switch", "input_boolean"].includes(dom(id)); return dom(id) === "light" && !accessorio(id); };
// presa = interruttore che alimenta qualcosa: classe "outlet" o dispositivo/nome da presa smart
function ePresa(id) {
  const f = forzato(id); if (f) return f === "prese" && ["switch", "input_boolean"].includes(dom(id));
  if (dom(id) !== "switch" || accessorio(id)) return false;
  if (attr(id, "device_class") === "outlet") return true;
  const e = S.entita.find((x) => x.id === id), d = e && e.dispositivo && S.dispositivi.find((x) => x.id === e.dispositivo);
  return /pres[ae]|plug|socket|outlet|spina/i.test(nomeE(id) + " " + (d ? [d.modello, d.nome].join(" ") : ""));
}
const eApertura = (id) => dom(id) === "binary_sensor" && ["door", "window", "garage_door", "opening"].includes(attr(id, "device_class")) && !accessorio(id);

function visibile(id) {
  if (!st(id) || (S.cfg.nascoste || []).includes(id)) return false;
  if (!DOMINI_UTILI.includes(dom(id))) return false;
  const e = S.entita.find((x) => x.id === id);
  if (e && (e.nascosta || e.categoria)) return false;
  return true;
}
function stanze() {
  if (S.cfg.stanze && S.cfg.stanze.length) return S.cfg.stanze.map((s) => ({ ...s, entita: (s.entita || []).filter((id) => st(id)) }));
  return S.aree.map((a) => ({ id: a.id, nome: a.nome, entita: Object.keys(S.stati).filter((id) => areaEntita(id) === a.id && visibile(id)) })).filter((s) => s.entita.length);
}
function tempStanza(s) {
  const t = s.entita.find((id) => attr(id, "device_class") === "temperature" && dom(id) === "sensor");
  if (t) return num(t);
  const c = s.entita.find((id) => dom(id) === "climate");
  return c ? attr(c, "current_temperature") : null;
}
function iconaE(id) {
  if (pers(id).icona) return pers(id).icona;
  const d = dom(id), c = attr(id, "device_class");
  const ga = gruppoAccessorio(id); if (ga) return ga === "Telecamere" ? "telecamere" : "media";
  return ({ light: "luci", switch: c === "outlet" ? "presa" : "presa", fan: "ventola", cover: "tapparelle", climate: "clima", lock: "lucchetto", media_player: "media", camera: "telecamere", vacuum: "robot", alarm_control_panel: "sicurezza", scene: "scenari", script: "scenari", water_heater: "goccia", valve: "goccia", humidifier: "goccia" })[d]
    || ({ temperature: "clima", humidity: "goccia", power: "energia", energy: "energia", battery: "batteria", motion: "movimento", occupancy: "movimento", presence: "movimento", door: "porte", garage_door: "porte", window: "finestra", opening: "finestra", smoke: "allerta", gas: "allerta", moisture: "goccia" })[c] || "sensore";
}
const ACCESO = ["on", "open", "opening", "playing", "unlocked", "heat", "cool", "heat_cool", "auto", "dry", "fan_only", "cleaning"];
function testoStato(id) {
  const s = st(id); if (!s) return ""; const d = dom(id), v = s.state, c = s.attributes.device_class;
  if (v === "unavailable") return "Non disponibile";
  if (d === "light") return v === "on" ? (s.attributes.brightness ? "Accesa · " + Math.round(s.attributes.brightness / 2.55) + "%" : "Accesa") : "Spenta";
  if (["switch", "input_boolean", "fan"].includes(d)) return v === "on" ? "Acceso" : "Spento";
  if (d === "cover") { const p = s.attributes.current_position; return ({ open: "Aperta", closed: "Chiusa", opening: "Si apre…", closing: "Si chiude…" })[v] + (p != null && v !== "closed" ? " · " + p + "%" : ""); }
  if (d === "climate") return ({ off: "Spento", heat: "Riscalda", cool: "Raffredda", auto: "Automatico", heat_cool: "Automatico", dry: "Deumidifica", fan_only: "Ventola" })[v] || v;
  if (d === "lock") return ({ locked: "Chiusa", unlocked: "Aperta", jammed: "Bloccata" })[v] || v;
  if (d === "binary_sensor") {
    const m = { door: ["Chiusa", "Aperta"], window: ["Chiusa", "Aperta"], garage_door: ["Chiusa", "Aperta"], opening: ["Chiusa", "Aperta"], motion: ["Nessun movimento", "Movimento"], occupancy: ["Libero", "Occupato"], presence: ["Nessuno", "Presenza"], smoke: ["Ok", "FUMO"], gas: ["Ok", "GAS"], moisture: ["Asciutto", "ACQUA"], battery: ["Ok", "Batteria scarica"], problem: ["Ok", "Problema"], connectivity: ["Scollegato", "Collegato"] }[c] || ["No", "Sì"];
    return v === "on" ? m[1] : m[0];
  }
  if (d === "sensor") { const u = s.attributes.unit_of_measurement || ""; const n = parseFloat(v); return isNaN(n) ? v : fmt1(n) + (u ? " " + u : ""); }
  if (d === "media_player") return ({ playing: "In riproduzione", paused: "In pausa", idle: "Inattivo", off: "Spento", on: "Acceso" })[v] || v;
  if (d === "vacuum") return ({ cleaning: "Pulisce", docked: "In base", returning: "Torna in base", idle: "Fermo", paused: "In pausa", error: "Errore" })[v] || v;
  if (d === "alarm_control_panel") return testoAllarme(v);
  return v;
}
const testoAllarme = (v) => ({ unavailable: "Non disponibile", unknown: "Sconosciuto", disarmed: "Disinserito", armed_away: "Inserito · totale", armed_home: "Inserito · in casa", armed_night: "Inserito · notte", armed_vacation: "Inserito · vacanza", armed_custom_bypass: "Inserito", arming: "Si inserisce…", pending: "In attesa…", triggered: "SCATTATO" })[v] || v;
const pericolo = (id) => dom(id) === "binary_sensor" && ["smoke", "gas", "moisture", "carbon_monoxide", "problem"].includes(attr(id, "device_class")) && st(id).state === "on";

function tessera(id) {
  const s = st(id); if (!s) return "";
  const d = dom(id), v = s.state, on = ACCESO.includes(v);
  const nd = v === "unavailable" ? " nondisp" : "";
  let extra = "", azione = "", cls = "";
  if (d === "light") {
    cls = (accessorio(id) ? "" : "luce ") + "cliccabile"; azione = `data-az="toggle"`;
    if (v === "on" && s.attributes.brightness != null) extra = `<input class="cursore" type="range" min="1" max="100" value="${Math.round(s.attributes.brightness / 2.55)}" data-luminosita="${id}" aria-label="Luminosità ${esc(nomeE(id))}">`;
  } else if (["switch", "input_boolean", "fan"].includes(d)) { cls = "cliccabile"; azione = `data-az="toggle"`; }
  else if (d === "cover") {
    const p = s.attributes.current_position;
    extra = (p != null ? `<input class="cursore" type="range" min="0" max="100" value="${p}" data-posizione="${id}" aria-label="Apertura ${esc(nomeE(id))}">` : "") +
      `<div class="pulsanti"><button class="btn" data-cover="open_cover" data-id="${id}" aria-label="Apri">${ico("su", "s")}</button><button class="btn" data-cover="stop_cover" data-id="${id}" aria-label="Ferma">${ico("stop", "s")}</button><button class="btn" data-cover="close_cover" data-id="${id}" aria-label="Chiudi">${ico("giu", "s")}</button></div>`;
  } else if (d === "climate") {
    const t = s.attributes.temperature;
    extra = `<div class="riga"><button class="btn pic" data-clima="-0.5" data-id="${id}" aria-label="Meno">−</button><b style="flex:1;text-align:center">${t != null ? fmt1(t) + "°" : "—"}</b><button class="btn pic" data-clima="0.5" data-id="${id}" aria-label="Più">+</button></div>`;
  } else if (d === "lock") { extra = `<button class="btn pic" data-lock="${v === "locked" ? "unlock" : "lock"}" data-id="${id}">${v === "locked" ? "Apri" : "Chiudi"}</button>`; }
  else if (d === "media_player" && v !== "off") { extra = `<div class="pulsanti"><button class="btn" data-media="media_play_pause" data-id="${id}">${v === "playing" ? "Pausa" : "Play"}</button><button class="btn" data-media="volume_down" data-id="${id}">−</button><button class="btn" data-media="volume_up" data-id="${id}">+</button></div>`; }
  else if (d === "vacuum") { extra = `<div class="pulsanti"><button class="btn" data-vac="${v === "cleaning" ? "pause" : "start"}" data-id="${id}">${v === "cleaning" ? "Pausa" : "Pulisci"}</button><button class="btn" data-vac="return_to_base" data-id="${id}">Base</button></div>`; }
  else if (d === "scene" || d === "script" || d === "button") { cls = "cliccabile"; azione = `data-az="esegui"`; }
  if (pericolo(id) || (eApertura(id) && v === "on")) cls += " allarme";
  const tg = ["light", "switch", "input_boolean", "fan"].includes(d) ? `<span class="tg ${on ? "on" : ""}" aria-hidden="true"></span>` : "";
  const pref = (S.cfg.home.preferiti || []).includes(id);
  const azioni = `<span class="tess-az"><button class="mini ${pref ? "si" : ""}" data-pref="${id}" aria-label="${pref ? "Togli dai preferiti" : "Aggiungi ai preferiti"}" title="${pref ? "Togli dai preferiti" : "Preferito in home"}">${ico("stella", "s")}</button><button class="mini" data-nascondi="${id}" aria-label="Nascondi dalla plancia" title="Nascondi dalla plancia">${ico("nascondi", "s")}</button></span>`;
  return `<div class="tess ${on && !["binary_sensor", "sensor"].includes(d) ? "on" : ""} ${cls}${nd}${tg ? " con-tg" : ""}" data-id="${id}" ${azione} ${azione ? 'role="button" tabindex="0"' : ""}>${azioni}
    <div class="testa"><div class="ico">${ico(iconaE(id))}</div><div><div class="nome">${esc(nomeE(id))}</div><div class="val">${esc(testoStato(id))}</div></div></div>${tg}${extra}</div>`;
}

const ORDINE = ["light", "switch", "fan", "cover", "climate", "media_player", "lock", "vacuum", "camera", "input_boolean", "humidifier", "water_heater", "valve", "scene", "script", "button", "binary_sensor", "sensor", "alarm_control_panel"];
const GRUPPI = { light: "Luci", switch: "Interruttori", input_boolean: "Interruttori", fan: "Ventilazione", cover: "Tapparelle e tende", climate: "Clima", media_player: "Multimedia", lock: "Serrature", vacuum: "Robot", camera: "Telecamere", humidifier: "Clima", water_heater: "Acqua calda", valve: "Valvole", scene: "Scene", script: "Scene", button: "Pulsanti", binary_sensor: "Sensori", sensor: "Misure", alarm_control_panel: "Allarme" };
function tesserePerGruppo(ids) {
  const g = {};
  for (const id of ids) { const f = forzato(id); const k = f ? { luci: "Luci", prese: "Prese", interruttori: "Interruttori", multimedia: "Multimedia", telecamere: "Telecamere", sensori: "Sensori" }[f] : gruppoAccessorio(id) || (ePresa(id) ? "Prese" : GRUPPI[dom(id)]) || "Altro"; (g[k] = g[k] || []).push(id); }
  const pos = (k) => { const o = ["Luci", "Prese", "Interruttori", "Tapparelle e tende", "Clima", "Ventilazione", "Multimedia", "Telecamere", "Serrature", "Robot", "Scene", "Pulsanti", "Sensori", "Misure", "Allarme"].indexOf(k); return o < 0 ? 99 : o; };
  const ord = Object.keys(g).sort((a, b) => pos(a) - pos(b));
  return ord.map((k) => `<div class="gruppo">${k}</div><div class="tessere">${g[k].map(tessera).join("")}</div>`).join("");
}

// ------------------------------------------------------------------ schede
const SCHEDE = [
  { id: "agente", nome: "Agente", ic: "agente" },
  { id: "stanze", nome: "Stanze", ic: "stanze" },
  { id: "comandi", nome: "Comandi", ic: "comandi" },
  { id: "casa3d", nome: "Casa 3D", ic: "cubo", completa: true },
  { id: "energia", nome: "Energia", ic: "energia" },
  { id: "sicurezza", nome: "Sicurezza", ic: "sicurezza" },
  { id: "persone", nome: "Persone", ic: "persone" },
  { id: "scenari", nome: "Scenari", ic: "scenari" },
  { id: "raccolta", nome: "Raccolta", ic: "raccolta" },
  { id: "impostazioni", nome: "Impostazioni", ic: "impostazioni" },
];
function schedeAttive() {
  const sez = S.cfg.sezioni || [];
  const ord = ["agente", ...ordineSezioni(), "impostazioni"];
  return ord.map((id) => SCHEDE.find((x) => x.id === id)).filter((s) => s.id === "impostazioni" || s.id === "agente" || (sez.includes(s.id) && (!s.completa || completa())));
}
function applicaAspetto() {
  const a = (S.cfg && S.cfg.aspetto) || {};
  const m = document.querySelector(".marchio");
  if (m) m.innerHTML = `${ico("casa")}<span>${esc(a.nome || "Casa")}</span><b>·</b><em>${esc(a.sottotitolo || "Nexalia")}</em>`;
  const chiaro = a.tema === "chiaro" || (a.tema === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches);
  document.body.classList.toggle("chiaro", !!chiaro);
  document.documentElement.style.setProperty("--blu", a.accento || "#5AB0FF");
}
function disegnaSchede() {
  applicaAspetto();
  const att = schedeAttive();
  if (!att.find((s) => s.id === S.scheda)) S.scheda = "agente";
  $("#schede").innerHTML = att.map((s) => `<button role="tab" aria-selected="${s.id === S.scheda}" class="${s.id === S.scheda ? "on" : ""}" data-scheda="${s.id}">${ico(s.ic)}${s.nome}</button>`).join("");
}
function vai(scheda) { S.scheda = scheda; localStorage.setItem("nx_scheda", scheda); disegnaSchede(); disegna(); window.scrollTo(0, 0); }

let tDisegna = null, inInput = false;
function ridisegna() { clearTimeout(tDisegna); tDisegna = setTimeout(() => { if (!inInput && $("#finestra").hidden) disegna(); }, 120); }

function disegna() {
  if (!S.cfg) return;
  const f = { agente: vAgente, stanze: vStanze, comandi: vComandi, casa3d: vCasa3d, energia: vEnergia, sicurezza: vSicurezza, persone: vPersone, scenari: vScenari, raccolta: vRaccolta, impostazioni: vImpostazioni }[S.scheda] || vAgente;
  const att = document.activeElement, idAtt = att && att.id;
  const agg = S.aggiornamento ? `<div class="agg"><div>${ico("agente")}<b>Nexalia ${esc(S.aggiornamento.versione)} è disponibile</b><span class="mut">Hai la ${esc(S.versione)}</span></div><button class="btn p pic" data-aggiorna="${esc(S.aggiornamento.link)}">Aggiorna</button></div>` : "";
  $("#vista").innerHTML = agg + f();
  if (idAtt && document.getElementById(idAtt)) document.getElementById(idAtt).focus();
  if (S.scheda === "casa3d") dopoCasa3d();
  if (S.scheda === "energia") disegnaGrafico();
  if (S.scheda === "impostazioni") disegnaQR();
}

// ---------- Agente
const ICONE_DIARIO = { persone: "persone", allerta: "allerta", sicurezza: "sicurezza", goccia: "goccia", luci: "luci", energia: "energia", raccolta: "raccolta", batteria: "batteria", scenari: "scenari" };
let rispostaAssist = "", conversazione = null;
const RIQUADRI = {
  stanze: "Stanze", diario: "Cosa è successo", preferiti: "Preferiti",
  consumo: "Consumo adesso", persone: "Persone in casa", aperture: "Porte e finestre", allarme: "Allarme", meteo: "Meteo", raccolta: "Raccolta di domani",
};
const KPI = ["consumo", "persone", "aperture", "allarme", "meteo", "raccolta"];
const METEO = { "clear-night": "Sereno", cloudy: "Nuvoloso", fog: "Nebbia", hail: "Grandine", lightning: "Temporale", "lightning-rainy": "Temporale", partlycloudy: "Poco nuvoloso", pouring: "Pioggia forte", rainy: "Pioggia", snowy: "Neve", "snowy-rainy": "Nevischio", sunny: "Sole", windy: "Vento", "windy-variant": "Vento", exceptional: "Allerta" };
function riquadroKpi(k) {
  if (k === "consumo") { const c = S.cfg.energia.casa ? watt(S.cfg.energia.casa) : null; return [RIQUADRI[k], c != null ? fmtW(c) : "—", "energia"]; }
  if (k === "persone") { const p = Object.values(S.stati).filter((x) => x.entity_id.startsWith("person.")); const n = p.filter((x) => x.state === "home").length; return [RIQUADRI[k], p.length ? n + " su " + p.length : "—", "persone"]; }
  if (k === "aperture") { const a = Object.keys(S.stati).filter((id) => eApertura(id) && visibileStanza(id)); const o = a.filter((id) => st(id).state === "on").length; return [RIQUADRI[k], a.length ? (o ? o + (o === 1 ? " aperta" : " aperte") : "Tutte chiuse") : "—", "finestra"]; }
  if (k === "allarme") { const a = Object.keys(S.stati).find((id) => dom(id) === "alarm_control_panel"); return [RIQUADRI[k], a ? testoAllarme(st(a).state) : "Nessuno", "sicurezza"]; }
  if (k === "meteo") { const w = Object.keys(S.stati).find((id) => dom(id) === "weather"); if (!w) return [RIQUADRI[k], "—", "meteo"]; const t = attr(w, "temperature"); return [RIQUADRI[k], (METEO[st(w).state] || st(w).state) + (t != null ? " · " + fmt1(t) + "°" : ""), "meteo"]; }
  if (k === "raccolta") { const dn = ((new Date().getDay() + 1) % 7) || 7; return [RIQUADRI[k], S.cfg.raccolta.calendario[String(dn)] || "Nessuna", "raccolta"]; }
  return null;
}
function vAgente() {
  const d = new Date();
  const scelti = (S.cfg.home && S.cfg.home.riquadri) || [];
  const ss = stanze();
  const giorno = d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
  const ultima = S.diario[0];
  const tipo = ultima ? ultima.tipo : "info";
  const aperte = Object.keys(S.stati).filter((id) => eApertura(id) && st(id).state === "on");
  const luciAccese = Object.keys(S.stati).filter((id) => eLuce(id) && st(id).state === "on").length;
  const frase = ultima ? ultima.titolo : (S.collegato ? `Tutto tranquillo. ${luciAccese ? luciAccese + (luciAccese === 1 ? " luce accesa" : " luci accese") : "Luci spente"}${aperte.length ? ", " + aperte.length + (aperte.length === 1 ? " apertura aperta" : " aperte") : ""}.` : "Mi sto collegando a Home Assistant…");
  const conStanze = scelti.includes("stanze"), conDiario = scelti.includes("diario");
  const colonne = [conStanze ? "300px" : null, "1fr", conDiario ? "330px" : null].filter(Boolean).join(" ");
  const pref = ((S.cfg.home && S.cfg.home.preferiti) || []).filter((id) => st(id) && !(S.cfg.nascoste || []).includes(id));
  const sezPref = scelti.includes("preferiti") ? `<section class="card" style="margin-top:16px"><div class="tit"><h2>Preferiti</h2><span class="dim" style="font-size:13px">Tocca la stella su un dispositivo per aggiungerlo qui</span></div>${pref.length ? `<div class="tessere">${pref.map(tessera).join("")}</div>` : '<div class="dim">Nessun preferito: apri una stanza e tocca la stella sulle tessere.</div>'}</section>` : "";
  // sotto al blocco principale: preferiti e riquadri nell'ordine scelto (riquadri vicini nella stessa fila)
  let sotto = "", fila = [];
  const chiudiFila = () => { if (fila.length) sotto += `<div class="kpi" style="--kcols:${Math.min(fila.length, 4)}">${fila.map(([t, v, ic]) => `<div><small>${ico(ic, "s")} ${t}</small><b>${esc(v)}</b></div>`).join("")}</div>`; fila = []; };
  for (const k of scelti) { if (KPI.includes(k)) { const r = riquadroKpi(k); if (r) fila.push(r); } else if (k === "preferiti") { chiudiFila(); sotto += sezPref; } }
  chiudiFila();
  return `<div class="agente" style="--cols:${colonne}">
    ${conStanze ? `<section class="card"><div class="dim" style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Cosa succede in casa</div>
      <div class="ora">${ora(d)} · <span style="text-transform:capitalize">${giorno}</span></div>
      <div class="gruppo">Stanze</div>
      <div class="stanze-mini">${ss.map((s) => { const t = tempStanza(s); const l = s.entita.filter((id) => eLuce(id) && st(id).state === "on").length; return `<button class="st-mini ${l ? "on" : ""}" data-apri-stanza="${esc(s.id)}"><b>${esc(s.nome)}</b><span>${t != null ? fmt1(t) + "°" : "—"}</span><small>${l ? l + (l === 1 ? " luce accesa" : " luci accese") : s.entita.length + " dispositivi"}</small></button>`; }).join("") || '<div class="dim">Crea le stanze in Stanze › Gestisci stanze.</div>'}</div>
    </section>` : ""}
    <section class="card centro">
      <div class="orb ${tipo}"><div class="anello"></div><div class="anello b"></div><div class="nucleo">${ico(ultima ? (ICONE_DIARIO[ultima.icona] || "agente") : "agente", "l")}</div></div>
      <div class="etichetta">Nexalia · ${tipo === "avviso" ? "attenzione" : tipo === "fatto" ? "fatto" : "ti tiene d'occhio la casa"}</div>
      ${ultima ? `<div class="dim">${esc(ultima.stanza || "Casa")} · ${ora(ultima.t)}</div>` : conStanze ? "" : `<div class="dim" style="text-transform:capitalize">${ora(d)} · ${giorno}</div>`}
      <div class="frase">“${esc(frase)}”</div>
      ${ultima && ultima.testo ? `<div class="mut" style="max-width:560px">${esc(ultima.testo)}</div>` : ""}
      ${rispostaAssist ? `<div class="risposta"><b class="etichetta" style="display:block;margin-bottom:4px">Nexalia</b>${esc(rispostaAssist)}</div>` : ""}
      ${S.cfg.assist && S.cfg.assist.nascondi ? "" : `<form class="chat" id="formAssist"><input id="assist" type="text" placeholder="Chiedi a Nexalia: “accendi le luci in cucina”" autocomplete="off" aria-label="Chiedi a Nexalia"><button class="btn p" aria-label="Invia">${ico("invio")}</button></form>
      <div class="dim" style="font-size:12px">Le richieste passano dall'assistente di Home Assistant (Assist), anche con un modello AI se lo hai configurato.</div>`}
    </section>
    ${conDiario ? `<section class="card"><div class="tit"><h2>Cosa è successo</h2>${S.diario.length ? '<button class="btn pic" data-azz-diario>Svuota</button>' : ""}</div>
      <div class="diario">${S.diario.slice(0, 40).map((v) => `<div class="voce ${v.tipo}"><div class="ico">${ico(ICONE_DIARIO[v.icona] || "agente", "s")}</div><div><small>${ora(v.t)}${v.stanza ? " · " + esc(v.stanza) : ""}</small><b>${esc(v.titolo)}</b>${v.testo ? `<p>${esc(v.testo)}</p>` : ""}</div></div>`).join("") || '<div class="vuoto">Qui Nexalia annota quello che succede e quello che fa per te.</div>'}</div>
    </section>` : ""}
  </div>
  ${sotto}`;
}

// ---------- Stanze
function vStanze() {
  const ss = stanze();
  if (!S.stanza || !ss.find((s) => s.id === S.stanza)) S.stanza = ss[0] && ss[0].id;
  const s = ss.find((x) => x.id === S.stanza);
  return `<div class="stanze">
    <section class="card"><div class="tit"><h2>Stanze</h2><button class="btn pic" data-gestisci-stanze>${ico("matita", "s")}Gestisci</button></div>
      <div class="elenco">${ss.map((x) => { const t = tempStanza(x); return `<button class="${x.id === S.stanza ? "on" : ""}" data-stanza="${esc(x.id)}"><span><b>${esc(x.nome)}</b><small>${x.entita.length} dispositivi</small></span><span>${t != null ? fmt1(t) + "°" : ""}</span></button>`; }).join("") || '<div class="vuoto">Nessuna stanza. Premi Gestisci per crearle o importarle dalle aree di Home Assistant.</div>'}</div>
    </section>
    <section class="card">${s ? `<div class="tit"><div><div class="dim" style="font-size:12px">Stanza</div><h2 style="font-size:26px">${esc(s.nome)}</h2></div><div class="riga">${tempStanza(s) != null ? `<b style="font-size:24px">${fmt1(tempStanza(s))}°</b>` : ""}${s.entita.some(eLuce) ? `<button class="btn pic" data-tutte-luci="${esc(s.id)}" data-v="turn_off">Spegni luci</button>` : ""}</div></div>${tesserePerGruppo(s.entita.filter(visibileStanza))}` : '<div class="vuoto">Seleziona una stanza.</div>'}</section>
  </div>`;
}
const visibileStanza = (id) => st(id) && !(S.cfg.nascoste || []).includes(id);

function finestra(html) { const f = $("#finestra"); $(".pannello", f).innerHTML = html; f.hidden = false; const p = $(".pannello input,.pannello button", f); if (p) p.focus(); }
function chiudiFinestra() { $("#finestra").hidden = true; disegna(); }

function gestisciStanze() {
  const proprie = S.cfg.stanze && S.cfg.stanze.length;
  const ss = stanze();
  finestra(`<div class="tit"><h2>Gestisci stanze</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>
    <p class="mut">${proprie ? "Stai usando le tue stanze. Puoi rinominarle, eliminarle e scegliere i dispositivi di ognuna." : "Ora le stanze vengono dalle aree di Home Assistant. Se vuoi personalizzarle, importale qui: poi le modifichi solo in Nexalia."}</p>
    ${proprie ? "" : `<button class="btn p" data-importa-aree style="margin-bottom:14px">Importa le aree e personalizza</button>`}
    <div class="lista-sel">${ss.map((s) => `<label style="cursor:default"><b style="flex:1">${esc(s.nome)}</b><small>${s.entita.length} disp.</small>${proprie ? `<button class="btn pic" data-dispositivi-stanza="${esc(s.id)}">Dispositivi</button><button class="btn pic" data-rinomina-stanza="${esc(s.id)}" aria-label="Rinomina">${ico("matita", "s")}</button><button class="btn pic r" data-elimina-stanza="${esc(s.id)}" aria-label="Elimina">${ico("cestino", "s")}</button>` : ""}</label>`).join("")}</div>
    ${proprie ? `<form class="riga" id="formNuovaStanza"><input id="nuovaStanza" type="text" placeholder="Nome della nuova stanza" style="flex:1" maxlength="40"><button class="btn p">${ico("piu", "s")}Aggiungi</button></form>
    <p><button class="btn pic" data-torna-aree>Torna alle aree di Home Assistant</button></p>` : ""}`);
}
function dispositiviStanza(idSt) {
  const s = S.cfg.stanze.find((x) => x.id === idSt); if (!s) return;
  const altre = {}; for (const x of S.cfg.stanze) if (x.id !== idSt) for (const e of x.entita || []) altre[e] = x.nome;
  const tutte = Object.keys(S.stati).filter(visibile).sort((a, b) => nomeE(a).localeCompare(nomeE(b)));
  finestra(`<div class="tit"><h2>Dispositivi · ${esc(s.nome)}</h2><button class="btn pic" data-gestisci-stanze aria-label="Indietro">${ico("chiudi", "s")}</button></div>
    <input type="text" id="cercaDisp" placeholder="Cerca un dispositivo" aria-label="Cerca">
    <div class="lista-sel" id="listaDisp">${tutte.map((id) => `<label data-nome="${esc(nomeE(id).toLowerCase())}"><input type="checkbox" value="${id}" ${(s.entita || []).includes(id) ? "checked" : ""}>${ico(iconaE(id), "s")}<span>${esc(nomeE(id))}</span><small>${altre[id] ? "in " + esc(altre[id]) : esc(dom(id))}</small></label>`).join("")}</div>
    <div class="riga"><span class="spazio"></span><button class="btn" data-gestisci-stanze>Annulla</button><button class="btn p" data-salva-disp="${esc(idSt)}">Salva</button></div>`);
}

// ---------- Comandi
function vComandi() {
  const luci = Object.keys(S.stati).filter((id) => eLuce(id) && visibile(id));
  const tap = Object.keys(S.stati).filter((id) => dom(id) === "cover" && visibile(id));
  const prese = Object.keys(S.stati).filter((id) => ePresa(id) && visibile(id));
  const altri = Object.keys(S.stati).filter((id) => ((dom(id) === "switch" && !ePresa(id)) || ["input_boolean", "fan"].includes(dom(id))) && !eLuce(id) && !ePresa(id) && !accessorio(id) && forzato(id) !== "sensori" && visibile(id));
  const acc = luci.filter((id) => st(id).state === "on").length, aperte = tap.filter((id) => st(id).state !== "closed").length;
  return `<section class="card"><div class="riga">
      <div class="riga" style="gap:12px">${ico("luci")}<div><b>Tutte le luci</b><div class="dim" style="font-size:13px">${acc} accese su ${luci.length}</div></div><button class="btn a pic" data-gruppo="light" data-v="turn_on">Accendi tutte</button><button class="btn pic" data-gruppo="light" data-v="turn_off">Spegni tutte</button></div>
      <span class="spazio"></span>
      <div class="riga" style="gap:12px">${ico("tapparelle")}<div><b>Tutte le tapparelle</b><div class="dim" style="font-size:13px">${aperte} aperte su ${tap.length}</div></div><button class="btn p pic" data-gruppo="cover" data-v="open_cover">${ico("su", "s")}Apri tutte</button><button class="btn pic" data-gruppo="cover" data-v="close_cover">${ico("giu", "s")}Chiudi tutte</button></div>
    </div>
    ${luci.length ? `<div class="gruppo">Luci</div><div class="tessere">${luci.map(tessera).join("")}</div>` : ""}
    ${tap.length ? `<div class="gruppo">Tapparelle</div><div class="tessere">${tap.map(tessera).join("")}</div>` : ""}
    ${prese.length ? `<div class="gruppo">Prese</div><div class="tessere">${prese.map(tessera).join("")}</div>` : ""}
    ${altri.length ? `<div class="gruppo">Altri interruttori</div><div class="tessere">${altri.map(tessera).join("")}</div>` : ""}
    ${!luci.length && !tap.length && !prese.length && !altri.length ? '<div class="vuoto">Nessun dispositivo da comandare trovato in Home Assistant.</div>' : ""}
  </section>`;
}

// ---------- Casa 3D
let modifica3d = false, vista3d = { rx: 55, rz: -35, z: 1 };
const CELLA = 70;
function piantaStanze() {
  const ss = stanze(); const p = { ...(S.cfg.pianta || {}) };
  let x = 0, y = 0, rigaH = 0; const LARG = 12;
  for (const s of ss) {
    if (p[s.id]) continue;
    const w = 4, h = 3;
    if (x + w > LARG) { x = 0; y += rigaH; rigaH = 0; }
    p[s.id] = { x, y, w, h }; x += w; rigaH = Math.max(rigaH, h);
  }
  return { ss, p };
}
function vCasa3d() {
  if (!completa()) return `<section class="card bloccata">${ico("cubo", "l")}<h2>Casa 3D è inclusa nella licenza completa</h2><p class="mut" style="max-width:480px">Disegna la pianta della casa, posiziona i dispositivi e comandali toccandoli sulla mappa.</p><button class="btn p" data-vai="impostazioni">Vedi la licenza</button></section>`;
  const { ss, p } = piantaStanze();
  let maxX = 0, maxY = 0; for (const s of ss) { const r = p[s.id]; maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h); }
  const W = maxX * CELLA, H = maxY * CELLA;
  const stanzeHtml = ss.map((s) => {
    const r = p[s.id], luce = s.entita.some((id) => eLuce(id) && st(id).state === "on"), t = tempStanza(s);
    const pins = s.entita.filter((id) => ["light", "switch", "cover", "lock", "climate", "fan", "media_player", "input_boolean"].includes(dom(id)) && !accessorio(id) && visibileStanza(id)).map((id, i) => {
      const pos = (S.cfg.posizioni || {})[id] || { x: 20 + (i % 4) * 20, y: 35 + Math.floor(i / 4) * 25 };
      const on = ACCESO.includes(st(id).state);
      return `<div class="c3d-pin ${dom(id) === "light" ? "" : "blu"} ${on ? "on" : ""}" style="left:${pos.x}%;top:${pos.y}%" data-pin="${id}" title="${esc(nomeE(id))}: ${esc(testoStato(id))}">${ico(iconaE(id))}</div>`;
    }).join("");
    return `<div class="c3d-stanza ${luce ? "luce" : ""}" data-st3d="${esc(s.id)}" style="left:${r.x * CELLA}px;top:${r.y * CELLA}px;width:${r.w * CELLA}px;height:${r.h * CELLA}px"><span class="nome-st">${esc(s.nome)}</span>${t != null ? `<span class="temp-st">${fmt1(t)}°</span>` : ""}${pins}<span class="maniglia" data-maniglia="${esc(s.id)}"></span></div>`;
  }).join("");
  return `<section class="card"><div class="tit"><div><h2>Casa 3D</h2><div class="mut" style="font-size:13px">${modifica3d ? "Trascina stanze e dispositivi. L'angolo blu ridimensiona la stanza." : "Tocca un dispositivo per accenderlo o spegnerlo. Trascina lo sfondo per ruotare."}</div></div>
    <div class="riga"><button class="btn pic" data-ruota="-15">↺</button><button class="btn pic" data-ruota="15">↻</button><button class="btn pic" data-zoom="0.1">+</button><button class="btn pic" data-zoom="-0.1">−</button><button class="btn pic" data-vista2d>${vista3d.rx ? "Vista dall'alto" : "Vista 3D"}</button><button class="btn ${modifica3d ? "p" : ""} pic" data-modifica3d>${modifica3d ? "Fine" : "Modifica"}</button></div></div>
    <div class="c3d-scena ${modifica3d ? "modifica" : ""}" id="scena3d"><div class="c3d-piano" id="piano3d" style="width:${W}px;height:${H}px;margin:${-H / 2}px 0 0 ${-W / 2}px;transform:scale(${vista3d.z}) rotateX(${modifica3d ? 0 : vista3d.rx}deg) rotateZ(${modifica3d ? 0 : vista3d.rz}deg)">${stanzeHtml}</div></div>
  </section>`;
}
function dopoCasa3d() {
  const scena = $("#scena3d"); if (!scena) return;
  let trasc = null;
  scena.onpointerdown = (e) => {
    const pin = e.target.closest("[data-pin]"), man = e.target.closest("[data-maniglia]"), stz = e.target.closest("[data-st3d]");
    if (!modifica3d) {
      if (pin) return;
      trasc = { tipo: "ruota", x0: e.clientX, y0: e.clientY, rz: vista3d.rz, rx: vista3d.rx };
    } else if (pin) {
      const box = pin.parentElement.getBoundingClientRect();
      trasc = { tipo: "pin", el: pin, box };
    } else if (man) {
      const id = man.dataset.maniglia; const r = { ...piantaStanze().p[id] };
      trasc = { tipo: "dim", id, r, x0: e.clientX, y0: e.clientY, el: man.parentElement };
    } else if (stz) {
      const id = stz.dataset.st3d; const r = { ...piantaStanze().p[id] };
      trasc = { tipo: "sposta", id, r, x0: e.clientX, y0: e.clientY, el: stz };
    }
    if (trasc) { scena.setPointerCapture(e.pointerId); e.preventDefault(); }
  };
  scena.onpointermove = (e) => {
    if (!trasc) return;
    const piano = $("#piano3d"), z = vista3d.z;
    if (trasc.tipo === "ruota") {
      vista3d.rz = trasc.rz + (e.clientX - trasc.x0) * 0.3;
      if (vista3d.rx) vista3d.rx = Math.max(20, Math.min(70, trasc.rx - (e.clientY - trasc.y0) * 0.2));
      piano.style.transform = `scale(${z}) rotateX(${vista3d.rx}deg) rotateZ(${vista3d.rz}deg)`;
    } else if (trasc.tipo === "pin") {
      const x = Math.max(5, Math.min(95, ((e.clientX - trasc.box.left) / trasc.box.width) * 100));
      const y = Math.max(8, Math.min(92, ((e.clientY - trasc.box.top) / trasc.box.height) * 100));
      trasc.el.style.left = x + "%"; trasc.el.style.top = y + "%"; trasc.pos = { x: Math.round(x), y: Math.round(y) };
    } else {
      const dx = Math.round((e.clientX - trasc.x0) / (CELLA * z)), dy = Math.round((e.clientY - trasc.y0) / (CELLA * z));
      const r = { ...trasc.r };
      if (trasc.tipo === "sposta") { r.x = Math.max(0, r.x + dx); r.y = Math.max(0, r.y + dy); trasc.el.style.left = r.x * CELLA + "px"; trasc.el.style.top = r.y * CELLA + "px"; }
      else { r.w = Math.max(2, r.w + dx); r.h = Math.max(2, r.h + dy); trasc.el.style.width = r.w * CELLA + "px"; trasc.el.style.height = r.h * CELLA + "px"; }
      trasc.nuovo = r;
    }
  };
  scena.onpointerup = () => {
    if (!trasc) return;
    const t = trasc; trasc = null;
    if (t.tipo === "pin" && t.pos) salvaCfg({ posizioni: { ...(S.cfg.posizioni || {}), [t.el.dataset.pin]: t.pos } });
    if ((t.tipo === "sposta" || t.tipo === "dim") && t.nuovo) { const pianta = { ...piantaStanze().p, [t.id]: t.nuovo }; salvaCfg({ pianta }).then(disegna); }
  };
}

// ---------- Energia
function vEnergia() {
  const e = S.cfg.energia;
  const sol = e.solare ? watt(e.solare) : null, rete = e.rete ? watt(e.rete) : null, bat = e.batteria ? watt(e.batteria) : null, liv = e.batteria_livello ? num(e.batteria_livello) : null;
  let casa = e.casa ? watt(e.casa) : null;
  if (casa == null && (sol != null || rete != null)) casa = (sol || 0) + (rete || 0) + (bat || 0);
  const config = e.solare || e.rete || e.casa;
  const potenze = Object.keys(S.stati).filter((id) => dom(id) === "sensor" && attr(id, "device_class") === "power" && ![e.solare, e.rete, e.batteria, e.casa].includes(id)).map((id) => [id, watt(id)]).filter((x) => x[1] != null && x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const max = potenze.length ? potenze[0][1] : 1;
  const linea = (v, col, inv) => `<div class="linea ${v == null || Math.abs(v) < 5 ? "ferma" : (v > 0) !== !!inv ? "in" : "out"}" style="color:${col}"></div>`;
  const fonte = (ic, col, tit, v, sotto) => `<div class="fonte"><div class="ico" style="background:${col}22;color:${col}">${ico(ic)}</div><div><small>${tit}</small><b>${fmtW(v == null ? null : Math.abs(v))}</b><small>${sotto}</small></div></div>`;
  return `<section class="card"><div class="tit"><div><h2>Energia</h2><div class="mut" style="font-size:13px">I flussi di adesso${e.contatore_kw ? " · contatore da " + e.contatore_kw + " kW" : ""}</div></div><button class="btn pic" data-vai="impostazioni">Scegli i sensori</button></div>
    ${config ? `<div class="flussi">
      <div>${e.solare ? fonte("solare", "#FFC85A", "Fotovoltaico", sol, sol > 5 ? "Produce adesso" : "Non produce") : ""}${e.rete ? fonte("rete", "#B48CFF", "Rete", rete, rete == null ? "" : rete >= 0 ? "Stai prelevando" : "Stai cedendo alla rete") : ""}${e.batteria ? fonte("batteria", "#4CC38A", "Batteria" + (liv != null ? " " + Math.round(liv) + "%" : ""), bat, bat == null ? "" : bat > 5 ? "In scarica" : bat < -5 ? "In carica" : "Ferma") : ""}</div>
      <div>${e.solare ? linea(sol, "#FFC85A") : ""}${e.rete ? linea(rete, "#B48CFF") : ""}${e.batteria ? linea(bat, "#4CC38A") : ""}</div>
      <div class="casa-tot">${ico("casa", "l")}<span class="mut">Casa consuma</span><b>${fmtW(casa)}</b>${e.contatore_kw && casa != null ? `<small class="${casa > e.contatore_kw * 920 ? "" : "dim"}" style="${casa > e.contatore_kw * 920 ? "color:var(--ambra)" : ""}">${Math.round((casa / (e.contatore_kw * 1000)) * 100)}% del contatore</small>` : ""}</div>
    </div>` : `<div class="vuoto">Scegli in Impostazioni i sensori di potenza (fotovoltaico, rete, consumo della casa) per vedere i flussi.</div>`}
  </section>
  <div class="griglia" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr));margin-top:16px">
    <section class="card"><h2>Dove va l'energia</h2><div class="barre">${potenze.map(([id, w]) => `<div class="barra-c"><span>${esc(nomeE(id))}</span><b>${fmtW(w)}</b><i><span style="width:${Math.max(3, (w / max) * 100)}%"></span></i></div>`).join("") || '<div class="dim">Nessun sensore di potenza dei singoli dispositivi.</div>'}</div></section>
    <section class="card"><h2>Consumo della casa · ultime 24 ore</h2><svg class="grafico" id="grafico" viewBox="0 0 600 180" preserveAspectRatio="none"></svg><div class="dim" id="graficoInfo" style="font-size:13px"></div></section>
  </div>`;
}
let cacheStorico = { id: null, t: 0, punti: [] };
async function disegnaGrafico() {
  const g = $("#grafico"), id = S.cfg.energia.casa || S.cfg.energia.rete; if (!g) return;
  if (!id) { $("#graficoInfo").textContent = "Scegli il sensore del consumo della casa nelle impostazioni."; return; }
  if (cacheStorico.id !== id || Date.now() - cacheStorico.t > 5 * 60000) {
    try { const d = await api("api/storico?ore=24&id=" + encodeURIComponent(id)); cacheStorico = { id, t: Date.now(), punti: d.punti }; } catch (e) { $("#graficoInfo").textContent = "Storico non disponibile."; return; }
  }
  const g2 = $("#grafico"); if (!g2) return;
  const pts = cacheStorico.punti.map(([t, v]) => [new Date(t).getTime(), v]);
  if (pts.length < 2) { $("#graficoInfo").textContent = "Ancora pochi dati: torna più tardi."; return; }
  const t0 = Date.now() - 86400000, t1 = Date.now(), vmax = Math.max(...pts.map((p) => p[1]), 1);
  const X = (t) => ((t - t0) / (t1 - t0)) * 600, Y = (v) => 170 - (v / vmax) * 155;
  let d = ""; pts.forEach((p, i) => { d += (i ? "L" : "M") + X(Math.max(t0, p[0])).toFixed(1) + " " + Y(p[1]).toFixed(1); });
  d += "L600 " + Y(pts[pts.length - 1][1]).toFixed(1);
  g2.innerHTML = `<defs><linearGradient id="gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5AB0FF" stop-opacity=".35"/><stop offset="1" stop-color="#5AB0FF" stop-opacity="0"/></linearGradient></defs><path d="${d}L600 170L0 170Z" fill="url(#gg)"/><path d="${d}" fill="none" stroke="#5AB0FF" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
  const u = (attr(id, "unit_of_measurement") || "").toLowerCase() === "kw" ? 1000 : 1;
  $("#graficoInfo").textContent = "Picco: " + fmtW(vmax * u) + " · media: " + fmtW((pts.reduce((a, p) => a + p[1], 0) / pts.length) * u);
}

// ---------- Sicurezza
let pin = "", pinPer = null;
function vSicurezza() {
  const all = Object.keys(S.stati).filter((id) => dom(id) === "alarm_control_panel");
  const ap = Object.keys(S.stati).filter((id) => eApertura(id) && visibileStanza(id));
  const per = Object.keys(S.stati).filter((id) => dom(id) === "binary_sensor" && ["smoke", "gas", "moisture", "carbon_monoxide"].includes(attr(id, "device_class")));
  const serr = Object.keys(S.stati).filter((id) => dom(id) === "lock");
  const cam = Object.keys(S.stati).filter((id) => dom(id) === "camera" && visibileStanza(id));
  return `<div class="griglia" style="grid-template-columns:repeat(auto-fit,minmax(380px,1fr))">
    <section class="card"><h2>Allarme</h2>${all.map((id) => { const v = st(id).state, cls = ["unavailable", "unknown"].includes(v) ? "" : v === "disarmed" ? "disarmed" : v === "triggered" ? "triggered" : "armed"; return `<div class="allarme-stato ${cls}" style="margin-bottom:12px">${ico("sicurezza", "l")}<div style="flex:1"><div class="dim" style="font-size:12px">${esc(nomeE(id))}</div><b>${testoAllarme(v)}</b></div></div>
      <div class="riga" style="margin-bottom:16px">${["unavailable", "unknown"].includes(v) ? `<span class="dim">La centrale non risponde: controlla l'integrazione in Home Assistant.</span>` : v === "disarmed" ? `<button class="btn a" data-arma="alarm_arm_away" data-id="${id}">Inserisci totale</button><button class="btn p" data-arma="alarm_arm_home" data-id="${id}">In casa</button><button class="btn" data-arma="alarm_arm_night" data-id="${id}">Notte</button>` : `<button class="btn" data-arma="alarm_disarm" data-id="${id}">Disinserisci</button>`}</div>`; }).join("") || '<div class="dim">Nessuna centrale d\'allarme in Home Assistant.</div>'}
      ${per.length ? `<div class="gruppo">Sensori di sicurezza</div><div class="tessere">${per.map(tessera).join("")}</div>` : ""}
      ${serr.length ? `<div class="gruppo">Serrature</div><div class="tessere">${serr.map(tessera).join("")}</div>` : ""}
    </section>
    <section class="card"><div class="tit"><h2>Porte e finestre</h2><span class="badge ${ap.some((id) => st(id).state === "on") ? "fuori" : "casa"}">${ap.filter((id) => st(id).state === "on").length} aperte</span></div><div class="tessere">${ap.map(tessera).join("") || '<div class="dim">Nessun sensore di apertura.</div>'}</div></section>
  </div>
  ${cam.length ? `<section class="card" style="margin-top:16px"><h2>Telecamere</h2><div class="telecamere">${cam.map((id) => st(id).state === "unavailable" ? `<figure><div class="cam-off">${ico("telecamere", "l")}<span>Non disponibile</span></div><figcaption>${esc(nomeE(id))}</figcaption></figure>` : `<figure><img src="api/camera/${encodeURIComponent(id)}?t=${Math.floor(Date.now() / 10000)}" alt="${esc(nomeE(id))}" loading="lazy" onerror="this.outerHTML='<div class=cam-off>Immagine non disponibile</div>'"><figcaption>${esc(nomeE(id))}</figcaption></figure>`).join("")}</div></section>` : ""}`;
}
function tastierino(id, servizio) {
  const s = st(id);
  if (!s.attributes.code_format) { chiama("alarm_control_panel", servizio, { entity_id: id }); return; }
  pin = ""; pinPer = { id, servizio };
  disegnaTastierino();
}
function disegnaTastierino() {
  const n = { alarm_arm_away: "inserire totale", alarm_arm_home: "inserire in casa", alarm_arm_night: "inserire notte", alarm_disarm: "disinserire" }[pinPer.servizio];
  finestra(`<div class="tit"><h2>PIN per ${n}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>
    <div class="pallini">${[0, 1, 2, 3].map((i) => `<i class="${i < pin.length ? "p" : ""}"></i>`).join("")}${pin.length > 4 ? `<span class="mut">+${pin.length - 4}</span>` : ""}</div>
    <div class="tastiera">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((k) => `<button data-tasto="${k}">${k}</button>`).join("")}</div>
    <div class="riga"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn p" data-conferma-pin ${pin.length ? "" : "disabled"}>Conferma</button></div>`);
}

// ---------- Persone
const COLORI = ["#5AB0FF", "#B48CFF", "#4CC38A", "#FFB454", "#FF8A80", "#5EE1D6"];
function vPersone() {
  const p = Object.keys(S.stati).filter((id) => dom(id) === "person");
  const zone = Object.keys(S.stati).filter((id) => dom(id) === "zone");
  return `<section class="card"><h2>Persone</h2><div class="persone">${p.map((id, i) => { const v = st(id).state; const n = nomeE(id); return `<div class="pers"><div class="avatar" style="background:${COLORI[i % COLORI.length]}">${esc(n.charAt(0).toUpperCase())}</div><div style="flex:1"><b style="font-size:16px">${esc(n)}</b><div class="dim" style="font-size:13px">Da ${ora(st(id).last_changed)}</div></div><span class="badge ${v === "home" ? "casa" : "fuori"}">${v === "home" ? "In casa" : v === "not_home" ? "Fuori casa" : esc(v)}</span></div>`; }).join("") || '<div class="vuoto">Nessuna persona configurata in Home Assistant. Aggiungile in Impostazioni › Persone di Home Assistant e collega l\'app sul telefono.</div>'}</div>
    ${zone.length ? `<div class="gruppo">Zone</div><div class="riga">${zone.map((id) => `<span class="badge blu">${esc(nomeE(id))}${attr(id, "persons") ? " · " + attr(id, "persons").length : ""}</span>`).join("")}</div>` : ""}
  </section>`;
}

// ---------- Scenari
const nuovo = { quando: "orario", ora: "07:30", solo: "nessuna", fai: [], scena: "" };
function vScenari() {
  const scene = Object.keys(S.stati).filter((id) => ["scene", "script"].includes(dom(id)));
  const auto = Object.keys(S.stati).filter((id) => dom(id) === "automation");
  const QUANDO = { orario: "A un orario", tramonto: "Al tramonto", alba: "All'alba", escono: "Quando escono tutti", rientra: "Quando qualcuno rientra" };
  const FAI = { luci_off: "Spegni tutte le luci", luci_on: "Accendi tutte le luci", tap_chiudi: "Chiudi le tapparelle", tap_apri: "Apri le tapparelle", scena: "Attiva una scena", notifica: "Mandami una notifica" };
  const SOLO = { nessuna: "Sempre", vuota: "Solo se non c'è nessuno", piena: "Solo se c'è qualcuno" };
  return `<div class="scenari">
    <section class="card"><h2>Scene e automazioni</h2>
      ${scene.length ? `<div class="gruppo">Scene</div>${scene.map((id) => `<div class="voce-sc">${ico("play")}<div style="flex:1"><b>${esc(nomeE(id))}</b><small>${dom(id) === "script" ? "Script" : "Scena"}</small></div><button class="btn pic p" data-esegui="${id}">Attiva</button></div>`).join("")}` : ""}
      <div class="gruppo">Automazioni</div>${auto.map((id) => { const on = st(id).state === "on"; const mia = String(attr(id, "id") || "").startsWith("nexalia_"); return `<div class="voce-sc"><div style="flex:1"><b>${esc(nomeE(id))}</b><small>${attr(id, "last_triggered") ? "Ultima volta " + new Date(attr(id, "last_triggered")).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) : "Mai eseguita"}${mia ? " · creata con Nexalia" : ""}</small></div>${mia ? `<button class="btn pic r" data-elimina-auto="${esc(attr(id, "id"))}" aria-label="Elimina">${ico("cestino", "s")}</button>` : ""}<button class="tg ${on ? "on" : ""}" data-auto="${id}" aria-label="${on ? "Disattiva" : "Attiva"} ${esc(nomeE(id))}"></button></div>`; }).join("") || '<div class="dim">Nessuna automazione.</div>'}
    </section>
    <section class="card"><h2>Crea uno scenario</h2>
      <div class="gruppo">Quando</div><div class="scelte">${Object.entries(QUANDO).map(([k, v]) => `<button class="${nuovo.quando === k ? "on" : ""}" data-nq="${k}">${v}</button>`).join("")}</div>
      ${nuovo.quando === "orario" ? `<div style="margin-top:10px;max-width:160px"><input type="time" id="nuovoOra" value="${nuovo.ora}" aria-label="Orario"></div>` : ""}
      <div class="gruppo">Fai</div><div class="scelte">${Object.entries(FAI).map(([k, v]) => `<button class="${nuovo.fai.includes(k) ? "on" : ""}" data-nf="${k}">${v}</button>`).join("")}</div>
      ${nuovo.fai.includes("scena") ? `<div style="margin-top:10px"><select id="nuovoScena" aria-label="Scena">${Object.keys(S.stati).filter((id) => dom(id) === "scene").map((id) => `<option value="${id}" ${nuovo.scena === id ? "selected" : ""}>${esc(nomeE(id))}</option>`).join("") || "<option value=''>Nessuna scena</option>"}</select></div>` : ""}
      <div class="gruppo">Solo se</div><div class="scelte">${Object.entries(SOLO).map(([k, v]) => `<button class="${nuovo.solo === k ? "on" : ""}" data-ns="${k}">${v}</button>`).join("")}</div>
      <div class="riassunto">${ico("agente")}<div><b>Nexalia ha capito così:</b><br>${esc(riassunto(QUANDO, FAI, SOLO))}</div></div>
      <label class="campo">Nome dello scenario<input type="text" id="nuovoNome" maxlength="60" placeholder="Es. Buonanotte"></label>
      <div class="riga" style="margin-top:14px"><span class="spazio"></span><button class="btn p" data-crea-scenario ${nuovo.fai.length ? "" : "disabled"}>Salva scenario</button></div>
    </section>
  </div>`;
}
function riassunto(Q, F, So) {
  const q = nuovo.quando === "orario" ? "Alle " + nuovo.ora : Q[nuovo.quando];
  const f = nuovo.fai.map((k) => k === "scena" && nuovo.scena ? "attiva " + nomeE(nuovo.scena) : F[k].toLowerCase()).join(", ");
  return q + (nuovo.solo !== "nessuna" ? ", " + So[nuovo.solo].toLowerCase() : "") + ": " + (f || "scegli almeno un'azione") + ".";
}
function costruisciAutomazione() {
  const trig = { orario: [{ platform: "time", at: nuovo.ora + ":00" }], tramonto: [{ platform: "sun", event: "sunset" }], alba: [{ platform: "sun", event: "sunrise" }], escono: [{ platform: "numeric_state", entity_id: "zone.home", below: 1 }], rientra: [{ platform: "numeric_state", entity_id: "zone.home", above: 0 }] }[nuovo.quando];
  const cond = nuovo.solo === "vuota" ? [{ condition: "numeric_state", entity_id: "zone.home", below: 1 }] : nuovo.solo === "piena" ? [{ condition: "numeric_state", entity_id: "zone.home", above: 0 }] : [];
  const act = [];
  for (const k of nuovo.fai) {
    if (k === "luci_off") act.push({ service: "light.turn_off", target: { entity_id: "all" } });
    if (k === "luci_on") act.push({ service: "light.turn_on", target: { entity_id: "all" } });
    if (k === "tap_chiudi") act.push({ service: "cover.close_cover", target: { entity_id: "all" } });
    if (k === "tap_apri") act.push({ service: "cover.open_cover", target: { entity_id: "all" } });
    if (k === "scena" && nuovo.scena) act.push({ service: "scene.turn_on", target: { entity_id: nuovo.scena } });
    if (k === "notifica") {
      const n = S.cfg.agente.notifica;
      act.push(n && n.startsWith("notify.") ? { service: n, data: { title: "Nexalia", message: "Scenario eseguito: {{ this.attributes.friendly_name }}" } } : { service: "persistent_notification.create", data: { title: "Nexalia", message: "Scenario eseguito: {{ this.attributes.friendly_name }}" } });
    }
  }
  return { trigger: trig, condition: cond, action: act };
}

// ---------- Raccolta
const TIPI_RACC = { "": ["Nessuna", "#2A3644"], "Organico": ["Organico", "#C58A5A"], "Plastica e metalli": ["Plastica e metalli", "#FFD54A"], "Carta e cartone": ["Carta e cartone", "#5AB0FF"], "Vetro": ["Vetro", "#4CC38A"], "Indifferenziato": ["Indifferenziato", "#C9D2DB"] };
const GIORNI = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
function vRaccolta() {
  const r = S.cfg.raccolta;
  const oggi = new Date(), domani = ((oggi.getDay() + 1) % 7) || 7, tipoDomani = r.calendario[String(domani)];
  return `<div class="griglia" style="grid-template-columns:1fr 340px">
    <section class="card"><h2>Raccolta differenziata</h2><p class="mut" style="margin-top:-6px">Scegli cosa passa a ritirare ogni giorno. Nexalia ti ricorda la sera prima cosa portare fuori.</p>
      <div class="settimana">${GIORNI.map((g, i) => { const k = String(i + 1), t = r.calendario[k] || ""; return `<div class="giorno"><b>${g}</b><i class="tipo" style="background:${TIPI_RACC[t][1]}"></i><select data-racc="${k}" aria-label="Raccolta di ${g}">${Object.keys(TIPI_RACC).map((x) => `<option value="${esc(x)}" ${x === t ? "selected" : ""}>${TIPI_RACC[x][0]}</option>`).join("")}</select></div>`; }).join("")}</div>
    </section>
    <section class="card"><div class="dim" style="font-size:12px">Domani, ${GIORNI[domani - 1].toLowerCase()}</div><h2 style="color:${tipoDomani ? TIPI_RACC[tipoDomani][1] : "var(--mut)"};margin:4px 0 14px">${tipoDomani || "Nessuna raccolta"}</h2>
      <div class="voce-imp"><div><b>Promemoria</b><small>La sera prima, sulla plancia e sul telefono</small></div><button class="tg ${r.attiva ? "on" : ""}" data-racc-attiva aria-label="Promemoria raccolta"></button></div>
      <label class="campo" style="margin-top:12px">Orario del promemoria<input type="time" id="raccOra" value="${esc(r.ora)}"></label>
      <p class="dim" style="font-size:13px">Il promemoria va al servizio di notifica scelto in Impostazioni › Agente.</p>
    </section>
  </div>`;
}

// ---------- Impostazioni
function opzioniSensori(filtro, val) {
  const ids = Object.keys(S.stati).filter((id) => dom(id) === "sensor" && filtro(id)).sort((a, b) => nomeE(a).localeCompare(nomeE(b)));
  return `<option value="">— nessuno —</option>` + ids.map((id) => `<option value="${id}" ${id === val ? "selected" : ""}>${esc(nomeE(id))} (${esc(testoStato(id))})</option>`).join("");
}
let pannello = localStorage.getItem("nx_pannello") || "generali", cercaEd = "", catEd = "tutte", entSel = null, cercaEnt = "", entIcona = null;
const CAT_ED = { plancia: "Plancia", dispositivi: "Dispositivi", energia: "Energia", agente: "Agente", licenza: "Licenza", tutte: "Tutte" };
const TEMI_ACC = ["#5AB0FF", "#4CC38A", "#FFB454", "#B48CFF", "#FF8A80", "#5EE1D6"];
const GRUPPI_FORZATI = { "": "Automatico", luci: "Luce", prese: "Presa", interruttori: "Interruttore", multimedia: "Multimedia (non è luce né presa)", telecamere: "Accessorio di telecamera", sensori: "Sensore" };
function pannelli() {
  const l = S.cfg.licenza, e = S.cfg.energia, a = S.cfg.agente, as = S.cfg.aspetto || {}, ass = S.cfg.assist || {};
  const pot = (id) => attr(id, "device_class") === "power";
  const notif = (S.servizi && S.servizi.notify) || [];
  const righe = [["Sezioni", "Tutte tranne Casa 3D", "Tutte"], ["Agente, stanze, scenari", "Sì", "Sì"], ["Casa 3D", "No", "Sì"], ["Accesso da fuori casa", "No", "Sì"], ["Backup e ripristino", "No", "Sì"]];
  const sez = S.cfg.sezioni || [];
  const agenti = Object.keys(S.stati).filter((id) => dom(id) === "conversation");
  const pers = S.cfg.personalizza || {};
  const P = {};
  P.generali = { cat: "plancia", ic: "impostazioni", tit: "Generali", kw: "nome casa sottotitolo intestazione", html: () => `
    <p class="mut">Il nome e la riga sotto compaiono in alto a sinistra nella plancia.</p>
    <label class="campo">Nome della plancia<input type="text" id="edNome" maxlength="30" value="${esc(as.nome || "Casa")}"></label>
    <label class="campo" style="margin-top:10px">Sottotitolo<span>Facoltativo, es. "Casa al mare"</span><input type="text" id="edSotto" maxlength="40" value="${esc(as.sottotitolo || "")}"></label>
    <div class="riga" style="margin-top:12px"><button class="btn p" data-salva-generali>Salva</button></div>` };
  P.tema = { cat: "plancia", ic: "occhio", tit: "Tema e colori", kw: "tema chiaro scuro colore accento aspetto", html: () => `
    <div class="gruppo" style="margin-top:0">Aspetto</div>
    <div class="scelte">${[["scuro", "Scuro"], ["chiaro", "Chiaro"], ["auto", "Automatico"]].map(([k, n]) => `<button class="${(as.tema || "scuro") === k ? "on" : ""}" data-tema="${k}">${n}</button>`).join("")}</div>
    <div class="gruppo">Colore principale</div>
    <div class="riga">${TEMI_ACC.map((c) => `<button class="colore ${(as.accento || TEMI_ACC[0]) === c ? "on" : ""}" style="background:${c}" data-accento="${c}" aria-label="Colore ${c}"></button>`).join("")}</div>` };
  P.home = { cat: "plancia", ic: "casa", tit: "Schermata principale", kw: "home riquadri widget preferiti ordine", html: () => `<p class="mut" style="margin-top:-6px">Scegli cosa vedere nella home e in che ordine. Il cerchio dell'agente c'è sempre.</p>
      ${ordineHome().map((k, i, a) => `<div class="voce-imp"><div><b>${RIQUADRI[k]}</b></div><button class="btn pic" data-su="${k}" ${i === 0 ? "disabled" : ""} aria-label="Sposta su">${ico("su", "s")}</button><button class="btn pic" data-giu="${k}" ${i === a.length - 1 ? "disabled" : ""} aria-label="Sposta giù">${ico("giu", "s")}</button><button class="tg ${S.cfg.home.riquadri.includes(k) ? "on" : ""}" data-riq="${k}" aria-label="Mostra ${RIQUADRI[k]}"></button></div>`).join("")}` };
  P.sezioni = { cat: "plancia", ic: "comandi", tit: "Sezioni", kw: "schede menu barra ordine", html: () => `<p class="mut">Accendi le sezioni che vuoi nella barra in alto e scegli l'ordine. Agente e Impostazioni ci sono sempre.</p>
    ${ordineSezioni().map((id, i, arr) => { const sc = SCHEDE.find((x) => x.id === id); return `<div class="voce-imp">${ico(sc.ic)}<div><b>${sc.nome}</b>${sc.completa && !completa() ? "<small>Con la licenza completa</small>" : ""}</div><button class="btn pic" data-sez-su="${id}" ${i === 0 ? "disabled" : ""} aria-label="Sposta su">${ico("su", "s")}</button><button class="btn pic" data-sez-giu="${id}" ${i === arr.length - 1 ? "disabled" : ""} aria-label="Sposta giù">${ico("giu", "s")}</button><button class="tg ${sez.includes(id) && (!sc.completa || completa()) ? "on" : ""}" data-sezione="${id}" ${sc.completa && !completa() ? "disabled" : ""} aria-label="Mostra ${sc.nome}"></button></div>`; }).join("")}` };
  P.backup = { cat: "plancia", ic: "freccia", tit: "Backup e informazioni", kw: "backup ripristino versione aggiornamenti assistenza", html: () => `
      <p class="mut">Salva stanze, Casa 3D, scenari, impostazioni e raccolta in un file. Per passare a un altro mini PC: installa Nexalia e carica il backup.</p>
      ${completa() ? `<div class="riga"><a class="btn" href="api/backup" download>Scarica il backup</a><label class="btn">Ripristina da file<input type="file" id="fileBackup" accept="application/json" hidden></label></div>` : `<div class="dim">Incluso nella licenza completa.</div>`}
      <div class="gruppo">Informazioni</div>
      <div class="riga" style="margin-bottom:8px"><button class="btn pic" data-cerca-agg>Cerca aggiornamenti</button></div><div class="mut" style="font-size:14px">Nexalia ${esc(S.versione)} · Home Assistant ${esc((S.haConfig && S.haConfig.versione) || "")} · ${S.collegato ? "collegato" : "non collegato"}<br>${Object.keys(S.stati).length} entità · ${S.aree.length} aree<br>Assistenza: <a href="mailto:info@nexaliahome.com">info@nexaliahome.com</a> · <a href="https://nexaliahome.com" target="_blank" rel="noopener">nexaliahome.com</a></div>` };
  P.stanze = { cat: "dispositivi", ic: "stanze", tit: "Stanze", kw: "stanze aree stanza", html: () => `<p class="mut">Crea, rinomina ed elimina le stanze e scegli quali dispositivi ci sono in ognuna.</p><button class="btn p" data-gestisci-stanze>${ico("matita", "s")}Gestisci le stanze</button>` };
  P.entita = { cat: "dispositivi", ic: "stella", tit: "Le tue entità", kw: "entità rinomina nome icona gruppo luce presa", html: () => {
    const tutte = Object.keys(S.stati).filter((id) => DOMINI_UTILI.includes(dom(id))).sort((x, y) => nomeE(x).localeCompare(nomeE(y)));
    const q = cercaEnt.toLowerCase();
    const lista = q ? tutte.filter((id) => (nomeE(id) + " " + id).toLowerCase().includes(q)).slice(0, 60) : [];
    const mod = Object.keys(pers).filter((id) => st(id));
    const sel = entSel && st(entSel) ? entSel : null, ps = sel ? pers[sel] || {} : {};
    const icSel = entIcona !== null ? entIcona : ps.icona || "";
    return `<p class="mut">Rinomina un dispositivo, cambiagli l'icona o di' a Nexalia cos'è davvero (es. una presa che accende una lampada diventa "Luce"). Vale solo nella plancia: in Home Assistant non cambia niente.</p>
    ${sel ? `<div class="ed-box"><div class="tit"><b>${esc(nomeE(sel))}</b><small class="dim">${esc(sel)}</small></div>
      <label class="campo">Nome nella plancia<input type="text" id="entNome" maxlength="40" value="${esc(ps.nome || "")}" placeholder="${esc(nomeOriginale(sel))}"></label>
      <label class="campo" style="margin-top:10px">È un…<select id="entGruppo">${Object.entries(GRUPPI_FORZATI).map(([k, n]) => `<option value="${k}" ${(ps.gruppo || "") === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <div class="gruppo">Icona</div><div class="icone-sel"><button class="${!icSel ? "on" : ""}" data-ent-icona="" aria-label="Automatica">Auto</button>${["luci", "presa", "tapparelle", "clima", "ventola", "media", "telecamere", "porte", "finestra", "energia", "goccia", "robot", "lucchetto", "sensore", "casa", "stella"].map((k) => `<button class="${icSel === k ? "on" : ""}" data-ent-icona="${k}" aria-label="Icona ${k}">${ico(k)}</button>`).join("")}</div>
      <div class="riga" style="margin-top:14px"><button class="btn p" data-salva-ent>Salva</button><button class="btn" data-annulla-ent>Annulla</button><span class="spazio"></span>${pers[sel] ? `<button class="btn r pic" data-reset-ent="${sel}">Ripristina originale</button>` : ""}</div></div>` : ""}
    <label class="campo" style="margin-top:12px">Cerca un dispositivo da modificare<input type="text" id="cercaEnt" value="${esc(cercaEnt)}" placeholder="Es. presa, luce, echo" autocomplete="off"></label>
    <div id="risEnt">${lista.length ? `<div class="lista-sel">${lista.map((id) => `<label data-ent="${id}">${ico(iconaE(id), "s")}<span>${esc(nomeE(id))}</span><small>${esc(id)}</small></label>`).join("")}</div>` : q ? '<p class="dim">Nessun dispositivo trovato.</p>' : ""}</div>
    ${mod.length ? `<div class="gruppo">Modificati</div>${mod.map((id) => `<div class="voce-imp">${ico(iconaE(id))}<div><b>${esc(nomeE(id))}</b><small>${esc(id)}${pers[id].gruppo ? " · " + esc(GRUPPI_FORZATI[pers[id].gruppo]) : ""}</small></div><button class="btn pic" data-ent="${id}" aria-label="Modifica">${ico("matita", "s")}</button></div>`).join("")}` : ""}`; } };
  P.nascosti = { cat: "dispositivi", ic: "nascondi", tit: "Dispositivi nascosti", kw: "nascondi nascosti mostra", html: () => `
      ${(S.cfg.nascoste || []).length ? (S.cfg.nascoste || []).map((id) => `<div class="voce-imp">${ico(st(id) ? iconaE(id) : "sensore")}<div><b>${esc(st(id) ? nomeE(id) : id)}</b><small>${esc(id)}</small></div><button class="btn pic" data-mostra-disp="${id}">Mostra di nuovo</button></div>`).join("") : '<p class="mut">Nessun dispositivo nascosto. Per nasconderne uno tocca l\'icona con l\'occhio barrato sulla sua tessera.</p>'}` };
  P.energia = { cat: "energia", ic: "energia", tit: "Energia", kw: "energia sensori fotovoltaico rete batteria contatore carichi", html: () => `
      <div class="griglia">
        <label class="campo">Consumo della casa<select data-energia="casa">${opzioniSensori(pot, e.casa)}</select></label>
        <label class="campo">Fotovoltaico (produzione)<select data-energia="solare">${opzioniSensori(pot, e.solare)}</select></label>
        <label class="campo">Rete<span>Positivo quando prelevi, negativo quando cedi</span><select data-energia="rete">${opzioniSensori(pot, e.rete)}</select></label>
        <label class="campo">Batteria (potenza)<span>Positivo in scarica</span><select data-energia="batteria">${opzioniSensori(pot, e.batteria)}</select></label>
        <label class="campo">Batteria (livello %)<select data-energia="batteria_livello">${opzioniSensori((id) => attr(id, "device_class") === "battery", e.batteria_livello)}</select></label>
        <label class="campo">Potenza del contatore (kW)<input type="number" id="impContatore" min="1" max="30" step="0.5" value="${esc(e.contatore_kw)}"></label>
        <div><b style="font-size:14px">Carichi da spegnere se superi il contatore</b><div class="dim" style="font-size:13px;margin-bottom:8px">Es. lavatrice, scaldabagno: Nexalia li spegne per primi</div><button class="btn pic" data-differibili>${(e.differibili || []).length ? (e.differibili || []).length + " scelti · modifica" : "Scegli"}</button></div>
      </div>` };
  P.agente = { cat: "agente", ic: "agente", tit: "Agente", kw: "agente avvisi notifiche telefono consumi pioggia luci uscita", html: () => `
      <label class="campo">Dove mandare gli avvisi<span>Scegli l'app sul telefono (notify.mobile_app_…)</span><select id="impNotifica"><option value="">Solo notifiche di Home Assistant</option>${notif.map((n) => `<option value="notify.${n}" ${a.notifica === "notify." + n ? "selected" : ""}>notify.${esc(n)}</option>`).join("")}</select></label>
      <div class="voce-imp" style="margin-top:8px"><div><b>Spegni le luci quando escono tutti</b><small>Altrimenti Nexalia te lo ricorda soltanto</small></div><button class="tg ${a.spegni_luci_uscita ? "on" : ""}" data-agente="spegni_luci_uscita" aria-label="Spegni le luci quando escono tutti"></button></div>
      <div class="voce-imp"><div><b>Avvisa per consumi alti</b><small>Prima di superare la potenza del contatore</small></div><button class="tg ${a.avvisa_consumi ? "on" : ""}" data-agente="avvisa_consumi" aria-label="Avvisa per consumi alti"></button></div>
      <div class="voce-imp"><div><b>Finestre aperte quando piove</b><small>Usa il meteo di Home Assistant</small></div><button class="tg ${a.avvisa_finestre_pioggia ? "on" : ""}" data-agente="avvisa_finestre_pioggia" aria-label="Finestre aperte quando piove"></button></div>` };
  P.assist = { cat: "agente", ic: "invio", tit: "Assist e voce", kw: "assist chat assistente modello ai voce leggi risposta gemini", html: () => `<p class="mut">La casella "Chiedi a Nexalia" passa le richieste all'assistente di Home Assistant. Qui scegli quale usare e se la plancia deve leggere le risposte ad alta voce.</p>
    <label class="campo">Assistente<span>Vuoto = quello predefinito di Home Assistant</span><select id="edAgente"><option value="">Predefinito di Home Assistant</option>${agenti.map((id) => `<option value="${id}" ${ass.agente === id ? "selected" : ""}>${esc(nomeE(id))}</option>`).join("")}</select></label>
    <div class="voce-imp" style="margin-top:8px"><div><b>Leggi la risposta ad alta voce</b><small>Usa la voce del dispositivo su cui apri la plancia</small></div><button class="tg ${ass.voce ? "on" : ""}" data-assist="voce" aria-label="Leggi la risposta ad alta voce"></button></div>
    <div class="voce-imp"><div><b>Mostra la casella nella home</b></div><button class="tg ${ass.nascondi ? "" : "on"}" data-assist="nascondi" aria-label="Mostra la casella nella home"></button></div>` };
  P.licenza = { cat: "licenza", ic: "sicurezza", tit: "Licenza", kw: "licenza codice acquista paypal rinnova attiva disattiva", html: () => `<div class="tit"><span></span><span class="badge ${completa() ? "casa" : "blu"}">${completa() ? "Completa" : l.stato === "scaduta" ? "Scaduta" : "Gratuita"}</span></div>
      ${l.messaggio ? `<div class="lic-ko" style="margin-bottom:12px">${esc(l.messaggio)}</div>` : ""}
      ${completa() ? `<div class="lic-ok"><b>Licenza completa attiva su questa casa</b><div style="margin-top:6px;font-size:14px">Codice ${esc(l.codice)} · valida fino al ${esc(l.scadenza || "—")}</div>
        <div style="margin-top:6px;font-size:14px">Accesso da fuori casa: <span class="${S.tunnel === "attivo" ? "" : "dim"}">${{ attivo: "collegato", avvio: "in collegamento…", spento: "non collegato", mancante: "componente mancante" }[S.tunnel] || S.tunnel}</span></div></div>
        <div class="riga"><button class="btn pic" data-verifica-lic>Controlla ora</button><a class="btn pic" href="https://licenze.nexaliahome.com/acquista" target="_blank" rel="noopener">Rinnova</a><span class="spazio"></span><button class="btn pic r" data-disattiva-lic>Disattiva su questa casa</button></div>`
      : `<table><tr><th></th><th>Gratuita</th><th>Completa</th></tr>${righe.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</table>
        <p style="margin:14px 0 6px"><b>Versione completa · 39 € all'anno</b> per una casa</p>
        <a class="btn a" href="https://licenze.nexaliahome.com/acquista" target="_blank" rel="noopener" style="width:100%">Acquista con PayPal</a>
        <form id="formLic" class="riga" style="margin-top:14px"><label class="campo" style="flex:1">Ho già un codice<input type="text" id="codiceLic" placeholder="NXL-XXXX-XXXX" maxlength="13" autocomplete="off" style="text-transform:uppercase"></label><button class="btn p" style="align-self:flex-end">Attiva</button></form>
        <p class="dim" style="font-size:13px">Il codice arriva per email dopo l'acquisto e vale per una casa. Per pagare con bonifico scrivi a info@nexaliahome.com.</p>`}` };
  P.fuori = { cat: "licenza", ic: "lucchetto", tit: "Collega da fuori casa", kw: "fuori casa indirizzo qr telefono remoto collega dispositivo", html: () => `<div class="tit"><span></span>${ico("lucchetto")}</div>
      ${completa() && l.indirizzo ? `
      <p class="mut" style="margin-top:-6px">L'indirizzo della tua casa è privato: compare solo qui. Non condividerlo con chi non deve entrare.</p>
      <div class="riga" style="margin:10px 0"><code class="indir" id="indirizzo">${esc(mostraIndirizzo ? l.indirizzo : mascherato(l.indirizzo))}</code></div>
      <div class="riga"><button class="btn pic" data-mostra-ind>${mostraIndirizzo ? "Nascondi" : "Mostra"}</button><button class="btn pic" data-copia-ind>Copia</button><button class="btn pic p" data-qr>${qrVisibile ? "Nascondi QR" : "Mostra QR code"}</button></div>
      <div id="qr" class="qr" ${qrVisibile ? "" : "hidden"}></div>
      <ol class="passi">
        <li>Sul telefono installa l'app <b>Home Assistant</b> (App Store o Google Play).</li>
        <li>Inquadra il QR code con la fotocamera, oppure apri l'indirizzo nel browser.</li>
        <li>Accedi con il tuo utente di Home Assistant.</li>
        <li>Nell'app: <b>Impostazioni › App complementare › Server › URL esterno</b>, incolla l'indirizzo. Da quel momento funziona sia in casa sia fuori.</li>
      </ol>` : `<p class="mut">Con la licenza completa ottieni un indirizzo privato per entrare da fuori casa con il telefono, senza VPN. Qui troverai il collegamento e il QR code da inquadrare.</p>`}` };
  return P;
}
function ordineSezioni() {
  const altre = SCHEDE.filter((x) => !["agente", "impostazioni"].includes(x.id)).map((x) => x.id);
  const base = (S.cfg.sezioni_ordine || []).filter((id) => altre.includes(id));
  return [...base, ...altre.filter((id) => !base.includes(id))];
}
function vImpostazioni() {
  const P = pannelli();
  const q = cercaEd.toLowerCase().trim();
  const ids = Object.keys(P).filter((k) => (catEd === "tutte" || P[k].cat === catEd) && (!q || (P[k].tit + " " + P[k].kw).toLowerCase().includes(q)));
  if (!ids.includes(pannello)) pannello = ids[0] || "generali";
  const cats = {}; for (const k of ids) (cats[P[k].cat] = cats[P[k].cat] || []).push(k);
  const att = ids.length ? P[pannello] : null;
  return `<div class="editor">
    <div class="ed-top"><div class="ed-cerca">${ico("comandi")}<input type="text" id="cercaEd" value="${esc(cercaEd)}" placeholder="Cerca in tutte le impostazioni…" autocomplete="off" aria-label="Cerca nelle impostazioni"></div>
      <div class="scelte">${Object.entries(CAT_ED).map(([k, n]) => `<button class="${catEd === k ? "on" : ""}" data-cat-ed="${k}">${n}</button>`).join("")}</div></div>
    <div class="ed-corpo">
      <nav class="ed-nav">${Object.entries(cats).map(([c, ks]) => `<div class="ed-cat">${CAT_ED[c]}</div>${ks.map((k) => `<button class="${k === pannello ? "on" : ""}" data-pannello="${k}">${ico(P[k].ic, "s")}${P[k].tit}</button>`).join("")}`).join("") || '<div class="dim" style="padding:12px">Nessun risultato</div>'}</nav>
      <section class="card ed-pan">${att ? `<div class="ed-tit"><span class="etichetta">${CAT_ED[att.cat]}</span><h2>${att.tit}</h2></div>${att.html()}` : '<div class="vuoto">Nessuna impostazione corrisponde alla ricerca.</div>'}</section>
    </div>
  </div>`;
}
let mostraIndirizzo = false, qrVisibile = false;
const mascherato = (u) => { try { const h = new URL(u).hostname.split("."); return "https://" + h[0].slice(0, 5) + "••••." + h.slice(1).join("."); } catch (e) { return "••••"; } };
function disegnaQR() {
  const box = document.getElementById("qr"); if (!box || !qrVisibile) return;
  const testo = S.cfg.licenza.indirizzo;
  const fai = () => { box.innerHTML = ""; try { new QRCode(box, { text: testo, width: 200, height: 200, colorDark: "#0B0F14", colorLight: "#ffffff" }); } catch (e) { box.textContent = "QR code non disponibile: usa Copia."; } };
  if (window.QRCode) return fai();
  const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
  sc.onload = fai; sc.onerror = () => { box.textContent = "QR code non disponibile senza internet: usa Copia."; };
  document.head.appendChild(sc);
}

function ordineHome() {
  const base = (S.cfg.home.ordine || S.cfg.home.riquadri || []).filter((k) => RIQUADRI[k]);
  return [...base, ...Object.keys(RIQUADRI).filter((k) => !base.includes(k))];
}
function salvaHome(riquadri, ordine) {
  // l'ordine segue la lista completa; "riquadri" contiene solo quelli accesi, nell'ordine scelto
  const att = ordine.filter((k) => riquadri.includes(k));
  return salvaCfg({ home: { ...S.cfg.home, riquadri: att, ordine } }).then(disegna);
}

function scegliDifferibili() {
  const ids = Object.keys(S.stati).filter((id) => ["switch", "input_boolean"].includes(dom(id)) && !accessorio(id)).sort((a, b) => nomeE(a).localeCompare(nomeE(b)));
  const sel = S.cfg.energia.differibili || [];
  finestra(`<div class="tit"><h2>Carichi da spegnere</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><p class="mut">Se la casa sta per superare il contatore, Nexalia spegne il primo di questi che trova acceso.</p>
    <div class="lista-sel" id="listaDiff">${ids.map((id) => `<label><input type="checkbox" value="${id}" ${sel.includes(id) ? "checked" : ""}>${ico(iconaE(id), "s")}<span>${esc(nomeE(id))}</span><small>${esc(testoStato(id))}</small></label>`).join("") || '<div class="dim">Nessuna presa o interruttore.</div>'}</div>
    <div class="riga"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn p" data-salva-diff>Salva</button></div>`);
}

// ------------------------------------------------------------------ eventi
document.addEventListener("click", async (ev) => {
  if (ev.target.matches("input,select,textarea")) return;
  const t = ev.target.closest("button,[data-az],[data-pin],[data-ent],a,label.btn");
  if (!t) { if (ev.target.id === "finestra") chiudiFinestra(); return; }
  const d = t.dataset;
  if (d.scheda) return vai(d.scheda);
  if (d.vai) return vai(d.vai);
  if (d.chiudi !== undefined) return chiudiFinestra();
  if (d.apriStanza) { S.stanza = d.apriStanza; return vai("stanze"); }
  if (d.stanza) { S.stanza = d.stanza; return disegna(); }
  if (d.az === "toggle") { const id = t.dataset.id, dm = dom(id); const nuovoStato = st(id).state === "on" ? "off" : "on"; S.stati[id] = { ...st(id), state: nuovoStato }; disegna(); return chiama(dm === "light" ? "light" : "homeassistant", "toggle", { entity_id: id }); }
  if (d.az === "esegui") { const id = t.dataset.id; avviso("Attivo " + nomeE(id)); return chiama(dom(id), dom(id) === "button" ? "press" : "turn_on", { entity_id: id }); }
  if (d.esegui) { avviso("Attivo " + nomeE(d.esegui)); return chiama(dom(d.esegui), "turn_on", { entity_id: d.esegui }); }
  if (d.cover) return chiama("cover", d.cover, { entity_id: d.id });
  if (d.clima) { const tt = (attr(d.id, "temperature") || 20) + Number(d.clima); return chiama("climate", "set_temperature", { entity_id: d.id, temperature: tt }); }
  if (d.lock) return chiama("lock", d.lock, { entity_id: d.id });
  if (d.media) return chiama("media_player", d.media, { entity_id: d.id });
  if (d.vac) return chiama("vacuum", d.vac, { entity_id: d.id });
  if (d.gruppo === "light") { const ids = Object.keys(S.stati).filter((id) => eLuce(id) && visibile(id)); if (ids.length) chiama("homeassistant", d.v, { entity_id: ids }); return; }
  if (d.gruppo) { const ids = Object.keys(S.stati).filter((id) => dom(id) === d.gruppo && !accessorio(id) && visibile(id)); if (ids.length) chiama(d.gruppo, d.v, { entity_id: ids }); return; }
  if (d.tutteLuci) { const s = stanze().find((x) => x.id === d.tutteLuci); const ids = s.entita.filter(eLuce); return chiama("light", d.v, { entity_id: ids }); }
  if (d.pin && !modifica3d) { const id = d.pin, dm = dom(id); if (dm === "cover") return chiama("cover", st(id).state === "closed" ? "open_cover" : "close_cover", { entity_id: id }); if (dm === "lock") return chiama("lock", st(id).state === "locked" ? "unlock" : "lock", { entity_id: id }); if (dm === "climate") return vai("stanze"); return chiama(dm === "light" ? "light" : "homeassistant", "toggle", { entity_id: id }); }
  if (d.azzDiario !== undefined) { await api("api/diario", { metodo: "DELETE" }).catch(() => {}); S.diario = []; rispostaAssist = ""; return disegna(); }
  // stanze
  if (d.gestisciStanze !== undefined) return gestisciStanze();
  if (d.importaAree !== undefined) { const st0 = stanze().map((s) => ({ id: "st_" + Math.random().toString(36).slice(2, 8), nome: s.nome, entita: s.entita })); await salvaCfg({ stanze: st0.length ? st0 : [{ id: "st_casa", nome: "Casa", entita: [] }] }); return gestisciStanze(); }
  if (d.tornaAree !== undefined) { if (confirm("Tornare alle aree di Home Assistant? Le stanze create in Nexalia verranno eliminate.")) { await salvaCfg({ stanze: [] }); gestisciStanze(); } return; }
  if (d.rinominaStanza) { const s = S.cfg.stanze.find((x) => x.id === d.rinominaStanza); const n = prompt("Nuovo nome della stanza", s.nome); if (n && n.trim()) { s.nome = n.trim().slice(0, 40); await salvaCfg({ stanze: S.cfg.stanze }); } return gestisciStanze(); }
  if (d.eliminaStanza) { const s = S.cfg.stanze.find((x) => x.id === d.eliminaStanza); if (confirm("Eliminare la stanza " + s.nome + "? I dispositivi restano in Home Assistant.")) { await salvaCfg({ stanze: S.cfg.stanze.filter((x) => x.id !== s.id) }); } return gestisciStanze(); }
  if (d.dispositiviStanza) return dispositiviStanza(d.dispositiviStanza);
  if (d.salvaDisp) {
    const scelti = [...document.querySelectorAll("#listaDisp input:checked")].map((i) => i.value);
    const stz = S.cfg.stanze.map((x) => x.id === d.salvaDisp ? { ...x, entita: scelti } : { ...x, entita: (x.entita || []).filter((e) => !scelti.includes(e)) });
    await salvaCfg({ stanze: stz }); avviso("Stanza salvata", "ok"); return gestisciStanze();
  }
  // casa 3d
  if (d.modifica3d !== undefined) { modifica3d = !modifica3d; return disegna(); }
  if (d.ruota) { vista3d.rz += Number(d.ruota); return disegna(); }
  if (d.zoom) { vista3d.z = Math.max(0.4, Math.min(2, vista3d.z + Number(d.zoom))); return disegna(); }
  if (d.vista2d !== undefined) { vista3d.rx = vista3d.rx ? 0 : 55; return disegna(); }
  // sicurezza
  if (d.arma) return tastierino(d.id, d.arma);
  if (d.tasto) { const k = d.tasto; if (k === "C") pin = ""; else if (k === "⌫") pin = pin.slice(0, -1); else if (pin.length < 12) pin += k; return disegnaTastierino(); }
  if (d.confermaPin !== undefined) { const p = pinPer; $("#finestra").hidden = true; await chiama("alarm_control_panel", p.servizio, { entity_id: p.id, code: pin }); pin = ""; return disegna(); }
  // scenari
  if (d.auto) return chiama("automation", st(d.auto).state === "on" ? "turn_off" : "turn_on", { entity_id: d.auto });
  if (d.eliminaAuto) { if (confirm("Eliminare questo scenario?")) { try { await api("api/automazione", { metodo: "DELETE", corpo: { id: d.eliminaAuto } }); avviso("Scenario eliminato", "ok"); } catch (e) { avviso(e.message, "err"); } } return; }
  if (d.nq) { nuovo.quando = d.nq; return disegna(); }
  if (d.ns) { nuovo.solo = d.ns; return disegna(); }
  if (d.nf) { nuovo.fai = nuovo.fai.includes(d.nf) ? nuovo.fai.filter((x) => x !== d.nf) : [...nuovo.fai, d.nf]; if (d.nf === "scena" && !nuovo.scena) { const s = Object.keys(S.stati).find((id) => dom(id) === "scene"); nuovo.scena = s || ""; } return disegna(); }
  if (d.creaScenario !== undefined) {
    const nome = ($("#nuovoNome").value || "").trim() || "Scenario Nexalia";
    try { await api("api/automazione", { metodo: "POST", corpo: { alias: nome, ...costruisciAutomazione() } }); avviso("Scenario salvato e attivo", "ok"); nuovo.fai = []; disegna(); }
    catch (e) { avviso(e.message, "err"); }
    return;
  }
  // raccolta
  if (d.raccAttiva !== undefined) return salvaCfg({ raccolta: { ...S.cfg.raccolta, attiva: !S.cfg.raccolta.attiva } }).then(disegna);
  // impostazioni
  if (d.agente) return salvaCfg({ agente: { ...S.cfg.agente, [d.agente]: !S.cfg.agente[d.agente] } }).then(disegna);
  if (d.sezione) { const s = S.cfg.sezioni || []; await salvaCfg({ sezioni: s.includes(d.sezione) ? s.filter((x) => x !== d.sezione) : [...s, d.sezione] }); disegnaSchede(); return disegna(); }
  if (d.differibili !== undefined) return scegliDifferibili();
  if (d.salvaDiff !== undefined) { const sc = [...document.querySelectorAll("#listaDiff input:checked")].map((i) => i.value); await salvaCfg({ energia: { ...S.cfg.energia, differibili: sc } }); return chiudiFinestra(); }
  if (d.aggiorna) { try { window.top.location.href = d.aggiorna; } catch (e) { window.open(d.aggiorna, "_blank"); } return; }
  if (d.cercaAgg !== undefined) { try { const r = await api("api/aggiornamenti", { metodo: "POST" }); S.aggiornamento = r.aggiornamento; avviso(r.aggiornamento ? "Nuova versione " + r.aggiornamento.versione + " disponibile" : "Hai già l'ultima versione", "ok"); disegna(); } catch (e) { avviso(e.message, "err"); } return; }
  if (d.pannello) { pannello = d.pannello; localStorage.setItem("nx_pannello", pannello); entSel = null; return disegna(); }
  if (d.catEd) { catEd = d.catEd; return disegna(); }
  if (d.ent && !d.az) { entSel = d.ent; entIcona = null; cercaEnt = ""; pannello = "entita"; disegna(); const x = document.getElementById("entNome"); if (x) x.focus(); return; }
  if (d.entIcona !== undefined) { entIcona = d.entIcona; t.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === t)); return; }
  if (d.salvaEnt !== undefined) {
    const p = { ...(S.cfg.personalizza || {}) }, nome = $("#entNome").value.trim(), gruppo = $("#entGruppo").value, icona = entIcona !== null ? entIcona : (p[entSel] || {}).icona || "";
    const v = {}; if (nome) v.nome = nome.slice(0, 40); if (gruppo) v.gruppo = gruppo; if (icona) v.icona = icona;
    if (Object.keys(v).length) p[entSel] = v; else delete p[entSel];
    await salvaCfg({ personalizza: p }); ACCESSORI = null; entSel = null; entIcona = null; avviso("Salvato", "ok"); return disegna();
  }
  if (d.annullaEnt !== undefined) { entSel = null; entIcona = null; return disegna(); }
  if (d.resetEnt) { const p = { ...(S.cfg.personalizza || {}) }; delete p[d.resetEnt]; await salvaCfg({ personalizza: p }); ACCESSORI = null; entSel = null; return disegna(); }
  if (d.salvaGenerali !== undefined) { await salvaCfg({ aspetto: { ...S.cfg.aspetto, nome: $("#edNome").value.trim().slice(0, 30) || "Casa", sottotitolo: $("#edSotto").value.trim().slice(0, 40) } }); applicaAspetto(); avviso("Salvato", "ok"); return; }
  if (d.tema) { await salvaCfg({ aspetto: { ...S.cfg.aspetto, tema: d.tema } }); applicaAspetto(); return disegna(); }
  if (d.accento) { await salvaCfg({ aspetto: { ...S.cfg.aspetto, accento: d.accento } }); applicaAspetto(); return disegna(); }
  if (d.sezSu || d.sezGiu) { const o = ordineSezioni(), k = d.sezSu || d.sezGiu, i = o.indexOf(k), j = d.sezSu ? i - 1 : i + 1; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; await salvaCfg({ sezioni_ordine: o }); disegnaSchede(); return disegna(); }
  if (d.assist) { await salvaCfg({ assist: { ...S.cfg.assist, [d.assist]: !S.cfg.assist[d.assist] } }); return disegna(); }
  if (d.pref) { const p = S.cfg.home.preferiti || []; await salvaCfg({ home: { ...S.cfg.home, preferiti: p.includes(d.pref) ? p.filter((x) => x !== d.pref) : [...p, d.pref] } }); avviso(p.includes(d.pref) ? "Tolto dai preferiti" : "Aggiunto ai preferiti della home", "ok"); return disegna(); }
  if (d.nascondi) { await salvaCfg({ nascoste: [...new Set([...(S.cfg.nascoste || []), d.nascondi])] }); avviso(nomeE(d.nascondi) + " nascosto. Lo ritrovi in Impostazioni › Dispositivi nascosti.", "ok"); return disegna(); }
  if (d.mostraDisp) { await salvaCfg({ nascoste: (S.cfg.nascoste || []).filter((x) => x !== d.mostraDisp) }); return disegna(); }
  if (d.riq) { const r = S.cfg.home.riquadri || []; return salvaHome(r.includes(d.riq) ? r.filter((x) => x !== d.riq) : [...r, d.riq], ordineHome()); }
  if (d.su || d.giu) { const o = ordineHome(), k = d.su || d.giu, i = o.indexOf(k), j = d.su ? i - 1 : i + 1; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; return salvaHome(S.cfg.home.riquadri || [], o); }
  if (d.mostraInd !== undefined) { mostraIndirizzo = !mostraIndirizzo; return disegna(); }
  if (d.qr !== undefined) { qrVisibile = !qrVisibile; return disegna(); }
  if (d.copiaInd !== undefined) { const u = S.cfg.licenza.indirizzo; try { await navigator.clipboard.writeText(u); avviso("Indirizzo copiato", "ok"); } catch (e) { mostraIndirizzo = true; disegna(); avviso("Copia non riuscita: selezionalo e copialo a mano", "err"); } return; }
  if (d.verificaLic !== undefined) { try { const r = await api("api/licenza/verifica", { metodo: "POST" }); S.cfg = r.config; S.tunnel = r.tunnel; avviso("Licenza controllata", "ok"); disegna(); } catch (e) { avviso(e.message, "err"); } return; }
  if (d.disattivaLic !== undefined) { if (!confirm("Disattivare la licenza su questa casa? Nexalia torna alla versione gratuita qui e il codice si libera per un altro mini PC.")) return; try { await api("api/licenza/disattiva", { metodo: "POST" }); avviso("Licenza disattivata", "ok"); await carica(); } catch (e) { avviso(e.message, "err"); } return; }
});
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && !$("#finestra").hidden) chiudiFinestra();
  if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches("[data-az]")) { ev.preventDefault(); ev.target.click(); }
});
document.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const f = ev.target;
  if (f.id === "formAssist") {
    const testo = $("#assist").value.trim(); if (!testo) return;
    rispostaAssist = "Ci penso…"; disegna();
    try { const r = await api("api/assist", { metodo: "POST", corpo: { testo, conversazione } }); rispostaAssist = r.risposta; conversazione = r.conversazione; parla(r.risposta); }
    catch (e) { rispostaAssist = "Non ci sono riuscito: " + e.message; }
    disegna(); const a = $("#assist"); if (a) a.focus();
  }
  if (f.id === "formNuovaStanza") {
    const n = $("#nuovaStanza").value.trim(); if (!n) return;
    await salvaCfg({ stanze: [...S.cfg.stanze, { id: "st_" + Math.random().toString(36).slice(2, 8), nome: n.slice(0, 40), entita: [] }] });
    gestisciStanze();
  }
  if (f.id === "formLic") {
    const c = $("#codiceLic").value.trim().toUpperCase();
    const b = f.querySelector("button"); b.disabled = true; b.textContent = "Attivo…";
    try { await api("api/licenza/attiva", { metodo: "POST", corpo: { codice: c } }); avviso("Licenza completa attivata", "ok"); await carica(); }
    catch (e) { avviso(e.message, "err"); b.disabled = false; b.textContent = "Attiva"; }
  }
});
document.addEventListener("change", async (ev) => {
  const t = ev.target, d = t.dataset;
  if (d.luminosita) return chiama("light", "turn_on", { entity_id: d.luminosita, brightness_pct: Number(t.value) });
  if (d.posizione) return chiama("cover", "set_cover_position", { entity_id: d.posizione, position: Number(t.value) });
  if (d.racc) return salvaCfg({ raccolta: { ...S.cfg.raccolta, calendario: { ...S.cfg.raccolta.calendario, [d.racc]: t.value } } }).then(disegna);
  if (t.id === "raccOra") return salvaCfg({ raccolta: { ...S.cfg.raccolta, ora: t.value } });
  if (t.id === "nuovoOra") { nuovo.ora = t.value; return disegna(); }
  if (t.id === "nuovoScena") { nuovo.scena = t.value; return disegna(); }
  if (d.energia) { cacheStorico.id = null; return salvaCfg({ energia: { ...S.cfg.energia, [d.energia]: t.value } }); }
  if (t.id === "impContatore") return salvaCfg({ energia: { ...S.cfg.energia, contatore_kw: Number(t.value) || 3 } });
  if (t.id === "edAgente") return salvaCfg({ assist: { ...S.cfg.assist, agente: t.value } });
  if (t.id === "impNotifica") return salvaCfg({ agente: { ...S.cfg.agente, notifica: t.value } });
  if (t.id === "fileBackup" && t.files[0]) {
    try { const j = JSON.parse(await t.files[0].text()); await api("api/backup", { metodo: "POST", corpo: j }); avviso("Backup ripristinato", "ok"); await carica(); }
    catch (e) { avviso("Ripristino non riuscito: " + e.message, "err"); }
  }
});
document.addEventListener("input", (ev) => {
  if (ev.target.id === "cercaEd" || ev.target.id === "cercaEnt") {
    if (ev.target.id === "cercaEd") cercaEd = ev.target.value; else cercaEnt = ev.target.value;
    const id = ev.target.id, pos = ev.target.selectionStart; disegna(); const x = document.getElementById(id); if (x) { x.focus(); try { x.setSelectionRange(pos, pos); } catch (e) {} }
    return;
  }
  if (ev.target.id === "cercaDisp") { const q = ev.target.value.toLowerCase(); document.querySelectorAll("#listaDisp label").forEach((l) => { l.style.display = l.dataset.nome.includes(q) ? "" : "none"; }); }
});
document.addEventListener("focusin", (ev) => { if (ev.target.matches("input[type=text],input[type=number],input[type=time],select,input[type=range]")) inInput = true; });
document.addEventListener("focusout", () => { inInput = false; });
document.addEventListener("pointerdown", (ev) => { if (ev.target.matches("input[type=range]")) inInput = true; });
document.addEventListener("pointerup", () => { setTimeout(() => { if (!document.activeElement || !document.activeElement.matches("input,select")) inInput = false; }, 50); });

// ------------------------------------------------------------------ dati
function aggiornaStatoHa() {
  const el = $("#statoHa");
  el.className = "stato-ha " + (S.collegato ? "ok" : "ko");
  $("span", el).textContent = S.collegato ? (S.haConfig && S.haConfig.nome) || "Home Assistant" : "Non collegato";
}
async function carica() {
  try {
    const d = await api("api/stato");
    S.stati = Object.fromEntries(d.ha.stati.map((s) => [s.entity_id, s]));
    S.aree = d.ha.aree; S.dispositivi = d.ha.dispositivi; S.entita = d.ha.entita; ACCESSORI = null; S.haConfig = d.ha.config; S.servizi = d.ha.servizi;
    S.cfg = d.config; S.diario = d.diario; S.collegato = d.collegato; S.tunnel = d.tunnel; S.versione = d.versione; S.aggiornamento = d.aggiornamento;
    aggiornaStatoHa(); disegnaSchede(); disegna();
  } catch (e) {
    S.collegato = false; aggiornaStatoHa();
    if (!S.cfg) $("#vista").innerHTML = `<div class="vuoto">Non riesco a raggiungere Nexalia: ${esc(e.message)}. Riprovo…</div>`;
    setTimeout(carica, 4000);
  }
}
function ascolta() {
  const es = new EventSource("api/eventi");
  es.addEventListener("stato", (e) => { const { id, s } = JSON.parse(e.data); if (s) S.stati[id] = s; else delete S.stati[id]; ridisegna(); });
  es.addEventListener("diario", (e) => { S.diario.unshift(JSON.parse(e.data)); ridisegna(); });
  es.addEventListener("config", (e) => { S.cfg = JSON.parse(e.data); disegnaSchede(); ridisegna(); });
  es.addEventListener("ricarica", () => carica());
  es.addEventListener("aggiornamento", (e) => { S.aggiornamento = JSON.parse(e.data); ridisegna(); });
  es.onopen = () => { if (!S.collegato && S.cfg) carica(); };
  es.onerror = () => { S.collegato = false; aggiornaStatoHa(); };
}
setInterval(() => { if (S.scheda === "agente" || S.scheda === "sicurezza") ridisegna(); }, 30000);
carica().then(ascolta);
