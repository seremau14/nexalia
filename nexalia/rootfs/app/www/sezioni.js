// Nexalia – sezioni della plancia ordinate per categorie (Plancia, Energia, Clima e acqua, Casa,
// Sicurezza, Avvisi, Alexa, Macchine e rete), ognuna con la sua pagina nell'editor.
// Si carica dopo app.js ed editor.js.

Object.assign(IC, {
  auto: "M5 16h14M6 16l1.5-5h9L18 16M7 16v3M17 16v3M8 13.5h.01M16 13.5h.01",
  ups: "M7 3h10v18H7zM10 7h4M12 11l-2 4h4l-2 4",
  piscina: "M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2-1.5 4.5-1.5S19 18 21 18M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8",
  pianta: "M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 14c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5zM8 21h8",
  rubinetto: "M4 10h9a3 3 0 0 1 3 3v1M4 7v6M16 17c0 1.5 1 3 1 3s1-1.5 1-3a1 1 0 0 0-2 0z",
  radio: "M4 9h16v11H4zM8 9l9-5M8 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M14 13h3M14 17h3",
  sport: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7l4 3-1.5 4.5h-5L8 10zM12 3v4M21 10.5l-5-.5M3 10.5l5-.5M7.5 19.5 9.5 14.5M16.5 19.5l-2-5",
  stampante: "M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z",
  zampa: "M12 21c-3 0-5-2-5-4 0-2.5 2.5-4 5-4s5 1.5 5 4c0 2-2 4-5 4zM6 11a1.5 2 0 1 0 0-.1M18 11a1.5 2 0 1 0 0-.1M9.5 7a1.5 2 0 1 0 0-.1M14.5 7a1.5 2 0 1 0 0-.1",
  cuore: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  movimento: "M13 4a1.5 1.5 0 1 0 0 .1M10 21l2-6 3 3v3M8 12l3-4 3 2 3 1M9 8l-2 4",
  cancello: "M3 21V5M21 21V5M3 9h18M3 15h18M7 5v16M11 5v16M15 5v16M19 5v16",
  campanello: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
  campana: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4M12 3V2",
  computer: "M4 5h16v10H4zM9 19h6M12 15v4",
  muro: "M5 3h14v18H5zM9 7h6M9 11h6M12 17h.01",
  orologio: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  cartella: "M3 6h6l2 2h10v11H3z",
});
document.getElementById("icone").innerHTML = Object.entries(IC).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join("");

// ------------------------------------------------------------------ categorie dell'editor (come GdAHome)
for (const k of Object.keys(CAT_ED)) delete CAT_ED[k];
Object.assign(CAT_ED, { plancia: "Plancia", energia: "Energia", clima: "Clima e acqua", casa: "Casa", sicurezza: "Sicurezza", avvisi: "Avvisi", alexa: "Alexa", rete: "Macchine e rete", tutte: "Tutte" });
if (!CAT_ED[catEd]) catEd = "tutte";

