# Novità

## 1.14.0
- Comandi rapidi senza AI, attivi da subito: accendi, spegni, alza e abbassa li esegue direttamente Home Assistant, in meno di un secondo. L'assistente AI (Gemini, Claude, ChatGPT…) risponde solo alle domande che Home Assistant non capisce.
  - Vale sia nella casella "Chiedi a Nexalia" sia a voce (Echo, telefono, satelliti): Nexalia attiva "preferisci i comandi locali" negli assistenti vocali che usano un agente AI.
  - Si spegne in Impostazioni → Assist e voce → "Comandi rapidi senza AI".

## 1.13.0
- Casa 3D: ogni parete si può accorciare, allungare o togliere, per esempio per fare una parete divisoria corta.
  - Modifica → tocca una stanza → "Pareti" → scegli la parete (In alto, In basso, A sinistra, A destra).
  - Con − e ＋ la accorci o la allunghi da un lato o dall'altro. "Nessuna" la toglie, "Intera" la rimette com'era.
  - Se la parete è in comune con la stanza accanto, si aggiorna anche lì.

## 1.12.1
- Casa 3D: "Arreda in automatico" riconosce anche le stanze chiamate "Sala" come soggiorno.

## 1.12.0
- Casa 3D tridimensionale: le stanze hanno muri e pavimenti (piastrelle, parquet) e si possono arredare con mobili 3D.
  - Mobili disponibili: letto matrimoniale e singolo, comodino con lampada, armadio, doccia, vasca, water, bidet, lavandino con specchio, lavatrice, cucina, frigorifero, tavolo con sedie, divano, poltrona, mobile TV, scrivania, libreria, pianta, tappeto.
  - I mobili li scegli tu: Modifica → tocca una stanza → "Aggiungi mobile". Poi li trascini dove vuoi, li ruoti o li togli.
  - "Arreda in automatico" (facoltativo) propone un arredo in base al nome della stanza: bagno, camera, cucina, soggiorno, studio, lavanderia.
  - Collegati alla casa: con la luce accesa si illuminano le lampade, con la TV accesa si illumina lo schermo, con la lavatrice in funzione si anima l'oblò.

## 1.11.0
- Impostazioni più chiare: la vecchia pagina unica è divisa in pagine corte.
  - Plancia: Generali, Home, **Barra in fondo e sezioni** (nuova), Widget, Azioni, **Assistente e voce** (nuova), Licenza, Collega da fuori casa.
  - Nuova categoria **Avanzate**: Automazioni, A muro, Le tue entità, Le tue sezioni, Dispositivi nascosti, Backup, **Manutenzione** (nuova), Runtime.
  - Ogni pagina nuova ha una riga che spiega a cosa serve.

## 1.10.2
- Barra rapida ancorata in fondo allo schermo, a tutta larghezza e con fondo pieno: sempre allo stesso posto, non si confonde più con i riquadri. Icone e scritte più grandi.

## 1.10.1
- Home ordinata: nasconde anche i widget senza nulla da mostrare (es. Agenda con 0 calendari); intestazione più bassa quando il meteo non c'è.

## 1.10.0
- Home ordinata (attiva da sola, si spegne in Impostazioni › Home): ogni informazione compare una volta sola.
  - Via il blocco "Cosa succede in casa" (ripeteva data, ora e stanze) e la fila consumo/porte/allarme quando ci sono i widget.
  - Le pastiglie uguali a un widget non compaiono più.
  - Niente riquadri vuoti: i widget senza dati ("—", "non disponibile") e quelli "0, tutto a posto" si nascondono; "Cosa è successo" compare solo quando c'è qualcosa.
  - Intestazione: niente più "— UNAVAILABLE" quando il meteo non risponde.

## 1.9.1
- La plancia si aggiorna anche sui browser integrati che bloccano il collegamento in tempo reale (tablet, Echo con LineageOS, app che la mostrano a tutto schermo): in quel caso chiede lo stato ogni 6 secondi.

## 1.9.0
- L'agente non fa più nulla da solo: quando vede qualcosa che non va lo mostra in cima alla home e chiede cosa fare, con i pulsanti per farlo.
  - Siete usciti tutti e l'antifurto non è inserito → "Inserisci l'antifurto".
  - Siete tutti fuori e una porta o finestra è aperta.
  - Siete tutti fuori e ci sono luci accese → "Spegni le luci".
  - Consumi vicini o oltre il limite del contatore → "Spegni …" per i carichi differibili.
  - L'antifurto sta suonando → avviso urgente, "Guarda le telecamere" o "Disinserisci".
- Gli avvisi spariscono da soli quando il problema si risolve; arrivano anche come notifica.

## 1.8.2
- Correzione: la home restava vuota se un sensore della batteria del telefono non aveva stato.

