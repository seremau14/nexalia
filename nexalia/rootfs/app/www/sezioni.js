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
// filtri in più per le caselle
Object.assign(FILTRI_ENT, {
  camera: (id) => ["camera", "image"].includes(dom(id)),
  tracker: (id) => ["device_tracker", "person", "sensor"].includes(dom(id)),
  persona: (id) => dom(id) === "person",
  todo: (id) => dom(id) === "todo",
  irriga: (id) => ["switch", "valve", "input_boolean", "script"].includes(dom(id)),
  echo: (id) => dom(id) === "media_player",
  qualsiasi: () => true,
});

// ------------------------------------------------------------------ le sezioni, con le caselle di ogni pagina
// tipo di una casella: nome di un filtro (entità) oppure t testo, n numero, a stanza, c sì/no, h ora, col colore, s:k=Etichetta|k2=Etichetta2 scelta
const E = (k, n, f = "qualsiasi", nota = "") => [k, n, f, nota];
const SEZ_GEN = {
  // ---- Energia
  accumulo: { cat: "energia", nome: "Batteria di accumulo", ic: "batteria", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /accumul|storage|luna2000|powerwall|battery_soc|batteria_(casa|accumulo)|home_battery|\bbms\b/.test(testoE(id)),
    nota: "Facoltativa. Una batteria che parla attraverso l'inverter (per esempio Huawei LUNA2000) non ha un BMS da scegliere: stato di carica e potenza si mettono in Energia.",
    elementi: { nome: "pacco", campi: [E("soc", "Stato di carica (%)", "numerico"), E("potenza", "Potenza (W)", "numerico"), E("tensione", "Tensione (V)", "numerico"), E("corrente", "Corrente (A)", "numerico"), E("temperatura", "Temperatura", "numerico"), E("cella_min", "Cella più bassa (V)", "numerico"), E("cella_max", "Cella più alta (V)", "numerico"), E("cicli", "Cicli", "numerico"), E("stato", "Stato del BMS", "sensore")] } },
  veicoli: { cat: "energia", nome: "Veicoli", ic: "auto", auto: (id) => ["sensor", "binary_sensor", "device_tracker", "lock", "climate", "switch", "number", "button"].includes(dom(id)) && /\b(car|ev|tesla|kia|hyundai|renault|zoe|bmw|volkswagen|vw|leaf|leapmotor|byd|polestar|volvo|audi|mercedes|peugeot|fiat|toyota|skoda|cupra|seat|mg4|ioniq|niro|enyaq)\b|vettura|veicolo|autonomia|odometer|chilometr|contachilometri|wallbox|colonnina|evcc|easee|zappi/.test(testoE(id)),
    elementi: { nome: "veicolo", campi: [["tipo", "Tipo", "s:auto=Auto|moto=Moto"], ["motore", "Motore", "s:elettrica=Elettrica|termica=Termica (benzina, diesel, GPL)|ibrida=Ibrida plug-in"], ["capacita", "Capacità della batteria (kWh)", "n", "Serve a stimare quanto manca alla fine della carica. Vuota = 70"], ["immagine", "Immagine", "t", "Percorso /local o entità image, es. /local/auto.png"], ["immagine_carica", "Immagine durante la ricarica", "t"],
      E("batteria", "Batteria (%)", "numerico"), E("autonomia", "Autonomia (km)", "numerico"), E("odometro", "Contachilometri (km)", "numerico"), E("stato_ricarica", "Stato della ricarica", "sensore"), E("cavo", "Cavo collegato", "binario"), E("potenza_carica", "Potenza di ricarica (kW)", "numerico"), E("fine_carica", "Tempo alla fine della ricarica (min)", "numerico"), E("target", "Limite di carica (%)"), E("comando_ricarica", "Comando della ricarica", "comando"),
      E("carburante", "Livello carburante (%)", "numerico"), E("autonomia_carb", "Autonomia a carburante (km)", "numerico"), E("motore_acceso", "Motore acceso", "sensore"), E("portiere", "Portiere", "qualsiasi"), E("finestrini", "Finestrini", "sensore"), E("bagagliaio", "Bagagliaio", "sensore"), E("cofano", "Cofano", "sensore"), E("posizione", "Posizione", "tracker"), E("allarme", "Allarme dell'auto"),
      E("batteria12", "Batteria di servizio 12 V", "numerico"), E("gomma_as", "Pressione gomma anteriore sinistra", "numerico"), E("gomma_ad", "Pressione gomma anteriore destra", "numerico"), E("gomma_ps", "Pressione gomma posteriore sinistra", "numerico"), E("gomma_pd", "Pressione gomma posteriore destra", "numerico"),
      E("temp_batteria", "Temperatura della batteria", "numerico"), E("temp_abitacolo", "Temperatura nell'abitacolo", "numerico"), E("clima", "Clima dell'auto", "comando"), E("consumo_medio", "Consumo medio (kWh/100 km)", "numerico"), E("ultimo_viaggio", "Ultimo viaggio (km)", "numerico"),
      E("evcc_modo", "Modalità di ricarica EVCC"), E("sessione", "Energia della sessione (kWh)", "numerico"), E("quota_sole", "Quota solare della sessione (%)", "numerico"), E("wallbox_potenza", "Potenza wallbox (W)", "numerico"), E("wallbox_oggi", "Energia wallbox oggi (kWh)", "numerico"), E("aggiornato", "Ultimo aggiornamento dell'auto", "sensore")] } },
  ups: { cat: "energia", nome: "UPS", ic: "ups", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /\bups\b|nut_|_ups_|apc_|eaton|riello|cyberpower/.test(testoE(id)) && !/pop.?ups|follow.?ups/.test(testoE(id)),
    elementi: { nome: "UPS", campi: [E("stato", "Stato dell'UPS", "sensore", "Le sigle di NUT (OL in linea, OB a batteria, LB batteria scarica) le legge da solo"), E("rete", "Presenza rete", "binario", "Un sensore acceso/spento, se ce l'hai separato dallo stato"), ["rete_invertita", "Il sensore dice il contrario (acceso = corrente NON c'è)", "c"], E("carica", "Carica della batteria (%)", "numerico"), E("carico", "Carico (%)", "numerico"), E("autonomia", "Autonomia residua", "numerico", "Quando la rete cade è il numero grande della tessera"), E("tensione", "Tensione di rete (V)", "numerico"), E("potenza", "Potenza assorbita (W)", "numerico"), E("temperatura", "Temperatura", "numerico")] } },
  // ---- Clima e acqua
  clima: { cat: "clima", nome: "Clima", ic: "clima", auto: (id) => ["climate", "fan", "humidifier", "water_heater"].includes(dom(id)) && visibile(id),
    elementi: { nome: "unità clima", campi: [["tipo", "Tipo", "s:freddo=Freddo|caldo=Caldo|pdc=Pompa di calore|deumidificatore=Deumidificatore|vmc=VMC"], E("entita", "Entità", "comando"), ["stanza", "Stanza", "a"], E("valvola", "Posizione della valvola termostatica (0-100)", "numerico"), ["tasto_modo", "Tasto rapido: modalità", "s:=Non toccare|cool=Raffrescamento|heat=Riscaldamento|heat_cool=Automatico caldo/freddo|auto=Automatico|dry=Deumidificazione|fan_only=Solo ventola"], ["tasto_temp", "Tasto rapido: temperatura", "n"], ["tasto_ventola", "Tasto rapido: ventola", "s:=Non toccare|auto=Automatica|low=Bassa|medium=Media|high=Alta"]] },
    opzioni: [["caldaie", "Caldaie (separate da virgola)", "t", "Interruttori o sensori che dicono quando la caldaia lavora, es. switch.caldaia"], ["pillola_caldaia", "Mostra «Caldaia accesa» nella Home", "c"], ["ambiente_grande", "Nelle card mostra grande la temperatura dell'ambiente (target sotto)", "c"]] },
  temperatura: { cat: "clima", nome: "Temperatura", ic: "termometro", auto: (id) => dom(id) === "sensor" && ["temperature", "humidity"].includes(dc(id)) && !accessorio(id) && !/cpu|processor|chip|soc_|scheda|board|inverter|batter/.test(testoE(id)), perStanza: true,
    elementi: { nome: "stanza", campi: [["stanza", "Stanza", "a"], ["nome_t", "Nome temperatura (facoltativo)", "t"], E("temperatura", "Entità temperatura", "numerico"), ["nome_u", "Nome umidità (facoltativo)", "t"], E("umidita", "Entità umidità", "numerico")] }, associa: true },
  meteo: { cat: "clima", nome: "Meteo", ic: "meteo", auto: (id) => dom(id) === "weather" || id === "sun.sun",
    campi: [E("meteo", "Entità meteo (weather)", "weather", "È la stessa della testata della Home"), E("temperatura", "Temperatura esterna", "numerico"), E("umidita", "Umidità", "numerico"), E("percepita", "Temperatura percepita", "numerico"), E("pressione", "Pressione", "numerico"), E("vento", "Velocità del vento", "numerico"), E("raffica", "Raffica", "numerico"), E("direzione", "Direzione del vento", "numerico"), E("pioggia", "Pioggia di oggi", "numerico"), E("intensita", "Intensità della pioggia", "numerico"), E("uv", "Indice UV", "numerico"), E("radiazione", "Radiazione solare", "numerico"), E("luminosita", "Luminosità", "numerico")],
    opzioni: [["radar", "Radar pioggia", "s:=Nessuno (il blocco non compare)|rainviewer=Servizio di mappe RainViewer, senza chiavi|camera=Camera di Home Assistant"], ["radar_camera", "Camera o immagine del radar", "camera"]], blocchi: ["adesso", "stazione", "ore", "giorni", "radar"], stazione: true },
  termica: { cat: "clima", nome: "Gestione termica", ic: "clima", auto: (id) => dom(id) === "water_heater" || /caldaia|boiler|pompa.?di.?calore|heat.?pump|mandata|ritorno|puffer|solare.?termico|scaldabagno|termostufa|stufa|camino|pellet/.test(testoE(id)),
    elementi: { nome: "impianto", campi: [["tipo", "Tipo", "s:solare=Solare termico|scaldabagno=Scaldabagno|caldaia=Caldaia|pellet=Stufa a pellet"], E("comando", "Comando (acceso/spento o termostato)", "comando"), E("potenza", "Potenza (W)", "numerico"), E("boiler", "Temperatura del boiler / accumulo", "numerico"), E("accumulo_basso", "Accumulo in basso", "numerico"), E("accumulo_alto", "Accumulo in alto", "numerico"), E("pannello", "Temperatura del pannello solare", "numerico"), E("delta", "ΔT solare", "numerico"), E("pompa", "Pompa solare / circolatore", "qualsiasi"), E("mandata", "Mandata", "numerico"), E("ritorno", "Ritorno", "numerico"), E("pressione", "Pressione", "numerico"), E("ricircolo", "Ricircolo", "qualsiasi"), E("boost", "Boost", "comando"), E("fiamma", "Fiamma / combustione", "sensore"), E("serbatoio", "Serbatoio pellet (%)", "numerico"), E("ventilatore", "Ventilatore", "qualsiasi"), E("allarme", "Allarme / errore", "sensore")] } },
  piscina: { cat: "clima", nome: "Piscina", ic: "piscina", auto: (id) => /pool|piscin|\bph\b|_ph_|cloro|chlorine|\borp\b|redox|skimmer/.test(testoE(id)),
    elementi: { nome: "piscina", campi: [E("temperatura", "Temperatura dell'acqua", "numerico"), E("ph", "pH", "numerico"), ["ph_min", "pH minimo", "n"], ["ph_max", "pH massimo", "n"], E("cloro", "Cloro / ORP", "numerico"), ["cloro_min", "Cloro minimo", "n"], ["cloro_max", "Cloro massimo", "n"], E("pompa", "Pompa", "comando"), E("riscaldamento", "Riscaldamento", "comando"), E("luce", "Luce", "comando"), ["filtra", "Filtrazione giornaliera attiva", "c", "La fa Nexalia, anche a plancia chiusa"], ["ore_auto", "Ore automatiche (temperatura ÷ 2)", "c"], ["ore", "Ore di filtrazione", "n"], ["ora_inizio", "Ora di inizio", "h"]] } },
  irrigazione: { cat: "clima", nome: "Irrigazione", ic: "goccia", auto: (id) => dom(id) === "valve" || /irrig|sprinkler|gocciol|rain.?bird|opensprinkler|zona_irr|b.?hyve|gardena|rachio/.test(testoE(id)),
    elementi: { nome: "zona", campi: [E("entita", "Interruttore o valvola della zona", "irriga"), ["stanza", "Zona / stanza", "a"], ["minuti", "Minuti", "n"]] },
    opzioni: [["attivo", "Programma attivo ogni giorno (lo fa Nexalia, anche a plancia chiusa)", "c"], ["orari", "Orari (separati da virgola, es. 06:30, 20:00)", "t"], ["prob_pioggia", "Probabilità di pioggia di oggi (%)", "numerico"], ["prob_max", "Salta se la pioggia è probabile almeno al (%)", "n"], ["umidita_suolo", "Sensore umidità del terreno", "numerico"], ["umid_min", "Umidità ideale minima (%)", "n"], ["umid_max", "Umidità ideale massima (%)", "n"], ["salta_sopra", "Salta il programma se l'umidità è ≥ (%)", "n"], ["avvia_sotto", "Avvia da solo se l'umidità è < (%)", "n"], ["meteo", "Meteo", "weather"]] },
  piante: { cat: "clima", nome: "Piante", ic: "pianta", auto: (id) => dom(id) === "plant" || (dom(id) === "sensor" && ["moisture", "conductivity"].includes(dc(id))) || /plant|piant|flower|miflora|fiore/.test(testoE(id)),
    elementi: { nome: "pianta", campi: [E("pianta", "Entità pianta (plant)", "qualsiasi"), ["stanza", "Stanza", "a"], E("umidita", "Umidità del terreno (%)", "numerico"), ["umid_min", "Umidità minima (%)", "n"], E("fertilita", "Fertilità / conducibilità", "numerico"), E("luce", "Luce (lx)", "numerico"), E("temperatura", "Temperatura", "numerico"), E("batteria", "Batteria del sensore", "numerico")] } },
  acqua_gas: { cat: "clima", nome: "Acqua e gas", ic: "rubinetto", auto: (id) => (dom(id) === "sensor" && (["water", "gas"].includes(dc(id)) || /m³|m3|^l$/i.test(unita(id)))) || (/perdit|leak|valvola.?(acqua|gas)|contatore.?(acqua|gas)|\bgas\b/.test(testoE(id)) && dom(id) !== "camera"),
    elementi: { nome: "contatore", campi: [["tipo", "Tipo", "s:acqua=Acqua|gas=Gas"], E("totale", "Contatore totale", "numerico"), E("oggi", "Consumo di oggi", "numerico"), E("mese", "Consumo del mese", "numerico"), E("portata", "Portata adesso", "numerico"), ["prezzo", "Prezzo per unità (€)", "n"], E("perdita", "Sensore di perdita", "binario"), E("valvola", "Valvola generale", "comando")] } },
  // ---- Casa
  luci: { cat: "casa", nome: "Luci", ic: "luci", auto: (id) => eLuce(id) && visibile(id), perStanza: true, gruppoLuci: true,
    elementi: { nome: "luce aggiunta a mano", campi: [E("entita", "Luce o interruttore", "comando"), ["stanza", "Stanza", "a"]] } },
  finestre: { cat: "casa", nome: "Finestre", ic: "finestra", auto: (id) => (dom(id) === "cover" && visibile(id)) || (eApertura(id) && ["window", "opening"].includes(dc(id))), perStanza: true,
    opzioni: [["chiusa_sotto", "Chiusa sotto il (%), di serie", "n", "Una tapparella ferma a questa percentuale o sotto conta come chiusa"], ["arieggia_sopra", "Suggerisci di arieggiare sopra il (%) di umidità", "n", "L'umidità è quella della stanza, impostata in Temperatura"]],
    elementi: { nome: "finestra", campi: [["stanza", "Stanza", "a"], E("tapparella", "Tapparella (cover o interruttore su)", "comando"), E("tapparella_giu", "Interruttore giù (se separato)", "comando"), E("tenda", "Tenda", "comando"), E("tenda_sole", "Tenda da sole", "comando"), E("sensore", "Sensore della finestra", "binario"), ["preferita", "Posizione preferita (%)", "n"], ["chiusa_sotto", "Chiusa sotto il (%) per questa finestra", "n"], ["invertita", "Percentuali invertite (100% = chiusa)", "c"]] } },
  elettrodomestici: { cat: "casa", nome: "Elettrodomestici", ic: "lavatrice", auto: (id) => !["camera", "update", "automation", "script", "scene"].includes(dom(id)) && /lavatric|washer|washing|lavastovigl|dishwasher|asciugatr|dryer|forno|oven|frigo|fridge|freezer|congelat|microonde|microwave|cappa|piano.?cottura|induz|bimby|thermomix|caffe|coffee|friggitric/.test(testoE(id)),
    elementi: { nome: "elettrodomestico", campi: [["tipo", "Che cos'è", "s:lavatrice=Lavatrice|lavastoviglie=Lavastoviglie|asciugatrice=Asciugatrice|forno=Forno|frigo=Frigorifero|congelatore=Congelatore|piano=Piano cottura|cappa=Cappa|caffe=Macchina del caffè|condizionatore=Condizionatore|generico=Altro"], ["stanza", "Stanza", "a"], E("potenza", "Consumo (W)", "numerico"), E("interruttore", "Interruttore o presa", "comando"), E("stato", "Stato / programma", "sensore"), E("fine", "Fine programma / tempo residuo", "sensore"), ["soglia", "Soglia «in funzione» (W)", "n"], ["non_wifi", "Non è wifi: lo leggo solo dalla presa", "c"]] } },
  musica: { cat: "casa", nome: "Musica", ic: "media", auto: (id) => dom(id) === "media_player" && !/tv|televis/.test(testoE(id)),
    elementi: { nome: "lettore", campi: [E("entita", "Lettore", "media"), ["stanza", "Stanza", "a"]] } },
  radio: { cat: "casa", nome: "Radio", ic: "radio", auto: () => false, radio: true, campi: [E("lettore", "Su quale lettore suonano", "echo")] },
  sport: { cat: "casa", nome: "Sport", ic: "sport", auto: (id) => dom(id) === "sensor" && (attr(id, "team_name") != null || attr(id, "opponent_name") != null || /teamtracker|serie_a|calcio|partita|match_|formula|motogp|\bf1\b/.test(testoE(id))),
    elementi: { nome: "squadra o campionato", campi: [["tipo", "Che cosa", "s:calcio=Squadra di calcio|hockey=Squadra di hockey|f1=Formula 1|motogp=MotoGP"], E("entita", "Sensore (es. TeamTracker)", "numerico")] } },
  robot: { cat: "casa", nome: "Robot", ic: "robot", auto: (id) => ["vacuum", "lawn_mower"].includes(dom(id)) || /robot|roomba|roborock|dreame|deebot|ecovacs|tagliaerba|mower/.test(testoE(id)) && ["vacuum", "lawn_mower", "sensor", "select"].includes(dom(id)),
    elementi: { nome: "robot", campi: [E("entita", "Robot", "qualsiasi"), E("batteria", "Batteria", "numerico"), E("mappa", "Mappa (camera o immagine)", "camera"), E("stato", "Stato / errore", "sensore"), E("programmi", "Programmi o stanze (select)", "qualsiasi")] } },
  stampanti: { cat: "casa", nome: "Stampanti", ic: "stampante", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /printer|stampant|toner|\bink\b|inchiostro|cartridge|cartuccia|drum|brother|epson|canon|laserjet|deskjet|officejet|ecotank/.test(testoE(id)),
    elementi: { nome: "stampante", campi: [E("stato", "Stato", "sensore"), E("nero", "Nero (%)", "numerico"), E("ciano", "Ciano (%)", "numerico"), E("magenta", "Magenta (%)", "numerico"), E("giallo", "Giallo (%)", "numerico"), E("tamburo", "Tamburo (%)", "numerico"), E("pagine", "Pagine stampate", "numerico")] } },
  animali: { cat: "casa", nome: "Animali", ic: "zampa", auto: (id) => /\bcane\b|\bgatto\b|\bdog\b|\bcat\b|\bpet\b|lettiera|litter|mangiatoia|feeder|crocchet|tractive|petkit|catlink|fontanella|acquario|terrario/.test(testoE(id)),
    elementi: { nome: "animale", campi: [["tipo", "Che cosa", "s:animale=Animale|acquario=Acquario|terrario=Terrario"], E("cibo", "Livello del cibo", "numerico"), E("eroga", "Eroga il cibo (pulsante)", "comando"), E("lettiera", "Lettiera", "sensore"), E("acqua", "Acqua / filtro", "sensore"), E("collare", "Collare / posizione", "tracker"), E("temperatura", "Temperatura (acquario/terrario)", "numerico"), E("luce", "Luce", "comando")] } },
  batterie: { cat: "casa", nome: "Batterie", ic: "batteria", auto: (id) => dom(id) === "sensor" && dc(id) === "battery" && numE(id) != null, batterie: true,
    opzioni: [["soglia", "Da cambiare sotto il (%)", "n", "Vale per tutte: sotto questa percentuale la batteria entra nel conto di quelle da cambiare"]] },
  salute: { cat: "casa", nome: "Salute", ic: "cuore", auto: (id) => dom(id) === "sensor" && /passi|steps|heart|battito|frequenza.?cardiaca|sleep|sonno|weight|peso|spo2|ossigen|blood|pressione.?(min|max|arter)|calori|withings|fitbit|garmin/.test(testoE(id)), salute: true,
    opzioni: [["obiettivo", "Obiettivo passi al giorno", "n", "L'anello della pagina si chiude a questo numero"]],
    campi: [E("passi", "Passi", "numerico"), E("battito_riposo", "Battito a riposo", "numerico"), E("battito", "Battito", "numerico"), E("peso", "Peso", "numerico"), E("grasso", "Massa grassa", "numerico"), E("pressione_max", "Pressione massima", "numerico"), E("pressione_min", "Pressione minima", "numerico"), E("ossigeno", "Ossigeno", "numerico"), E("sonno", "Sonno", "numerico"), E("calorie", "Calorie", "numerico")] },
  prese: { cat: "casa", nome: "Prese", ic: "presa", auto: (id) => ePresa(id) && visibile(id), perStanza: true,
    elementi: { nome: "presa", campi: [E("entita", "Presa", "comando"), E("consumo", "Consumo (facoltativo)", "numerico"), ["stanza", "Stanza", "a"], ["sola_lettura", "Si vede ma non si comanda (frigo, modem, congelatore)", "c"]] } },
  // ---- Sicurezza
  varchi: { cat: "sicurezza", nome: "Varchi", ic: "porte", auto: (id) => eApertura(id), perStanza: true },
  presenza: { cat: "sicurezza", nome: "Presenza", ic: "movimento", auto: (id) => dom(id) === "binary_sensor" && ["motion", "occupancy", "presence"].includes(dc(id)) && !accessorio(id), perStanza: true },
  apri_porte: { cat: "sicurezza", nome: "Apri porte e cancelli", ic: "cancello", auto: (id) => dom(id) === "lock" || (dom(id) === "cover" && ["gate", "garage", "door"].includes(dc(id))) || (["button", "switch", "script"].includes(dom(id)) && /cancell[oi]|\bgate\b|portone|garage|apriport|apri.?porta|serratura|basculante|pedonale/.test(testoE(id))),
    opzioni: [["conferma", "Chiedi conferma prima di aprire", "c", "Spenta, si apre al primo tocco"]],
    elementi: { nome: "apertura", campi: [E("entita", "Cosa si comanda (serratura, cancello, pulsante, script)", "comando"), E("stato", "Sensore aperto/chiuso (facoltativo)", "binario")] }, apertura: true },
  citofono: { cat: "sicurezza", nome: "Citofono e posta", ic: "campanello", auto: (id) => /citofon|doorbell|campanell|intercom|videocitofono|posta|mailbox|cassetta/.test(testoE(id)) && dom(id) !== "update",
    elementi: { nome: "citofono o cassetta", campi: [["tipo", "Che cosa", "s:citofono=Citofono|cassetta=Cassetta della posta"], E("campanello", "Campanello (quando suonano)", "sensore"), E("apri", "Tasto che apre", "comando"), E("telecamera", "Telecamera", "camera"), E("movimento", "Sensore di movimento (cassetta)", "binario"), E("sportello", "Contatto sullo sportello (cassetta)", "binario"), E("contatore", "Contatore lettere (counter)", "qualsiasi")] } },
  // ---- Avvisi
  allerte: { cat: "avvisi", nome: "Allerte", ic: "allerta", auto: (id) => ["sensor", "binary_sensor", "geo_location"].includes(dom(id)) && /allert|alert|warning|meteoalarm|protezione.?civile|\bdpc\b|avviso.?meteo|terremot|earthquake|ingv|bollettino|pollin|blitzortung|fulmin|scioper|treno|flightradar|pm2|pm10|aqi|qualit.?aria/.test(testoE(id)),
    gruppiCampi: [["Terremoti", [E("terremoti", "Sensore dei terremoti (INGV)", "qualsiasi"), E("magnitudo", "Magnitudo", "numerico"), E("distanza_t", "Distanza in km", "numerico")]], ["Protezione civile", [E("protezione", "Avviso della protezione civile / Meteoalarm", "qualsiasi")]], ["Fulmini", [E("fulmini", "Conteggio dei fulmini", "numerico"), E("distanza_f", "Distanza dell'ultimo fulmine (km)", "numerico")]], ["Pollini", [E("pollini", "Pollini di oggi", "qualsiasi"), E("graminacee", "Graminacee", "qualsiasi"), E("erbacce", "Erbacce", "qualsiasi"), E("alberi", "Alberi", "qualsiasi")]], ["Comfort termico", [E("percezione", "Percezione", "qualsiasi"), E("humidex", "Humidex", "numerico"), E("calore", "Indice di calore", "numerico"), E("gelo", "Rischio gelo", "qualsiasi")]], ["Voli sopra casa", [E("voli", "Voli in zona (Flightradar24)", "numerico")]], ["Scioperi", [E("scioperi", "Sensore degli scioperi", "qualsiasi")]], ["Treni", [E("treno", "Treno seguito (ritardo)", "qualsiasi"), E("stazione", "Stazione preferita", "qualsiasi")]], ["Qualità dell'aria", [E("aria", "La misura in copertina (vuota = la peggiore)", "numerico"), E("aria_esclusa", "Non contare questo sensore", "numerico")]]] },
  agenda: { cat: "avvisi", nome: "Agenda", ic: "calendario", auto: (id) => dom(id) === "calendar" || dom(id) === "todo", agenda: true,
    elementi: { nome: "calendario o lista", campi: [["tipo", "Che cosa", "s:calendario=Calendario|lista=Lista (cose da fare)"], E("entita", "Entità (calendar.* o todo.*)", "qualsiasi"), ["colore", "Colore", "col"]] }, rileva: true },
  // ---- Alexa
  notifiche: { cat: "alexa", nome: "Notifiche", ic: "campana", auto: () => false, nonInBarra: true, notifiche: true },
  avvisi_alexa: { cat: "alexa", nome: "Avvisi personalizzati", ic: "allerta", auto: () => false, nonInBarra: true, avvisiAlexa: true },
  alexa: { cat: "alexa", nome: "Musica", nomeBarra: "Musica su Alexa", ic: "media", auto: (id) => dom(id) === "media_player" && /echo|alexa/.test(testoE(id)) },
  // ---- Macchine e rete
  minipc: { cat: "rete", nome: "MiniPC", nomeBarra: "MiniPC e rete", ic: "computer", auto: (id) => ["sensor", "binary_sensor"].includes(dom(id)) && /\bcpu\b|processor|memoria|memory|\bram\b|disk|disco|load_|uptime|system_monitor|glances|nas\b|synology|proxmox|router|\bwan\b|ping|speedtest|velocit.?(download|upload)|internet/.test(testoE(id)),
    campi: [E("cpu", "CPU (%)", "numerico"), E("ram", "RAM (%)", "numerico"), E("disco", "Disco (%)", "numerico"), E("uptime", "Uptime MiniPC", "sensore"), E("temp_cpu", "Temperatura CPU (°C)", "numerico"), E("uptime_ha", "Uptime Home Assistant", "sensore"), E("potenza", "Potenza del server (W)", "numerico"), E("internet", "Stato Internet", "binario"), E("ping", "Ping Internet", "binario"), E("google", "Raggiungibilità Google", "binario"), E("down", "Speedtest download (Mbit/s)", "numerico"), E("up", "Speedtest upload (Mbit/s)", "numerico"), E("ping_ms", "Speedtest ping (ms)", "numerico")],
    elementi: { nome: "nodo o macchina", campi: [E("stato", "Stato", "sensore"), E("cpu", "CPU (%)", "numerico"), E("ram", "Memoria (%)", "numerico"), E("disco", "Disco (%)", "numerico"), E("temperatura", "Temperatura", "numerico")] } },
  non_connessi: { cat: "rete", nome: "Dispositivi non connessi", ic: "scollegato", auto: (id) => DOMINI_UTILI.includes(dom(id)) && st(id).state === "unavailable" && !accessorio(id), nonConnessi: true },
};
for (const [id, d] of Object.entries(SEZ_GEN)) if (!d.nonInBarra && !SCHEDE.find((x) => x.id === id)) SCHEDE.splice(SCHEDE.length - 1, 0, { id, nome: d.nomeBarra || d.nome, ic: d.ic, gen: true });
SCHEDE.find((x) => x.id === "raccolta").nome = "Rifiuti";
const tipoScelte = (t) => t.slice(2).split("|").map((x) => x.split("="));