// ------------------------------------------------------------------ riconoscimento delle entità
const testoE = (id) => (id + " " + (attr(id, "friendly_name") || "")).toLowerCase();
const reT = (r) => (id) => r.test(testoE(id));
const dc = (id) => attr(id, "device_class");
const unita = (id) => attr(id, "unit_of_measurement") || "";
const nonNasc = (id) => !(S.cfg.nascoste || []).includes(id);
// dispositivi multimediali e telecamere (Echo, Google, Sonos, telecamere): le loro entità restano fuori dalle altre sezioni
let devMedia = null, devMediaN = -1;
function eDiMedia(id) {
  if (!devMedia || devMediaN !== S.entita.length) {
    devMedia = new Set(); devMediaN = S.entita.length;
    for (const e of S.entita) if (e.dispositivo && ["media_player", "camera", "assist_satellite"].includes(dom(e.id))) devMedia.add(e.dispositivo);
  }
  const e = S.entita.find((x) => x.id === id);
  return !!(e && e.dispositivo && devMedia.has(e.dispositivo));
}
const SEZ_MEDIA_OK = ["musica", "alexa", "citofono", "temperatura", "non_connessi"];
function okAuto(sez, x) {
  try { return SEZ_GEN[sez].auto(x) && nonNasc(x) && (SEZ_MEDIA_OK.includes(sez) || (!eDiMedia(x) && !/\becho\b|alexa|google.?home|nest.?(hub|mini|audio)|sonos|homepod/.test(testoE(x)))); } catch (e) { return false; }
}
const SEZ_GEN = {
  // Energia
  accumulo: { cat: "energia", nome: "Batteria di accumulo", ic: "batteria", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /accumul|storage|luna2000|powerwall|battery_soc|batteria_(casa|accumulo)|home_battery|bms/.test(testoE(id)),
    campi: [["soc", "Stato di carica (%)", "numerico"], ["potenza", "Potenza (positiva in scarica)", "numerico"], ["carica_oggi", "Energia caricata oggi", "numerico"], ["scarica_oggi", "Energia scaricata oggi", "numerico"], ["temperatura", "Temperatura della batteria", "numerico"]] },
  veicoli: { cat: "energia", nome: "Veicoli", ic: "auto", auto: (id) => ["sensor", "binary_sensor", "device_tracker", "lock", "climate", "switch", "number", "button"].includes(dom(id)) && /\b(car|ev|tesla|kia|hyundai|renault|zoe|bmw|volkswagen|vw|leaf|leapmotor|byd|polestar|volvo|audi|mercedes|peugeot|fiat|toyota|skoda|cupra|seat|mg4|ioniq|niro|enyaq)\b|vettura|veicolo|autonomia|odometer|chilometr|contachilometri|wallbox|colonnina|evcc|easee|zappi/.test(testoE(id)),
    campi: [["batteria", "Batteria o serbatoio (%)", "numerico"], ["autonomia", "Autonomia", "numerico"], ["km", "Contachilometri", "numerico"], ["in_carica", "In carica", "sensore"], ["potenza_carica", "Potenza di ricarica", "numerico"], ["posizione", "Posizione", "tutte"], ["serratura", "Serratura", "tutte"], ["clima", "Clima dell'auto", "tutte"], ["colonnina", "Colonnina (interruttore o modalità)", "tutte"]] },
  ups: { cat: "energia", nome: "UPS", ic: "ups", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /\bups\b|nut_|_ups_|apc_|eaton|riello|cyberpower/.test(testoE(id)) && !/pop.?ups|follow.?ups/.test(testoE(id)),
    campi: [["stato", "Stato (rete o batteria)", "sensore"], ["batteria", "Batteria (%)", "numerico"], ["autonomia", "Autonomia", "numerico"], ["carico", "Carico (%)", "numerico"], ["tensione", "Tensione in ingresso", "numerico"]] },
  // Clima e acqua
  clima: { cat: "clima", nome: "Clima", ic: "clima", auto: (id) => ["climate", "fan", "humidifier", "water_heater"].includes(dom(id)) && visibile(id) },
  temperatura: { cat: "clima", nome: "Temperatura", ic: "termometro", auto: (id) => dom(id) === "sensor" && ["temperature", "humidity"].includes(dc(id)) && !accessorio(id) && !/cpu|processor|chip|soc_|scheda|board|inverter|batter/.test(testoE(id)), perStanza: true },
  meteo: { cat: "clima", nome: "Meteo", ic: "meteo", auto: (id) => dom(id) === "weather" || id === "sun.sun",
    campi: [["meteo", "Entità meteo", "weather"], ["temperatura", "Temperatura esterna", "numerico"], ["umidita", "Umidità", "numerico"], ["vento", "Vento", "numerico"], ["pioggia", "Pioggia", "numerico"], ["pressione", "Pressione", "numerico"], ["uv", "Indice UV", "numerico"]] },
  termica: { cat: "clima", nome: "Gestione termica", ic: "clima", auto: (id) => dom(id) === "water_heater" || /caldaia|boiler|pompa.?di.?calore|heat.?pump|mandata|ritorno|puffer|solare.?termico|scaldabagno|termostufa|stufa|camino|pellet/.test(testoE(id)),
    campi: [["caldaia", "Caldaia o pompa di calore", "tutte"], ["mandata", "Temperatura di mandata", "numerico"], ["ritorno", "Temperatura di ritorno", "numerico"], ["puffer", "Accumulo / puffer", "numerico"], ["solare", "Solare termico", "numerico"], ["acs", "Acqua calda sanitaria", "numerico"]] },
  piscina: { cat: "clima", nome: "Piscina", ic: "piscina", auto: (id) => /pool|piscin|\bph\b|_ph_|cloro|chlorine|\borp\b|redox|skimmer/.test(testoE(id)),
    campi: [["temp_acqua", "Temperatura dell'acqua", "numerico"], ["pompa", "Pompa", "comando"], ["ph", "pH", "numerico"], ["cloro", "Cloro o ORP", "numerico"], ["luce", "Luce", "comando"], ["robot", "Robot", "tutte"]] },
  irrigazione: { cat: "clima", nome: "Irrigazione", ic: "goccia", auto: (id) => dom(id) === "valve" || /irrig|sprinkler|gocciol|rain.?bird|opensprinkler|zona_irr|b.?hyve|gardena|rachio/.test(testoE(id)),
    campi: [["umidita_suolo", "Umidità del terreno", "numerico"], ["pioggia", "Sensore di pioggia", "sensore"], ["programma", "Programma o interruttore generale", "comando"]] },
  piante: { cat: "clima", nome: "Piante", ic: "pianta", auto: (id) => dom(id) === "plant" || (dom(id) === "sensor" && ["moisture", "conductivity"].includes(dc(id))) || /plant|piant|flower|miflora|fiore/.test(testoE(id)) },
  acqua_gas: { cat: "clima", nome: "Acqua e gas", ic: "rubinetto", auto: (id) => (dom(id) === "sensor" && (["water", "gas"].includes(dc(id)) || /m³|m3|^l$/i.test(unita(id)))) || (/perdit|leak|valvola.?(acqua|gas)|contatore.?(acqua|gas)|\bgas\b/.test(testoE(id)) && dom(id) !== "camera"),
    campi: [["acqua_oggi", "Acqua di oggi", "numerico"], ["acqua_totale", "Contatore acqua", "numerico"], ["gas_oggi", "Gas di oggi", "numerico"], ["gas_totale", "Contatore gas", "numerico"], ["perdita", "Sensore di perdita", "sensore"], ["valvola", "Valvola generale", "tutte"]] },
  // Casa
  luci: { cat: "casa", nome: "Luci", ic: "luci", auto: (id) => eLuce(id) && visibile(id), perStanza: true, gruppoLuci: true },
  finestre: { cat: "casa", nome: "Finestre", ic: "finestra", auto: (id) => (dom(id) === "cover" && visibile(id)) || (eApertura(id) && ["window", "opening"].includes(dc(id))), perStanza: true },
  elettrodomestici: { cat: "casa", nome: "Elettrodomestici", ic: "lavatrice", auto: (id) => !["camera", "update", "automation", "script", "scene"].includes(dom(id)) && /lavatric|washer|washing|lavastovigl|dishwasher|asciugatr|dryer|forno|oven|frigo|fridge|freezer|congelat|microonde|microwave|cappa|piano.?cottura|induz|bimby|thermomix|caffe|coffee|friggitric/.test(testoE(id)) },
  musica: { cat: "casa", nome: "Musica", ic: "media", auto: (id) => dom(id) === "media_player" && !/tv|televis/.test(testoE(id)) },
  radio: { cat: "casa", nome: "Radio", ic: "radio", auto: () => false, campi: [["lettore", "Su quale lettore suonare", "media"]], radio: true },
  sport: { cat: "casa", nome: "Sport", ic: "sport", auto: (id) => dom(id) === "sensor" && (attr(id, "team_name") != null || attr(id, "opponent_name") != null || /teamtracker|serie_a|calcio|partita|match_/.test(testoE(id))) },
  robot: { cat: "casa", nome: "Robot", ic: "robot", auto: (id) => ["vacuum", "lawn_mower"].includes(dom(id)) || /robot|roomba|roborock|dreame|deebot|ecovacs|tagliaerba|mower/.test(testoE(id)) && ["vacuum", "lawn_mower", "sensor", "select"].includes(dom(id)) },
  stampanti: { cat: "casa", nome: "Stampanti", ic: "stampante", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /printer|stampant|toner|\bink\b|inchiostro|cartridge|cartuccia|drum|brother|epson|canon|laserjet|deskjet|officejet|ecotank/.test(testoE(id)) },
  animali: { cat: "casa", nome: "Animali", ic: "zampa", auto: (id) => /\bcane\b|\bgatto\b|\bdog\b|\bcat\b|\bpet\b|lettiera|litter|mangiatoia|feeder|crocchet|tractive|petkit|catlink|fontanella|acquario|terrario/.test(testoE(id)) },
  batterie: { cat: "casa", nome: "Batterie", ic: "batteria", auto: (id) => dom(id) === "sensor" && dc(id) === "battery" && numE(id) != null, batterie: true },
  salute: { cat: "casa", nome: "Salute", ic: "cuore", auto: (id) => dom(id) === "sensor" && /passi|steps|heart|battito|frequenza.?cardiaca|sleep|sonno|weight|peso|spo2|ossigen|blood|pressione.?(min|max|arter)|calori|withings|fitbit|garmin/.test(testoE(id)) },
  prese: { cat: "casa", nome: "Prese", ic: "presa", auto: (id) => ePresa(id) && visibile(id), perStanza: true },
  // Sicurezza
  varchi: { cat: "sicurezza", nome: "Varchi", ic: "porte", auto: (id) => eApertura(id), perStanza: true },
  presenza: { cat: "sicurezza", nome: "Presenza", ic: "movimento", auto: (id) => dom(id) === "binary_sensor" && ["motion", "occupancy", "presence"].includes(dc(id)) && !accessorio(id), perStanza: true },
  apri_porte: { cat: "sicurezza", nome: "Apri porte e cancelli", ic: "cancello", auto: (id) => dom(id) === "lock" || (dom(id) === "cover" && ["gate", "garage", "door"].includes(dc(id))) || (["button", "switch", "script"].includes(dom(id)) && /cancell[oi]|\bgate\b|portone|garage|apriport|apri.?porta|serratura|basculante|pedonale/.test(testoE(id))) },
  citofono: { cat: "sicurezza", nome: "Citofono e posta", ic: "campanello", auto: (id) => /citofon|doorbell|campanell|intercom|videocitofono|posta|mailbox|cassetta/.test(testoE(id)) && dom(id) !== "update",
    campi: [["campanello", "Campanello (quando suonano)", "sensore"], ["telecamera", "Telecamera dell'ingresso", "tutte"], ["apri", "Tasto per aprire", "comando"], ["posta", "Sensore della cassetta della posta", "binario"]] },
  // Avvisi
  allerte: { cat: "avvisi", nome: "Allerte", ic: "allerta", auto: (id) => ["sensor", "binary_sensor", "geo_location"].includes(dom(id)) && /allert|alert|warning|meteoalarm|protezione.?civile|\bdpc\b|avviso.?meteo|terremot|earthquake|ingv|bollettino/.test(testoE(id)) },
  agenda: { cat: "avvisi", nome: "Agenda", ic: "calendario", auto: (id) => dom(id) === "calendar", agenda: true },
  // Alexa
  alexa: { cat: "alexa", nome: "Musica su Alexa", ic: "media", auto: (id) => dom(id) === "media_player" && /echo|alexa/.test(testoE(id)) },
  // Macchine e rete
  minipc: { cat: "rete", nome: "MiniPC e rete", ic: "computer", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /\bcpu\b|processor|memoria|memory|\bram\b|disk|disco|load_|uptime|system_monitor|glances|nas\b|synology|proxmox|router|\bwan\b|ping|speedtest|velocit.?(download|upload)|internet/.test(testoE(id)),
    campi: [["cpu", "Uso CPU", "numerico"], ["ram", "Uso memoria", "numerico"], ["disco", "Uso disco", "numerico"], ["temperatura", "Temperatura", "numerico"], ["internet", "Internet / WAN", "sensore"]] },
  non_connessi: { cat: "rete", nome: "Dispositivi non connessi", ic: "scollegato", auto: (id) => DOMINI_UTILI.includes(dom(id)) && st(id).state === "unavailable" && !accessorio(id), nonConnessi: true },
};
// sezioni che Nexalia ha già (con la loro vista) e dove stanno nell'editor
for (const [id, d] of Object.entries(SEZ_GEN)) if (!SCHEDE.find((x) => x.id === id)) SCHEDE.splice(SCHEDE.length - 1, 0, { id, nome: d.nome, ic: d.ic, gen: true });
SCHEDE.find((x) => x.id === "raccolta").nome = "Rifiuti";