## 1.8.1
- Batteria del telefono anche quando arriva solo con la posizione (iPhone e app di Home Assistant senza sensori attivi).

## 1.8.0
- Persone in home: batteria del telefono sempre visibile (livello colorato e fulmine quando è in carica). Con l'app di Home Assistant la trova da sola.
- Avatar animati (sbattono le palpebre, respirano, salutano quando sei in casa) personalizzabili in Impostazioni › Persone: pelle, capelli, colore, barba, occhiali, maglia e sfondo, oppure foto o iniziale. Tasto "A caso".

## 1.7.3
- Impostazioni: nuovo interruttore "Nexalia come schermata iniziale per tutti". Aprendo Home Assistant parte subito Nexalia per tutti gli utenti.

## 1.7.2
- Voce: sui telefoni e nell'app di Home Assistant la risposta ora si sente (l'audio viene sbloccato al tocco su "Invia").
- Nuova opzione "Dove parla": questo apparecchio oppure un altoparlante di casa (Echo, Google, Sonos…).

## 1.7.1
- "Applica all'assistente" non riporta più il modello AI a quello predefinito quando cambia il carattere.

## 1.7.0
- Impostazioni › Assistente: la plancia può rispondere con una voce di Home Assistant (Piper o un servizio cloud), uguale su tutti gli apparecchi, con il tasto "Prova la voce".
- Carattere dell'assistente AI: Maggiordomo, Amichevole, Essenziale o "A modo mio". Nexalia scrive le istruzioni direttamente nell'assistente AI di Home Assistant (Claude, ChatGPT, Gemini…).

## 1.6.3
- Casa 3D, modifica: le stanze si ridimensionano da tutti e quattro i bordi e dai quattro angoli, con maniglie grandi e dentro la stanza (prima c'era solo un quadratino nell'angolo, spesso coperto dalla stanza accanto).
- Passo di mezza cella, misura visibile mentre trascini e griglia di riferimento.
- Tocca una stanza per sceglierla: compare una barra con Larghezza −/＋, Profondità −/＋ e le frecce per spostarla.

## 1.6.2
- Rifiuti: sul telefono la pagina andava fuori schermo a destra; ora il riquadro "Domani" va sotto al calendario.

## 1.6.1
- Il blocco "Dispositivi" sparisce dalla home anche per chi lo aveva acceso senza preferiti.

## 1.6.0
- Stanze come GdAHome: piani della casa, vista Tessere o Righe, icona, piano e "all'aperto" per ogni stanza, ordine con le frecce. Niente più assegnazione dei dispositivi da qui: arrivano dalle aree di Home Assistant e dalla stanza scelta nelle sezioni.
- Le tue entità come GdAHome: scegli un'entità, la scheda in cui farla comparire, nome e icona; compare in fondo a quella scheda.
- Home: tolto il blocco "Dispositivi". La stella su una tessera ora aggiunge l'entità in fondo alla Home (i vecchi preferiti passano lì da soli).
- Rifiuti: più materiali nello stesso giorno (es. lunedì plastica e vetro) e materiali in più a scelta (sfalci, pannolini, olio…).

## 1.5.1
- Tema scuro, chiaro o automatico (segue il telefono o il computer): Impostazioni › Impostazioni › Schermo. Nel tema chiaro le icone usano tinte più scure per restare leggibili.

## 1.5.0
- Icone a colori in tutta la plancia: tessere, widget, pastiglie, titoli delle sezioni, riquadri, menu delle impostazioni e barra rapida. Lo stesso tipo di cosa ha sempre lo stesso colore (luci gialle, clima verde acqua, finestre azzurre, sicurezza rossa, rifiuti verdi…). Le tessere accese si colorano nel loro colore, quelle non disponibili restano grigie.
- Si torna alle icone grigie da Impostazioni › Impostazioni › Icone colorate.

## 1.4.3
- Barra rapida a colori: ogni sezione ha la sua icona colorata e il tasto aperto si accende nel colore della sezione. Si torna alle icone grigie da Impostazioni › Impostazioni › Icone colorate.

## 1.4.2
- Riquadro dell'agente più compatto: cerchio piccolo a sinistra, frase e domanda a destra.
- Schede delle persone più piccole, due per riga sul telefono.

## 1.4.1
- Le schede delle persone stanno in cima alla home, sotto le pastiglie.
- La pastiglia Presenza compare solo quando qualcuno è in casa (niente più «Nessuno in casa»).
- In home compaiono anche le persone aggiunte in Impostazioni › Persone con il solo telefono, ognuna col suo stato.

