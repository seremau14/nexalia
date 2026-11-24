# Novità

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