// ------------------------------------------------------------------ dati di una sezione
const cfgGen = (id) => ((S.cfg.sez_gen || {})[id]) || {};
const miaSez = (id) => (S.cfg.mie_sezioni || []).find((x) => x.id === id);
function entitaGen(id) {
  const m = miaSez(id); if (m) return (m.entita || []).filter((x) => st(x));
  const d = SEZ_GEN[id], c = cfgGen(id);
  const esc_ = c.escluse || [];
  const auto = tutteId().filter((x) => okAuto(id, x));
  const campi = Object.values(c.campi || {}).filter((x) => x && st(x));
  return [...new Set([...campi, ...auto, ...(c.aggiunte || []).filter((x) => st(x))])].filter((x) => !esc_.includes(x) || campi.includes(x));
}
const nomeAreaDi = (id) => { const a = areaEntita(id); return (a && (S.aree.find((x) => x.id === a) || {}).nome) || "Senza stanza"; };

// ------------------------------------------------------------------ vista di una sezione nella plancia
function vGen(id) {
  const m = miaSez(id), d = SEZ_GEN[id] || { nome: m.nome, ic: m.icona || "stella" }, c = cfgGen(id);
  const ents = entitaGen(id);
  const campi = (d.campi || []).map(([k, n]) => [n, (c.campi || {})[k]]).filter(([, e]) => e && st(e));
  let h = `<section class="card"><div class="tit"><h2>${ico(d.ic)} ${esc(d.nome)}</h2><span class="dim">${ents.length} ${ents.length === 1 ? "entità" : "entità"}</span></div>`;
  if (campi.length) h += `<div class="kpi" style="--kcols:${Math.min(campi.length, 4)};margin:0 0 14px">${campi.map(([n, e]) => `<div><small>${esc(n)}</small><b>${esc(testoStato(e))}</b></div>`).join("")}</div>`;
  if (d.gruppoLuci && ents.length) h += `<div class="riga" style="margin-bottom:14px"><button class="btn a pic" data-gruppo="light" data-v="turn_on">Accendi tutte</button><button class="btn pic" data-gruppo="light" data-v="turn_off">Spegni tutte</button></div>`;
  if (d.radio) h += vistaRadio(id);
  else if (d.agenda) h += vistaAgenda(ents);
  else if (d.batterie) h += vistaBatterie(ents);
  else if (d.nonConnessi) h += vistaNonConnessi(ents);
  else if (id === "meteo") h += vistaMeteo(ents, c);
  else if (!ents.length) h += `<p class="mut">Non ho trovato niente per questa sezione. Puoi aggiungere le entità in Impostazioni › ${esc(d.nome)}.</p>`;
  else if (d.perStanza) { const g = {}; for (const e of ents) (g[nomeAreaDi(e)] = g[nomeAreaDi(e)] || []).push(e); h += Object.entries(g).sort((a, b) => (a[0] === "Senza stanza") - (b[0] === "Senza stanza") || a[0].localeCompare(b[0])).map(([a, l]) => `<div class="gruppo">${esc(a)}</div><div class="tessere">${l.map(tessera).join("")}</div>`).join(""); }
  else h += `<div class="tessere">${ents.map(tessera).join("")}</div>`;
  return h + `</section>`;
}
function perDispositivo(ents) {
  const g = new Map();
  for (const e of ents) { const en = S.entita.find((x) => x.id === e), dv = en && en.dispositivo && (S.dispositivi || []).find((x) => x.id === en.dispositivo); const k = dv ? dv.id : e; if (!g.has(k)) g.set(k, { nome: dv ? dv.nome || nomeE(e) : nomeE(e), modello: dv ? [dv.produttore, dv.modello].filter(Boolean).join(" ") : e, ents: [], area: nomeAreaDi(e) }); g.get(k).ents.push(e); }
  return [...g.values()];
}
function vistaNonConnessi(ents) {
  const dv = perDispositivo(ents).sort((a, b) => Math.min(...b.ents.map((e) => new Date(st(e).last_changed))) - Math.min(...a.ents.map((e) => new Date(st(e).last_changed))));
  if (!dv.length) return '<p class="mut">Tutti i dispositivi rispondono.</p>';
  return `<p class="mut">${dv.length} ${dv.length === 1 ? "dispositivo non risponde" : "dispositivi non rispondono"} (${ents.length} entità).</p><table>${dv.map((x) => { const da = new Date(Math.min(...x.ents.map((e) => new Date(st(e).last_changed)))); return `<tr><td><b>${esc(x.nome)}</b><div class="dim" style="font-size:12px">${esc(x.modello)} · ${esc(x.area)} · ${x.ents.length} entità</div></td><td class="dim" style="white-space:nowrap">da ${esc(da.toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }))}</td></tr>`; }).join("")}</table>`;
}
function vistaMeteo(ents, c) {
  const w = (c.campi || {}).meteo && st(c.campi.meteo) ? c.campi.meteo : ents.find((e) => dom(e) === "weather");
  if (!w) return '<p class="mut">Nessuna entità meteo.</p>';
  const m = datiMeteo(), fc = attr(w, "forecast") || [];
  return `<div class="meteo-big">${ico("meteo", "l")}<b>${m.temp != null ? fmt1(m.temp) + "°" : "—"}</b><span>${esc(METEO[st(w).state] || st(w).state)}</span></div>
    <div class="intest-chip" style="justify-content:flex-start;margin:10px 0">${m.umid != null ? `<span>${ico("goccia", "s")} ${Math.round(m.umid)}%</span>` : ""}${m.vento != null ? `<span>${ico("vento", "s")} ${fmt1(m.vento)} ${esc(m.uVento)}</span>` : ""}${attr(w, "pressure") != null ? `<span>${fmt1(attr(w, "pressure"))} hPa</span>` : ""}${st("sun.sun") ? `<span>${ico("solare", "s")} ${st("sun.sun").state === "above_horizon" ? "Tramonto" : "Alba"} ${esc(new Date(attr("sun.sun", st("sun.sun").state === "above_horizon" ? "next_setting" : "next_rising")).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }))}</span>` : ""}</div>
    ${fc.length ? `<div class="previsioni">${fc.slice(0, 7).map((f) => `<div><small>${esc(new Date(f.datetime).toLocaleDateString("it-IT", { weekday: "short" }))}</small>${ico(/rain|pour/.test(f.condition) ? "pioggia" : "meteo")}<b>${f.temperature != null ? Math.round(f.temperature) + "°" : ""}</b><span>${f.templow != null ? Math.round(f.templow) + "°" : ""}</span></div>`).join("")}</div>` : ""}
    <div class="tessere" style="margin-top:12px">${ents.filter((e) => dom(e) !== "weather" && e !== "sun.sun").map(tessera).join("")}</div>`;
}
function vistaAgenda(cals) {
  if (!cals.length) return '<p class="mut">Nessun calendario in Home Assistant.</p>';
  return cals.map((id) => { const t = attr(id, "start_time"), msg = attr(id, "message"); return `<div class="voce-imp">${ico("calendario")}<div><b>${esc(msg || "Niente in programma")}</b><small>${esc(nomeE(id))}${t ? " · " + esc(new Date(String(t).replace(" ", "T")).toLocaleString("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })) : ""}${attr(id, "location") ? " · " + esc(attr(id, "location")) : ""}</small></div>${st(id).state === "on" ? '<span class="badge blu">adesso</span>' : ""}</div>`; }).join("");
}
function vistaBatterie(ents) {
  const s = Number((cfgGen("batterie").extra || {}).soglia) || 20;
  const l = [...ents].sort((a, b) => numE(a) - numE(b));
  return l.length ? `<p class="mut">Sotto il ${s}% sono in evidenza.</p>${l.map((e) => { const v = numE(e); return `<div class="batt-riga ${v <= s ? "bassa" : ""}"><span>${esc(nomeE(e))}<small>${esc(nomeAreaDi(e))}</small></span><div class="barra-b"><i style="width:${Math.max(2, Math.min(100, v))}%"></i></div><b>${Math.round(v)}%</b></div>`; }).join("")}` : '<p class="mut">Nessuna batteria.</p>';
}
function vistaRadio(id) {
  const c = cfgGen(id), lett = (c.campi || {}).lettore, stz = (c.extra || {}).stazioni || [];
  if (!lett || !st(lett)) return '<p class="mut">Scegli il lettore in Impostazioni › Radio.</p>';
  return `<div class="tessere" style="margin-bottom:14px">${tessera(lett)}</div>${stz.length ? `<div class="azioni-rapide">${stz.map((s, i) => `<button class="az-rapida" data-nx-radio="${i}">${ico("radio")}<span>${esc(s.nome)}</span></button>`).join("")}</div>` : '<p class="mut">Aggiungi le stazioni in Impostazioni › Radio.</p>'}`;
}
const _disegna0 = disegna;
disegna = function () {
  if (!S.cfg) return;
  if (!SEZ_GEN[S.scheda] && !miaSez(S.scheda)) return _disegna0();
  const att = document.activeElement, idAtt = att && att.id;
  $("#vista").innerHTML = vGen(S.scheda);
  if (idAtt && document.getElementById(idAtt)) document.getElementById(idAtt).focus();
};