// ------------------------------------------------------------------ dati di una sezione
const cfgGen = (id) => ((S.cfg.sez_gen || {})[id]) || {};
const miaSez = (id) => (S.cfg.mie_sezioni || []).find((x) => x.id === id);
const opz = (id, k) => (cfgGen(id).extra || {})[k];
const elementiDi = (id) => cfgGen(id).elementi || [];
const ENT_TIPI = (t) => t && !/^(t|n|a|c|h|col|s:.*)$/.test(t);
function entitaGen(id) {
  const m = miaSez(id); if (m) return (m.entita || []).filter((x) => st(x));
  const d = SEZ_GEN[id], c = cfgGen(id);
  const esc_ = c.escluse || [];
  const auto = tutteId().filter((x) => okAuto(id, x));
  const campi = Object.values(c.campi || {}).filter((x) => x && st(x));
  return [...new Set([...campi, ...auto, ...(c.aggiunte || []).filter((x) => st(x))])].filter((x) => !esc_.includes(x) || campi.includes(x));
}
const nomeAreaDi = (id) => { const a = areaEntita(id); return (a && (S.aree.find((x) => x.id === a) || {}).nome) || "Senza stanza"; };
const nomeArea = (a) => (S.aree.find((x) => x.id === a) || {}).nome || "";
// le entità usate negli elementi non si ripetono fra le "trovate da sola"
function entitaNegliElementi(id) { const out = new Set(); for (const el of elementiDi(id)) for (const [k, , t] of (SEZ_GEN[id].elementi || {}).campi || []) if (ENT_TIPI(t) && el[k]) out.add(el[k]); return out; }
const COMANDABILI = ["switch", "light", "climate", "cover", "fan", "lock", "media_player", "valve", "vacuum", "lawn_mower", "input_boolean", "humidifier", "water_heater", "siren", "button", "script", "scene", "input_button"];