## 1.4.0
- Barra rapida in fondo con le icone delle sezioni preferite: si accende, si spegne e si sceglie quali tasti mettere e in che ordine (Impostazioni › Impostazioni). In alto resta solo l'ingranaggio delle impostazioni; le sezioni in alto si possono rimettere.
- Le pagine delle impostazioni hanno le caselle complete di ogni sezione: più UPS (stato NUT, rete, autonomia), più piscine (pH e cloro con limiti, filtrazione giornaliera automatica), zone e programma dell'irrigazione (salta col terreno bagnato o la pioggia probabile, parte da sola col terreno secco), veicoli (auto o moto, elettrica/termica/ibrida, batteria, autonomia, ricarica, gomme, portiere, EVCC e wallbox), unità clima con tasto rapido, temperature per stanza con associazione automatica, impianti di gestione termica (solare, scaldabagno, caldaia, stufa a pellet), piante, contatori acqua e gas, finestre e tapparelle, elettrodomestici con soglia «in funzione», stampanti, robot, animali, acquari e terrari, persone con telefono e orologio, prese «si vedono ma non si comandano», telecamere, aperture con conferma, citofoni e cassette della posta, calendari e liste, nodi del MiniPC.
- Meteo: previsioni ora per ora e dei prossimi giorni, la tua stazione (trova i sensori da sola), radar pioggia e ordine dei blocchi.
- Allerte: terremoti, protezione civile, fulmini, pollini, comfort termico, voli sopra casa, scioperi, treni e qualità dell'aria.
- Agenda con gli eventi dei prossimi 14 giorni e le liste delle cose da fare.
- Radio: cerca fra le radio vicine, le più ascoltate o per nome e salva le preferite.
- Salute con l'anello dei passi e le misure.
- Alexa: gli Echo dicono le notifiche (urgenti, sicurezza, casa, persone) con il silenzio di notte, e avvisi personalizzati a orario o quando cambia qualcosa.
- Dispositivi non connessi: ricerca e dispositivi da ignorare.

## 1.3.2
- Dispositivi non connessi contati per dispositivo (non per singola entità), con marca, modello, stanza e da quando non rispondono.
- Apri porte e cancelli: niente più falsi riconoscimenti come la "echo cancellation" degli Echo.

## 1.3.1
- Riconoscimento più preciso: le entità di Echo, altoparlanti e telecamere non finiscono più in Veicoli, UPS, Animali o MiniPC, e la stampante non finisce più in Salute.

## 1.3.0
- Impostazioni ordinate per categorie: Plancia, Energia, Clima e acqua, Casa, Sicurezza, Avvisi, Alexa, Macchine e rete, con 52 pagine.
- Nuove sezioni, ognuna con la sua pagina nell'editor (accendila e compare nella barra in alto): Batteria di accumulo, Veicoli, UPS, Clima, Temperatura, Meteo (con previsioni, alba e tramonto), Gestione termica, Piscina, Irrigazione, Piante, Acqua e gas, Luci, Finestre, Elettrodomestici, Musica, Radio (con le tue stazioni), Sport, Robot, Stampanti, Animali, Batterie, Salute, Prese, Varchi, Presenza, Apri porte e cancelli, Citofono e posta, Allerte, Agenda, Musica su Alexa, MiniPC e rete, Dispositivi non connessi.
- Ogni sezione trova da sola le sue entità; puoi togliere quelle che non c'entrano, aggiungerne altre e scegliere le entità principali.
- Le tue sezioni: crei sezioni tue con nome, icona ed entità.
- A muro: per i tablet appesi, con pagina fissa, orologio di riposo e luminosità ridotta di notte.
- Automazioni: tutte le automazioni di Home Assistant da accendere e spegnere.
- Runtime: come sta girando la plancia.
- La sezione Raccolta si chiama Rifiuti.

## 1.2.2
- Sul telefono i popup (luci, prese, widget) non escono più dallo schermo.

## 1.2.1
- Modo chiosco: la plancia occupa davvero tutto lo schermo anche con Home Assistant 2026 (prima restava una striscia vuota a sinistra).

## 1.2.0
- Impostazioni: utente amministratore (solo lui vede e cambia le impostazioni), modo chiosco senza la barra laterale di Home Assistant, intestazione fissa, assistente e voce, sezioni e ordine della barra, diagnosi, autorilevamento e reset totale.
- Home a blocchi in ordine libero: intestazione col meteo, pastiglie di stato, agente, stanze, dispositivi, cosa è successo, persone, widget, azioni rapide e i riquadri di prima.
- Pastiglie di stato: antifurto, posta, rifiuti, porte, finestre, serrature, stampanti, aggiornamenti, luci, tapparelle, clima, prese, musica, presenza, temperatura, umidità e pioggia. Compaiono solo quando hanno qualcosa da dire.
- Antifurto: modalità da mostrare, sensore "scattato" con il suo valore, sirena con il tasto per spegnerla, zona e tasti personalizzati per chi non ha una centrale.
- Widget: 24 widget da accendere e ordinare, tessere compatte (mai, auto, sempre) e avvisi personalizzati che si aprono da soli quando si accendono.
- Azioni rapide: popup delle luci (scelte o tutte), delle prese, del clima, dell'antifurto e della lavatrice, accendi/spegni, lettore multimediale, script e scene, con messaggio di conferma.
- Backup: copia negli appunti e ripristino incollando il testo.