// ------------------------------------------------------------------ le tue sezioni (diventano schede)
function allineaMie() {
  for (let i = SCHEDE.length - 1; i >= 0; i--) if (SCHEDE[i].mia) SCHEDE.splice(i, 1);
  for (const m of (S.cfg && S.cfg.mie_sezioni) || []) SCHEDE.splice(SCHEDE.length - 1, 0, { id: m.id, nome: m.nome, ic: m.icona || "stella", mia: true });
}
const _disegnaSchede0 = disegnaSchede;
disegnaSchede = function () { allineaMie(); applicaMuro(); _disegnaSchede0(); };

// ------------------------------------------------------------------ plancia a muro (per apparecchio)
const muroCfg = () => { try { return JSON.parse(localStorage.getItem("nx_muro") || "{}"); } catch (e) { return {}; } };
const salvaMuro = (m) => { localStorage.setItem("nx_muro", JSON.stringify(m)); applicaMuro(true); };
let tRiposo = null;
function applicaMuro(cambio) {
  const m = muroCfg();
  document.body.classList.toggle("muro", !!m.on);
  if (m.on && m.vista && cambio) { S.scheda = m.vista; localStorage.setItem("nx_scheda", m.vista); }
  let sv = document.getElementById("salvaschermo");
  if (!m.on) { if (sv) sv.remove(); clearTimeout(tRiposo); return; }
  if (!sv) { sv = document.createElement("div"); sv.id = "salvaschermo"; sv.hidden = true; document.body.appendChild(sv); }
  riarmaRiposo();
}
function riarmaRiposo() {
  const m = muroCfg(); clearTimeout(tRiposo);
  const sv = document.getElementById("salvaschermo"); if (sv && !sv.hidden) sv.hidden = true;
  if (!m.on || !(Number(m.riposo) > 0)) return;
  tRiposo = setTimeout(() => { const s = document.getElementById("salvaschermo"); if (!s) return; s.hidden = false; disegnaRiposo(); if (m.vista && S.scheda !== m.vista) vai(m.vista); }, Number(m.riposo) * 60000);
}
function disegnaRiposo() {
  const s = document.getElementById("salvaschermo"); if (!s || s.hidden) return;
  const m = muroCfg(), d = new Date(), h = d.getHours();
  const notte = m.notte_da != null && m.notte_a != null && m.notte_da !== "" && (Number(m.notte_da) > Number(m.notte_a) ? h >= m.notte_da || h < m.notte_a : h >= m.notte_da && h < m.notte_a);
  const mt = datiMeteo();
  s.style.setProperty("--luce", notte ? (Number(m.luce_notte) || 20) / 100 : 1);
  s.innerHTML = `<div class="ss-ora">${ora(d)}</div><div class="ss-data">${d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</div>${mt.temp != null ? `<div class="ss-meteo">${ico("meteo")} ${fmt1(mt.temp)}° · ${esc(METEO[mt.cond] || mt.cond || "")}</div>` : ""}<div class="ss-tocca">Tocca per tornare alla plancia</div>`;
}
setInterval(disegnaRiposo, 20000);
let ignoraClicFino = 0;
["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => document.addEventListener(t, (ev) => { const s = document.getElementById("salvaschermo"); if (s && !s.hidden) { ev.preventDefault(); ev.stopPropagation(); ignoraClicFino = Date.now() + 700; s.hidden = true; if (!muroCfg().on) s.remove(); } riarmaRiposo(); }, { capture: true, passive: false }));
document.addEventListener("click", (ev) => { if (Date.now() < ignoraClicFino) { ev.preventDefault(); ev.stopPropagation(); } }, true);

// ------------------------------------------------------------------ pagine dell'editor
let nuovaMia = { nome: "", icona: "stella" };
const visTg = (id) => interruttore((S.cfg.sezioni || []).includes(id), `data-sezione="${id}"`, "Sezione visibile nella plancia", "Accesa, la sezione compare nella barra in alto");
function pannelloGen(id) {
  const d = SEZ_GEN[id], c = cfgGen(id);
  const auto = tutteId().filter((x) => okAuto(id, x)).sort();
  const escl = c.escluse || [], agg = (c.aggiunte || []);
  const filtri = [...new Set((d.campi || []).map((x) => x[2]))];
  return `${filtri.map(datalist).join("")}${datalist("tutte")}
    ${visTg(id)}
    ${(d.campi || []).length ? `<div class="gruppo">Entità principali</div><div class="griglia">${d.campi.map(([k, n, f]) => campoEnt(`sez_gen.${id}.campi.${k}`, n, f)).join("")}</div>` : ""}
    ${d.radio ? pannelloRadio(id) : ""}
    ${d.batterie ? `<div class="gruppo">Soglia</div><label class="campo">Batterie in evidenza sotto il (%)<input type="number" min="1" max="99" data-nx-cfg="sez_gen.batterie.extra.soglia" data-num value="${esc((c.extra || {}).soglia || 20)}"></label>` : ""}
    ${d.radio ? "" : `<div class="gruppo">Trovate da sola (${auto.length})</div><p class="mut">Nexalia le riconosce dal tipo e dal nome. Togli quelle che non c'entrano.</p>
    ${auto.slice(0, 80).map((e) => `<div class="voce-imp ${escl.includes(e) ? "spenta" : ""}">${ico(iconaE(e))}<div><b>${esc(nomeE(e))}</b><small>${esc(e)} · ${esc(testoStato(e))}</small></div><button class="btn pic ${escl.includes(e) ? "" : "r"}" data-nx-gen-escl="${id}|${e}">${escl.includes(e) ? "Rimetti" : "Togli"}</button></div>`).join("") || '<p class="dim">Nessuna.</p>'}${auto.length > 80 ? `<p class="dim">…e altre ${auto.length - 80}.</p>` : ""}`}
    <div class="gruppo">Aggiunte da te</div>
    ${agg.map((e, i) => `<div class="voce-imp">${ico(st(e) ? iconaE(e) : "sensore")}<div><b>${esc(st(e) ? nomeE(e) : e)}</b><small>${esc(e)}</small></div><button class="btn pic r" data-nx-del="sez_gen.${id}.aggiunte" data-i="${i}" aria-label="Togli">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><input type="text" id="nxGenAdd" list="dl-tutte" placeholder="Scegli un'entità: dominio.nome" style="flex:1;min-width:200px" autocomplete="off"><button class="btn pic p" data-nx-gen-add="${id}">＋ Aggiungi un'entità</button></div>`;
}
function pannelloRadio(id) {
  const stz = (cfgGen(id).extra || {}).stazioni || [];
  return `<div class="gruppo">Stazioni</div>${stz.map((s, i) => `<div class="voce-imp">${ico("radio")}<div><b>${esc(s.nome)}</b><small>${esc(s.url)}</small></div><button class="btn pic r" data-nx-del="sez_gen.radio.extra.stazioni" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><input type="text" id="nxRadioNome" placeholder="Nome (es. Radio 105)" style="flex:1;min-width:140px"><input type="text" id="nxRadioUrl" placeholder="Indirizzo dello streaming (https://…)" style="flex:2;min-width:200px"><button class="btn pic p" data-nx-radio-add>＋ Aggiungi stazione</button></div>`;
}
function pannelloAutomazioni() {
  const au = tutteId().filter((id) => dom(id) === "automation").sort((a, b) => nomeE(a).localeCompare(nomeE(b)));
  const on = au.filter((id) => st(id).state === "on").length;
  return `${visTg("scenari")}
    <p class="mut">Le automazioni di Home Assistant: le accendi e le spegni da qui, e le esegue Home Assistant anche a plancia chiusa. Quelle nuove le crei nella sezione Scenari, partendo da un modello pronto.</p>
    <div class="riga" style="margin:10px 0 14px"><button class="btn p pic" data-nx-vai="scenari">${ico("scenari", "s")}Crea uno scenario</button><span class="dim">${on} accese su ${au.length}</span></div>
    ${au.length ? `<div class="tessere">${au.map(tessera).join("")}</div>` : '<p class="dim">Nessuna automazione.</p>'}`;
}
function pannelloMuro() {
  const m = muroCfg();
  const viste = schedeAttive().filter((s) => s.id !== "impostazioni");
  return `<p class="mut" style="margin-top:0">Per un tablet appeso al muro. Vale solo su questo apparecchio: ogni tablet ha le sue impostazioni.</p>
    ${interruttore(!!m.on, "data-nx-muro-on", "Usa questa plancia a muro", "La barra delle sezioni si nasconde e la plancia resta sulla pagina scelta")}
    <div class="gruppo">Pagina da mostrare</div>
    <div class="scelte">${viste.map((s) => `<button class="${m.vista === s.id ? "on" : ""}" data-nx-muro-set="vista" data-v="${s.id}">${ico(s.ic, "s")}${esc(s.nome)}</button>`).join("")}</div>
    <div class="gruppo">Riposo</div>
    <div class="griglia">
      <label class="campo">Dopo quanti minuti senza tocchi parte l'orologio<span>0 = mai</span><input type="number" min="0" max="120" id="nxMuroRiposo" value="${esc(m.riposo ?? 5)}"></label>
      <label class="campo">Notte: dalle ore<select id="nxMuroDa"><option value="">Mai</option>${Array.from({ length: 24 }, (_, i) => `<option value="${i}" ${String(m.notte_da) === String(i) ? "selected" : ""}>${String(i).padStart(2, "0")}:00</option>`).join("")}</select></label>
      <label class="campo">alle ore<select id="nxMuroA">${Array.from({ length: 24 }, (_, i) => `<option value="${i}" ${String(m.notte_a ?? 7) === String(i) ? "selected" : ""}>${String(i).padStart(2, "0")}:00</option>`).join("")}</select></label>
      <label class="campo">Luminosità dell'orologio di notte (%)<input type="number" min="5" max="100" id="nxMuroLuce" value="${esc(m.luce_notte ?? 20)}"></label>
    </div>
    <div class="riga" style="margin-top:12px"><button class="btn p" data-nx-muro-salva>Salva</button><button class="btn pic" data-nx-muro-prova>${ico("orologio", "s")}Prova l'orologio</button></div>`;
}
function pannelloMie() {
  const mie = S.cfg.mie_sezioni || [];
  return `${datalist("tutte")}<p class="mut" style="margin-top:0">Sezioni tue, con le entità che scegli tu. Compaiono nella barra in alto come le altre.</p>
    ${mie.map((m, i) => `<div class="ed-box" style="margin-bottom:10px"><div class="voce-imp" style="border:0;padding-top:0">${ico(m.icona || "stella")}<div><b>${esc(m.nome)}</b><small>${(m.entita || []).length} entità</small></div>${interruttore((S.cfg.sezioni || []).includes(m.id), `data-sezione="${m.id}"`, "Visibile")}<button class="btn pic r" data-nx-mia-del="${i}" aria-label="Elimina sezione">${ico("cestino", "s")}</button></div>
      ${(m.entita || []).map((e, j) => `<div class="voce-imp">${ico(st(e) ? iconaE(e) : "sensore")}<div><b>${esc(st(e) ? nomeE(e) : e)}</b><small>${esc(e)}</small></div><button class="btn pic r" data-nx-mia-ent-del="${i}|${j}" aria-label="Togli">${ico("cestino", "s")}</button></div>`).join("") || '<p class="dim">Sezione vuota: aggiungi un\'entità qui sotto.</p>'}
      <div class="riga" style="margin-top:8px"><input type="text" id="nxMiaEnt${i}" list="dl-tutte" placeholder="dominio.nome" style="flex:1;min-width:180px" autocomplete="off"><button class="btn pic" data-nx-mia-ent-add="${i}">＋ Aggiungi un'entità</button></div></div>`).join("")}
    <div class="ed-box"><b>Nuova sezione</b><div class="griglia" style="margin-top:10px"><label class="campo">Nome<input type="text" id="nxMiaNome" maxlength="24" placeholder="Es. Giardino"></label></div>
      <div class="gruppo">Icona</div><div class="icone-sel">${ICONE_SCELTA.concat(["pianta", "auto", "zampa", "piscina", "computer", "sport"]).map((k) => `<button class="${nuovaMia.icona === k ? "on" : ""}" data-nx-mia-icona="${k}" aria-label="Icona ${k}">${ico(k)}</button>`).join("")}</div>
      <div class="riga" style="margin-top:12px"><button class="btn p" data-nx-mia-add>＋ Aggiungi sezione</button></div></div>`;
}
function pannelloRuntime() {
  const n = Object.keys(S.stati).length, nd = tutteId().filter((id) => st(id).state === "unavailable").length;
  const righe = [["Nexalia", S.versione], ["Home Assistant", ((S.haConfig || {}).versione || "") + (S.collegato ? " · collegato" : " · NON collegato")], ["Casa", (S.haConfig || {}).nome || ""], ["Fuso orario", (S.haConfig || {}).fuso || ""],
    ["Entità", n + " (" + nd + " non disponibili)"], ["Aree", S.aree.length], ["Dispositivi", (S.dispositivi || []).length], ["Licenza", S.cfg.licenza.completa ? "completa" : "base"],
    ["Utente", (S.utente && (S.utente.visibile || S.utente.nome)) || "—"], ["Sezioni visibili", schedeAttive().length], ["Voci nel diario", (S.diario || []).length],
    ["Aggiornamento", S.aggiornamento ? "disponibile la " + S.aggiornamento.versione : "nessuno"], ["Questo apparecchio", (navigator.userAgent.match(/(Android|iPhone|iPad|Windows|Mac OS X|Linux)/) || ["?"])[0] + " · " + innerWidth + "×" + innerHeight],
    ["Modo chiosco", localStorage.getItem("nx_chiosco") === "1" ? "acceso" : "spento"], ["Plancia a muro", muroCfg().on ? "accesa" : "spenta"]];
  return `<p class="mut" style="margin-top:0">Come sta girando la plancia adesso.</p><table>${righe.map((r) => `<tr><td>${r[0]}</td><td><b>${esc(String(r[1]))}</b></td></tr>`).join("")}</table>
    <div class="riga" style="margin-top:12px"><button class="btn pic" data-cerca-agg>Cerca aggiornamenti</button><button class="btn pic" data-nx-ricarica>Ricarica i dati</button></div>`;
}
const pannelliEsistenti = (B) => ({
  energia: { cat: "energia", ic: "energia", tit: "Energia", kw: "energia consumo fotovoltaico rete batteria contatore", html: () => visTg("energia") + B.energia.html() },
  stanze: { cat: "casa", ic: "stanze", tit: "Stanze", kw: "stanze aree", html: () => visTg("stanze") + B.stanze.html() },
  persone: { cat: "casa", ic: "persone", tit: "Persone", kw: "persone presenza chi è in casa", html: () => visTg("persone") + `<p class="mut">Nexalia mostra tutte le persone di Home Assistant (entità person.*) con dove sono e da quanto.</p><div class="tessere">${tutteId().filter((x) => dom(x) === "person").map(tessera).join("")}</div>` },
  sicurezza: { cat: "sicurezza", ic: "sicurezza", tit: "Sicurezza", kw: "sicurezza allarme antifurto telecamere", html: () => visTg("sicurezza") + `<p class="mut">L'antifurto (centrale, modalità, sirena, zona e tasti) si imposta in <a href="#" data-pannello="home">Impostazioni › Home</a>. Qui scegli se la sezione si vede.</p>` },
  raccolta: { cat: "avvisi", ic: "raccolta", tit: "Rifiuti", kw: "rifiuti raccolta differenziata calendario bidone", html: () => visTg("raccolta") + `<p class="mut">Il calendario della raccolta si compila nella sezione Rifiuti. L'ora dopo la quale la pastiglia annuncia il ritiro di domani è in <a href="#" data-pannello="home">Impostazioni › Home</a>.</p><div class="riga"><button class="btn p pic" data-nx-vai="raccolta">Apri il calendario</button></div>` },
  notifiche: { cat: "avvisi", ic: "campana", tit: "Notifiche", kw: "notifiche avvisi telefono app agente luci consumi finestre", html: () => B.agente.html() },
  avvisi_pers: { cat: "avvisi", ic: "allerta", tit: "Avvisi personalizzati", kw: "avvisi personalizzati soglia batterie allagamenti fumo", html: () => `${datalist("tutte")}${interruttore((S.cfg.widget || {}).popup_avvisi !== false, 'data-nx-tg="widget.popup_avvisi"', "Avvisi a finestra", "Quando un avviso si accende la plancia lo apre da sola")}${htmlAvvisi()}` },
});
const ORDINE_ED = ["generali", "home", "widget", "azioni", "automazioni", "muro", "entita", "mie", "nascosti", "backup", "runtime", "licenza", "fuori",
  "energia", "accumulo", "veicoli", "ups",
  "clima", "temperatura", "meteo", "termica", "piscina", "irrigazione", "piante", "acqua_gas",
  "stanze", "luci", "finestre", "elettrodomestici", "musica", "radio", "sport", "robot", "stampanti", "animali", "persone", "batterie", "salute", "prese",
  "sicurezza", "varchi", "presenza", "apri_porte", "citofono",
  "allerte", "agenda", "raccolta", "notifiche", "avvisi_pers",
  "alexa", "minipc", "non_connessi"];
