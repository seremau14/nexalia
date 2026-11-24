// Nexalia – pagine dell'editor (Impostazioni, Home, Widget, Azioni) e quello che fanno nella plancia.
// Si carica dopo app.js e ne usa le funzioni (S, st, dom, attr, tessera, finestra, salvaCfg…).

// ------------------------------------------------------------------ icone in più
Object.assign(IC, {
  posta: "M3 6h18v12H3zM3 7l9 6 9-6",
  pioggia: "M7 15a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17.5 15zM8 18l-1 2M12 18l-1 2M16 18l-1 2",
  vento: "M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h8",
  calendario: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  aggiorna: "M20 11a8 8 0 0 0-14.9-3M4 5v4h4M4 13a8 8 0 0 0 14.9 3M20 19v-4h-4",
  lavatrice: "M5 3h14v18H5zM5 7h14M8 5h1M12 14m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  scollegato: "M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 4-2.5M19 13a10 10 0 0 0-2.4-1.8M12 20h.01",
  termometro: "M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z",
  fumo: "M4 18h16M6 14c0-2 2-2 2-4s-2-2-2-4M12 14c0-2 2-2 2-4s-2-2-2-4M18 14c0-2 2-2 2-4s-2-2-2-4",
  allagamento: "M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3zM3 21h18",
  chiave: "M14 10a4 4 0 1 0-4 4l-7 7M7 17l2 2M10 14l1 1",
  aiuto: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
});
document.getElementById("icone").innerHTML = Object.entries(IC).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join("");
const ICONE_SCELTA = ["agente", "luci", "presa", "tapparelle", "clima", "ventola", "media", "telecamere", "porte", "finestra", "lucchetto", "sicurezza", "energia", "solare", "batteria", "goccia", "robot", "lavatrice", "scenari", "play", "casa", "persone", "stella", "posta", "pioggia", "calendario", "termometro", "chiave", "allerta"];

// ------------------------------------------------------------------ utilità
const leggiCfg = (perc) => perc.split(".").reduce((o, k) => (o == null ? undefined : o[k]), S.cfg);
function impostaCfg(perc, valore) {
  const [k, ...r] = perc.split(".");
  if (!r.length) return salvaCfg({ [k]: valore });
  const base = JSON.parse(JSON.stringify(S.cfg[k] || {}));
  let o = base; for (let i = 0; i < r.length - 1; i++) o = o[r[i]] = o[r[i]] || {};
  o[r[r.length - 1]] = valore;
  return salvaCfg({ [k]: base });
}
const tutteId = () => Object.keys(S.stati);
const numE = (id) => { const s = st(id); if (!s) return null; const n = parseFloat(s.state); return isNaN(n) ? null : n; };
const nonDisp = (id) => st(id) && ["unavailable", "unknown"].includes(st(id).state);
const FILTRI_ENT = {
  tutte: () => true,
  weather: (id) => dom(id) === "weather",
  allarme: (id) => dom(id) === "alarm_control_panel",
  sensore: (id) => ["sensor", "binary_sensor", "input_boolean", "switch", "input_select"].includes(dom(id)),
  numerico: (id) => dom(id) === "sensor",
  binario: (id) => ["binary_sensor", "input_boolean", "switch"].includes(dom(id)),
  comando: (id) => ["switch", "light", "input_boolean", "fan", "script", "scene", "button", "input_button", "siren", "cover", "lock"].includes(dom(id)),
  sirena: (id) => ["switch", "siren", "light", "input_boolean"].includes(dom(id)),
  luci: (id) => eLuce(id) || dom(id) === "light",
  media: (id) => dom(id) === "media_player",
  script: (id) => dom(id) === "script",
  scena: (id) => dom(id) === "scene",
  lavatrice: (id) => ["switch", "sensor", "binary_sensor", "select", "input_boolean"].includes(dom(id)),
  calendario: (id) => dom(id) === "calendar",
};
// elenco di entità per le caselle: un <datalist> per filtro, scritto una volta per pagina
function datalist(filtro) {
  const ids = tutteId().filter(FILTRI_ENT[filtro] || FILTRI_ENT.tutte).sort();
  return `<datalist id="dl-${filtro}">${ids.map((id) => `<option value="${id}">${esc(nomeE(id))}</option>`).join("")}</datalist>`;
}
// casella "entità": salva da sola quando cambi il valore
function campoEnt(perc, etichetta, filtro, nota = "", ph = "dominio.nome") {
  const v = leggiCfg(perc) || "";
  const ok = !v || st(v);
  return `<label class="campo">${etichetta}${nota ? `<span>${nota}</span>` : ""}<div class="ent-campo"><input type="text" list="dl-${filtro}" data-nx-cfg="${perc}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off" spellcheck="false">${v ? `<button class="btn pic" data-nx-svuota="${perc}" aria-label="Svuota">${ico("chiudi", "s")}</button>` : ""}</div>${v ? `<small class="${ok ? "dim" : "err"}">${ok ? esc(nomeE(v)) + " · " + esc(testoStato(v)) : "Questa entità non esiste in Home Assistant"}</small>` : ""}</label>`;
}
const interruttore = (on, attrs, etichetta, nota = "") => `<div class="voce-imp"><div><b>${etichetta}</b>${nota ? `<small>${nota}</small>` : ""}</div><button class="tg ${on ? "on" : ""}" ${attrs} aria-label="${esc(etichetta)}"></button></div>`;
const suGiu = (pref, k, i, n) => `<button class="btn pic" data-nx-su="${pref}:${k}" ${i === 0 ? "disabled" : ""} aria-label="Sposta su">${ico("su", "s")}</button><button class="btn pic" data-nx-giu="${pref}:${k}" ${i === n - 1 ? "disabled" : ""} aria-label="Sposta giù">${ico("giu", "s")}</button>`;
function sposta(lista, k, delta) { const o = [...lista], i = o.indexOf(k), j = i + delta; if (i < 0 || j < 0 || j >= o.length) return null; [o[i], o[j]] = [o[j], o[i]]; return o; }

// ------------------------------------------------------------------ pastiglie di stato (riga in cima alla home)
const PASTIGLIE = {
  sicurezza: "Antifurto", posta: "Posta", rifiuti: "Rifiuti", porte: "Porte aperte", finestre: "Finestre aperte", serrature: "Serrature aperte",
  stampanti: "Stampanti", aggiornamenti: "Aggiornamenti", luci: "Luci accese", tapparelle: "Tapparelle aperte", clima: "Clima acceso", prese: "Prese accese",
  musica: "Musica", presenza: "Chi è in casa", temperatura: "Temperatura", umidita: "Umidità", pioggia_adesso: "Pioggia adesso", pioggia_oggi: "Pioggia di oggi",
};
const ACCESO_CLIMA = ["heat", "cool", "heat_cool", "auto", "dry", "fan_only"];
const apertiPer = (classi) => tutteId().filter((id) => dom(id) === "binary_sensor" && classi.includes(attr(id, "device_class")) && !accessorio(id) && visibileStanza(id) && st(id).state === "on");
function statoAntifurto() {
  const a = S.cfg.antifurto || {};
  const id = a.entita && st(a.entita) ? a.entita : tutteId().find((x) => dom(x) === "alarm_control_panel" && !nonDisp(x));
  const sc = a.scattato && st(a.scattato) ? st(a.scattato).state === (a.scattato_valore || "on") : false;
  return { id, v: id ? st(id).state : null, scattato: sc || (id && st(id).state === "triggered") };
}
function oggiRitiro() {
  const cal = (S.cfg.raccolta && S.cfg.raccolta.calendario) || {}, ora = new Date().getHours();
  const gOggi = new Date().getDay() || 7, gDom = (gOggi % 7) + 1;
  const limite = Number((S.cfg.pastiglie || {}).rifiuti_ora); // -1 = mai
  if (limite >= 0 && ora >= limite) return cal[String(gDom)] ? ["Domani", cal[String(gDom)]] : null;
  return cal[String(gOggi)] ? ["Oggi", cal[String(gOggi)]] : null;
}
function pastiglia(k) {
  const p = S.cfg.pastiglie || {};
  const conta = (ids, sing, plur) => ids.length ? [ids.length + " " + (ids.length === 1 ? sing : plur), ids] : null;
  switch (k) {
    case "sicurezza": { const a = statoAntifurto(); if (a.scattato) return { t: "Allarme scattato", ic: "sicurezza", cls: "rosso", ids: a.id ? [a.id] : [] }; if (a.v && a.v.startsWith("armed")) return { t: testoAllarme(a.v), ic: "sicurezza", cls: "verde", ids: [a.id] }; return null; }
    case "posta": { const id = p.posta; if (!id || !st(id)) return null; const vista = Number(localStorage.getItem("nx_posta_vista") || 0), arrivo = Number(localStorage.getItem("nx_posta_arrivo") || 0); const aperta = st(id).state === "on" && new Date(st(id).last_changed).getTime() > vista; return (aperta || arrivo > vista) ? { t: "È arrivata la posta", ic: "posta", cls: "ambra anima" } : null; }
    case "rifiuti": { const r = oggiRitiro(); return r ? { t: `${r[0]}: ${r[1]}`, ic: "raccolta", cls: "" } : null; }
    case "porte": { const c = conta(apertiPer(["door", "garage_door"]), "porta aperta", "porte aperte"); return c && { t: c[0], ic: "porte", cls: "ambra", ids: c[1] }; }
    case "finestre": { const c = conta(apertiPer(["window", "opening"]), "finestra aperta", "finestre aperte"); return c && { t: c[0], ic: "finestra", cls: "ambra", ids: c[1] }; }
    case "serrature": { const c = conta(tutteId().filter((id) => dom(id) === "lock" && st(id).state === "unlocked"), "serratura aperta", "serrature aperte"); return c && { t: c[0], ic: "lucchetto", cls: "ambra", ids: c[1] }; }
    case "stampanti": { const ids = tutteId().filter((id) => dom(id) === "sensor" && /toner|ink|inchiostro|cartuccia|drum|tamburo/i.test(id + " " + (attr(id, "friendly_name") || "")) && numE(id) != null && numE(id) <= 10); return ids.length ? { t: ids.length === 1 ? nomeE(ids[0]) + " quasi finito" : ids.length + " consumabili quasi finiti", ic: "allerta", cls: "ambra", ids } : null; }
    case "aggiornamenti": { const c = conta(tutteId().filter((id) => dom(id) === "update" && st(id).state === "on"), "aggiornamento", "aggiornamenti"); return c && { t: c[0], ic: "aggiorna", cls: "", ids: c[1] }; }
    case "luci": { const c = conta(tutteId().filter((id) => eLuce(id) && visibile(id) && st(id).state === "on"), "luce accesa", "luci accese"); return c && { t: c[0], ic: "luci", cls: "", ids: c[1] }; }
    case "tapparelle": { const c = conta(tutteId().filter((id) => dom(id) === "cover" && visibile(id) && ["open", "opening"].includes(st(id).state)), "tapparella aperta", "tapparelle aperte"); return c && { t: c[0], ic: "tapparelle", cls: "", ids: c[1] }; }
    case "clima": { const ids = tutteId().filter((id) => (dom(id) === "climate" && (ACCESO_CLIMA.includes(st(id).state) && attr(id, "hvac_action") !== "idle")) || (dom(id) === "water_heater" && !["off", "unavailable"].includes(st(id).state))); if (!ids.length) return null; const caldo = ids.some((id) => st(id).state === "heat" || attr(id, "hvac_action") === "heating"); return { t: ids.length === 1 ? (caldo ? "Riscaldamento acceso" : nomeE(ids[0]) + " acceso") : ids.length + " climatizzatori accesi", ic: "clima", cls: "", ids }; }
    case "prese": { const c = conta(tutteId().filter((id) => ePresa(id) && visibile(id) && st(id).state === "on"), "presa accesa", "prese accese"); return c && { t: c[0], ic: "presa", cls: "", ids: c[1] }; }
    case "musica": { const id = tutteId().find((x) => dom(x) === "media_player" && st(x).state === "playing"); return id ? { t: attr(id, "media_title") ? attr(id, "media_title") + (attr(id, "media_artist") ? " · " + attr(id, "media_artist") : "") : nomeE(id), ic: "media", cls: "", ids: [id] } : null; }
    case "presenza": { const pp = tutteId().filter((id) => dom(id) === "person"); if (!pp.length) return null; const n = pp.filter((id) => st(id).state === "home"); return n.length ? { t: n.map((id) => nomeE(id)).join(", ") + " in casa", ic: "persone", cls: "" } : null; }
    case "temperatura": { const v = numE(p.temperatura); return v == null ? null : { t: fmt1(v) + "°", ic: "termometro", cls: "" }; }
    case "umidita": { const v = numE(p.umidita); return v == null ? null : { t: Math.round(v) + "% umidità", ic: "goccia", cls: "" }; }
    case "pioggia_adesso": { const v = numE(p.pioggia); if (v != null) return v > 0 ? { t: "Piove · " + fmt1(v) + " " + (attr(p.pioggia, "unit_of_measurement") || "mm/h"), ic: "pioggia", cls: "blu" } : null; const w = (p.meteo && st(p.meteo)) ? p.meteo : tutteId().find((x) => dom(x) === "weather"); return w && ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(st(w).state) ? { t: "Piove", ic: "pioggia", cls: "blu" } : null; }
    case "pioggia_oggi": { const v = numE(p.pioggia_oggi); return v ? { t: fmt1(v) + " mm di pioggia oggi", ic: "pioggia", cls: "" } : null; }
  }
  return null;
}
function vPastiglie() {
  const att = ((S.cfg.pastiglie || {}).attive || []).filter((k) => PASTIGLIE[k]);
  const pp = att.map((k) => [k, pastiglia(k)]).filter((x) => x[1]);
  if (!pp.length) return "";
  return `<div class="pastiglie">${pp.map(([k, p]) => `<button class="pastiglia ${p.cls}" data-nx-pastiglia="${k}">${ico(p.ic, "s")}<span>${esc(p.t)}</span></button>`).join("")}</div>`;
}

