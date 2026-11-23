# Novità

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