const _pannelliEd = pannelli;
pannelli = function () {
  const B = _pannelliEd();
  const T = { ...B, ...pannelliEsistenti(B) };
  T.automazioni = { cat: "plancia", ic: "scenari", tit: "Automazioni", kw: "automazioni scenari modelli accendi spegni", html: pannelloAutomazioni };
  T.muro = { cat: "plancia", ic: "muro", tit: "A muro", kw: "muro tablet parete riposo notte luminosità orologio", html: pannelloMuro };
  T.mie = { cat: "plancia", ic: "stella", tit: "Le tue sezioni", kw: "sezioni personali mie nuove", html: pannelloMie };
  T.runtime = { cat: "plancia", ic: "aiuto", tit: "Runtime", kw: "runtime versione stato diagnostica", html: pannelloRuntime };
  if (T.entita) Object.assign(T.entita, { cat: "plancia", tit: "Le tue entità" });
  for (const k of ["nascosti", "backup", "licenza", "fuori"]) if (T[k]) T[k].cat = "plancia";
  if (T.nascosti) T.nascosti.tit = "Dispositivi nascosti";
  for (const [id, d] of Object.entries(SEZ_GEN)) T[id] = { cat: d.cat, ic: d.ic, tit: d.nome, kw: d.nome + " " + (d.campi || []).map((x) => x[1]).join(" "), html: () => pannelloGen(id) };
  const out = {};
  for (const k of ORDINE_ED) if (T[k]) out[k] = T[k];
  return out;
};