// ------------------------------------------------------------------ vista di una sezione nella plancia
const fmtValore = (e) => st(e) ? testoStato(e) : "—";
function cellaKpi(n, e) { return `<div><small>${esc(n)}</small><b>${esc(fmtValore(e))}</b></div>`; }
// una scheda per ogni elemento (UPS, piscina, veicolo, zona…): comandi come tessere, misure come numeri
function schedaElemento(id, el, i) {
  const spec = (SEZ_GEN[id].elementi || {}).campi || [];
  const comandi = [], misure = [];
  for (const [k, n, t] of spec) { if (!ENT_TIPI(t) || !el[k] || !st(el[k])) continue; (COMANDABILI.includes(dom(el[k])) ? comandi : misure).push([n, el[k]]); }
  const scelta = spec.find((x) => x[0] === "tipo" && /^s:/.test(x[2]));
  const tipo = scelta && el.tipo ? (tipoScelte(scelta[2]).find((x) => x[0] === el.tipo) || [])[1] : "";
  let extra = "";
  if (id === "ups") extra = statoUps(el);
  if (id === "elettrodomestici") { const w = numE(el.potenza), s = Number(el.soglia) || 5; if (w != null) extra = `<span class="badge ${w > s ? "verde" : ""}">${w > s ? "In funzione · " + fmtW(w) : "Fermo"}</span>`; }
  if (id === "piscina") extra = statoPiscina(el);
  if (id === "veicoli" && el.immagine) { const img = /^image\./.test(el.immagine) ? attr(el.immagine, "entity_picture") : el.immagine; const carica = el.cavo && st(el.cavo) && st(el.cavo).state === "on" && el.immagine_carica; if (img) extra = `<img class="veicolo-img" src="${esc(carica ? el.immagine_carica : img)}" alt="">`; }
  if (id === "apri_porte") extra = el.entita && st(el.entita) ? `<button class="btn p pic" data-nx-apri="${i}">${ico("chiave", "s")}Apri</button>` : "";
  return `<div class="elem"><div class="elem-tit">${ico(SEZ_GEN[id].ic)}<div><b>${esc(el.nome || SEZ_GEN[id].elementi.nome)}</b><small>${esc([tipo, el.stanza ? nomeArea(el.stanza) : ""].filter(Boolean).join(" · "))}</small></div>${extra && !/^<img/.test(extra) ? extra : ""}</div>${/^<img/.test(extra) ? extra : ""}
    ${misure.length ? `<div class="kpi" style="--kcols:${Math.min(misure.length, 4)};margin:10px 0 0">${misure.map(([n, e]) => cellaKpi(n, e)).join("")}</div>` : ""}
    ${comandi.length ? `<div class="tessere" style="margin-top:10px">${comandi.map(([, e]) => tessera(e)).join("")}</div>` : ""}</div>`;
}
function statoUps(el) {
  const s = el.stato && st(el.stato) ? String(st(el.stato).state).toUpperCase() : "";
  let rete = null;
  if (el.rete && st(el.rete)) rete = (st(el.rete).state === "on") !== !!el.rete_invertita;
  else if (s) rete = !/\bOB\b/.test(s);
  const bassa = /\bLB\b/.test(s);
  if (rete === null) return "";
  return `<span class="badge ${bassa ? "rosso" : rete ? "verde" : "ambra"}">${bassa ? "Batteria scarica" : rete ? "In linea" : "A batteria" + (el.autonomia && st(el.autonomia) ? " · " + testoStato(el.autonomia) : "")}</span>`;
}
function statoPiscina(el) {
  const ph = numE(el.ph), cl = numE(el.cloro), out = [];
  if (ph != null) { const ok = ph >= (Number(el.ph_min) || 7) && ph <= (Number(el.ph_max) || 7.6); out.push(`<span class="badge ${ok ? "verde" : "ambra"}">pH ${fmt1(ph)}</span>`); }
  if (cl != null && (el.cloro_min || el.cloro_max)) { const ok = (!el.cloro_min || cl >= Number(el.cloro_min)) && (!el.cloro_max || cl <= Number(el.cloro_max)); out.push(`<span class="badge ${ok ? "verde" : "ambra"}">Cloro ${fmt1(cl)}</span>`); }
  if (el.filtra && el.ora_inizio) { const t = numE(el.temperatura), ore = el.ore_auto && t != null ? Math.max(2, Math.min(24, Math.round(t / 2))) : Number(el.ore) || 8; out.push(`<span class="badge blu">Filtra ${ore} h dalle ${esc(el.ora_inizio)}</span>`); }
  return out.join(" ");
}
function vGen(id) {
  const m = miaSez(id), d = SEZ_GEN[id] || { nome: m.nome, ic: m.icona || "stella" }, c = cfgGen(id);
  const usate = SEZ_GEN[id] ? entitaNegliElementi(id) : new Set();
  const ents = entitaGen(id).filter((e) => !usate.has(e));
  const els = SEZ_GEN[id] ? elementiDi(id) : [];
  const campi = (d.campi || []).map(([k, n]) => [n, (c.campi || {})[k]]).filter(([, e]) => e && st(e));
  let h = `<section class="card"><div class="tit"><h2>${ico(d.ic)} ${esc(d.nomeBarra || d.nome)}</h2></div>`;
  if (id === "meteo") return h + vistaMeteo(c) + `</section>`;
  if (d.salute) return h + vistaSalute(c) + `</section>`;
  if (d.gruppiCampi) return h + vistaAllerte(c, ents) + `</section>`;
  if (campi.length) h += `<div class="kpi" style="--kcols:${Math.min(campi.length, 4)};margin:0 0 14px">${campi.map(([n, e]) => cellaKpi(n, e)).join("")}</div>`;
  if (id === "irrigazione") h += vistaIrrigazione();
  if (d.gruppoLuci && ents.length) h += `<div class="riga" style="margin-bottom:14px"><button class="btn a pic" data-gruppo="light" data-v="turn_on">Accendi tutte</button><button class="btn pic" data-gruppo="light" data-v="turn_off">Spegni tutte</button></div>`;
  if (els.length && !["luci", "prese", "musica", "agenda"].includes(id)) h += `<div class="elementi">${els.map((el, i) => schedaElemento(id, el, i)).join("")}</div>`;
  if (d.radio) h += vistaRadio(id);
  else if (d.agenda) h += vistaAgenda(ents);
  else if (d.batterie) h += vistaBatterie(ents);
  else if (d.nonConnessi) h += vistaNonConnessi(ents);
  else {
    let lista = ents;
    if (["luci", "prese", "musica"].includes(id)) lista = [...new Set([...els.map((x) => x.entita).filter((e) => e && st(e)), ...ents])];
    if (!lista.length && !els.length) h += `<p class="mut">Non ho trovato niente per questa sezione. Puoi aggiungere le entità in Impostazioni › ${esc(d.nome)}.</p>`;
    else if (lista.length && d.perStanza) { const g = {}; const areaEl = (e) => { const x = els.find((y) => y.entita === e && y.stanza); return x ? nomeArea(x.stanza) : nomeAreaDi(e); }; for (const e of lista) (g[areaEl(e)] = g[areaEl(e)] || []).push(e); h += Object.entries(g).sort((a, b) => (a[0] === "Senza stanza") - (b[0] === "Senza stanza") || a[0].localeCompare(b[0])).map(([a, l]) => `<div class="gruppo">${esc(a)}</div><div class="tessere">${l.map(tesseraSez(id)).join("")}</div>`).join(""); }
    else if (lista.length) h += `${els.length && !["luci", "prese", "musica"].includes(id) ? '<div class="gruppo">Altre entità</div>' : ""}<div class="tessere">${lista.map(tesseraSez(id)).join("")}</div>`;
  }
  return h + `</section>`;
}
// prese "si vede ma non si comanda"
const tesseraSez = (id) => (e) => { const el = id === "prese" ? elementiDi("prese").find((x) => x.entita === e) : null; let t = tessera(e); if (el && el.sola_lettura) t = t.replace('class="tess', 'class="tess sola-lettura').replace(/<button class="tg[^"]*"[^>]*><\/button>/, '<span class="badge">sempre accesa</span>'); if (el && el.consumo && st(el.consumo)) t = t.replace("</div>", `<small class="consumo">${esc(testoStato(el.consumo))}</small></div>`); return t; };

// ---- Meteo: blocchi nell'ordine scelto, previsioni chieste a Home Assistant
let cachePrev = { id: null, t: 0, daily: [], hourly: [] };
async function caricaPrevisioni(w) {
  if (cachePrev.id === w && Date.now() - cachePrev.t < 30 * 60000) return;
  cachePrev = { id: w, t: Date.now(), daily: [], hourly: [] };
  try { const [a, b] = await Promise.all([api("api/previsioni?tipo=daily&id=" + encodeURIComponent(w)), api("api/previsioni?tipo=hourly&id=" + encodeURIComponent(w))]); cachePrev.daily = a.previsioni || []; cachePrev.hourly = b.previsioni || []; } catch (e) {}
  if (S.scheda === "meteo") disegna();
}
function vistaMeteo(c) {
  const cc = c.campi || {}, w = cc.meteo && st(cc.meteo) ? cc.meteo : tutteId().find((e) => dom(e) === "weather");
  const ord = (opz("meteo", "blocchi") || SEZ_GEN.meteo.blocchi).filter((b) => (opz("meteo", "nascosti") || []).indexOf(b) < 0);
  if (w) caricaPrevisioni(w);
  const v = (k) => cc[k] && st(cc[k]) ? numE(cc[k]) : null;
  const B = {
    adesso: () => { if (!w) return '<p class="mut">Nessuna entità meteo.</p>'; const t = v("temperatura") ?? attr(w, "temperature"); const d0 = cachePrev.daily[0] || {}; return `<div class="meteo-big">${ico(/rain|pour/.test(st(w).state) ? "pioggia" : "meteo", "l")}<b>${t != null ? fmt1(t) + "°" : "—"}</b><div><span>${esc(METEO[st(w).state] || st(w).state)}</span><small class="dim">${v("percepita") != null ? "Percepita " + fmt1(v("percepita")) + "° · " : ""}${d0.templow != null ? "min " + Math.round(d0.templow) + "° · " : ""}${d0.temperature != null ? "max " + Math.round(d0.temperature) + "°" : ""}</small></div></div>`; },
    stazione: () => { const k = ["umidita", "pressione", "vento", "raffica", "direzione", "pioggia", "intensita", "uv", "radiazione", "luminosita"].filter((x) => cc[x] && st(cc[x])); if (!k.length) return ""; const nomi = Object.fromEntries(SEZ_GEN.meteo.campi.map((x) => [x[0], x[1]])); return `<div class="gruppo">La mia stazione</div><div class="kpi" style="--kcols:4;margin:0">${k.map((x) => cellaKpi(nomi[x], cc[x])).join("")}</div>`; },
    ore: () => cachePrev.hourly.length ? `<div class="gruppo">Prossime 24 ore</div><div class="previsioni ore">${cachePrev.hourly.slice(0, 24).map((f) => `<div><small>${esc(new Date(f.datetime).toLocaleTimeString("it-IT", { hour: "2-digit" }))}</small>${ico(/rain|pour/.test(f.condition) ? "pioggia" : "meteo")}<b>${f.temperature != null ? Math.round(f.temperature) + "°" : ""}</b>${f.precipitation_probability != null ? `<span>${f.precipitation_probability}%</span>` : ""}</div>`).join("")}</div>` : "",
    giorni: () => cachePrev.daily.length ? `<div class="gruppo">Prossimi giorni</div><div class="previsioni">${cachePrev.daily.slice(0, 7).map((f) => `<div><small>${esc(new Date(f.datetime).toLocaleDateString("it-IT", { weekday: "short" }))}</small>${ico(/rain|pour/.test(f.condition) ? "pioggia" : "meteo")}<b>${f.temperature != null ? Math.round(f.temperature) + "°" : ""}</b><span>${f.templow != null ? Math.round(f.templow) + "°" : ""}</span></div>`).join("")}</div>` : (w && attr(w, "forecast") ? "" : ""),
    radar: () => { const r = opz("meteo", "radar"); if (!r) return ""; if (r === "camera") { const cam = opz("meteo", "radar_camera"); return cam && st(cam) ? `<div class="gruppo">Radar pioggia</div><img class="radar" src="${dom(cam) === "image" ? esc(attr(cam, "entity_picture")) : "api/camera/" + encodeURIComponent(cam) + "?t=" + Math.floor(Date.now() / 60000)}" alt="Radar">` : ""; } const z = st("zone.home"); const lat = z ? attr("zone.home", "latitude") : 41.9, lon = z ? attr("zone.home", "longitude") : 12.5; return `<div class="gruppo">Radar pioggia</div><iframe class="radar" src="https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1" loading="lazy" title="Radar pioggia"></iframe>`; },
  };
  return ord.map((b) => B[b] ? B[b]() : "").join("");
}
// ---- Salute
function vistaSalute(c) {
  const cc = c.campi || {}, ob = Number(opz("salute", "obiettivo")) || 10000;
  const auto = (k, re) => cc[k] === "-" ? null : cc[k] && st(cc[k]) ? cc[k] : tutteId().find((x) => dom(x) === "sensor" && re.test(testoE(x)));
  const passi = auto("passi", /passi|steps/), p = passi ? numE(passi) || 0 : null;
  const misure = [["battito_riposo", /resting.?heart|battito.?a.?riposo/], ["battito", /heart.?rate|battito|frequenza.?cardiaca/], ["peso", /weight|peso/], ["grasso", /fat|grass/], ["pressione_max", /systolic|pressione.?max/], ["pressione_min", /diastolic|pressione.?min/], ["ossigeno", /spo2|ossigen|oxygen/], ["sonno", /sleep|sonno/], ["calorie", /calori/]].map(([k, re]) => [k, auto(k, re)]).filter((x) => x[1]);
  const nomi = Object.fromEntries(SEZ_GEN.salute.campi.map((x) => [x[0], x[1]]));
  const perc = p != null ? Math.min(100, Math.round(p / ob * 100)) : 0;
  return `${p != null ? `<div class="anello-passi" style="--p:${perc}"><div><b>${Math.round(p).toLocaleString("it-IT")}</b><small>passi su ${ob.toLocaleString("it-IT")}</small></div></div>` : '<p class="mut">Nessun sensore dei passi.</p>'}
    ${misure.length ? `<div class="kpi" style="--kcols:${Math.min(misure.length, 4)};margin-top:14px">${misure.map(([k, e]) => cellaKpi(nomi[k], e)).join("")}</div>` : ""}`;
}
// ---- Allerte: un blocco per tipo
function vistaAllerte(c, ents) {
  const cc = c.campi || {};
  const blocchi = SEZ_GEN.allerte.gruppiCampi.map(([g, campi]) => [g, campi.filter(([k]) => k !== "aria_esclusa" && cc[k] && st(cc[k]))]).filter((x) => x[1].length);
  const aria = tutteId().filter((x) => dom(x) === "sensor" && ["pm25", "pm10", "pm1", "carbon_dioxide", "carbon_monoxide", "volatile_organic_compounds", "nitrogen_dioxide", "ozone", "aqi"].includes(dc(x)) && x !== cc.aria_esclusa);
  let h = blocchi.map(([g, campi]) => `<div class="gruppo">${esc(g)}</div><div class="kpi" style="--kcols:${Math.min(campi.length, 4)};margin:0">${campi.map(([k, n]) => cellaKpi(n, cc[k])).join("")}</div>`).join("");
  if (!cc.aria && aria.length) h += `<div class="gruppo">Qualità dell'aria</div><div class="tessere">${aria.map(tessera).join("")}</div>`;
  const altre = ents.filter((e) => !Object.values(cc).includes(e) && !aria.includes(e));
  if (altre.length) h += `<div class="gruppo">Altre allerte trovate</div><div class="tessere">${altre.map(tessera).join("")}</div>`;
  return h || '<p class="mut">Nessuna allerta configurata. Le imposti in Impostazioni › Allerte (terremoti, protezione civile, fulmini, pollini, comfort, voli, scioperi, treni, aria).</p>';
}
// ---- Irrigazione: il programma
function vistaIrrigazione() {
  const x = cfgGen("irrigazione").extra || {}, u = x.umidita_suolo && st(x.umidita_suolo) ? numE(x.umidita_suolo) : null;
  if (!x.attivo && u == null) return "";
  return `<div class="riga" style="margin-bottom:12px">${x.attivo ? `<span class="badge blu">Programma: ${esc((x.orari || "").toString() || "nessun orario")}</span>` : '<span class="badge">Programma spento</span>'}${u != null ? `<span class="badge ${x.umid_min && u < Number(x.umid_min) ? "ambra" : x.umid_max && u > Number(x.umid_max) ? "blu" : "verde"}">Terreno ${Math.round(u)}%</span>` : ""}<span class="spazio"></span><button class="btn pic" data-nx-annaffia>${ico("goccia", "s")}Annaffia adesso</button></div>`;
}
// ---- Agenda: eventi e liste
const cacheAg = {};
async function caricaAgenda(id) {
  if (cacheAg[id] && Date.now() - cacheAg[id].t < 5 * 60000) return;
  cacheAg[id] = { t: Date.now(), voci: null };
  try { const r = dom(id) === "todo" ? await api("api/todo?id=" + encodeURIComponent(id)) : await api("api/calendario?giorni=14&id=" + encodeURIComponent(id)); cacheAg[id].voci = r.voci || r.eventi || []; } catch (e) { cacheAg[id].voci = []; }
  if (S.scheda === "agenda") disegna();
}
function vistaAgenda(ents) {
  const els = elementiDi("agenda").filter((x) => x.entita && st(x.entita));
  const lista = els.length ? els : ents.map((e) => ({ entita: e, nome: nomeE(e), tipo: dom(e) === "todo" ? "lista" : "calendario" }));
  if (!lista.length) return '<p class="mut">Nessun calendario. Aggiungili in Impostazioni › Agenda.</p>';
  for (const x of lista) caricaAgenda(x.entita);
  const eventi = [];
  for (const x of lista.filter((y) => dom(y.entita) === "calendar")) for (const ev of (cacheAg[x.entita] || {}).voci || []) eventi.push({ ...ev, cal: x.nome || nomeE(x.entita), col: x.colore || "#5AB0FF" });
  eventi.sort((a, b) => String(a.inizio).localeCompare(String(b.inizio)));
  const giorno = (s) => new Date(String(s).length <= 10 ? s + "T00:00" : s).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
  let h = "", ultimo = "";
  for (const ev of eventi.slice(0, 40)) { const g = giorno(ev.inizio); if (g !== ultimo) { h += `<div class="gruppo">${esc(g)}</div>`; ultimo = g; } h += `<div class="evento" style="--c:${esc(ev.col)}"><b>${esc(ev.titolo || "")}</b><small>${String(ev.inizio).length > 10 ? esc(new Date(ev.inizio).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })) + " · " : "Tutto il giorno · "}${esc(ev.cal)}${ev.luogo ? " · " + esc(ev.luogo) : ""}</small></div>`; }
  if (!eventi.length && lista.some((y) => dom(y.entita) === "calendar")) h += '<p class="mut">Niente in programma nei prossimi 14 giorni.</p>';
  for (const x of lista.filter((y) => dom(y.entita) === "todo")) { const v = (cacheAg[x.entita] || {}).voci || []; h += `<div class="gruppo">${esc(x.nome || nomeE(x.entita))}</div>${v.filter((y) => !y.fatto).map((y) => `<div class="voce-imp"><span class="emo">☐</span><div><b>${esc(y.testo)}</b></div></div>`).join("") || '<p class="dim">Lista vuota.</p>'}`; }
  return h;
}
function vistaBatterie(ents) {
  const s = Number(opz("batterie", "soglia")) || 20;
  const l = [...ents].sort((a, b) => numE(a) - numE(b));
  const basse = l.filter((e) => numE(e) <= s).length;
  return l.length ? `<p class="mut">${basse ? `<b>${basse} da cambiare</b> (sotto il ${s}%)` : `Tutte sopra il ${s}%`}.</p>${l.map((e) => { const v = numE(e); return `<div class="batt-riga ${v <= s ? "bassa" : ""}"><span>${esc(nomeE(e))}<small>${esc(nomeAreaDi(e))}</small></span><div class="barra-b"><i style="width:${Math.max(2, Math.min(100, v))}%"></i></div><b>${Math.round(v)}%</b></div>`; }).join("")}` : '<p class="mut">Nessuna batteria.</p>';
}
function vistaRadio(id) {
  const lett = (cfgGen(id).campi || {}).lettore, stz = opz(id, "stazioni") || [];
  if (!lett || !st(lett)) return '<p class="mut">Scegli il lettore in Impostazioni › Radio.</p>';
  return `<div class="tessere" style="margin-bottom:14px">${tessera(lett)}</div>${stz.length ? `<div class="azioni-rapide">${stz.map((s, i) => `<button class="az-rapida" data-nx-radio="${i}">${s.icona ? `<img src="${esc(s.icona)}" alt="" class="radio-logo" onerror="this.remove()">` : ico("radio")}<span>${esc(s.nome)}</span></button>`).join("")}</div>` : '<p class="mut">Aggiungi le radio preferite in Impostazioni › Radio.</p>'}`;
}
function perDispositivo(ents) {
  const g = new Map();
  for (const e of ents) { const en = S.entita.find((x) => x.id === e), dv = en && en.dispositivo && (S.dispositivi || []).find((x) => x.id === en.dispositivo); const k = dv ? dv.id : e; if (!g.has(k)) g.set(k, { k, nome: dv ? dv.nome || nomeE(e) : nomeE(e), modello: dv ? [dv.produttore, dv.modello].filter(Boolean).join(" ") : e, ents: [], area: nomeAreaDi(e) }); g.get(k).ents.push(e); }
  return [...g.values()];
}
let cercaNC = "";
function vistaNonConnessi(ents) {
  const ign = opz("non_connessi", "ignora") || [];
  const q = cercaNC.toLowerCase();
  const dv = perDispositivo(ents).filter((x) => !ign.includes(x.k)).filter((x) => !q || (x.nome + " " + x.modello + " " + x.ents.join(" ")).toLowerCase().includes(q)).sort((a, b) => Math.min(...b.ents.map((e) => new Date(st(e).last_changed))) - Math.min(...a.ents.map((e) => new Date(st(e).last_changed))));
  return `<div class="ed-cerca" style="margin-bottom:12px">${ico("comandi")}<input type="text" id="nxCercaNC" value="${esc(cercaNC)}" placeholder="Cerca per nome, tipo, marca o entità…" autocomplete="off"></div>
    ${dv.length ? `<p class="mut">${dv.length} ${dv.length === 1 ? "dispositivo non risponde" : "dispositivi non rispondono"}.${ign.length ? ` ${ign.length} ignorati.` : ""}</p><table>${dv.map((x) => { const da = new Date(Math.min(...x.ents.map((e) => new Date(st(e).last_changed)))); return `<tr><td><b>${esc(x.nome)}</b><div class="dim" style="font-size:12px">${esc(x.modello)} · ${esc(x.area)} · ${x.ents.length} entità</div></td><td class="dim" style="white-space:nowrap">da ${esc(da.toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }))}</td><td><button class="btn pic" data-nx-ignora="${esc(x.k)}" title="Non mostrarlo più" aria-label="Ignora">${ico("cestino", "s")}</button></td></tr>`; }).join("")}</table>` : '<p class="mut">Tutti i dispositivi rispondono.</p>'}
    ${ign.length ? `<div class="riga" style="margin-top:10px"><button class="btn pic" data-nx-ignora-reset>Mostra di nuovo i ${ign.length} ignorati</button></div>` : ""}`;
}
const _disegna0 = disegna;
disegna = function () {
  if (!S.cfg) return;
  disegnaBarraRapida();
  if (!SEZ_GEN[S.scheda] && !miaSez(S.scheda)) return _disegna0();
  const att = document.activeElement, idAtt = att && att.id, pos = att && att.selectionStart;
  $("#vista").innerHTML = vGen(S.scheda);
  if (idAtt && document.getElementById(idAtt)) { const x = document.getElementById(idAtt); x.focus(); try { x.setSelectionRange(pos, pos); } catch (e) {} }
};

// ------------------------------------------------------------------ barra rapida in fondo (come la navbar di GdAHome)
const barraRapida = () => (S.cfg.generali || {}).barra_rapida || {};
const barraAccesa = () => barraRapida().on !== false;
// in alto: di serie solo l'ingranaggio; le sezioni stanno nella barra rapida in fondo
const sezioniInAlto = () => !!(S.cfg.generali || {}).sezioni_in_alto || !barraAccesa();
function tastiBarra() { const b = barraRapida(); const att = schedeAttive().map((s) => s.id); const t = (b.tasti && b.tasti.length ? b.tasti : ["agente", "raccolta", "citofono", "clima", "stanze", "meteo", "luci", "prese", "finestre", "sicurezza", "allerte", "impostazioni"]).filter((id) => SCHEDE.find((x) => x.id === id)); return b.tasti && b.tasti.length ? t : t.filter((id) => att.includes(id)); }
// un colore per sezione (variante C): icona colorata, tasto attivo nel colore della sua sezione
const COLORE_SEZ = { agente: "#5AB0FF", raccolta: "#4CC38A", stanze: "#A78BFA", comandi: "#5AB0FF", casa3d: "#A78BFA", energia: "#FFC94D", sicurezza: "#FF7A70", persone: "#F0997B", scenari: "#C4A1FF", impostazioni: "#9AA6B2",
  meteo: "#FFB454", clima: "#5EEAD4", temperatura: "#F0997B", luci: "#FFD866", prese: "#FFB454", finestre: "#7DD3FC", varchi: "#FF9C6B", presenza: "#F0997B", apri_porte: "#4CC38A", citofono: "#7DD3FC", allerte: "#FF7A70", agenda: "#5AB0FF",
  accumulo: "#4CC38A", veicoli: "#5AB0FF", ups: "#FFC94D", termica: "#FF9C6B", piscina: "#5EEAD4", irrigazione: "#4CC38A", piante: "#97C459", acqua_gas: "#7DD3FC", elettrodomestici: "#C4A1FF", musica: "#ED93B1", radio: "#ED93B1", sport: "#4CC38A", robot: "#9AA6B2", stampanti: "#9AA6B2", animali: "#F0997B", batterie: "#97C459", salute: "#FF7A70", alexa: "#5EEAD4", minipc: "#9AA6B2", non_connessi: "#FF9C6B" };
const coloreSez = (id) => COLORE_SEZ[id] || "#5AB0FF";
function disegnaBarraRapida() {
  let el = document.getElementById("barraRapida");
  const on = barraAccesa() && !document.body.classList.contains("muro");
  document.body.classList.toggle("con-barra-rapida", on);
  if (!on) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement("nav"); el.id = "barraRapida"; el.className = "barra-rapida"; el.setAttribute("aria-label", "Barra rapida"); document.body.appendChild(el); }
  el.classList.toggle("grigia", !!(S.cfg.generali || {}).icone_grigie);
  el.innerHTML = tastiBarra().map((id) => { const s = SCHEDE.find((x) => x.id === id); return `<button class="${S.scheda === id ? "on" : ""}" style="--c:${coloreSez(id)}" data-scheda="${id}" aria-label="${esc(s.nome)}">${ico(s.ic)}<span>${esc(id === "agente" ? "Home" : s.nome)}</span></button>`; }).join("");
}
// i tasti della barra aprono anche sezioni non mostrate in alto
const _schedeAttive1 = schedeAttive;
schedeAttive = function () { const a = _schedeAttive1(); const b = barraRapida(); if (!barraAccesa() || !b.tasti) return a; const extra = b.tasti.filter((id) => !a.find((x) => x.id === id)).map((id) => SCHEDE.find((x) => x.id === id)).filter(Boolean).map((x) => ({ ...x, soloBarra: true })); return [...a.slice(0, -1), ...extra, a[a.length - 1]]; };
const _disegnaSchedeR = disegnaSchede;
disegnaSchede = function () {
  _disegnaSchedeR();
  const solo = !sezioniInAlto() && !document.body.classList.contains("muro");
  document.body.classList.toggle("solo-ingranaggio", solo);
  if (solo) $("#schede").innerHTML = `<button role="tab" class="ingranaggio ${S.scheda === "impostazioni" ? "on" : ""}" data-scheda="impostazioni" aria-label="Impostazioni" title="Impostazioni">${ico("impostazioni")}</button>`;
  else document.querySelectorAll("#schede button").forEach((b) => { const s = schedeAttive().find((x) => x.id === b.dataset.scheda); if (s && s.soloBarra) b.remove(); });
  disegnaBarraRapida();
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
let nuovoAvvA = { testo: "", tipo: "orario", ora: "08:00", giorni: [], entita: "", valore: "on" };
let radioRis = null, radioModo = "", radioFiltro = "";
const visTg = (id) => interruttore((S.cfg.sezioni || []).includes(id), `data-sezione="${id}"`, "Sezione visibile nella plancia", "Accesa, la sezione compare nella barra in alto");
function campoSpec(path, [k, n, t, nota = ""]) {
  const p = path + "." + k, v = leggiCfg(p);
  if (ENT_TIPI(t)) return campoEnt(p, n, t, nota);
  if (t === "c") return `<div style="grid-column:1/-1">${interruttore(!!v, `data-nx-tg="${p}"`, n, nota)}</div>`;
  if (t === "a") return `<label class="campo">${n}<select data-nx-cfg="${p}"><option value="">— Nessuna stanza —</option>${S.aree.map((a) => `<option value="${esc(a.id)}" ${v === a.id ? "selected" : ""}>${esc(a.nome)}</option>`).join("")}</select></label>`;
  if (/^s:/.test(t)) return `<label class="campo">${n}${nota ? `<span>${nota}</span>` : ""}<select data-nx-cfg="${p}">${tipoScelte(t).map(([x, l]) => `<option value="${esc(x)}" ${String(v ?? "") === x ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
  const tipoIn = { n: "number", h: "time", col: "color", t: "text" }[t] || "text";
  return `<label class="campo">${n}${nota ? `<span>${nota}</span>` : ""}<input type="${tipoIn}" ${t === "n" ? 'step="any" data-num' : ""} data-nx-cfg="${p}" value="${esc(v ?? (t === "col" ? "#5AB0FF" : ""))}"></label>`;
}
function filtriDi(d) { const f = new Set(["tutte"]); const add = (l) => (l || []).forEach((x) => ENT_TIPI(x[2]) && f.add(x[2])); add(d.campi); add(d.opzioni); add((d.elementi || {}).campi); (d.gruppiCampi || []).forEach(([, l]) => add(l)); return [...f]; }
function pannelloGen(id) {
  const d = SEZ_GEN[id], c = cfgGen(id);
  const usate = entitaNegliElementi(id);
  const auto = tutteId().filter((x) => okAuto(id, x) && !usate.has(x)).sort();
  const escl = c.escluse || [], agg = c.aggiunte || [];
  let h = filtriDi(d).map(datalist).join("");
  if (d.nota) h += `<p class="mut" style="margin-top:0">${esc(d.nota)}</p>`;
  if (!d.nonInBarra) h += visTg(id);
  if (d.notifiche) return h + pannelloNotifiche();
  if (d.avvisiAlexa) return h + pannelloAvvisiAlexa();
  if (d.opzioni) h += `<div class="gruppo">Impostazioni</div><div class="griglia">${d.opzioni.map((sp) => campoSpec(`sez_gen.${id}.extra`, sp)).join("")}</div>`;
  if (d.stazione) h += `<div class="riga" style="margin-top:12px"><button class="btn pic" data-nx-trova-stazione>${ico("agente", "s")}Trova i sensori della stazione</button></div>`;
  if (d.campi) h += `<div class="gruppo">${id === "meteo" ? "Previsioni e la mia stazione" : id === "salute" ? "Le misure (vuota = automatica)" : "Entità principali"}</div><div class="griglia">${d.campi.map(([k, n, f, nota]) => campoEnt(`sez_gen.${id}.campi.${k}`, n, f, nota)).join("")}</div>`;
  if (d.gruppiCampi) h += d.gruppiCampi.map(([g, l]) => `<div class="gruppo">${esc(g)}</div><div class="griglia">${l.map(([k, n, f, nota]) => campoEnt(`sez_gen.${id}.campi.${k}`, n, f, nota)).join("")}</div>`).join("");
  if (d.blocchi) { const ord = opz(id, "blocchi") || d.blocchi, nasc = opz(id, "nascosti") || []; const N = { adesso: ["Adesso", "condizioni, percepita, minima e massima"], stazione: ["La mia stazione", "le misure di casa"], ore: ["Prossime 24 ore", "ora per ora, dalle previsioni"], giorni: ["Prossimi giorni", "fino a 7 giorni"], radar: ["Radar pioggia", "la fonte si sceglie qui sopra"] }; h += `<div class="gruppo">La pagina</div>${ord.map((b, i) => `<div class="voce-imp"><div><b>${N[b][0]}</b><small>${N[b][1]}</small></div>${suGiu("meteo", b, i, ord.length)}<button class="tg ${nasc.includes(b) ? "" : "on"}" data-nx-lista="sez_gen.meteo.extra.nascosti" data-v="${b}" aria-label="Mostra ${N[b][0]}"></button></div>`).join("")}`; }
  if (d.radio) h += pannelloRadio(id);
  if (d.elementi) {
    const els = elementiDi(id), nomeEl = d.elementi.nome;
    h += `<div class="gruppo">${esc(nomeEl.charAt(0).toUpperCase() + nomeEl.slice(1))} (${els.length})</div>`;
    if (d.associa) h += `<div class="riga" style="margin-bottom:10px"><button class="btn pic" data-nx-associa>${ico("agente", "s")}Associa i sensori stanza per stanza</button></div>`;
    if (d.rileva) h += `<div class="riga" style="margin-bottom:10px"><button class="btn pic" data-nx-rileva>${ico("agente", "s")}Rileva da Home Assistant</button></div>`;
    h += els.map((el, i) => `<div class="ed-box elem-ed"><div class="riga" style="margin-bottom:10px"><input type="text" data-nx-cfg="sez_gen.${id}.elementi.${i}.nome" value="${esc(el.nome || "")}" placeholder="Nome" style="flex:1;font-weight:600"><button class="btn pic r" data-nx-el-del="${id}|${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div><div class="griglia">${d.elementi.campi.map((sp) => campoSpec(`sez_gen.${id}.elementi.${i}`, sp)).join("")}</div></div>`).join("");
    h += `<div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-el-add="${id}">＋ Aggiungi ${esc(nomeEl)}</button></div>`;
  }
  if (!d.radio) {
    h += `<div class="gruppo">Trovate da sola (${auto.length})</div><p class="mut">Nexalia le riconosce dal tipo e dal nome. Togli quelle che non c'entrano.</p>
    ${auto.slice(0, 80).map((e) => `<div class="voce-imp ${escl.includes(e) ? "spenta" : ""}">${ico(iconaE(e))}<div><b>${esc(nomeE(e))}</b><small>${esc(e)} · ${esc(testoStato(e))}</small></div><button class="btn pic ${escl.includes(e) ? "" : "r"}" data-nx-gen-escl="${id}|${e}">${escl.includes(e) ? "Rimetti" : "Togli"}</button></div>`).join("") || '<p class="dim">Nessuna.</p>'}${auto.length > 80 ? `<p class="dim">…e altre ${auto.length - 80}.</p>` : ""}
    <div class="gruppo">Aggiunte da te</div>
    ${agg.map((e, i) => `<div class="voce-imp">${ico(st(e) ? iconaE(e) : "sensore")}<div><b>${esc(st(e) ? nomeE(e) : e)}</b><small>${esc(e)}</small></div><button class="btn pic r" data-nx-del="sez_gen.${id}.aggiunte" data-i="${i}" aria-label="Togli">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><input type="text" id="nxGenAdd" list="dl-tutte" placeholder="Scegli un'entità: dominio.nome" style="flex:1;min-width:200px" autocomplete="off"><button class="btn pic p" data-nx-gen-add="${id}">＋ Aggiungi un'entità</button></div>`;
  }
  return h;
}
function pannelloRadio(id) {
  const stz = opz(id, "stazioni") || [];
  return `<div class="gruppo">Le radio preferite</div><p class="mut">Compaiono nella sezione Radio e si ascoltano sul lettore scelto qui sopra (anche un Echo).</p>
    ${stz.map((s, i) => `<div class="voce-imp">${s.icona ? `<img src="${esc(s.icona)}" class="radio-logo" alt="" onerror="this.remove()">` : ico("radio")}<div><b>${esc(s.nome)}</b><small>${esc(s.url)}</small></div>${suGiu("radio", String(i), i, stz.length)}<button class="btn pic r" data-nx-del="sez_gen.radio.extra.stazioni" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("") || '<p class="dim">Nessuna radio preferita.</p>'}
    <div class="gruppo">Aggiungi una radio</div><p class="mut">Dalle radio di tutto il mondo (Radio Browser, lo stesso archivio di Home Assistant).</p>
    <div class="riga"><button class="btn pic ${radioModo === "vicino" ? "p" : ""}" data-nx-radio-cerca="vicino">Vicino a te</button><button class="btn pic ${radioModo === "top" ? "p" : ""}" data-nx-radio-cerca="top">Più ascoltate in Italia</button><input type="text" id="nxRadioFiltro" value="${esc(radioFiltro)}" placeholder="Filtra per nome…" style="flex:1;min-width:160px"><button class="btn pic" data-nx-radio-cerca="nome">Cerca</button></div>
    <div style="margin-top:10px">${radioRis === null ? "" : radioRis === "carico" ? '<p class="dim">Cerco le radio…</p>' : radioRis.length ? radioRis.map((r, i) => `<div class="voce-imp">${r.favicon ? `<img src="${esc(r.favicon)}" class="radio-logo" alt="" onerror="this.remove()">` : ico("radio")}<div><b>${esc(r.name)}</b><small>${esc([r.state, r.country, r.tags].filter(Boolean).join(" · ").slice(0, 80))}</small></div><button class="btn pic" data-nx-radio-pref="${i}">＋ Preferita</button></div>`).join("") : '<p class="dim">Nessuna radio trovata.</p>'}</div>
    <div class="riga" style="margin-top:12px"><input type="text" id="nxRadioNome" placeholder="Oppure a mano: nome" style="flex:1;min-width:140px"><input type="text" id="nxRadioUrl" placeholder="Indirizzo dello streaming (https://…)" style="flex:2;min-width:200px"><button class="btn pic" data-nx-radio-add>＋ Aggiungi</button></div>`;
}
const echiDiCasa = () => tutteId().filter((id) => dom(id) === "media_player" && /echo|alexa/.test(testoE(id)));
const CAT_NOTIFICHE = [["urgenti", "Urgenti: antifurto scattato, fumo, gas, acqua"], ["sicurezza", "Sicurezza: inserimenti, aperture con l'allarme"], ["casa", "Casa: consumi, rifiuti, pioggia, irrigazione"], ["persone", "Persone: chi arriva"]];
function pannelloNotifiche() {
  const x = cfgGen("notifiche").extra || {}, echi = echiDiCasa();
  return `<div class="gruppo">Fai dire le notifiche agli Echo</div><p class="mut">Le notifiche arrivano ai telefoni; così le dicono anche gli Echo di casa. Vale per tutta la casa.</p>
    ${interruttore(!!x.attiva, 'data-nx-tg="sez_gen.notifiche.extra.attiva"', "Gli Echo dicono le notifiche")}
    ${echi.length ? `<div class="scelte" style="margin:10px 0">${echi.map((e) => `<button class="${(x.echi || []).includes(e) ? "on" : ""}" data-nx-lista="sez_gen.notifiche.extra.echi" data-v="${e}">${esc(nomeE(e))}</button>`).join("")}</div><div class="riga"><button class="btn pic" data-nx-prova-echo>${ico("media", "s")}Prova</button></div>` : '<p class="ambra-t">Nessun Echo in Home Assistant: installa l\'integrazione «Alexa Media Player» da HACS e accedi con l\'account Amazon. Gli Echo compaiono qui da soli.</p>'}
    <div class="gruppo">Che cosa dicono</div>${CAT_NOTIFICHE.map(([k, n]) => interruttore((x.categorie || []).includes(k), `data-nx-lista="sez_gen.notifiche.extra.categorie" data-v="${k}"`, n)).join("")}
    <div class="gruppo">Di notte zitti</div>${interruttore(!!x.notte, 'data-nx-tg="sez_gen.notifiche.extra.notte"', "Di notte zitti", "Le urgenti si dicono lo stesso")}
    <div class="griglia">${campoSpec("sez_gen.notifiche.extra", ["notte_da", "Dalle", "h"])}${campoSpec("sez_gen.notifiche.extra", ["notte_a", "Alle", "h"])}</div>
    <div class="gruppo">Come lo dice</div><div class="scelte">${[["annuncio", "Annuncio: prima il suono, poi la voce"], ["voce", "Voce: solo la voce"]].map(([k, n]) => `<button class="${(x.modo || "annuncio") === k ? "on" : ""}" data-nx-set="sez_gen.notifiche.extra.modo" data-v="${k}">${n}</button>`).join("")}</div>
    <div class="gruppo">Sul telefono</div>${pannelliBase().agente.html()}`;
}
const GIORNI_AV = [["1", "Lun"], ["2", "Mar"], ["3", "Mer"], ["4", "Gio"], ["5", "Ven"], ["6", "Sab"], ["7", "Dom"]];
function pannelloAvvisiAlexa() {
  const av = opz("avvisi_alexa", "avvisi") || [], x = cfgGen("notifiche").extra || {};
  return `${x.attiva && (x.echi || []).length ? "" : '<p class="ambra-t">Alexa non parla ancora: accendila e scegli gli Echo in Alexa › Notifiche.</p>'}
    <p class="mut">Frasi tue che gli Echo dicono a un orario o quando cambia qualcosa in casa. Quelli a orario si dicono anche di notte.</p>
    ${av.map((a, i) => `<div class="voce-imp">${ico(a.tipo === "orario" ? "orologio" : "allerta")}<div><b>«${esc(a.testo)}»</b><small>${a.tipo === "orario" ? "Alle " + esc(a.ora) + ((a.giorni || []).length ? " · " + a.giorni.map((g) => GIORNI_AV.find((x) => x[0] === String(g))[1]).join(" ") : " · ogni giorno") : "Quando " + esc(a.entita) + " diventa " + esc(a.valore || "on")}</small></div><button class="btn pic r" data-nx-del="sez_gen.avvisi_alexa.extra.avvisi" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="ed-box" style="margin-top:10px"><b>Nuovo avviso</b>
      <label class="campo" style="margin-top:10px">Cosa dice<input type="text" id="nxAvvATesto" value="${esc(nuovoAvvA.testo)}" maxlength="200" placeholder="Es. Ricordati di prendere le chiavi"></label>
      <div class="scelte" style="margin:10px 0">${[["orario", "A un orario"], ["cambio", "Quando cambia qualcosa"]].map(([k, n]) => `<button class="${nuovoAvvA.tipo === k ? "on" : ""}" data-nx-avva-tipo="${k}">${n}</button>`).join("")}</div>
      ${nuovoAvvA.tipo === "orario" ? `<div class="griglia"><label class="campo">Ora<input type="time" id="nxAvvAOra" value="${esc(nuovoAvvA.ora)}"></label></div><div class="scelte" style="margin-top:10px">${GIORNI_AV.map(([k, n]) => `<button class="${nuovoAvvA.giorni.includes(k) ? "on" : ""}" data-nx-avva-giorno="${k}">${n}</button>`).join("")}</div><p class="dim" style="font-size:12px">Nessun giorno scelto = ogni giorno.</p>` : `${datalist("tutte")}<div class="griglia"><label class="campo">Entità<input type="text" id="nxAvvAEnt" list="dl-tutte" value="${esc(nuovoAvvA.entita)}" placeholder="binary_sensor.porta_ingresso" autocomplete="off"></label><label class="campo">Quando diventa<input type="text" id="nxAvvAVal" value="${esc(nuovoAvvA.valore)}" placeholder="on"></label></div>`}
      <div class="riga" style="margin-top:12px"><button class="btn p pic" data-nx-avva-add>＋ Aggiungi avviso</button></div></div>`;
}
function htmlBarraRapida() {
  const b = barraRapida(), tasti = tastiBarra();
  const altre = SCHEDE.filter((s) => !tasti.includes(s.id));
  return `<div class="gruppo">Barra rapida in fondo</div><p class="mut">Una fila di icone in fondo allo schermo per saltare alle sezioni preferite con un tocco. I tasti aprono anche sezioni che non tieni nella barra in alto.</p>
    ${interruttore(barraAccesa(), "data-nx-barra-on", "Mostra la barra rapida", "Spenta, le sezioni tornano nella barra in alto")}
    ${barraAccesa() ? interruttore(!!(S.cfg.generali || {}).sezioni_in_alto, 'data-nx-tg="generali.sezioni_in_alto"', "Sezioni anche nella barra in alto", "Spenta, in alto resta solo l'ingranaggio delle impostazioni") : ""}
    ${barraAccesa() ? `${tasti.map((id, i) => { const s = SCHEDE.find((x) => x.id === id); return `<div class="voce-imp">${ico(s.ic)}<div><b>${esc(id === "agente" ? "Home" : s.nome)}</b></div>${suGiu("barra", id, i, tasti.length)}<button class="btn pic r" data-nx-barra-del="${id}" aria-label="Togli">${ico("cestino", "s")}</button></div>`; }).join("")}
      <div class="gruppo">Aggiungi un tasto</div><div class="scelte">${altre.map((s) => `<button data-nx-barra-add="${s.id}">${ico(s.ic, "s")}${esc(s.nome)}</button>`).join("")}</div>` : ""}`;
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
  energia: { cat: "energia", ic: "energia", tit: "Energia", kw: "energia consumo fotovoltaico rete batteria contatore prezzo", html: () => visTg("energia") + B.energia.html() },
  stanze: { cat: "casa", ic: "stanze", tit: "Stanze", kw: "stanze aree piani", html: () => visTg("stanze") + B.stanze.html() },
  persone: { cat: "casa", ic: "persone", tit: "Persone", kw: "persone presenza telefono batteria", html: () => visTg("persone") + pannelloPersone() },
  sicurezza: { cat: "sicurezza", ic: "sicurezza", tit: "Sicurezza", kw: "sicurezza allarme antifurto telecamere", html: () => visTg("sicurezza") + `<p class="mut">La centrale, le modalità, la sirena, la zona e i tasti dell'antifurto sono in <a href="#" data-pannello="home">Impostazioni › Home</a>.</p>${datalist("camera")}<div class="gruppo">Telecamere</div>${elementiDi("telecamere").map((el, i) => `<div class="ed-box elem-ed"><div class="riga" style="margin-bottom:10px"><input type="text" data-nx-cfg="sez_gen.telecamere.elementi.${i}.nome" value="${esc(el.nome || "")}" placeholder="Nome (es. Giardino)" style="flex:1;font-weight:600"><button class="btn pic r" data-nx-el-del="telecamere|${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div><div class="griglia">${campoSpec(`sez_gen.telecamere.elementi.${i}`, ["camera", "Telecamera", "camera"])}${campoSpec(`sez_gen.telecamere.elementi.${i}`, ["live", "Video dal vivo nella tessera (invece di un'istantanea ogni pochi secondi)", "c"])}</div></div>`).join("") || '<p class="dim">Nexalia mostra da sola tutte le telecamere. Aggiungile qui per dare un nome o il video dal vivo.</p>'}<div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-el-add="telecamere">＋ Aggiungi telecamera</button></div>` },
  raccolta: { cat: "avvisi", ic: "raccolta", tit: "Rifiuti", kw: "rifiuti raccolta differenziata calendario bidone", html: () => visTg("raccolta") + `<p class="mut">I materiali e i giorni si scelgono nella sezione Rifiuti. L'ora dopo la quale la plancia annuncia il ritiro di domani è in <a href="#" data-pannello="home">Impostazioni › Home</a>.</p><div class="riga"><button class="btn p pic" data-nx-vai="raccolta">Apri il calendario</button></div>` },
});
function pannelloPersone() {
  const pp = tutteId().filter((x) => dom(x) === "person"), els = elementiDi("persone");
  return `${datalist("numerico")}${datalist("sensore")}${datalist("tracker")}<p class="mut">Per ogni persona: il telefono, l'orologio e i tempi di rientro. Compaiono nelle schede delle persone in home.</p>
    ${els.map((el, i) => `<div class="ed-box elem-ed"><div class="riga" style="margin-bottom:10px"><input type="text" data-nx-cfg="sez_gen.persone.elementi.${i}.nome" value="${esc(el.nome || "")}" placeholder="Nome di casa" style="flex:1;font-weight:600">${suGiu("persone", String(i), i, els.length)}<button class="btn pic r" data-nx-el-del="persone|${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div><div class="griglia">${[["persona", "Persona (person.*)", "tracker"], ["tracker", "Posizione (device_tracker)", "tracker"], ["batteria", "Batteria del telefono", "numerico"], ["stato_batteria", "Stato della batteria (in carica)", "sensore"], ["orologio", "Batteria dell'orologio", "numerico"], ["distanza", "Distanza da casa", "numerico"], ["rientro", "Tempo per tornare (Waze)", "numerico"], ["attivita", "Attività", "sensore"], ["colore", "Colore", "col"]].map((sp) => campoSpec(`sez_gen.persone.elementi.${i}`, sp)).join("")}</div></div>`).join("")}
    <div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-el-add="persone">＋ Aggiungi persona</button><button class="btn pic" data-nx-importa-persone>⤵ Importa da Home Assistant (${pp.length})</button></div>`;
}
const ORDINE_ED = ["generali", "home", "widget", "azioni", "automazioni", "muro", "entita", "mie", "nascosti", "backup", "runtime", "licenza", "fuori",
  "energia", "accumulo", "veicoli", "ups",
  "clima", "temperatura", "meteo", "termica", "piscina", "irrigazione", "piante", "acqua_gas",
  "stanze", "luci", "finestre", "elettrodomestici", "musica", "radio", "sport", "robot", "stampanti", "animali", "persone", "batterie", "salute", "prese",
  "sicurezza", "varchi", "presenza", "apri_porte", "citofono",
  "allerte", "agenda", "raccolta",
  "notifiche", "avvisi_alexa", "alexa",
  "minipc", "non_connessi"];
const _pannelliEd = pannelli;
const pannelliBase = () => _pannelliEd();
pannelli = function () {
  const B = _pannelliEd();
  const T = { ...B, ...pannelliEsistenti(B) };
  const g0 = T.generali.html; T.generali = { ...T.generali, kw: T.generali.kw + " barra rapida fondo icone navbar", html: () => g0() + htmlBarraRapida() };
  T.automazioni = { cat: "plancia", ic: "scenari", tit: "Automazioni", kw: "automazioni scenari modelli accendi spegni", html: pannelloAutomazioni };
  T.muro = { cat: "plancia", ic: "muro", tit: "A muro", kw: "muro tablet parete riposo notte luminosità orologio", html: pannelloMuro };
  T.mie = { cat: "plancia", ic: "stella", tit: "Le tue sezioni", kw: "sezioni personali mie nuove", html: pannelloMie };
  T.runtime = { cat: "plancia", ic: "aiuto", tit: "Runtime", kw: "runtime versione stato diagnostica", html: pannelloRuntime };
  if (T.entita) Object.assign(T.entita, { cat: "plancia", tit: "Le tue entità" });
  for (const k of ["nascosti", "backup", "licenza", "fuori"]) if (T[k]) T[k].cat = "plancia";
  if (T.nascosti) T.nascosti.tit = "Dispositivi nascosti";
  for (const [id, d] of Object.entries(SEZ_GEN)) T[id] = { cat: d.cat, ic: d.ic, tit: d.nome, kw: d.nome + " " + [...(d.campi || []), ...(d.opzioni || []), ...((d.elementi || {}).campi || [])].map((x) => x[1]).join(" ") + (d.gruppiCampi || []).map((x) => " " + x[0]).join(""), html: () => pannelloGen(id) };
  const out = {};
  for (const k of ORDINE_ED) if (T[k]) out[k] = T[k];
  return out;
};

// ------------------------------------------------------------------ eventi
const nuovoEl = (id) => { const d = SEZ_GEN[id] || {}, n = elementiDi(id).length + 1, nome = ({ persone: "Persona", telecamere: "Telecamera" }[id]) || ((d.elementi || {}).nome || "Elemento"); return { nome: nome.charAt(0).toUpperCase() + nome.slice(1) + " " + n }; };
async function cercaRadio(modo) {
  radioModo = modo; radioRis = "carico"; disegna();
  const base = "https://de1.api.radio-browser.info/json/stations/search?hidebroken=true&limit=40&order=clickcount&reverse=true";
  let url = base + "&countrycode=IT";
  if (modo === "vicino") { const z = st("zone.home"); if (z) url = base + `&has_geo_info=true&geo_lat=${attr("zone.home", "latitude")}&geo_long=${attr("zone.home", "longitude")}&geo_distance=150000`; }
  if (modo === "nome") url = base + "&name=" + encodeURIComponent(radioFiltro);
  try { const r = await fetch(url); radioRis = (await r.json()).filter((x) => x.url_resolved).slice(0, 40); } catch (e) { radioRis = []; avviso("Non riesco a raggiungere l'archivio delle radio", "err"); }
  disegna();
}
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button,a[data-pannello]"); if (!t) return;
  const d = t.dataset;
  if (t.tagName === "A" && d.pannello) { ev.preventDefault(); pannello = d.pannello; localStorage.setItem("nx_pannello", pannello); return disegna(); }
  if (d.nxGenEscl) { const [id, e] = d.nxGenEscl.split("|"); const l = [...(cfgGen(id).escluse || [])]; const i = l.indexOf(e); if (i >= 0) l.splice(i, 1); else l.push(e); await impostaCfg(`sez_gen.${id}.escluse`, l); return disegna(); }
  if (d.nxGenAdd) { const e = $("#nxGenAdd").value.trim(); if (!st(e)) return avviso("Scegli un'entità che esiste", "err"); const l = cfgGen(d.nxGenAdd).aggiunte || []; if (!l.includes(e)) await impostaCfg(`sez_gen.${d.nxGenAdd}.aggiunte`, [...l, e]); return disegna(); }
  if (d.nxElAdd) { await impostaCfg(`sez_gen.${d.nxElAdd}.elementi`, [...elementiDi(d.nxElAdd), nuovoEl(d.nxElAdd)]); return disegna(); }
  if (d.nxElDel) { const [id, i] = d.nxElDel.split("|"); const l = [...elementiDi(id)]; l.splice(Number(i), 1); await impostaCfg(`sez_gen.${id}.elementi`, l); return disegna(); }
  if (d.nxAssocia !== undefined) { const l = [...elementiDi("temperatura")]; let n = 0; for (const a of S.aree) { if (l.find((x) => x.stanza === a.id)) continue; const inA = tutteId().filter((e) => dom(e) === "sensor" && areaEntita(e) === a.id && !/cpu|batter/.test(testoE(e))); const t1 = inA.find((e) => dc(e) === "temperature"), u1 = inA.find((e) => dc(e) === "humidity"); if (t1 || u1) { l.push({ nome: a.nome, stanza: a.id, temperatura: t1 || "", umidita: u1 || "" }); n++; } } await impostaCfg("sez_gen.temperatura.elementi", l); avviso(n ? `Associate ${n} stanze` : "Nessuna stanza nuova da associare", n ? "ok" : ""); return disegna(); }
  if (d.nxRileva !== undefined) { const l = [...elementiDi("agenda")]; for (const e of tutteId().filter((x) => ["calendar", "todo"].includes(dom(x)))) if (!l.find((x) => x.entita === e)) l.push({ nome: nomeE(e), tipo: dom(e) === "todo" ? "lista" : "calendario", entita: e, colore: COLORI[l.length % COLORI.length] }); await impostaCfg("sez_gen.agenda.elementi", l); return disegna(); }
  if (d.nxTrovaStazione !== undefined) { const c = { ...(cfgGen("meteo").campi || {}) }; const s = (cls, re) => tutteId().find((x) => dom(x) === "sensor" && (!cls || dc(x) === cls) && re.test(testoE(x))); const est = /outdoor|estern|outside|fuori|stazione|weather|meteo|ecowitt|netatmo/; const m = { meteo: tutteId().find((x) => dom(x) === "weather"), temperatura: s("temperature", est), umidita: s("humidity", est), percepita: s("", /feels|percepit|apparent/), pressione: s("", /pressure|pressione/), vento: s("", /wind_speed|vento|wind speed/), raffica: s("", /gust|raffica/), direzione: s("", /wind_dir|direzione/), pioggia: s("", /daily_rain|pioggia.?(oggi|giorn)|rain_today/), intensita: s("", /rain_rate|intensit/), uv: s("", /\buv\b|uv_index/), radiazione: s("", /solar_rad|radiazione/), luminosita: s("illuminance", est) }; let n = 0; for (const [k, v] of Object.entries(m)) if (!c[k] && v) { c[k] = v; n++; } await impostaCfg("sez_gen.meteo.campi", c); avviso(n ? `Trovati ${n} sensori` : "Nessun sensore nuovo", n ? "ok" : ""); return disegna(); }
  if (d.nxImportaPersone !== undefined) { const l = [...elementiDi("persone")]; for (const p of tutteId().filter((x) => dom(x) === "person")) if (!l.find((x) => x.persona === p)) l.push({ nome: nomeE(p), persona: p, tracker: (attr(p, "device_trackers") || [])[0] || "", colore: COLORI[l.length % COLORI.length] }); await impostaCfg("sez_gen.persone.elementi", l); return disegna(); }
  if (d.nxRadioCerca) { radioFiltro = ($("#nxRadioFiltro") || {}).value || ""; return cercaRadio(d.nxRadioCerca); }
  if (d.nxRadioPref !== undefined) { const r = radioRis[Number(d.nxRadioPref)]; if (!r) return; await impostaCfg("sez_gen.radio.extra.stazioni", [...(opz("radio", "stazioni") || []), { nome: r.name.trim(), url: r.url_resolved, icona: r.favicon || "" }]); avviso(r.name + " tra le preferite", "ok"); return disegna(); }
  if (d.nxRadioAdd !== undefined) { const nome = $("#nxRadioNome").value.trim(), url = $("#nxRadioUrl").value.trim(); if (!nome || !/^https?:\/\//.test(url)) return avviso("Servono nome e indirizzo http(s)", "err"); await impostaCfg("sez_gen.radio.extra.stazioni", [...(opz("radio", "stazioni") || []), { nome, url }]); return disegna(); }
  if (d.nxRadio !== undefined) { const s = (opz("radio", "stazioni") || [])[Number(d.nxRadio)], l = (cfgGen("radio").campi || {}).lettore; if (!s || !l) return; chiama("media_player", "play_media", { entity_id: l, media_content_id: s.url, media_content_type: "music" }); return avviso("In onda: " + s.nome, "ok"); }
  if (d.nxProvaEcho !== undefined) { try { await api("api/annuncio", { metodo: "POST", corpo: { testo: "Ciao, sono Nexalia. Le notifiche di casa arriveranno anche qui." } }); avviso("Inviato agli Echo", "ok"); } catch (e) { avviso(e.message, "err"); } return; }
  if (d.nxAvvaTipo) { leggiAvvA(); nuovoAvvA.tipo = d.nxAvvaTipo; return disegna(); }
  if (d.nxAvvaGiorno) { leggiAvvA(); const g = nuovoAvvA.giorni; const i = g.indexOf(d.nxAvvaGiorno); if (i >= 0) g.splice(i, 1); else g.push(d.nxAvvaGiorno); return disegna(); }
  if (d.nxAvvaAdd !== undefined) { leggiAvvA(); const a = { ...nuovoAvvA, giorni: [...nuovoAvvA.giorni] }; if (!a.testo) return avviso("Scrivi cosa devono dire", "err"); if (a.tipo === "cambio" && !st(a.entita)) return avviso("Scegli un'entità che esiste", "err"); if (a.tipo === "orario") { delete a.entita; delete a.valore; } else { delete a.ora; delete a.giorni; } await impostaCfg("sez_gen.avvisi_alexa.extra.avvisi", [...(opz("avvisi_alexa", "avvisi") || []), a]); nuovoAvvA = { testo: "", tipo: "orario", ora: "08:00", giorni: [], entita: "", valore: "on" }; return disegna(); }
  if (d.nxBarraOn !== undefined) { const b = { ...barraRapida() }; b.on = !barraAccesa(); if (b.on && !(b.tasti || []).length) b.tasti = tastiBarra().slice(0, 8); await impostaCfg("generali.barra_rapida", b); disegnaSchede(); return disegna(); }
  if (d.nxBarraAdd) { const b = { ...barraRapida() }; b.tasti = [...tastiBarra(), d.nxBarraAdd]; await impostaCfg("generali.barra_rapida", b); disegnaSchede(); return disegna(); }
  if (d.nxBarraDel) { const b = { ...barraRapida() }; b.tasti = tastiBarra().filter((x) => x !== d.nxBarraDel); await impostaCfg("generali.barra_rapida", b); disegnaSchede(); return disegna(); }
  if (d.nxSu || d.nxGiu) {
    const [pref, k] = (d.nxSu || d.nxGiu).split(":"), delta = d.nxSu ? -1 : 1;
    if (pref === "barra") { const o = sposta(tastiBarra(), k, delta); if (o) { await impostaCfg("generali.barra_rapida", { ...barraRapida(), tasti: o }); return disegna(); } return; }
    if (pref === "meteo") { const o = sposta(opz("meteo", "blocchi") || SEZ_GEN.meteo.blocchi, k, delta); if (o) { await impostaCfg("sez_gen.meteo.extra.blocchi", o); return disegna(); } return; }
    if (pref === "radio" || pref === "persone") { const path = pref === "radio" ? "sez_gen.radio.extra.stazioni" : "sez_gen.persone.elementi"; const l = [...(leggiCfg(path) || [])], i = Number(k), j = i + delta; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; await impostaCfg(path, l); return disegna(); }
  }
  if (d.nxIgnora) { await impostaCfg("sez_gen.non_connessi.extra.ignora", [...(opz("non_connessi", "ignora") || []), d.nxIgnora]); return disegna(); }
  if (d.nxIgnoraReset !== undefined) { await impostaCfg("sez_gen.non_connessi.extra.ignora", []); return disegna(); }
  if (d.nxAnnaffia !== undefined) { try { await api("api/annaffia", { metodo: "POST", corpo: {} }); avviso("Irrigazione avviata", "ok"); } catch (e) { avviso(e.message, "err"); } return; }
  if (d.nxApri !== undefined) {
    const el = elementiDi("apri_porte")[Number(d.nxApri)]; if (!el || !st(el.entita)) return;
    const apri = () => { const dm = dom(el.entita); if (dm === "lock") chiama("lock", "unlock", { entity_id: el.entita }); else if (dm === "cover") chiama("cover", "open_cover", { entity_id: el.entita }); else if (dm === "script") chiama("script", "turn_on", { entity_id: el.entita }); else if (["button", "input_button"].includes(dm)) chiama(dm, "press", { entity_id: el.entita }); else chiama("homeassistant", "turn_on", { entity_id: el.entita }); avviso((el.nome || "Apertura") + ": aperto", "ok"); };
    if (!opz("apri_porte", "conferma")) return apri();
    window.__nxApri = apri;
    return finestra(`<div class="tit"><h2>Apro ${esc(el.nome || "")}?</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div><div class="riga"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn p" data-nx-apri-ok>Apri</button></div>`);
  }
  if (d.nxApriOk !== undefined) { chiudiFinestra(); if (window.__nxApri) window.__nxApri(); return; }
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
function leggiAvvA() { const v = (id) => ($(id) ? $(id).value.trim() : null); if (v("#nxAvvATesto") !== null) nuovoAvvA.testo = v("#nxAvvATesto"); if (v("#nxAvvAOra") !== null) nuovoAvvA.ora = v("#nxAvvAOra"); if (v("#nxAvvAEnt") !== null) nuovoAvvA.entita = v("#nxAvvAEnt"); if (v("#nxAvvAVal") !== null) nuovoAvvA.valore = v("#nxAvvAVal") || "on"; }
document.addEventListener("input", (ev) => { if (ev.target.id === "nxCercaNC") { cercaNC = ev.target.value; disegna(); } });

// ================================================================== Stanze e Le tue entità (come GdAHome)
Object.assign(IC, {
  divano: "M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 1 1 2 2v3H3v-3a2 2 0 0 1 0-4zM6 18v2M18 18v2",
  letto: "M3 18V7M3 13h18v5M21 18v-3a2 2 0 0 0-2-2h-8v5M7 11a1.5 1.5 0 1 0 0-.1",
  fornello: "M5 3h14v18H5zM5 8h14M9 5.5h.01M12 5.5h.01M15 5.5h.01M9 13h6v4H9z",
  bagno: "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V5a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2",
  scale: "M4 20h4v-4h4v-4h4V8h4",
  albero: "M12 22v-6M12 3l6 8h-4l4 5H6l4-5H6z",
});
document.getElementById("icone").innerHTML = Object.entries(IC).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join("");
const ICONE_STANZA = ["casa", "divano", "letto", "fornello", "bagno", "computer", "auto", "lavatrice", "porte", "scale", "albero", "pianta", "piscina", "media", "stella", "zampa", "sport", "cubo"];
function iconaStanzaDa(nome) {
  const n = (nome || "").toLowerCase();
  return /cucin|kitchen/.test(n) ? "fornello" : /sala|soggiorn|salott|living/.test(n) ? "divano" : /camer|letto|bed/.test(n) ? "letto" : /bagn|bath|wc/.test(n) ? "bagno" : /uffic|studio|office/.test(n) ? "computer" : /box|garage|autorimessa/.test(n) ? "auto" : /lavander|laundry/.test(n) ? "lavatrice" : /ingress|entrata|corridoio|hall/.test(n) ? "porte" : /giardin|terrazz|balcon|cortile|orto/.test(n) ? "albero" : /piscin/.test(n) ? "piscina" : /scal|mansard|soffitt|cantin/.test(n) ? "scale" : "casa";
}
const stanzeCfg = () => S.cfg.stanze_cfg || { piani: [], vista: "tessere", stanze: [] };
// le stanze di partenza: quelle di prima (se c'erano) oppure le aree di Home Assistant
function stanzeBase() {
  const vecchie = (S.cfg.stanze || []).length ? S.cfg.stanze : S.aree;
  return vecchie.map((a) => ({ id: a.id, nome: a.nome, icona: iconaStanzaDa(a.nome), piano: "", aperto: /giardin|terrazz|balcon|cortile|orto/i.test(a.nome) }));
}
const elencoStanze = () => { const c = stanzeCfg(); return (c.stanze && c.stanze.length) ? c.stanze : stanzeBase(); };
// cosa sta in una stanza: l'area di Home Assistant, le stanze scelte nelle pagine delle sezioni e (per chi le aveva) le assegnazioni di prima
function membriStanza(r) {
  const out = new Set(Object.keys(S.stati).filter((id) => areaEntita(id) === r.id && visibile(id)));
  const vecchia = (S.cfg.stanze || []).find((x) => x.id === r.id); if (vecchia) for (const e of vecchia.entita || []) if (st(e)) out.add(e);
  for (const [sid, c] of Object.entries(S.cfg.sez_gen || {})) for (const el of c.elementi || []) if (el.stanza === r.id) { const spec = ((SEZ_GEN[sid] || {}).elementi || {}).campi || []; for (const [k, , t] of spec) if (ENT_TIPI(t) && el[k] && st(el[k])) out.add(el[k]); }
  for (const m of S.cfg.mie_entita || []) if (m.scheda === "stanza:" + r.id && st(m.entita)) out.add(m.entita);
  return [...out];
}
stanze = function () { return elencoStanze().map((r) => ({ ...r, entita: membriStanza(r) })); };
function righePerGruppo(ids) {
  const g = {};
  for (const id of ids) { const k = ePresa(id) ? "Prese" : eLuce(id) ? "Luci" : GRUPPI[dom(id)] || "Altro"; (g[k] = g[k] || []).push(id); }
  return Object.entries(g).map(([k, l]) => `<div class="gruppo">${esc(k)}</div><div class="righe-ent">${l.map((id) => { const on = ACCESO.includes(st(id).state), tog = ["light", "switch", "input_boolean", "fan"].includes(dom(id)); return `<div class="riga-ent ${on ? "on" : ""}">${ico(iconaE(id))}<span class="n">${esc(nomeE(id))}</span><small>${esc(testoStato(id))}</small>${tog ? `<button class="tg ${on ? "on" : ""}" data-az="toggle" data-id="${id}" aria-label="Accendi o spegni ${esc(nomeE(id))}"></button>` : ""}</div>`; }).join("")}</div>`).join("");
}
vStanze = function () {
  const ss = stanze(), c = stanzeCfg();
  if (!S.stanza || !ss.find((s) => s.id === S.stanza)) S.stanza = ss[0] && ss[0].id;
  const s = ss.find((x) => x.id === S.stanza);
  const piani = c.piani || [];
  const gruppi = piani.length ? [...piani.map((p) => [p.nome, ss.filter((x) => x.piano === p.id)]), ["Senza piano", ss.filter((x) => !piani.find((p) => p.id === x.piano))]].filter((x) => x[1].length) : [["", ss]];
  const ids = s ? s.entita.filter(visibileStanza) : [];
  return `<div class="stanze">
    <section class="card"><div class="tit"><h2>Stanze</h2><button class="btn pic" data-nx-vai-ed="stanze">${ico("matita", "s")}Gestisci</button></div>
      ${gruppi.map(([g, l]) => `${g ? `<div class="gruppo">${esc(g)}</div>` : ""}<div class="elenco">${l.map((x) => { const t = x.aperto ? null : tempStanza(x); return `<button class="${x.id === S.stanza ? "on" : ""}" data-stanza="${esc(x.id)}"><span class="st-ic">${ico(x.icona || "casa")}</span><span style="flex:1"><b>${esc(x.nome)}</b><small>${x.entita.length} dispositivi${x.aperto ? " · all'aperto" : ""}</small></span><span>${t != null ? fmt1(t) + "°" : ""}</span></button>`; }).join("")}</div>`).join("") || '<div class="vuoto">Nessuna stanza. Creale in Impostazioni › Stanze.</div>'}
    </section>
    <section class="card">${s ? `<div class="tit"><div style="display:flex;align-items:center;gap:12px"><span class="st-ic grande">${ico(s.icona || "casa", "l")}</span><div><div class="dim" style="font-size:12px">${esc([piani.find((p) => p.id === s.piano) ? piani.find((p) => p.id === s.piano).nome : "Stanza", s.aperto ? "all'aperto" : ""].filter(Boolean).join(" · "))}</div><h2 style="font-size:26px">${esc(s.nome)}</h2></div></div><div class="riga">${tempStanza(s) != null ? `<b style="font-size:24px">${fmt1(tempStanza(s))}°</b>` : ""}${s.entita.some(eLuce) ? `<button class="btn pic" data-tutte-luci="${esc(s.id)}" data-v="turn_off">Spegni luci</button>` : ""}</div></div>${ids.length ? (c.vista === "righe" ? righePerGruppo(ids) : tesserePerGruppo(ids)) : '<p class="mut">Nessun dispositivo in questa stanza. Assegnalo all\'area in Home Assistant oppure scegli la stanza nelle pagine delle sezioni.</p>'}` : '<div class="vuoto">Seleziona una stanza.</div>'}</section>
  </div>`;
};
let stanzaMod = null, pianoNuovo = "";
function pannelloStanze() {
  const c = stanzeCfg(), ss = elencoStanze(), piani = c.piani || [];
  const conta = (pid) => ss.filter((x) => (pid ? x.piano === pid : !piani.find((p) => p.id === x.piano)));
  return `<p class="mut" style="margin-top:0">Le tue stanze. Ogni stanza compare nei menu delle stanze di clima, elettrodomestici, prese, luci e telecamere. I dispositivi arrivano dalle aree di Home Assistant e dalla stanza che scegli nelle pagine delle sezioni.</p>
    <div class="ed-box"><div class="tit" style="margin-bottom:8px"><b>I piani della casa</b><span class="badge">${piani.length} piani · ${ss.length} stanze</span></div>
      ${piani.length ? "" : '<p class="mut">Nessun piano. Aggiungine uno qui sotto: serve solo se la casa ne ha più d\'uno.</p>'}
      ${piani.map((p, i) => `<div class="voce-imp">${ico("scale")}<div><input type="text" value="${esc(p.nome)}" data-nx-cfg="stanze_cfg.piani.${i}.nome" style="font-weight:600"><small>${conta(p.id).length} stanze · ${esc(conta(p.id).map((x) => x.nome).join(" · "))}</small></div>${suGiu("piani", String(i), i, piani.length)}<button class="btn pic r" data-nx-piano-del="${i}" aria-label="Elimina piano">${ico("cestino", "s")}</button></div>`).join("")}
      <div class="voce-imp">${ico("casa")}<div><b>Senza piano</b><small>${conta("").length} stanze · ${esc(conta("").map((x) => x.nome).join(" · "))}</small></div></div>
      <div class="riga" style="margin-top:8px"><input type="text" id="nxPiano" value="${esc(pianoNuovo)}" placeholder="Nome piano (es. Mansarda)" style="flex:1;min-width:180px"><button class="btn pic p" data-nx-piano-add>＋ Aggiungi piano</button></div>
      <p class="dim" style="font-size:12px;margin-bottom:0">L'ordine dei piani è quello che vedi qui. Eliminare un piano lascia le sue stanze senza piano.</p></div>
    <div class="ed-box" style="margin-top:12px"><b>Vista della stanza</b><p class="mut" style="margin:4px 0 10px">Come si presenta una stanza aperta nella pagina Stanze.</p>
      <div class="scelte-grandi">${[["tessere", "Tessere", "Ogni cosa col suo comando, in una griglia"], ["righe", "Righe", "L'elenco diviso per tipo"]].map(([k, n, d]) => `<button class="${(c.vista || "tessere") === k ? "on" : ""}" data-nx-set="stanze_cfg.vista" data-v="${k}"><b>${n}</b><small>${d}</small></button>`).join("")}</div></div>
    <div class="gruppo">Stanze (${ss.length})</div>
    ${ss.map((x, i) => `<div class="voce-imp stanza-riga"><span class="st-ic">${ico(x.icona || "casa")}</span><div><b>${esc(x.nome)}</b><small>${esc([piani.find((p) => p.id === x.piano) ? piani.find((p) => p.id === x.piano).nome : "", x.aperto ? "all'aperto" : "", membriStanza(x).length + " dispositivi"].filter(Boolean).join(" · "))}</small></div>${suGiu("stanze", String(i), i, ss.length)}<button class="btn pic" data-nx-stanza-mod="${i}" aria-label="Modifica">${ico("matita", "s")}</button><button class="btn pic r" data-nx-stanza-del="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>`).join("")}
    <div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-stanza-add>＋ Aggiungi stanza</button>${(c.stanze || []).length ? "" : '<span class="dim" style="font-size:13px">Per ora sono le aree di Home Assistant: alla prima modifica diventano tue.</span>'}</div>`;
}
function finestraStanza(i) {
  const ss = elencoStanze(), x = i === -1 ? { nome: "", icona: "casa", piano: "", aperto: false } : ss[i], piani = stanzeCfg().piani || [];
  stanzaMod = { i, icona: x.icona || "casa" };
  finestra(`<div class="tit"><h2>${i === -1 ? "Nuova stanza" : "Modifica stanza"}</h2><button class="btn pic" data-chiudi aria-label="Chiudi">${ico("chiudi", "s")}</button></div>
    <label class="campo">Nome<input type="text" id="nxStNome" value="${esc(x.nome)}" maxlength="40" placeholder="Es. Cucina"></label>
    <div class="gruppo">Icona</div><div class="icone-sel">${ICONE_STANZA.map((k) => `<button class="${stanzaMod.icona === k ? "on" : ""}" data-nx-st-icona="${k}" aria-label="Icona ${k}">${ico(k)}</button>`).join("")}</div>
    <label class="campo" style="margin-top:12px">Piano<span>I piani si creano e si ordinano nella pagina Stanze</span><select id="nxStPiano"><option value="">— Senza piano —</option>${piani.map((p) => `<option value="${esc(p.id)}" ${x.piano === p.id ? "selected" : ""}>${esc(p.nome)}</option>`).join("")}</select></label>
    <label class="voce-imp" style="cursor:pointer;margin-top:8px"><input type="checkbox" id="nxStAperto" ${x.aperto ? "checked" : ""} style="width:20px;height:20px"><div><b>All'aperto</b><small>Balcone, terrazzo, giardino. Temperatura e umidità si vedono come sempre, ma l'agente non propone di scaldare, rinfrescare o arieggiare, e la stanza non entra nella media della casa.</small></div></label>
    <div class="riga" style="margin-top:14px"><span class="spazio"></span><button class="btn" data-chiudi>Annulla</button><button class="btn p" data-nx-st-salva>Salva modifiche</button></div>`);
}
async function salvaStanze(nuove) { await salvaCfg({ stanze_cfg: { ...stanzeCfg(), stanze: nuove } }); }

// ---- Le tue entità: un'entità in più, nella scheda che vuoi
let entAperta = -1;
function schedeScelta() { return [["agente", "Home"], ...SCHEDE.filter((s) => !["agente", "impostazioni"].includes(s.id)).map((s) => [s.id, s.nome]), ...elencoStanze().map((r) => ["stanza:" + r.id, "Stanza · " + r.nome])]; }
function pannelloMieEntita() {
  const l = S.cfg.mie_entita || [], sc = schedeScelta(), nomeSc = (k) => (sc.find((x) => x[0] === k) || [null, "—"])[1];
  return `${datalist("tutte")}<p class="mut" style="margin-top:0">Alcune sezioni sono elenchi (luci, prese, telecamere) e un'entità in più si aggiunge sempre. Altre sono fatte di caselle con un ruolo preciso: l'Energia ha una rete e un fotovoltaico, la Sicurezza una centrale, e per un sensore in più non c'è posto. Qui c'è: scegli l'entità, in quale scheda farla comparire, come chiamarla e con che icona. Compare in fondo alla scheda che scegli, e quelle che si accendono si accendono.</p>
    ${l.map((m, i) => `<div class="ed-box elem-ed"><div class="voce-imp" style="border:0;padding:0">${ico(m.icona || "stella")}<div><b>${esc(m.nome || (st(m.entita) ? nomeE(m.entita) : m.entita) || "Entità nuova")}</b><small>${esc(nomeSc(m.scheda))}${m.entita ? " · " + esc(m.entita) : ""}</small></div><button class="btn pic" data-nx-ment-apri="${i}" aria-label="Modifica">${ico("matita", "s")}</button><button class="btn pic r" data-nx-del="mie_entita" data-i="${i}" aria-label="Elimina">${ico("cestino", "s")}</button></div>
      ${entAperta === i ? `<div class="griglia" style="margin-top:12px">
        <label class="campo">In quale scheda<select data-nx-cfg="mie_entita.${i}.scheda"><option value="">— Scegli la scheda —</option>${sc.map(([k, n]) => `<option value="${esc(k)}" ${m.scheda === k ? "selected" : ""}>${esc(n)}</option>`).join("")}</select></label>
        <label class="campo">Nome (facoltativo)<input type="text" data-nx-cfg="mie_entita.${i}.nome" value="${esc(m.nome || "")}" placeholder="${esc(st(m.entita) ? nomeE(m.entita) : "Nome")}"></label>
        ${campoEnt(`mie_entita.${i}.entita`, "Entità", "tutte")}
      </div><div class="gruppo">Icona</div><div class="icone-sel">${["stella", ...ICONE_SCELTA.filter((x) => x !== "stella"), "stampante", "computer", "termometro", "pianta"].map((k) => `<button class="${(m.icona || "stella") === k ? "on" : ""}" data-nx-ment-icona="${i}|${k}" aria-label="Icona ${k}">${ico(k)}</button>`).join("")}</div>` : ""}</div>`).join("")}
    <div class="riga" style="margin-top:8px"><button class="btn pic p" data-nx-ment-add>＋ Aggiungi entità</button></div>`;
}
// in fondo alla scheda scelta
function htmlMieEntita(scheda) {
  const l = (S.cfg.mie_entita || []).filter((m) => m.scheda === scheda && m.entita && st(m.entita));
  if (!l.length) return "";
  return `<section class="card mie-entita"><div class="tit"><h2>${ico("stella")} Le tue entità</h2></div><div class="tessere">${l.map((m) => { let t = tessera(m.entita); if (m.nome) t = t.replace(/(<div class="nome">)[^<]*(<\/div>)/, `$1${esc(m.nome)}$2`); if (m.icona) t = t.replace(/<svg class="ic ic-[a-z0-9_]+ ([^"]*)"><use href="#i-[a-z0-9_]+"\/><\/svg>/, `<svg class="ic ic-${m.icona} $1"><use href="#i-${m.icona}"/></svg>`); return t; }).join("")}</div></section>`;
}
const _disegnaME = disegna;
disegna = function () {
  _disegnaME();
  if (!S.cfg || S.scheda === "impostazioni") return;
  const h = htmlMieEntita(S.scheda);
  if (h) $("#vista").insertAdjacentHTML("beforeend", h);
};
// le due pagine dell'editor
const _pannelliSt = pannelli;
pannelli = function () {
  const P = _pannelliSt();
  if (P.stanze) P.stanze = { ...P.stanze, kw: "stanze piani icona all'aperto vista tessere righe ordine", html: () => visTg("stanze") + pannelloStanze() };
  if (P.entita) P.entita = { ...P.entita, ic: "stella", tit: "Le tue entità", kw: "le tue entità aggiungi entità scheda icona nome", html: pannelloMieEntita };
  return P;
};
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button"); if (!t) return;
  const d = t.dataset;
  if (d.nxVaiEd) { pannello = d.nxVaiEd; localStorage.setItem("nx_pannello", pannello); return vai("impostazioni"); }
  if (d.nxPianoAdd !== undefined) { const n = $("#nxPiano").value.trim(); if (!n) return avviso("Scrivi il nome del piano", "err"); pianoNuovo = ""; await salvaCfg({ stanze_cfg: { ...stanzeCfg(), piani: [...(stanzeCfg().piani || []), { id: "p_" + Date.now().toString(36), nome: n.slice(0, 30) }] } }); return disegna(); }
  if (d.nxPianoDel !== undefined) { const c = stanzeCfg(), p = (c.piani || [])[Number(d.nxPianoDel)]; if (!p) return; if (!confirm(`Elimino il piano «${p.nome}»? Le sue stanze restano, senza piano.`)) return; await salvaCfg({ stanze_cfg: { ...c, piani: c.piani.filter((x) => x.id !== p.id), stanze: (c.stanze && c.stanze.length ? c.stanze : stanzeBase()).map((x) => x.piano === p.id ? { ...x, piano: "" } : x) } }); return disegna(); }
  if (d.nxStanzaAdd !== undefined) return finestraStanza(-1);
  if (d.nxStanzaMod !== undefined) return finestraStanza(Number(d.nxStanzaMod));
  if (d.nxStIcona) { stanzaMod.icona = d.nxStIcona; t.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b === t)); return; }
  if (d.nxStSalva !== undefined) {
    const nome = $("#nxStNome").value.trim(); if (!nome) return avviso("Dai un nome alla stanza", "err");
    const l = [...elencoStanze()], v = { nome: nome.slice(0, 40), icona: stanzaMod.icona, piano: $("#nxStPiano").value, aperto: $("#nxStAperto").checked };
    if (stanzaMod.i === -1) l.push({ id: "st_" + Date.now().toString(36), ...v }); else l[stanzaMod.i] = { ...l[stanzaMod.i], ...v };
    await salvaStanze(l); chiudiFinestra(); return;
  }
  if (d.nxStanzaDel !== undefined) { const l = [...elencoStanze()], x = l[Number(d.nxStanzaDel)]; if (!confirm(`Elimino la stanza «${x.nome}»? I dispositivi non vengono toccati.`)) return; l.splice(Number(d.nxStanzaDel), 1); await salvaStanze(l); return disegna(); }
  if (d.nxSu || d.nxGiu) {
    const [pref, k] = (d.nxSu || d.nxGiu).split(":"), delta = d.nxSu ? -1 : 1, i = Number(k), j = i + delta;
    if (pref === "stanze") { const l = [...elencoStanze()]; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; await salvaStanze(l); return disegna(); }
    if (pref === "piani") { const c = stanzeCfg(), l = [...(c.piani || [])]; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; await salvaCfg({ stanze_cfg: { ...c, piani: l } }); return disegna(); }
  }
  if (d.nxMentAdd !== undefined) { const l = [...(S.cfg.mie_entita || []), { scheda: "agente", icona: "stella", nome: "", entita: "" }]; entAperta = l.length - 1; await salvaCfg({ mie_entita: l }); return disegna(); }
  if (d.nxMentApri !== undefined) { entAperta = entAperta === Number(d.nxMentApri) ? -1 : Number(d.nxMentApri); return disegna(); }
  if (d.nxMentIcona) { const [i, k] = d.nxMentIcona.split("|"); await impostaCfg(`mie_entita.${i}.icona`, k); return disegna(); }
});
document.addEventListener("input", (ev) => { if (ev.target.id === "nxPiano") pianoNuovo = ev.target.value; });
// la stella su una tessera mette l'entità in "Le tue entità" della Home; i vecchi preferiti passano lì una volta sola
function migraPreferiti() {
  const h = S.cfg.home || {}, p = h.preferiti || [];
  if (!p.length && !(h.riquadri || []).includes("preferiti") && !(h.ordine || []).includes("preferiti")) return;
  const l = [...(S.cfg.mie_entita || [])];
  for (const id of p) if (!l.find((m) => m.scheda === "agente" && m.entita === id)) l.push({ scheda: "agente", icona: "", nome: "", entita: id });
  salvaCfg({ mie_entita: l, home: { ...S.cfg.home, preferiti: [], riquadri: (S.cfg.home.riquadri || []).filter((k) => k !== "preferiti"), ordine: (S.cfg.home.ordine || []).filter((k) => k !== "preferiti") } });
}
const _caricaMP = carica;
carica = async function () { await _caricaMP(); if (S.cfg) migraPreferiti(); };
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button[data-pref]"); if (!t) return;
  ev.stopImmediatePropagation();
  const id = t.dataset.pref, l = S.cfg.mie_entita || [], c = l.find((m) => m.scheda === "agente" && m.entita === id);
  await salvaCfg({ mie_entita: c ? l.filter((m) => m !== c) : [...l, { scheda: "agente", icona: "", nome: "", entita: id }] });
  avviso(c ? "Tolto dalla home" : "Aggiunto in fondo alla home", "ok"); disegna();
}, true);
const _attesaMP = setInterval(() => { if (S.cfg) { clearInterval(_attesaMP); migraPreferiti(); } }, 300);

