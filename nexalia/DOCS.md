# Nexalia

Nexalia è la plancia con agente per Home Assistant. Ti dice cosa succede in casa, fa le cose al posto tuo e, con la licenza completa, ti fa entrare anche da fuori senza VPN.

## Primo avvio

1. Avvia l'app e attiva **Mostra nella barra laterale**.
2. Apri **Nexalia** dalla barra laterale di Home Assistant.
3. Le stanze vengono prese dalle **aree** di Home Assistant. Per personalizzarle vai in **Stanze › Gestisci › Importa le aree e personalizza**.
4. In **Impostazioni** scegli:
   - dove mandare gli avvisi (l'app di Home Assistant sul telefono);
   - i sensori di potenza per la sezione Energia;
   - le sezioni da mostrare.

## L'agente

Nexalia controlla la casa anche a plancia chiusa e annota tutto in **Cosa è successo**:

- chi entra ed esce di casa;
- fumo, gas o perdite d'acqua, con notifica sul telefono;
- porte e finestre aperte con l'allarme inserito;
- finestre aperte quando inizia a piovere (usa il meteo di Home Assistant);
- consumi vicini al limite del contatore. Se scegli dei "carichi da spegnere", Nexalia li spegne per primi;
- batterie dei sensori quasi scariche;
- il promemoria della raccolta differenziata, la sera prima.

Nella casella **Chiedi a Nexalia** puoi scrivere comandi come "accendi le luci in cucina". Le richieste passano da Assist di Home Assistant, quindi funzionano anche con un modello AI (OpenAI, Google…) se lo hai configurato in Assist.

## Licenza completa e accesso da fuori casa

La versione gratuita include agente, stanze, comandi, energia, sicurezza, persone, scenari e raccolta.

Con la licenza completa (39 € l'anno, su https://nexaliahome.com) si aggiungono:

- Casa 3D;
- backup e ripristino;
- l'accesso da fuori casa con un indirizzo sicuro tutto tuo, ad esempio `https://casa-xxxx.nexaliahome.com`.

Per attivarla: **Impostazioni › Licenza › Ho già un codice**, inserisci il codice `NXL-…` e premi **Attiva**.

### Una riga da aggiungere a Home Assistant

Perché Home Assistant accetti le connessioni che arrivano da fuori tramite Nexalia, aggiungi questo al file `configuration.yaml` e riavvia Home Assistant:

```yaml
http:
  use_x_forwarded_for: true
  trusted_proxies:
    - 172.30.32.0/23
```

Se hai già una sezione `http:`, aggiungi solo le righe che mancano.

Per entrare da fuori apri l'indirizzo che trovi in **Impostazioni › Licenza** e accedi con il tuo utente di Home Assistant. Va bene anche l'app Home Assistant sul telefono: aggiungi l'indirizzo come "URL esterno".

### Cambiare mini PC

1. Disattiva la licenza su quello vecchio da **Impostazioni › Licenza**.
2. Installa Nexalia sul nuovo mini PC e inserisci lo stesso codice.
3. Con **Backup e ripristino** ritrovi stanze, Casa 3D, scenari e impostazioni.

## Statistiche anonime

Una volta al giorno Nexalia comunica al server licenze soltanto:

- un codice casuale, che non permette di risalire alla casa;
- la versione installata;
- se la licenza è completa.

Non invia dati dei dispositivi, delle persone, della posizione o dell'uso della plancia. Serve solo a sapere quante case usano Nexalia. Per disattivarlo apri la scheda **Configurazione** dell'app e spegni **statistiche_anonime**.

## Assistenza

Scrivi a info@nexaliahome.com.