// ------------------------------------------------------------------ eventi
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button,a[data-pannello]"); if (!t) return;
  const d = t.dataset;
  if (t.tagName === "A" && d.pannello) { ev.preventDefault(); pannello = d.pannello; localStorage.setItem("nx_pannello", pannello); return disegna(); }
  if (d.nxGenEscl) { const [id, e] = d.nxGenEscl.split("|"); const l = [...(cfgGen(id).escluse || [])]; const i = l.indexOf(e); if (i >= 0) l.splice(i, 1); else l.push(e); await impostaCfg(`sez_gen.${id}.escluse`, l); return disegna(); }
  if (d.nxGenAdd) { const e = $("#nxGenAdd").value.trim(); if (!st(e)) return avviso("Scegli un'entità che esiste", "err"); const l = cfgGen(d.nxGenAdd).aggiunte || []; if (!l.includes(e)) await impostaCfg(`sez_gen.${d.nxGenAdd}.aggiunte`, [...l, e]); return disegna(); }
  if (d.nxRadioAdd !== undefined) { const nome = $("#nxRadioNome").value.trim(), url = $("#nxRadioUrl").value.trim(); if (!nome || !/^https?:\/\//.test(url)) return avviso("Servono nome e indirizzo http(s)", "err"); await impostaCfg("sez_gen.radio.extra.stazioni", [...((cfgGen("radio").extra || {}).stazioni || []), { nome, url }]); return disegna(); }
  if (d.nxRadio !== undefined) { const c = cfgGen("radio"), s = ((c.extra || {}).stazioni || [])[Number(d.nxRadio)], l = (c.campi || {}).lettore; if (!s || !l) return; chiama("media_player", "play_media", { entity_id: l, media_content_id: s.url, media_content_type: "music" }); return avviso("In onda: " + s.nome, "ok"); }
  if (d.nxMiaIcona) { nuovaMia.icona = d.nxMiaIcona; t.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === t)); return; }
  if (d.nxMiaAdd !== undefined) { const nome = $("#nxMiaNome").value.trim(); if (!nome) return avviso("Dai un nome alla sezione", "err"); const id = "mia_" + Date.now().toString(36); await salvaCfg({ mie_sezioni: [...(S.cfg.mie_sezioni || []), { id, nome, icona: nuovaMia.icona, entita: [] }], sezioni: [...(S.cfg.sezioni || []), id] }); nuovaMia = { nome: "", icona: "stella" }; disegnaSchede(); return disegna(); }
  if (d.nxMiaDel !== undefined) { const m = [...(S.cfg.mie_sezioni || [])], x = m.splice(Number(d.nxMiaDel), 1)[0]; await salvaCfg({ mie_sezioni: m, sezioni: (S.cfg.sezioni || []).filter((s) => s !== (x && x.id)) }); disegnaSchede(); return disegna(); }
  if (d.nxMiaEntAdd !== undefined) { const i = Number(d.nxMiaEntAdd), e = $("#nxMiaEnt" + i).value.trim(); if (!st(e)) return avviso("Scegli un'entità che esiste", "err"); const m = JSON.parse(JSON.stringify(S.cfg.mie_sezioni || [])); if (!m[i].entita.includes(e)) m[i].entita.push(e); await salvaCfg({ mie_sezioni: m }); return disegna(); }
  if (d.nxMiaEntDel) { const [i, j] = d.nxMiaEntDel.split("|").map(Number); const m = JSON.parse(JSON.stringify(S.cfg.mie_sezioni || [])); m[i].entita.splice(j, 1); await salvaCfg({ mie_sezioni: m }); return disegna(); }
  if (d.nxMuroOn !== undefined) { const m = muroCfg(); m.on = !m.on; if (m.on && !m.vista) m.vista = "agente"; salvaMuro(m); disegnaSchede(); return disegna(); }
  if (d.nxMuroSet) { const m = muroCfg(); m[d.nxMuroSet] = d.v; salvaMuro(m); return disegna(); }
  if (d.nxMuroSalva !== undefined) { const m = muroCfg(); m.riposo = Number($("#nxMuroRiposo").value) || 0; m.notte_da = $("#nxMuroDa").value === "" ? "" : Number($("#nxMuroDa").value); m.notte_a = Number($("#nxMuroA").value); m.luce_notte = Number($("#nxMuroLuce").value) || 20; salvaMuro(m); return avviso("Salvato su questo apparecchio", "ok"); }
  if (d.nxMuroProva !== undefined) { let s = document.getElementById("salvaschermo"); if (!s) { s = document.createElement("div"); s.id = "salvaschermo"; document.body.appendChild(s); } setTimeout(() => { s.hidden = false; disegnaRiposo(); }, 50); return; }
  if (d.nxRicarica !== undefined) { await carica(); return avviso("Dati ricaricati", "ok"); }
});