// ================================================================== Rifiuti: più materiali nello stesso giorno
// il giorno resta un testo ("Plastica e metalli + Vetro"): promemoria, pastiglia e riquadri lo mostrano così com'è
const SEP_RACC = " + ";
const tipiGiorno = (k) => String(((S.cfg.raccolta || {}).calendario || {})[k] || "").split(SEP_RACC).map((x) => x.trim()).filter(Boolean);
function tipiRaccolta() { const extra = (S.cfg.raccolta || {}).tipi_extra || []; return [...Object.keys(TIPI_RACC).filter(Boolean).map((k) => [k, TIPI_RACC[k][1]]), ...extra.map((x) => [x.nome, x.colore || "#B48CFF"])]; }
const coloreRacc = (n) => (tipiRaccolta().find((x) => x[0] === n) || [n, "#B48CFF"])[1];
let tipoRaccNuovo = "";
vRaccolta = function () {
  const r = S.cfg.raccolta, domani = ((new Date().getDay() + 1) % 7) || 7, dom = tipiGiorno(String(domani)), tipi = tipiRaccolta();
  return `<div class="griglia racc-griglia">
    <section class="card"><h2>Raccolta differenziata</h2><p class="mut" style="margin-top:-6px">Tocca i materiali che passano a ritirare ogni giorno: puoi sceglierne più d'uno (es. lunedì plastica e vetro). Nexalia ti ricorda la sera prima cosa portare fuori.</p>
      <div class="settimana">${GIORNI.map((g, i) => { const k = String(i + 1), sel = tipiGiorno(k); return `<div class="giorno"><b>${g}</b><div class="tipi-barra">${sel.length ? sel.map((t) => `<i style="background:${coloreRacc(t)}"></i>`).join("") : '<i style="background:#2A3644"></i>'}</div><div class="chip-racc">${tipi.map(([n, c]) => `<button class="${sel.includes(n) ? "on" : ""}" style="--c:${c}" data-nx-racc="${k}|${esc(n)}" aria-pressed="${sel.includes(n)}">${esc(n)}</button>`).join("")}</div></div>`; }).join("")}</div>
      <div class="gruppo">Altri materiali</div><p class="mut" style="margin-top:0">Se il tuo comune ritira anche altro (sfalci, pannolini, olio…) aggiungilo qui: compare in tutti i giorni.</p>
      ${((r.tipi_extra) || []).map((x, i) => `<div class="voce-imp"><i class="pallino" style="background:${esc(x.colore)}"></i><div><b>${esc(x.nome)}</b></div><button class="btn pic r" data-nx-racc-del="${i}" aria-label="Elimina ${esc(x.nome)}">${ico("cestino", "s")}</button></div>`).join("")}
      <div class="riga" style="margin-top:8px"><input type="text" id="nxRaccTipo" value="${esc(tipoRaccNuovo)}" placeholder="Es. Sfalci e potature" maxlength="30" style="flex:1;min-width:180px"><input type="color" id="nxRaccCol" value="#B48CFF" aria-label="Colore"><button class="btn pic p" data-nx-racc-add>＋ Aggiungi materiale</button></div>
    </section>
    <section class="card"><div class="dim" style="font-size:12px">Domani, ${GIORNI[domani - 1].toLowerCase()}</div><h2 style="margin:4px 0 14px">${dom.length ? dom.map((t) => `<span style="color:${coloreRacc(t)}">${esc(t)}</span>`).join('<span class="dim"> + </span>') : '<span style="color:var(--mut)">Nessuna raccolta</span>'}</h2>
      <div class="voce-imp"><div><b>Promemoria</b><small>La sera prima, sulla plancia e sul telefono</small></div><button class="tg ${r.attiva ? "on" : ""}" data-racc-attiva aria-label="Promemoria raccolta"></button></div>
      <label class="campo" style="margin-top:12px">Orario del promemoria<input type="time" id="raccOra" value="${esc(r.ora)}"></label>
      <p class="dim" style="font-size:13px">Il promemoria va al servizio di notifica scelto in Impostazioni › Agente.</p>
    </section>
  </div>`;
};
document.addEventListener("click", async (ev) => {
  const t = ev.target.closest("button"); if (!t) return;
  const d = t.dataset, r = S.cfg && S.cfg.raccolta;
  if (d.nxRacc) {
    const [k, n] = d.nxRacc.split("|"), sel = tipiGiorno(k), ordine = tipiRaccolta().map((x) => x[0]);
    const nuovi = (sel.includes(n) ? sel.filter((x) => x !== n) : [...sel, n]).sort((a, b) => ordine.indexOf(a) - ordine.indexOf(b));
    await salvaCfg({ raccolta: { ...r, calendario: { ...r.calendario, [k]: nuovi.join(SEP_RACC) } } }); return disegna();
  }
  if (d.nxRaccAdd !== undefined) {
    const n = $("#nxRaccTipo").value.trim().replace(/\+/g, "").slice(0, 30); if (!n) return avviso("Scrivi il nome del materiale", "err");
    if (tipiRaccolta().some((x) => x[0].toLowerCase() === n.toLowerCase())) return avviso("C'è già", "err");
    tipoRaccNuovo = ""; await salvaCfg({ raccolta: { ...r, tipi_extra: [...(r.tipi_extra || []), { nome: n, colore: $("#nxRaccCol").value }] } }); return disegna();
  }
  if (d.nxRaccDel !== undefined) {
    const x = (r.tipi_extra || [])[Number(d.nxRaccDel)]; if (!x || !confirm(`Elimino «${x.nome}»? Viene tolto anche dai giorni.`)) return;
    const cal = {}; for (const [k, v] of Object.entries(r.calendario || {})) cal[k] = String(v).split(SEP_RACC).filter((y) => y.trim() !== x.nome).join(SEP_RACC);
    await salvaCfg({ raccolta: { ...r, calendario: cal, tipi_extra: r.tipi_extra.filter((y) => y !== x) } }); return disegna();
  }
});
document.addEventListener("input", (ev) => { if (ev.target.id === "nxRaccTipo") tipoRaccNuovo = ev.target.value; });