## 1.1.4
- Dopo un aggiornamento la plancia mostra subito la versione nuova: il browser non riusa più i file vecchi rimasti in memoria.

## 1.1.3
- In alto a sinistra resta sempre "Casa · Nexalia"; in Impostazioni › Generali puoi aggiungere accanto il nome della tua casa (facoltativo).
- Tolta la scelta di tema e colori: la plancia mantiene i suoi colori originali.

## 1.1.2
- Gli aggiornamenti di Nexalia compaiono subito in Impostazioni › Aggiornamenti di Home Assistant: quando esce una nuova versione Nexalia chiede a Home Assistant di ricontrollare l'archivio delle app invece di aspettare il controllo periodico.

## 1.1.1
- Testi di esempio dell'editor più generici.

## 1.1.0
- Nuovo editor delle impostazioni: ricerca in tutte le impostazioni, filtri per categoria, menu laterale e pannelli (su telefono il menu diventa una barra scorrevole).
- Sezioni: accendi, spegni e riordina le sezioni della barra in alto.
- Le tue entità: rinomina un dispositivo, cambiagli l'icona o di' a Nexalia cos'è davvero (luce, presa, interruttore, multimedia, accessorio di telecamera, sensore). Vale solo nella plancia.
- Assist e voce: scegli quale assistente di Home Assistant usare, fai leggere le risposte ad alta voce o nascondi la casella "Chiedi a Nexalia".

## 1.0.6
- Schermata principale personalizzabile (Impostazioni › Schermata principale): scegli quali riquadri vedere (stanze, cosa è successo, preferiti, consumo, persone, porte e finestre, allarme, meteo, raccolta di domani) e in che ordine.
- Preferiti: tocca la stella su un dispositivo per averlo nella home.
- Nascondi dispositivo: tocca l'occhio barrato su una tessera; lo ritrovi in Impostazioni › Dispositivi nascosti.

## 1.0.5
- Luci: solo le luci vere. Il faretto delle telecamere e lo schermo di Echo Show e smart display non compaiono più tra le luci.
- Prese: solo le prese. Gli altri interruttori sono in "Altri interruttori"; quelli di telecamere ed Echo (privacy, microfono, sveglie, modalità notte…) sono raggruppati sotto Telecamere o Multimedia.
- Il copriobiettivo dell'Echo Show non viene più scambiato per una finestra aperta.
- Allarme non disponibile: niente più pulsanti, solo un avviso.
- Telecamere non disponibili: segnaposto al posto dell'immagine rotta.
- Nomi più puliti: "Scaldino Socket 1" diventa "Scaldino".
- Nuova scheda "Collega un dispositivo da fuori casa" in Impostazioni, con indirizzo nascosto (Mostra/Copia), QR code e istruzioni. Per privacy l'indirizzo non compare più nella schermata principale.

## 1.0.4
- Echo Show, Echo e altri smart speaker/display non vengono più contati come luci o prese: schermo, "non disturbare" e simili finiscono sotto Multimedia e sono esclusi da "Tutte le luci", dai conteggi dell'agente e dalla Casa 3D.

## 1.0.3
- Quando esce una nuova versione, Nexalia lo segnala con una notifica in Home Assistant, un avviso in cima alla plancia e il pulsante Aggiorna.
- Nuovo pulsante "Cerca aggiornamenti" in Impostazioni.

## 1.0.2
- Promemoria e controlli dell'agente all'ora giusta: Nexalia ora usa il fuso orario di Home Assistant.
- Allarme non disponibile mostrato come "Non disponibile".
- Corretto il testo "1 apertura aperta".
- Aggiornata la configurazione di installazione al nuovo formato di Home Assistant (niente più avviso su build.yaml).

## 1.0.1
- Contatore anonimo delle installazioni: una volta al giorno Nexalia invia solo un codice casuale, la versione e se la licenza è completa. Nessun dato della casa, dei dispositivi o delle persone. Si può disattivare dalle opzioni dell'app.

## 1.0.0
- Prima versione pubblica di Nexalia.
- Plancia collegata ai dispositivi di Home Assistant: agente, stanze, comandi, energia, sicurezza, persone, scenari, raccolta differenziata e Casa 3D.
- Licenza completa con accesso da fuori casa senza VPN.