// ------------------------------------------------------------------ intestazione col meteo e persone
function datiMeteo() {
  const p = S.cfg.pastiglie || {};
  const w = p.meteo && st(p.meteo) ? p.meteo : tutteId().find((x) => dom(x) === "weather");
  const d = { cond: w ? st(w).state : null, temp: w ? attr(w, "temperature") : null, umid: w ? attr(w, "humidity") : null, vento: w ? attr(w, "wind_speed") : null, uVento: w ? attr(w, "wind_speed_unit") || "km/h" : "km/h", uTemp: w ? attr(w, "temperature_unit") || "°C" : "°C" };
  if (p.sensori_meteo) {
    if (numE(p.temperatura) != null) d.temp = numE(p.temperatura);
    if (numE(p.umidita) != null) d.umid = numE(p.umidita);
    if (numE(p.vento) != null) { d.vento = numE(p.vento); d.uVento = attr(p.vento, "unit_of_measurement") || d.uVento; }
  }
  return d;
}
function vIntestazione() {
  const d = new Date(), m = datiMeteo();
  return `<section class="card intest">
    <div class="intest-meteo">${ico(m.cond && /rain|pour/.test(m.cond) ? "pioggia" : "meteo", "l")}<b>${m.temp != null ? fmt1(m.temp) + "°" : "—"}</b><span>${esc(m.cond ? METEO[m.cond] || m.cond : "Meteo non configurato")}</span></div>
    <div class="intest-chip">${m.umid != null ? `<span>${ico("goccia", "s")} Umidità ${Math.round(m.umid)}%</span>` : ""}${m.vento != null ? `<span>${ico("vento", "s")} Vento ${fmt1(m.vento)} ${esc(m.uVento)}</span>` : ""}</div>
    <div class="intest-ora"><span>${d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</span><b>${ora(d)}</b></div>
  </section>`;
}
function vPersoneHome() {
  // prima le persone impostate in Impostazioni › Persone (anche solo col telefono), poi le altre persone di Home Assistant
  const els = (((S.cfg.sez_gen || {}).persone || {}).elementi || []).filter((x) => (x.tracker && st(x.tracker)) || (x.persona && st(x.persona)));
  const coperte = new Set(els.map((x) => x.persona).filter(Boolean));
  const lista = [...els.map((el) => ({ el, id: el.tracker && st(el.tracker) ? el.tracker : el.persona })), ...tutteId().filter((id) => dom(id) === "person" && !coperte.has(id)).map((id) => ({ el: {}, id }))];
  if (!lista.length) return "";
  const dove = (id) => { const v = st(id).state; return v === "home" ? "In casa" : v === "not_home" ? "Fuori" : v; };
  const da = (id) => { const m = Math.round((Date.now() - new Date(st(id).last_changed)) / 60000); return m < 60 ? m + " min fa" : m < 1440 ? Math.round(m / 60) + " ore fa" : Math.round(m / 1440) + " giorni fa"; };
  return `<section class="persone-home">${lista.map(({ el, id }, i) => { const foto = el.persona ? attr(el.persona, "entity_picture") : dom(id) === "person" ? attr(id, "entity_picture") : null; const casa = st(id).state === "home"; const extra = [el.batteria && st(el.batteria) ? "📱 " + testoStato(el.batteria) : "", el.orologio && st(el.orologio) ? "⌚ " + testoStato(el.orologio) : "", !casa && el.rientro && st(el.rientro) ? "a casa in " + testoStato(el.rientro) : !casa && el.distanza && st(el.distanza) ? testoStato(el.distanza) + " da casa" : ""].filter(Boolean).join(" · "); const nome = el.nome || nomeE(id); return `<div class="persona-c ${casa ? "casa" : ""}"><div class="avatar" style="--c:${el.colore || COLORI[i % COLORI.length]}">${foto ? `<img src="${esc(foto)}" alt="">` : esc(nome.slice(0, 1))}</div><div><b>${esc(nome)}</b><span class="badge ${casa ? "casa" : "fuori"}">${esc(dove(id))}</span><small>${da(id)}${extra ? " · " + esc(extra) : ""}</small></div></div>`; }).join("")}</section>`;
}

// ------------------------------------------------------------------ widget
const WIDGET = {
  avvisi: { nome: "Avvisi personalizzati", ic: "allerta" },
  aggiornamenti: { nome: "Aggiornamenti", ic: "aggiorna" },
  luci: { nome: "Luci", ic: "luci", vai: "comandi" },
  clima: { nome: "Clima", ic: "clima" },
  finestre: { nome: "Porte e finestre", ic: "finestra", vai: "sicurezza" },
  sicurezza: { nome: "Sicurezza", ic: "sicurezza", vai: "sicurezza" },
  serrature: { nome: "Serrature", ic: "lucchetto" },
  telecamere: { nome: "Telecamere", ic: "telecamere", vai: "sicurezza" },
  energia: { nome: "Energia", ic: "energia", vai: "energia" },
  temperatura: { nome: "Temperatura", ic: "termometro" },
  prese: { nome: "Prese", ic: "presa", vai: "comandi" },
  tapparelle: { nome: "Tapparelle", ic: "tapparelle", vai: "comandi" },
  musica: { nome: "Musica", ic: "media" },
  robot: { nome: "Robot", ic: "robot" },
  ventilazione: { nome: "Ventilazione", ic: "ventola" },
  scaldabagno: { nome: "Scaldabagno", ic: "goccia" },
  rifiuti: { nome: "Rifiuti", ic: "raccolta", vai: "raccolta" },
  presenza: { nome: "Presenza", ic: "persone", vai: "persone" },
  batterie: { nome: "Batterie", ic: "batteria" },
  allagamenti: { nome: "Allagamenti", ic: "allagamento" },
  fumo: { nome: "Fumo e gas", ic: "fumo" },
  meteo: { nome: "Meteo", ic: "meteo" },
  agenda: { nome: "Agenda", ic: "calendario" },
  non_connessi: { nome: "Dispositivi non connessi", ic: "scollegato" },
};
const WIDGET_BASE = ["avvisi", "luci", "clima", "finestre", "sicurezza", "energia", "temperatura", "prese", "aggiornamenti", "rifiuti", "non_connessi"];
function ordineWidget() {
  const el = ((S.cfg.widget || {}).elenco || []).filter((x) => WIDGET[x.k]);
  const visti = el.map((x) => x.k);
  return [...el, ...Object.keys(WIDGET).filter((k) => !visti.includes(k)).map((k) => ({ k, on: !el.length && WIDGET_BASE.includes(k) }))];
}
const sogliaBatt = () => { const a = ((S.cfg.widget || {}).avvisi || []).find((x) => x.tipo === "batterie"); return a && a.valore !== "" && !isNaN(parseFloat(a.valore)) ? parseFloat(a.valore) : 20; };
function avvisoAttivo(a) {
  if (a.tipo === "batterie") { const s = a.valore !== "" && !isNaN(parseFloat(a.valore)) ? parseFloat(a.valore) : 20; return tutteId().filter((id) => attr(id, "device_class") === "battery" && dom(id) === "sensor" && numE(id) != null && numE(id) <= s); }
  if (a.tipo === "allagamenti") return tutteId().filter((id) => dom(id) === "binary_sensor" && attr(id, "device_class") === "moisture" && st(id).state === "on");
  if (a.tipo === "fumo") return tutteId().filter((id) => dom(id) === "binary_sensor" && ["smoke", "gas", "carbon_monoxide"].includes(attr(id, "device_class")) && st(id).state === "on");
  if (!a.entita || !st(a.entita)) return [];
  const v = st(a.entita).state, att = String(a.valore || "on").trim();
  const m = att.match(/^([<>]=?)\s*(-?[\d.,]+)$/);
  if (m) { const n = parseFloat(v), x = parseFloat(m[2].replace(",", ".")); if (isNaN(n)) return []; return ({ "<": n < x, "<=": n <= x, ">": n > x, ">=": n >= x }[m[1]]) ? [a.entita] : []; }
  const nv = parseFloat(v), na = parseFloat(att.replace(",", "."));
  return (v === att || (!isNaN(nv) && !isNaN(na) && nv === na)) ? [a.entita] : [];
}
function avvisiAccesi() { return ((S.cfg.widget || {}).avvisi || []).map((a, i) => ({ a, i, ids: avvisoAttivo(a) })).filter((x) => x.ids.length); }
function calcolaWidget(k) {
  const ids = (f) => tutteId().filter(f);
  switch (k) {
    case "avvisi": { const acc = avvisiAccesi(); return { v: acc.length ? String(acc.length) : "Nessuno", sub: acc.length ? acc.map((x) => x.a.nome || "Avviso").join(", ") : "Tutto a posto", att: acc.length > 0, ids: acc.flatMap((x) => x.ids) }; }
    case "aggiornamenti": { const u = ids((id) => dom(id) === "update" && st(id).state === "on"); return { v: String(u.length), sub: u.length ? "da installare" : "Tutto aggiornato", att: u.length > 0, ids: u }; }
    case "luci": { const l = ids((id) => eLuce(id) && visibile(id)); const a = l.filter((id) => st(id).state === "on"); return { v: a.length + "/" + l.length, sub: a.length ? "accese" : "Tutte spente", ids: l }; }
    case "clima": { const c = ids((id) => dom(id) === "climate" && visibile(id)); const a = c.filter((id) => ACCESO_CLIMA.includes(st(id).state)); return { v: a.length ? a.length + " acceso" + (a.length > 1 ? "i" : "") : "Spento", sub: c.length + " dispositivi", ids: c }; }
    case "finestre": { const f = ids((id) => eApertura(id) && visibileStanza(id)); const a = f.filter((id) => st(id).state === "on"); return { v: a.length ? String(a.length) : "Chiuse", sub: a.length ? "aperte" : "tutte chiuse", att: a.length > 0, ids: f }; }
    case "sicurezza": { const a = statoAntifurto(); return { v: a.id ? testoAllarme(a.v) : "—", sub: a.scattato ? "ALLARME SCATTATO" : a.id ? nomeE(a.id) : "Nessuna centrale", att: a.scattato, ids: a.id ? [a.id] : [] }; }
    case "serrature": { const s = ids((id) => dom(id) === "lock"); const a = s.filter((id) => st(id).state === "unlocked"); return { v: a.length ? a.length + " aperte" : "Chiuse", sub: s.length + " serrature", att: a.length > 0, ids: s }; }
    case "telecamere": { const c = ids((id) => dom(id) === "camera" && visibileStanza(id)); const o = c.filter((id) => !nonDisp(id)); return { v: o.length + "/" + c.length, sub: "in linea", att: o.length < c.length, ids: c }; }
    case "energia": { const e = S.cfg.energia || {}; const w = e.casa ? watt(e.casa) : null; const f = e.solare ? watt(e.solare) : null; return { v: fmtW(w), sub: f != null ? "Fotovoltaico " + fmtW(f) : "consumo adesso", att: w != null && e.contatore_kw && w > e.contatore_kw * 1000 * 0.9, ids: [e.casa, e.solare, e.rete].filter((x) => x && st(x)) }; }
    case "temperatura": { const t = ids((id) => dom(id) === "sensor" && attr(id, "device_class") === "temperature" && numE(id) != null && areaEntita(id) && visibileStanza(id)); const m = t.length ? t.reduce((s, id) => s + numE(id), 0) / t.length : null; return { v: m != null ? fmt1(m) + "°" : "—", sub: t.length ? "media di " + t.length + " sensori" : "nessun sensore nelle stanze", ids: t }; }
    case "prese": { const p = ids((id) => ePresa(id) && visibile(id)); const a = p.filter((id) => st(id).state === "on"); return { v: a.length + "/" + p.length, sub: "accese", ids: p }; }
    case "tapparelle": { const t = ids((id) => dom(id) === "cover" && visibile(id)); const a = t.filter((id) => st(id).state !== "closed"); return { v: a.length + "/" + t.length, sub: "aperte", ids: t }; }
    case "musica": { const m = ids((id) => dom(id) === "media_player" && !accessorio(id)); const p = m.find((id) => st(id).state === "playing"); return { v: p ? "In riproduzione" : "Ferma", sub: p ? (attr(p, "media_title") || nomeE(p)) : m.length + " lettori", ids: m }; }
    case "robot": { const r = ids((id) => dom(id) === "vacuum" || dom(id) === "lawn_mower"); const a = r.filter((id) => ["cleaning", "mowing", "returning"].includes(st(id).state)); return { v: a.length ? "Al lavoro" : r.length ? "In base" : "—", sub: r.length + " robot", att: r.some((id) => st(id).state === "error"), ids: r }; }
    case "ventilazione": { const f = ids((id) => dom(id) === "fan" && visibile(id)); const a = f.filter((id) => st(id).state === "on"); return { v: a.length + "/" + f.length, sub: "accese", ids: f }; }
    case "scaldabagno": { const w = ids((id) => dom(id) === "water_heater"); const t = w[0] ? attr(w[0], "current_temperature") : null; return { v: t != null ? fmt1(t) + "°" : w[0] ? st(w[0]).state : "—", sub: w[0] ? nomeE(w[0]) : "nessuno", ids: w }; }
    case "rifiuti": { const r = oggiRitiro(); const cal = (S.cfg.raccolta && S.cfg.raccolta.calendario) || {}; const dn = ((new Date().getDay() + 1) % 7) || 7; return { v: r ? r[1] : cal[String(dn)] || "Nessuno", sub: r ? r[0] : "domani", vai: "raccolta" }; }
    case "presenza": { const pp = ids((id) => dom(id) === "person"); const c = pp.filter((id) => st(id).state === "home"); return { v: c.length + "/" + pp.length, sub: c.length ? "in casa" : "nessuno in casa", ids: pp }; }
    case "batterie": { const s = sogliaBatt(); const b = ids((id) => dom(id) === "sensor" && attr(id, "device_class") === "battery" && numE(id) != null); const l = b.filter((id) => numE(id) <= s); return { v: l.length ? String(l.length) : "OK", sub: l.length ? "sotto il " + s + "%" : b.length + " batterie cariche", att: l.length > 0, ids: l.length ? l : b }; }
    case "allagamenti": { const a = ids((id) => dom(id) === "binary_sensor" && attr(id, "device_class") === "moisture"); const on = a.filter((id) => st(id).state === "on"); return { v: on.length ? "ACQUA" : "Asciutto", sub: a.length + " sensori", att: on.length > 0, ids: a }; }
    case "fumo": { const a = ids((id) => dom(id) === "binary_sensor" && ["smoke", "gas", "carbon_monoxide"].includes(attr(id, "device_class"))); const on = a.filter((id) => st(id).state === "on"); return { v: on.length ? "ALLARME" : "Tutto ok", sub: a.length + " rilevatori", att: on.length > 0, ids: a }; }
    case "meteo": { const m = datiMeteo(); return { v: m.temp != null ? fmt1(m.temp) + "°" : "—", sub: m.cond ? METEO[m.cond] || m.cond : "meteo non configurato" }; }
    case "agenda": { const c = ids((id) => dom(id) === "calendar"); const pross = c.map((id) => ({ id, t: attr(id, "start_time"), m: attr(id, "message") })).filter((x) => x.t && x.m).sort((a, b) => String(a.t).localeCompare(String(b.t)))[0]; return { v: pross ? pross.m : "Niente in vista", sub: pross ? new Date(String(pross.t).replace(" ", "T")).toLocaleString("it-IT", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : c.length + " calendari", ids: c }; }
    case "non_connessi": { const n = ids((id) => DOMINI_UTILI.includes(dom(id)) && st(id).state === "unavailable" && !(S.cfg.nascoste || []).includes(id) && !accessorio(id)); const nd = typeof perDispositivo === "function" ? perDispositivo(n).length : n.length; return { v: String(nd), sub: nd ? (nd === 1 ? "dispositivo non risponde" : "dispositivi non rispondono") : "tutti in linea", att: nd > 0, vai: "non_connessi" }; }
  }
  return { v: "—", sub: "" };
}
function vWidget() {
  const w = S.cfg.widget || {};
  const att = ordineWidget().filter((x) => x.on);
  if (!att.length) return "";
  
  return `<section class="widget-griglia">${att.map(({ k }) => { const d = WIDGET[k], c = calcolaWidget(k); return `<button class="widget ${c.att ? "att" : ""}" data-nx-widget="${k}"><span class="w-ic">${ico(d.ic)}</span><small>${d.nome}</small><b>${esc(c.v)}</b><span class="w-sub">${esc(c.sub || "")}</span></button>`; }).join("")}</section>`;
}
function apriWidget(k) {
  const d = WIDGET[k], c = calcolaWidget(k);
  const vai2 = c.vai || d.vai;
  if (k === "avvisi") {
    const acc = avvisiAccesi();
    return apriPopup(() => `<div class="tit"><h2>${d.nome}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>${acc.length ? acc.map((x) => `<div class="gruppo">${esc(x.a.icona || "⚠️")} ${esc(x.a.nome || "Avviso")}</div><div class="tessere">${x.ids.map(tessera).join("")}</div>`).join("") : '<p class="mut">Nessun avviso acceso. Li crei in Impostazioni › Widget.</p>'}`);
  }
  if (k === "non_connessi" && typeof vistaNonConnessi === "function") return apriPopup(() => `<div class="tit"><h2>${d.nome}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>${vistaNonConnessi(entitaGen("non_connessi"))}`);
  if (!c.ids || !c.ids.length) { if (vai2 && schedeAttive().some((x) => x.id === vai2)) return vai(vai2); return; }
  apriPopup(() => { const cc = calcolaWidget(k); return `<div class="tit"><h2>${d.nome}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><div class="tessere">${(cc.ids || []).map(tessera).join("")}</div>${vai2 ? `<div class="riga" style="margin-top:14px"><span class="spazio"></span><button class="btn pic" data-nx-vai="${vai2}">Apri la sezione</button></div>` : ""}`; });
}
// popup che si aggiorna con gli stati
let popupAttivo = null, tPopup = null;
function apriPopup(fn) { popupAttivo = fn; finestra(fn()); }
const _ridisegna0 = ridisegna;
ridisegna = function () {
  if (popupAttivo && !$("#finestra").hidden) { clearTimeout(tPopup); tPopup = setTimeout(() => { if (popupAttivo && !$("#finestra").hidden && !inInput) $("#finestra .pannello").innerHTML = popupAttivo(); }, 150); }
  _ridisegna0();
};
const _chiudi0 = chiudiFinestra;
chiudiFinestra = function () { popupAttivo = null; confermaPer = null; _chiudi0(); };
// avvisi personalizzati che si aprono da soli quando si accendono
let avvisiVisti = null;
function controllaAvvisiPopup() {
  const acc = avvisiAccesi().map((x) => x.i + ":" + x.ids.join(","));
  if (avvisiVisti === null) { avvisiVisti = new Set(acc); return; }
  const nuovi = acc.filter((x) => !avvisiVisti.has(x));
  avvisiVisti = new Set(acc);
  if (nuovi.length && (S.cfg.widget || {}).popup_avvisi && $("#finestra").hidden) apriWidget("avvisi");
}

// ------------------------------------------------------------------ azioni rapide
const TIPI_AZIONE = {
  popup_luci_scelte: "Popup luci: scegli tu quali", popup_luci: "Popup con tutte le luci", popup_prese: "Popup con tutte le prese", popup_clima: "Popup clima",
  popup_antifurto: "Popup antifurto", popup_lavatrice: "Popup lavatrice", toggle: "Accendi/spegni un'entità", media: "Lettore multimediale", script: "Script", scena: "Scena",
};
const AZ_ENT = { toggle: "comando", media: "media", script: "script", scena: "scena", popup_lavatrice: "lavatrice" };
function vAzioniHome() {
  const az = S.cfg.azioni || [];
  if (!az.length) return "";
  return `<section class="azioni-rapide">${az.map((a, i) => { const on = a.tipo === "toggle" && a.entita && st(a.entita) && ACCESO.includes(st(a.entita).state); return `<button class="az-rapida ${on ? "on" : ""}" data-nx-azione="${i}">${ico(a.icona || "play")}<span>${esc(a.nome || TIPI_AZIONE[a.tipo] || "Azione")}</span></button>`; }).join("")}</section>`;
}
let confermaPer = null;
function lanciaAzione(i, confermata) {
  const a = (S.cfg.azioni || [])[i]; if (!a) return;
  if (a.conferma && !confermata) {
    confermaPer = i;
    return finestra(`<div class="tit"><h2>${esc(a.nome || "Conferma")}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><p>${esc(a.conferma)}</p><div class="riga"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn p" data-nx-conferma>Conferma</button></div>`);
  }
  const tit = (t) => `<div class="tit"><h2>${esc(a.nome || t)}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>`;
  const pop = (t, f) => apriPopup(() => { const ids = f(); return tit(t) + (ids.length ? `<div class="tessere">${ids.map(tessera).join("")}</div>` : '<p class="mut">Niente da mostrare.</p>'); });
  switch (a.tipo) {
    case "popup_luci_scelte": return pop("Luci", () => (a.lista || []).filter((id) => st(id)));
    case "popup_luci": return apriPopup(() => { const l = tutteId().filter((id) => eLuce(id) && visibile(id)); return tit("Tutte le luci") + `<div class="riga" style="margin-bottom:12px"><button class="btn a pic" data-gruppo="light" data-v="turn_on">Accendi tutte</button><button class="btn pic" data-gruppo="light" data-v="turn_off">Spegni tutte</button></div><div class="tessere">${l.map(tessera).join("")}</div>`; });
    case "popup_prese": return pop("Tutte le prese", () => tutteId().filter((id) => ePresa(id) && visibile(id)));
    case "popup_clima": return pop("Clima", () => tutteId().filter((id) => ["climate", "water_heater", "fan", "humidifier"].includes(dom(id)) && visibile(id)));
    case "popup_antifurto": return apriPopup(() => tit("Antifurto") + bloccoAntifurto());
    case "popup_lavatrice": return pop("Lavatrice", () => { if (!a.entita || !st(a.entita)) return []; const e = S.entita.find((x) => x.id === a.entita); const fr = e && e.dispositivo ? S.entita.filter((x) => x.dispositivo === e.dispositivo).map((x) => x.id).filter((id) => st(id) && !nonDisp(id)) : []; return [a.entita, ...fr.filter((x) => x !== a.entita)].slice(0, 12); });
    case "media": return pop("Musica", () => a.entita && st(a.entita) ? [a.entita] : []);
    case "toggle": if (a.entita) { const d = dom(a.entita); if (["script"].includes(d)) chiama("script", "turn_on", { entity_id: a.entita }); else if (d === "scene") chiama("scene", "turn_on", { entity_id: a.entita }); else if (["button", "input_button"].includes(d)) chiama(d, "press", { entity_id: a.entita }); else chiama("homeassistant", "toggle", { entity_id: a.entita }); avviso(a.nome || nomeE(a.entita), "ok"); } return;
    case "script": if (a.entita) { chiama("script", "turn_on", { entity_id: a.entita }); avviso((a.nome || nomeE(a.entita)) + ": avviato", "ok"); } return;
    case "scena": if (a.entita) { chiama("scene", "turn_on", { entity_id: a.entita }); avviso((a.nome || nomeE(a.entita)) + ": fatto", "ok"); } return;
  }
}

// ------------------------------------------------------------------ antifurto (sezione Sicurezza e popup)
const MODI_ALLARME = { armed_home: ["In casa", "alarm_arm_home", 1], armed_away: ["Fuori (totale)", "alarm_arm_away", 2], armed_night: ["Notte", "alarm_arm_night", 4], armed_vacation: ["Vacanza", "alarm_arm_vacation", 32], armed_custom_bypass: ["Personalizzato", "alarm_arm_custom_bypass", 16] };
function modiSupportati(id) { const f = attr(id, "supported_features"); return Object.keys(MODI_ALLARME).filter((k) => f == null ? ["armed_home", "armed_away", "armed_night"].includes(k) : (f & MODI_ALLARME[k][2])); }
function pulsantiAllarme(id) {
  const v = st(id).state, a = S.cfg.antifurto || {};
  if (["unavailable", "unknown"].includes(v)) return `<span class="dim">La centrale non risponde: controlla l'integrazione in Home Assistant.</span>`;
  if (v !== "disarmed") return `<button class="btn" data-arma="alarm_disarm" data-id="${id}">Disinserisci</button>`;
  const scelti = (a.entita === id || !a.entita) && (a.modi || []).length ? a.modi : Object.keys(MODI_ALLARME);
  return modiSupportati(id).filter((k) => scelti.includes(k)).map((k, i) => `<button class="btn ${i === 0 ? "a" : ""}" data-arma="${MODI_ALLARME[k][1]}" data-id="${id}">${MODI_ALLARME[k][0]}</button>`).join("");
}
function extraAntifurto() {
  const a = S.cfg.antifurto || {}, s = statoAntifurto();
  let h = "";
  if (s.scattato) {
    const zona = a.zona && st(a.zona) && !nonDisp(a.zona) ? st(a.zona).state : (() => { const ult = tutteId().filter((id) => dom(id) === "binary_sensor" && ["door", "window", "motion", "opening", "occupancy", "garage_door"].includes(attr(id, "device_class")) && st(id).state === "on").sort((x, y) => new Date(st(y).last_changed) - new Date(st(x).last_changed))[0]; return ult ? nomeE(ult) : ""; })();
    h += `<div class="allarme-stato triggered" style="margin-bottom:12px">${ico("allerta", "l")}<div style="flex:1"><b>Allarme scattato</b>${zona ? `<div style="font-size:14px">Zona: ${esc(zona)}</div>` : ""}</div>${a.sirena && st(a.sirena) ? `<button class="btn r" data-nx-sirena>Spegni sirena</button>` : ""}</div>`;
  }
  const tasti = (a.tasti || []).filter((t) => t.entita);
  if (tasti.length) h += `<div class="gruppo">Comandi antifurto</div><div class="riga" style="margin-bottom:12px">${tasti.map((t, i) => `<button class="btn" data-nx-tasto-allarme="${i}">${esc(t.nome || nomeE(t.entita))}</button>`).join("")}</div>`;
  return h;
}
function bloccoAntifurto() {
  const s = statoAntifurto();
  const all = s.id ? [s.id] : [];
  return extraAntifurto() + (all.map((id) => { const v = st(id).state, cls = ["unavailable", "unknown"].includes(v) ? "" : v === "disarmed" ? "disarmed" : v === "triggered" ? "triggered" : "armed"; return `<div class="allarme-stato ${cls}" style="margin-bottom:12px">${ico("sicurezza", "l")}<div style="flex:1"><div class="dim" style="font-size:12px">${esc(nomeE(id))}</div><b>${testoAllarme(v)}</b></div></div><div class="riga">${pulsantiAllarme(id)}</div>`; }).join("") || (extraAntifurto() ? "" : '<p class="mut">Nessuna centrale d\'allarme. Configurala in Impostazioni › Home.</p>'));
}

// ------------------------------------------------------------------ home: blocchi nell'ordine scelto
Object.assign(RIQUADRI, { intestazione: "Intestazione col meteo", pastiglie: "Pastiglie di stato", agente: "Agente (il cerchio)", widget: "Widget", azioni: "Azioni rapide", persone_c: "Persone" });
RIQUADRI.preferiti = "Dispositivi (preferiti)";
const BLOCCHI_NUOVI = ["intestazione", "pastiglie", "agente", "widget", "azioni", "persone_c"];
const _vAgente0 = vAgente;
vAgente = function () {
  const h = S.cfg.home || {};
  let scelti = homeAttivi();
  if (!scelti.includes("agente")) scelti = [...scelti, "agente"];
  const cerchio = () => { const r0 = h.riquadri; S.cfg.home.riquadri = scelti.filter((k) => k === "stanze" || k === "diario"); inHome = true; try { return _vAgente0(); } finally { S.cfg.home.riquadri = r0; inHome = false; } };
  let out = "", fila = [];
  const chiudiFila = () => { if (fila.length) out += `<div class="kpi" style="--kcols:${Math.min(fila.length, 4)}">${fila.map(([t, v, ic]) => `<div><small>${ico(ic, "s")} ${t}</small><b>${esc(v)}</b></div>`).join("")}</div>`; fila = []; };
  for (const k of scelti) {
    if (KPI.includes(k)) { const r = riquadroKpi(k); if (r) fila.push(r); continue; }
    chiudiFila();
    if (k === "agente") out += cerchio();
    else if (k === "intestazione") out += vIntestazione();
    else if (k === "pastiglie") out += vPastiglie();
    else if (k === "widget") out += vWidget();
    else if (k === "azioni") out += vAzioniHome();
    else if (k === "persone_c") out += vPersoneHome();
    else if (k === "preferiti") { const pref = (h.preferiti || []).filter((id) => st(id) && !(S.cfg.nascoste || []).includes(id)); out += `<section class="card blocco"><div class="tit"><h2>Dispositivi</h2><span class="dim" style="font-size:13px">Aggiungili con la stella o da Impostazioni › Home</span></div>${pref.length ? `<div class="tessere">${pref.map(tessera).join("")}</div>` : '<div class="dim">Nessun dispositivo: tocca la stella su una tessera.</div>'}</section>`; }
  }
  chiudiFila();
  setTimeout(controllaAvvisiPopup, 0);
  return `<div class="home-blocchi">${out}</div>`;
};
// la vecchia lista "Schermata principale" diventa l'ordine completo dei blocchi
ordineHome = function () {
  const h = S.cfg.home || {};
  let base = (h.ordine || h.riquadri || []).filter((k) => RIQUADRI[k] && k !== "persone");
  if (!h.blocchi_nuovi) base = ["intestazione", "pastiglie", "persone_c", "agente", ...base, "widget", "azioni"].filter((k, i, a) => a.indexOf(k) === i);
  return [...base, ...Object.keys(RIQUADRI).filter((k) => !base.includes(k) && k !== "persone")];
};
salvaHome = function (riquadri, ordine) {
  const att = ordine.filter((k) => riquadri.includes(k) || k === "agente");
  return salvaCfg({ home: { ...S.cfg.home, riquadri: att, ordine, blocchi_nuovi: true } }).then(disegna);
};
const homeAttivi = () => { const h = S.cfg.home || {}; return h.blocchi_nuovi ? (h.riquadri || []) : ["intestazione", "pastiglie", "persone_c", "agente", ...(h.riquadri || []).filter((k) => k !== "persone"), "widget", "azioni"]; };

// stanze mostrate in home
const _stanze0 = stanze;
let inHome = false;
function stanzeHome() { const sh = (S.cfg.home || {}).stanze_home || []; const ss = _stanze0(); return sh.length ? ss.filter((s) => sh.includes(s.id)) : ss; }
stanze = function () { return inHome ? stanzeHome() : _stanze0(); };

// ------------------------------------------------------------------ Impostazioni: utente, chiosco, intestazione, manutenzione
function applicaChiosco(forza) {
  const on = forza === undefined ? localStorage.getItem("nx_chiosco") === "1" : forza;
  try {
    const ha = window.parent.document.querySelector("home-assistant");
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector("home-assistant-main");
    const r = main && main.shadowRoot; if (!r) return;
    let s = r.getElementById("nx-chiosco");
    if (on && !s) { s = document.createElement("style"); s.id = "nx-chiosco"; s.textContent = ":host{--ha-sidebar-width:0px!important;--ha-top-app-bar-width:100%!important;--mdc-drawer-width:0px!important}ha-sidebar{display:none!important}"; r.appendChild(s); }
    if (!on && s) s.remove();
    const dr = r.querySelector("ha-drawer"), dsr = dr && dr.shadowRoot;
    if (dsr) for (const el of dsr.querySelectorAll(".sidebar-shell,aside")) el.style.display = on ? "none" : "";
  } catch (e) {}
}
// uscendo dalla plancia la barra laterale di Home Assistant torna com'era
window.addEventListener("pagehide", () => applicaChiosco(false));
function applicaGenerali() {
  const g = S.cfg.generali || {}, c = (S.cfg.widget || {}).compatte || "auto";
  document.body.classList.toggle("barra-libera", g.intestazione_fissa === false);
  document.body.classList.toggle("compatte", c === "sempre");
  document.body.classList.toggle("compatte-auto", c === "auto");
  migraHome();
  applicaChiosco();
}
const _applicaAspetto0 = applicaAspetto;
applicaAspetto = function () { _applicaAspetto0(); applicaGenerali(); };
const _schedeAttive0 = schedeAttive;
schedeAttive = function () { const s = _schedeAttive0(); return S.configuratore === false ? s.filter((x) => x.id !== "impostazioni") : s; };
// configurazioni di prima: i blocchi nuovi della home si aggiungono una volta sola
function migraHome() {
  const h = S.cfg && S.cfg.home; if (!h || h.blocchi_nuovi) return;
  salvaCfg({ home: { ...h, riquadri: homeAttivi(), ordine: ordineHome(), blocchi_nuovi: true } });
}

function diagnosi() {
  const n = (f) => tutteId().filter(f).length;
  const a = statoAntifurto(), m = datiMeteo(), e = S.cfg.energia || {};
  const righe = [
    ["Luci", n((id) => eLuce(id) && visibile(id))], ["Prese", n((id) => ePresa(id) && visibile(id))], ["Altri interruttori", n((id) => dom(id) === "switch" && !ePresa(id) && !accessorio(id))],
    ["Tapparelle", n((id) => dom(id) === "cover")], ["Clima", n((id) => dom(id) === "climate")], ["Porte e finestre", n((id) => eApertura(id))],
    ["Telecamere", n((id) => dom(id) === "camera")], ["Antifurto", a.id ? nomeE(a.id) + " · " + testoAllarme(a.v) : "nessuna centrale"],
    ["Meteo", m.cond ? (METEO[m.cond] || m.cond) + (m.temp != null ? " · " + fmt1(m.temp) + "°" : "") : "nessuna entità weather"], ["Persone", n((id) => dom(id) === "person")],
    ["Energia", e.casa ? "consumo: " + nomeE(e.casa) : "non configurata"], ["Raccolta rifiuti", Object.keys((S.cfg.raccolta || {}).calendario || {}).length ? "configurata" : "non configurata"],
    ["Avvisi sul telefono", (S.cfg.agente || {}).notifica || "solo notifiche di Home Assistant"], ["Stanze", stanze().length],
    ["Dispositivi non connessi", n((id) => DOMINI_UTILI.includes(dom(id)) && st(id).state === "unavailable")], ["Aggiornamenti in attesa", n((id) => dom(id) === "update" && st(id).state === "on")],
    ["Sezioni visibili", (S.cfg.sezioni || []).length + " · " + schedeAttive().map((s) => s.nome).join(", ")],
  ];
  finestra(`<div class="tit"><h2>Diagnosi</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><p class="mut">Cosa trova Nexalia in Home Assistant, sezione per sezione.</p><table>${righe.map((r) => `<tr><td>${r[0]}</td><td><b>${esc(r[1])}</b></td></tr>`).join("")}</table><p class="dim" style="font-size:13px;margin-top:12px">Nexalia ${esc(S.versione)} · ${Object.keys(S.stati).length} entità</p>`);
}
function trova(f, re) { return tutteId().filter(f).find((id) => re.test(id + " " + (attr(id, "friendly_name") || ""))) || ""; }
async function autorilevamento() {
  const p = { ...(S.cfg.pastiglie || {}) }, a = { ...(S.cfg.antifurto || {}) }, e = { ...(S.cfg.energia || {}) }, trovati = [];
  const metti = (o, k, v, nome) => { if (!o[k] && v) { o[k] = v; trovati.push(nome + ": " + nomeE(v)); } };
  metti(p, "meteo", tutteId().find((id) => dom(id) === "weather"), "Meteo");
  metti(a, "entita", tutteId().find((id) => dom(id) === "alarm_control_panel" && !nonDisp(id)) || tutteId().find((id) => dom(id) === "alarm_control_panel"), "Antifurto");
  const num = (cls) => (id) => dom(id) === "sensor" && attr(id, "device_class") === cls;
  metti(p, "temperatura", trova(num("temperature"), /estern|outdoor|outside|fuori|esterno|meteo|stazione/i), "Temperatura esterna");
  metti(p, "umidita", trova(num("humidity"), /estern|outdoor|outside|fuori|esterno|meteo|stazione/i), "Umidità esterna");
  metti(p, "pioggia", trova((id) => dom(id) === "sensor" && /mm\/h|in\/h/.test(attr(id, "unit_of_measurement") || ""), /rain|piogg/i), "Pioggia adesso");
  metti(p, "pioggia_oggi", trova((id) => dom(id) === "sensor" && /^(mm|in)$/.test(attr(id, "unit_of_measurement") || ""), /rain|piogg/i), "Pioggia di oggi");
  metti(p, "posta", trova((id) => dom(id) === "binary_sensor", /posta|mailbox|letter|cassetta/i), "Posta");
  const pot = (id) => dom(id) === "sensor" && attr(id, "device_class") === "power";
  metti(e, "casa", trova(pot, /consum|casa|house|home|load|carico/i), "Consumo della casa");
  metti(e, "solare", trova(pot, /solar|fotovolt|pv|fv|inverter/i), "Fotovoltaico");
  metti(e, "rete", trova(pot, /grid|rete|meter|contatore/i), "Rete");
  metti(e, "batteria_livello", trova((id) => dom(id) === "sensor" && attr(id, "device_class") === "battery", /accumul|storage|luna|powerwall|battery_soc|soc/i), "Batteria di accumulo");
  if (!a.scattato) metti(a, "sirena", trova((id) => ["siren", "switch"].includes(dom(id)), /siren/i), "Sirena");
  await salvaCfg({ pastiglie: p, antifurto: a, energia: e });
  finestra(`<div class="tit"><h2>Autorilevamento</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>${trovati.length ? `<p class="mut">Ho riempito le caselle vuote con quello che ho trovato. Quelle che avevi già compilato non le ho toccate.</p><ul class="lista-ok">${trovati.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : '<p class="mut">Non ho trovato niente di nuovo: le caselle che si possono riempire da sole sono già a posto.</p>'}<p class="dim" style="font-size:13px">Luci, prese, tapparelle, telecamere e stanze Nexalia le riconosce sempre da sola.</p>`);
}
function confermaReset() {
  finestra(`<div class="tit"><h2>Reset totale</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><p>Tutte le impostazioni di Nexalia tornano come appena installata: stanze, Casa 3D, home, widget, azioni, energia, raccolta. <b>La licenza resta attiva.</b></p><p class="mut">Se vuoi poter tornare indietro, scarica prima il backup.</p><label class="campo">Per confermare scrivi RESET<input type="text" id="nxReset" autocomplete="off"></label><div class="riga" style="margin-top:12px"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn r" data-nx-reset-ok>Azzera tutto</button></div>`);
}

function htmlAvvisi() {
  const w = S.cfg.widget || {};
  return `    <div class="gruppo">Avvisi personalizzati</div><p class="mut">Un avviso si accende quando un'entità ha lo stato o il valore che scegli (es. on, open, heat, 23.5, oppure &lt;20, &gt;30). Gli avvisi accesi finiscono nel widget "Avvisi personalizzati".</p>
    ${(w.avvisi || []).map((a, i) => `<div class="voce-imp"><span class="emo">${esc(a.icona || "⚠️")}</span><div><b>${esc(a.nome || "Avviso")}</b><small>${esc({ batterie: "Batterie sotto il " + (a.valore || 20) + "%", allagamenti: "Sensori di allagamento", fumo: "Rilevatori di fumo e gas", personalizzato: (a.entita || "") + " = " + (a.valore || "on") }[a.tipo])}${avvisoAttivo(a).length ? " · ACCESO" : ""}</small></div><button class="btn pic r" data-nx-del="widget.avvisi" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="ed-box" style="margin-top:10px"><div class="griglia">
      <label class="campo">Tipo<select id="nxAvvTipo">${[["batterie", "Batterie (%)"], ["allagamenti", "Allagamenti"], ["fumo", "Rilevatori di fumo e gas"], ["personalizzato", "Personalizzato"]].map(([k, n]) => `<option value="${k}" ${nuovoAvv.tipo === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label class="campo">Nome dell'avviso<input type="text" id="nxAvvNome" value="${esc(nuovoAvv.nome)}" placeholder="Es. Finestre aperte"></label>
      ${nuovoAvv.tipo === "personalizzato" ? `<label class="campo">Entità<input type="text" id="nxAvvEnt" list="dl-tutte" value="${esc(nuovoAvv.entita)}" placeholder="binary_sensor.finestra_cucina" autocomplete="off"></label>` : ""}
      ${["personalizzato", "batterie"].includes(nuovoAvv.tipo) ? `<label class="campo">${nuovoAvv.tipo === "batterie" ? "Soglia (%)" : "Stato o valore"}<input type="text" id="nxAvvVal" value="${esc(nuovoAvv.valore)}" placeholder="${nuovoAvv.tipo === "batterie" ? "20" : "on"}"></label>` : ""}
      <label class="campo">Icona<input type="text" id="nxAvvIco" value="${esc(nuovoAvv.icona)}" maxlength="4" placeholder="⚠️ 💧 🌡️"></label>
    </div><div class="riga" style="margin-top:12px"><button class="btn p pic" data-nx-add-avviso>＋ Aggiungi avviso</button></div></div>`;
}
// ------------------------------------------------------------------ pagine dell'editor
let nuovaAz = { tipo: "toggle", icona: "play", nome: "", entita: "", lista: [], conferma: "" };
let nuovoAvv = { tipo: "personalizzato", entita: "", nome: "", icona: "⚠️", valore: "" };
let nuovoTasto = { nome: "", entita: "" };
const _pannelli0 = pannelli;
pannelli = function () {
  const B = _pannelli0();
  const g = S.cfg.generali || {}, as = S.cfg.aspetto || {}, ass = S.cfg.assist || {}, p = S.cfg.pastiglie || {}, af = S.cfg.antifurto || {}, w = S.cfg.widget || {};
  const agenti = tutteId().filter((id) => dom(id) === "conversation");
  const u = S.utente || {};
  const P = {};
  P.generali = { cat: "plancia", ic: "impostazioni", tit: "Impostazioni", kw: "generali nome casa utente amministratore admin chiosco intestazione assist voce sezioni navbar ordine diagnosi autorilevamento reset", html: () => `
    <div class="gruppo" style="margin-top:0">Generali</div>
    <p class="mut">In alto a sinistra resta sempre "Casa · Nexalia". Se vuoi, accanto compare anche il nome della tua casa.</p>
    <label class="campo">Nome della casa<span>Facoltativo, es. "Casa al mare"</span><input type="text" id="edNome" maxlength="30" value="${esc(as.nome_casa || "")}"></label>
    <label class="campo" style="margin-top:10px">Utente amministratore<span>Vuoto = le impostazioni le vedono tutti. Se scrivi un utente di Home Assistant, solo lui vede e cambia le impostazioni.${u.nome ? ` Tu sei: <b>${esc(u.nome)}</b>` : ""}</span><input type="text" id="edAdmin" maxlength="60" value="${esc(g.admin || "")}" placeholder="${esc(u.nome || "nome utente")}" autocomplete="off"></label>
    <div class="riga" style="margin-top:12px"><button class="btn p" data-nx-salva-generali>Salva</button></div>
    <div class="gruppo">Schermo</div>
    ${interruttore(localStorage.getItem("nx_chiosco") === "1", "data-nx-chiosco", "Modo chiosco", "La plancia a tutto schermo, senza la barra laterale di Home Assistant. Vale solo su questo apparecchio.")}
    ${interruttore(g.intestazione_fissa !== false, 'data-nx-tg="generali.intestazione_fissa"', "Intestazione fissa", "La barra con le sezioni resta in alto quando scorri")}
    <div class="gruppo">Assistente (la casella "Chiedi a Nexalia")</div>
    <label class="campo">Assistente<span>Vuoto = quello predefinito di Home Assistant (un modello AI, se l'hai configurato)</span><select id="edAgente"><option value="">Predefinito di Home Assistant</option>${agenti.map((id) => `<option value="${id}" ${ass.agente === id ? "selected" : ""}>${esc(nomeE(id))}</option>`).join("")}</select></label>
    ${interruttore(ass.voce, 'data-assist="voce"', "Leggi la risposta ad alta voce", "Usa la voce del dispositivo su cui apri la plancia")}
    ${interruttore(!ass.nascondi, 'data-assist="nascondi"', "Mostra la casella nella home")}
    <div class="gruppo">Sezioni e ordine della barra</div>
    ${B.sezioni.html()}
    <div class="gruppo">Rilevamento e manutenzione</div>
    <div class="riga"><button class="btn pic" data-nx-diagnosi>${ico("aiuto", "s")}Diagnosi</button><button class="btn pic" data-nx-autoril>${ico("agente", "s")}Avvia autorilevamento</button><span class="spazio"></span><button class="btn pic r" data-nx-reset>Reset totale configurazione</button></div>` };
  P.home = { cat: "plancia", ic: "casa", tit: "Home", kw: "home blocchi ordine intestazione meteo pastiglie persone widget azioni stanze dispositivi preferiti antifurto allarme sirena posta rifiuti pioggia temperatura umidità", html: () => {
    const ord = ordineHome(), att = homeAttivi();
    const ss = _stanze0(), sh = (S.cfg.home || {}).stanze_home || [];
    const a = af.entita && st(af.entita) ? af.entita : tutteId().find((x) => dom(x) === "alarm_control_panel");
    const pref = ((S.cfg.home || {}).preferiti || []);
    return `${datalist("weather")}${datalist("numerico")}${datalist("binario")}${datalist("allarme")}${datalist("sirena")}${datalist("sensore")}${datalist("comando")}${datalist("tutte")}
    <div class="gruppo" style="margin-top:0">Blocchi della home</div><p class="mut">Accendi quelli che vuoi e mettili nell'ordine che preferisci.</p>
    ${ord.map((k, i, arr) => `<div class="voce-imp"><div><b>${RIQUADRI[k]}</b></div>${suGiu("home", k, i, arr.length)}${k === "agente" ? '<span class="badge blu">sempre</span>' : `<button class="tg ${att.includes(k) ? "on" : ""}" data-riq="${k}" aria-label="Mostra ${esc(RIQUADRI[k])}"></button>`}</div>`).join("")}
    <div class="gruppo">Pastiglie di stato</div><p class="mut">La riga in cima alla home. Ogni pastiglia compare da sola solo quando ha qualcosa da dire.</p>
    <div class="scelte">${Object.entries(PASTIGLIE).map(([k, n]) => `<button class="${(p.attive || []).includes(k) ? "on" : ""}" data-nx-lista="pastiglie.attive" data-v="${k}">${n}</button>`).join("")}</div>
    <div class="griglia" style="margin-top:12px">
      ${campoEnt("pastiglie.posta", "Sensore della cassetta della posta", "binario", "Quando il postino apre lo sportello la pastiglia compare e resta finché non la tocchi")}
      <label class="campo">Rifiuti: dopo quest'ora annuncia il ritiro di domani<span>Il bidone si mette fuori la sera prima</span><select data-nx-cfg="pastiglie.rifiuti_ora" data-num>${[-1, ...Array.from({ length: 24 }, (_, i) => i)].map((h) => `<option value="${h}" ${Number(p.rifiuti_ora) === h ? "selected" : ""}>${h < 0 ? "Mai: solo il ritiro di oggi" : String(h).padStart(2, "0") + ":00"}</option>`).join("")}</select></label>
      ${campoEnt("pastiglie.temperatura", "Sensore della temperatura", "numerico")}
      ${campoEnt("pastiglie.umidita", "Sensore dell'umidità", "numerico")}
      ${campoEnt("pastiglie.pioggia", "Intensità della pioggia", "numerico", "Es. mm/h della stazione meteo. Vuoto: uso il meteo")}
      ${campoEnt("pastiglie.pioggia_oggi", "Pioggia caduta oggi", "numerico")}
    </div>
    <div class="gruppo">Meteo dell'intestazione</div>
    <div class="griglia">${campoEnt("pastiglie.meteo", "Entità meteo", "weather", "Vuoto: la prima che trovo")}</div>
    ${interruttore(p.sensori_meteo, 'data-nx-tg="pastiglie.sensori_meteo"', "Usa i sensori della tua stazione meteo", "Spento: temperatura, umidità e vento li prendo dall'entità meteo")}
    ${p.sensori_meteo ? `<div class="griglia">${campoEnt("pastiglie.temperatura", "Temperatura", "numerico")}${campoEnt("pastiglie.umidita", "Umidità", "numerico")}${campoEnt("pastiglie.vento", "Vento", "numerico")}</div>` : ""}
    <div class="gruppo">Stanze in home</div><p class="mut">Quali stanze vedere nella colonna "Stanze" della home. Nessuna scelta = tutte.</p>
    <div class="scelte">${ss.map((s) => `<button class="${sh.includes(s.id) ? "on" : ""}" data-nx-lista="home.stanze_home" data-v="${esc(s.id)}">${esc(s.nome)}</button>`).join("") || '<span class="dim">Nessuna stanza.</span>'}</div>
    <div class="gruppo">Antifurto</div>
    <div class="griglia">${campoEnt("antifurto.entita", "Centrale d'allarme", "allarme", "Vuoto: la prima che trovo")}</div>
    ${a && st(a) ? `<p class="mut" style="margin-top:10px">Modalità da mostrare (ci sono solo quelle che la centrale accetta; il disinserimento c'è sempre):</p><div class="scelte">${modiSupportati(a).map((k) => `<button class="${(af.modi || []).includes(k) ? "on" : ""}" data-nx-lista="antifurto.modi" data-v="${k}">${MODI_ALLARME[k][0]}</button>`).join("")}</div>` : ""}
    <div class="griglia" style="margin-top:12px">
      ${campoEnt("antifurto.scattato", "Dove si legge se è scattato", "sensore", "Un interruttore, un sensore o un aiutante. Quando è scattato la plancia diventa rossa")}
      <label class="campo">Il valore che vuol dire "scattato"<span>Vuoto vuol dire "on"</span><input type="text" data-nx-cfg="antifurto.scattato_valore" value="${esc(af.scattato_valore || "")}" placeholder="on"></label>
      ${campoEnt("antifurto.sirena", "Sirena (facoltativa)", "sirena", "Per il tasto «Spegni sirena»")}
      ${campoEnt("antifurto.zona", "Che cosa l'ha fatto scattare (facoltativo)", "sensore", "Un sensore che dice la zona. Vuoto: guardo l'ultima porta, finestra o movimento")}
    </div>
    <p class="mut" style="margin-top:14px">Tasti dell'antifurto: per chi non ha una centrale (antifurto fatto con ESPHome, script o aiutanti). Compaiono in Sicurezza e nel popup dell'antifurto.</p>
    ${(af.tasti || []).map((t, i) => `<div class="voce-imp">${ico("sicurezza")}<div><b>${esc(t.nome || nomeE(t.entita))}</b><small>${esc(t.entita)}</small></div><button class="btn pic r" data-nx-del="antifurto.tasti" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><input type="text" id="nxTastoNome" placeholder="Nome del tasto (es. Inserisci giardino)" value="${esc(nuovoTasto.nome)}" style="flex:1;min-width:160px"><input type="text" id="nxTastoEnt" list="dl-comando" placeholder="script.inserisci_giardino" value="${esc(nuovoTasto.entita)}" style="flex:1;min-width:160px"><button class="btn pic p" data-nx-add-tasto>＋ Aggiungi un tasto</button></div>
    <div class="gruppo">Dispositivi in home</div><p class="mut">Le tessere del blocco "Dispositivi". Puoi aggiungerle anche con la stella su ogni tessera.</p>
    ${pref.map((id, i) => `<div class="voce-imp">${ico(st(id) ? iconaE(id) : "sensore")}<div><b>${esc(st(id) ? nomeE(id) : id)}</b><small>${esc(id)}</small></div>${suGiu("pref", id, i, pref.length)}<button class="btn pic r" data-pref="${id}" aria-label="Togli">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><input type="text" id="nxPrefEnt" list="dl-tutte" placeholder="Scegli un'entità: dominio.nome" style="flex:1;min-width:200px" autocomplete="off"><button class="btn pic p" data-nx-add-pref>＋ Aggiungi un'entità</button></div>`; } };
  P.widget = { cat: "plancia", ic: "comandi", tit: "Widget", kw: "widget tessere compatte avvisi personalizzati batterie allagamenti fumo gas ordine", html: () => {
    const ow = ordineWidget();
    return `${datalist("tutte")}
    <div class="gruppo" style="margin-top:0">Tessere compatte</div><p class="mut">Con Auto si stringono solo sugli schermi stretti.</p>
    <div class="scelte">${[["mai", "Mai"], ["auto", "Auto"], ["sempre", "Sempre"]].map(([k, n]) => `<button class="${(w.compatte || "auto") === k ? "on" : ""}" data-nx-set="widget.compatte" data-v="${k}">${n}</button>`).join("")}</div>
    ${interruttore(w.popup_avvisi !== false, 'data-nx-tg="widget.popup_avvisi"', "Avvisi personalizzati a finestra", "Quando un avviso si accende la plancia lo apre da sola, mai sopra una finestra già aperta")}
    <div class="gruppo">Widget in home</div><p class="mut">Accendi i widget che vuoi vedere nel blocco "Widget" della home e scegli l'ordine.</p>
    ${ow.map((x, i) => { const c = calcolaWidget(x.k); return `<div class="voce-imp">${ico(WIDGET[x.k].ic)}<div><b>${WIDGET[x.k].nome}</b><small>${esc(c.v)}${c.sub ? " · " + esc(c.sub) : ""}</small></div>${suGiu("widget", x.k, i, ow.length)}<button class="tg ${x.on ? "on" : ""}" data-nx-widget-tg="${x.k}" aria-label="Mostra ${esc(WIDGET[x.k].nome)}"></button></div>`; }).join("")}
    ${htmlAvvisi()}`; } };
  P.azioni = { cat: "plancia", ic: "play", tit: "Azioni", kw: "azioni rapide popup luci prese clima antifurto lavatrice toggle script scena conferma", html: () => {
    const az = S.cfg.azioni || [];
    const fil = AZ_ENT[nuovaAz.tipo];
    return `${datalist("comando")}${datalist("media")}${datalist("script")}${datalist("scena")}${datalist("lavatrice")}${datalist("luci")}
    <p class="mut" style="margin-top:0">I tasti del blocco "Azioni rapide" della home: aprono un popup o comandano qualcosa con un tocco.</p>
    ${az.map((a, i) => `<div class="voce-imp">${ico(a.icona || "play")}<div><b>${esc(a.nome || TIPI_AZIONE[a.tipo])}</b><small>${esc(TIPI_AZIONE[a.tipo])}${a.entita ? " · " + esc(a.entita) : ""}${(a.lista || []).length ? " · " + a.lista.length + " luci" : ""}${a.conferma ? " · chiede conferma" : ""}</small></div>${suGiu("azioni", String(i), i, az.length)}<button class="btn pic r" data-nx-del="azioni" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("") || '<p class="dim">Nessuna azione rapida.</p>'}
    <div class="ed-box" style="margin-top:12px"><b>Nuova azione rapida</b>
      <div class="griglia" style="margin-top:10px">
        <label class="campo">Che cosa fa<select id="nxAzTipo">${Object.entries(TIPI_AZIONE).map(([k, n]) => `<option value="${k}" ${nuovaAz.tipo === k ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="campo">Nome<input type="text" id="nxAzNome" value="${esc(nuovaAz.nome)}" placeholder="Es. Buonanotte" maxlength="30"></label>
        ${fil ? `<label class="campo">${{ toggle: "Interruttore, luce o scena da comandare", media: "Lettore multimediale", script: "Script", scena: "Scena", popup_lavatrice: "Entità della lavatrice" }[nuovaAz.tipo]}<input type="text" id="nxAzEnt" list="dl-${fil}" value="${esc(nuovaAz.entita)}" placeholder="dominio.nome" autocomplete="off"></label>` : ""}
        <label class="campo">Messaggio di conferma<span>Facoltativo, es. "Sei sicuro?"</span><input type="text" id="nxAzConf" value="${esc(nuovaAz.conferma)}" maxlength="80"></label>
      </div>
      ${nuovaAz.tipo === "popup_luci_scelte" ? `<div class="gruppo">Luci del popup</div><div class="scelte">${nuovaAz.lista.map((id) => `<button class="on" data-nx-az-luce-tog="${id}">${esc(nomeE(id))} ✕</button>`).join("")}</div><div class="riga" style="margin-top:8px"><input type="text" id="nxAzLuce" list="dl-luci" placeholder="light.nome" style="flex:1" autocomplete="off"><button class="btn pic" data-nx-az-luce>＋ Aggiungi luce</button></div>` : ""}
      <div class="gruppo">Icona</div><div class="icone-sel">${ICONE_SCELTA.map((k) => `<button class="${nuovaAz.icona === k ? "on" : ""}" data-nx-az-icona="${k}" aria-label="Icona ${k}">${ico(k)}</button>`).join("")}</div>
      <div class="riga" style="margin-top:14px"><button class="btn p" data-nx-add-azione>＋ Aggiungi azione rapida</button></div>
    </div>`; } };
  // le altre pagine restano quelle di prima (Sezioni e Assist sono dentro Impostazioni)
  const resto = Object.fromEntries(Object.entries(B).filter(([k]) => !["generali", "home", "sezioni", "assist"].includes(k)));
  P.backup = resto.backup; delete resto.backup;
  const bk = P.backup.html;
  P.backup = { ...P.backup, tit: "Backup", html: () => bk() + (completa() ? `<div class="gruppo">Copia e incolla</div><div class="riga"><button class="btn pic" data-nx-copia-backup>Copia il backup negli appunti</button></div><label class="campo" style="margin-top:10px">Oppure incolla qui il testo di un backup<span>Le impostazioni che il backup non contiene restano come sono</span><textarea id="nxBackupTesto" rows="4" placeholder='{"config": …}'></textarea></label><div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-ripristina-testo>Ripristina dal testo</button></div>` : "") };
  return { ...P, ...resto };
};

// ------------------------------------------------------------------ eventi
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button,[data-nx-pastiglia]"); if (!t) return;
  const d = t.dataset;
  if (d.nxPastiglia) {
    if (d.nxPastiglia === "posta") { localStorage.setItem("nx_posta_vista", String(Date.now())); localStorage.setItem("nx_posta_arrivo", "0"); return disegna(); }
    const pp = pastiglia(d.nxPastiglia);
    if (d.nxPastiglia === "sicurezza") return apriPopup(() => `<div class="tit"><h2>Antifurto</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>${bloccoAntifurto()}`);
    if (d.nxPastiglia === "rifiuti") return vai("raccolta");
    if (pp && pp.ids && pp.ids.length) return apriPopup(() => { const q = pastiglia(d.nxPastiglia); return `<div class="tit"><h2>${PASTIGLIE[d.nxPastiglia]}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><div class="tessere">${((q && q.ids) || []).map(tessera).join("") || '<p class="mut">Tutto a posto.</p>'}</div>`; });
    return;
  }
  if (d.nxWidget) return apriWidget(d.nxWidget);
  if (d.nxVai) { chiudiFinestra(); return vai(d.nxVai); }
  if (d.nxAzione !== undefined) return lanciaAzione(Number(d.nxAzione));
  if (d.nxConferma !== undefined) { const i = confermaPer; chiudiFinestra(); return lanciaAzione(i, true); }
  if (d.nxSirena !== undefined) { const s = S.cfg.antifurto.sirena; chiama(dom(s) === "siren" ? "siren" : "homeassistant", "turn_off", { entity_id: s }); return avviso("Sirena spenta", "ok"); }
  if (d.nxTastoAllarme !== undefined) { const tt = (S.cfg.antifurto.tasti || []).filter((x) => x.entita)[Number(d.nxTastoAllarme)]; if (!tt) return; const dm = dom(tt.entita); if (dm === "script") chiama("script", "turn_on", { entity_id: tt.entita }); else if (dm === "scene") chiama("scene", "turn_on", { entity_id: tt.entita }); else if (["button", "input_button"].includes(dm)) chiama(dm, "press", { entity_id: tt.entita }); else chiama("homeassistant", "toggle", { entity_id: tt.entita }); return avviso(tt.nome || "Fatto", "ok"); }
  // editor
  if (d.nxSalvaGenerali !== undefined) {
    const admin = $("#edAdmin").value.trim(), u = S.utente || {};
    if (admin && u.nome && ![u.nome, u.visibile, u.id].some((x) => x && x.toLowerCase() === admin.toLowerCase())) { if (!confirm(`Con "${admin}" come amministratore, tu (${u.nome}) non vedrai più le Impostazioni. Continuo?`)) return; }
    await salvaCfg({ aspetto: { nome_casa: $("#edNome").value.trim().slice(0, 30) }, generali: { ...(S.cfg.generali || {}), admin } }); await carica(); return avviso("Salvato", "ok");
  }
  if (d.nxChiosco !== undefined) { localStorage.setItem("nx_chiosco", localStorage.getItem("nx_chiosco") === "1" ? "0" : "1"); applicaChiosco(); return disegna(); }
  if (d.nxTg) { const def = ["generali.intestazione_fissa", "widget.popup_avvisi"].includes(d.nxTg); const v = leggiCfg(d.nxTg); await impostaCfg(d.nxTg, !(v === undefined ? def : v)); applicaGenerali(); disegnaSchede(); return disegna(); }
  if (d.nxSet) { await impostaCfg(d.nxSet, d.v); return disegna(); }
  if (d.nxLista) { const l = [...(leggiCfg(d.nxLista) || [])]; const i = l.indexOf(d.v); if (i >= 0) l.splice(i, 1); else l.push(d.v); await impostaCfg(d.nxLista, l); return disegna(); }
  if (d.nxSvuota) { await impostaCfg(d.nxSvuota, ""); return disegna(); }
  if (d.nxDel) { const l = [...(leggiCfg(d.nxDel) || [])]; l.splice(Number(d.i), 1); await impostaCfg(d.nxDel, l); return disegna(); }
  if (d.nxSu || d.nxGiu) {
    const [pref, k] = (d.nxSu || d.nxGiu).split(":"), delta = d.nxSu ? -1 : 1;
    if (pref === "home") { const o = sposta(ordineHome(), k, delta); if (o) return salvaHome(homeAttivi(), o); return; }
    if (pref === "pref") { const o = sposta((S.cfg.home.preferiti || []), k, delta); if (o) { await salvaCfg({ home: { ...S.cfg.home, preferiti: o } }); return disegna(); } return; }
    if (pref === "widget") { const ow = ordineWidget(), ks = ow.map((x) => x.k), o = sposta(ks, k, delta); if (o) { await impostaCfg("widget.elenco", o.map((kk) => ({ k: kk, on: ow.find((x) => x.k === kk).on }))); return disegna(); } return; }
    if (pref === "azioni") { const az = [...(S.cfg.azioni || [])], i = Number(k), j = i + delta; if (j < 0 || j >= az.length) return; [az[i], az[j]] = [az[j], az[i]]; await salvaCfg({ azioni: az }); return disegna(); }
  }
  if (d.nxWidgetTg) { const ow = ordineWidget(); await impostaCfg("widget.elenco", ow.map((x) => ({ k: x.k, on: x.k === d.nxWidgetTg ? !x.on : x.on }))); return disegna(); }
  if (d.nxDiagnosi !== undefined) return diagnosi();
  if (d.nxAutoril !== undefined) return autorilevamento();
  if (d.nxReset !== undefined) return confermaReset();
  if (d.nxResetOk !== undefined) { if (($("#nxReset").value || "").trim().toUpperCase() !== "RESET") return avviso("Scrivi RESET per confermare", "err"); try { await api("api/reset", { metodo: "POST", corpo: {} }); chiudiFinestra(); localStorage.removeItem("nx_pannello"); avviso("Configurazione azzerata", "ok"); return carica(); } catch (e) { return avviso(e.message, "err"); } }
  if (d.nxAddTasto !== undefined) { const nome = $("#nxTastoNome").value.trim(), ent = $("#nxTastoEnt").value.trim(); if (!st(ent)) return avviso("Scegli un'entità che esiste", "err"); await impostaCfg("antifurto.tasti", [...((S.cfg.antifurto || {}).tasti || []), { nome, entita: ent }]); nuovoTasto = { nome: "", entita: "" }; return disegna(); }
  if (d.nxAddPref !== undefined) { const ent = $("#nxPrefEnt").value.trim(); if (!st(ent)) return avviso("Scegli un'entità che esiste", "err"); const p = S.cfg.home.preferiti || []; if (!p.includes(ent)) await salvaCfg({ home: { ...S.cfg.home, preferiti: [...p, ent] } }); return disegna(); }
  if (d.nxAddAvviso !== undefined) {
    const a = { tipo: $("#nxAvvTipo").value, nome: $("#nxAvvNome").value.trim(), icona: $("#nxAvvIco").value.trim() || "⚠️", entita: $("#nxAvvEnt") ? $("#nxAvvEnt").value.trim() : "", valore: $("#nxAvvVal") ? $("#nxAvvVal").value.trim() : "" };
    if (a.tipo === "personalizzato" && !st(a.entita)) return avviso("Scegli un'entità che esiste", "err");
    if (!a.nome) a.nome = { batterie: "Batterie scariche", allagamenti: "Allagamento", fumo: "Fumo o gas" }[a.tipo] || nomeE(a.entita);
    await impostaCfg("widget.avvisi", [...((S.cfg.widget || {}).avvisi || []), a]); nuovoAvv = { tipo: "personalizzato", entita: "", nome: "", icona: "⚠️", valore: "" }; avvisiVisti = null; return disegna();
  }
  if (d.nxAzIcona) { nuovaAz.icona = d.nxAzIcona; t.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === t)); return; }
  if (d.nxAzLuce !== undefined) { leggiNuovaAz(); const id = $("#nxAzLuce").value.trim(); if (!st(id)) return avviso("Scegli una luce che esiste", "err"); if (!nuovaAz.lista.includes(id)) nuovaAz.lista.push(id); return disegna(); }
  if (d.nxAzLuceTog) { leggiNuovaAz(); nuovaAz.lista = nuovaAz.lista.filter((x) => x !== d.nxAzLuceTog); return disegna(); }
  if (d.nxAddAzione !== undefined) {
    leggiNuovaAz();
    const a = { ...nuovaAz, lista: [...nuovaAz.lista] };
    if (AZ_ENT[a.tipo] && !st(a.entita)) return avviso("Scegli un'entità che esiste", "err");
    if (a.tipo === "popup_luci_scelte" && !a.lista.length) return avviso("Aggiungi almeno una luce", "err");
    if (!AZ_ENT[a.tipo]) a.entita = "";
    if (a.tipo !== "popup_luci_scelte") a.lista = [];
    await salvaCfg({ azioni: [...(S.cfg.azioni || []), a] }); nuovaAz = { tipo: "toggle", icona: "play", nome: "", entita: "", lista: [], conferma: "" }; avviso("Azione aggiunta", "ok"); return disegna();
  }
  if (d.nxCopiaBackup !== undefined) { try { const r = await fetch("api/backup", { cache: "no-store" }); const txt = await r.text(); try { await navigator.clipboard.writeText(txt); } catch (e) { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); } avviso("Backup copiato negli appunti", "ok"); } catch (e) { avviso("Non riesco a copiare: " + e.message, "err"); } return; }
  if (d.nxRipristinaTesto !== undefined) { try { const j = JSON.parse($("#nxBackupTesto").value); await api("api/backup", { metodo: "POST", corpo: j }); avviso("Backup ripristinato", "ok"); return carica(); } catch (e) { return avviso("Testo non valido: " + e.message, "err"); } }
});
function leggiNuovaAz() {
  const v = (id) => ($(id) ? $(id).value.trim() : "");
  nuovaAz.nome = v("#nxAzNome"); nuovaAz.conferma = v("#nxAzConf"); if ($("#nxAzEnt")) nuovaAz.entita = v("#nxAzEnt");
}
document.addEventListener("change", async (ev) => {
  const t = ev.target;
  if (t.dataset && t.dataset.nxCfg) { let v = t.value.trim(); if (t.dataset.num !== undefined) v = v === "" ? "" : Number(v); await impostaCfg(t.dataset.nxCfg, v); return disegna(); }
  if (t.id === "nxAzTipo") { leggiNuovaAz(); nuovaAz.tipo = t.value; return disegna(); }
  if (t.id === "nxAvvTipo") { nuovoAvv = { ...nuovoAvv, tipo: t.value, nome: $("#nxAvvNome").value, icona: $("#nxAvvIco").value }; return disegna(); }
});
// la posta: quando il sensore si accende la pastiglia resta finché non la tocchi
const _statoPosta = { v: null };
setInterval(() => {
  const id = (S.cfg && S.cfg.pastiglie || {}).posta; if (!id || !st(id)) return;
  const v = st(id).state;
  if (_statoPosta.v === "off" && v === "on") localStorage.setItem("nx_posta_arrivo", String(Date.now()));
  _statoPosta.v = v;
}, 2000);
