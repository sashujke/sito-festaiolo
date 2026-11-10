# Il Festaiolo — guida rapida

Sito statico in HTML, CSS e JavaScript vanilla. Avviare con `python3 -m http.server 8000` e aprire `http://localhost:8000`.

## Modificare i dati

- **`data/config.json`**: modificare brand, zona, categorie, fasce e testi. `mostraPrezziDaVerificare: true` mostra le stime; con `false` mostra “Contattaci per il prezzo”.
- **`data/gonfiabili.json`**: ogni scheda deve mantenere `id`, `nome`, `categorie` (array), `fasciaPrezzo`, `fasciaEta`, `prezzo`, `descrizione`, `dimensioni`, `foto`, `disponibile`, `daVerificare`. Per completare una scheda, sostituire i valori “Da definire”, aggiornare `foto` con percorsi locali e impostare `daVerificare` secondo necessità.
- **`data/content.json`**: testi della home, i cinque passaggi del servizio e il testo sicurezza. `sicurezza.daConfermare` deve restare `true` finché non sono verificati UNI EN 14960, vento massimo 38 km/h e corretto ancoraggio. Non aggiungere dichiarazioni di certificazione, conformità, assicurazione o ispezione senza fonti.
- **`data/casa-del-festaiolo.json`**: dati della Casa del Festaiolo. `orari` è una lista modificabile per giorno; indirizzo e orari sono verificati (`orariVerificati`/`indirizzoVerificato`), mentre prezzo, servizi e capienza restano `daVerificare`. `galleria` contiene le 15 foto locali.
- **`data/recensioni.json`**: recensioni verificate. Ogni voce deve avere `nome`, `testo`, `stelle`, `data`, `riferimento` e `fonte`; in assenza di fonti lasciare `[]`. La home e Casa mostrano “Presto le recensioni dei nostri clienti” senza media o conteggio e includono un link segnaposto per lasciare una recensione.
- Per le foto della casa creare `img/casa-del-festaiolo/`, aggiungere i file e inserire i relativi percorsi in `galleria` nel JSON.
- Le prenotazioni chiedono una data (non fasce orarie/orari di apertura), luogo e note: non inserire slot o orari di noleggio.
- Il catalogo combina i filtri categoria/prezzo/età; `Azzera filtri` ripristina tutto. I 58 articoli e 70 foto sono generati dai file locali e non vanno rimossi.
- Le immagini originali restano in `img/gonfiabili/`; il logo locale è `img/logo.png`.

## Standardizzare le foto del catalogo

- Le foto usate online sono in `img/gonfiabili/web/` e sono tutte in formato
  `1200 x 900` (rapporto 4:3), senza deformazioni.
- Gli originali non vengono sovrascritti: restano nella cartella
  `img/gonfiabili/`.
- Per rigenerare le immagini dopo aver sostituito una foto, eseguire dalla
  cartella del progetto:

  ```bash
  python3 tools/standardizza-immagini.py
  ```

- Il programma lavora solo sui percorsi presenti in
  `data/gonfiabili.json`, aggiorna automaticamente quei percorsi e contiene
  nella costante `TEXT_MASKS` le aree delle quote da rimuovere. Elimina anche
  bande nere tecniche e filigrane testuali note, senza modificare gli originali.
- Dopo l'esecuzione, controllare il provino delle immagini prima di caricare
  su Aruba la cartella `img/gonfiabili/web/` e il file
  `data/gonfiabili.json`.

## WhatsApp e Casa (aggiornamento)
- `data/contatti.json`: unica fonte per i quattro contatti WhatsApp (`rental` e `casa`) e per i placeholder `telefono`/`email` normali. Cambia i numeri solo qui.
- `data/config.json`: `mostraPrezziDaVerificare` controlla il testo dei prezzi stimati.
- `contatti.html` + `app.js`: il modulo noleggio richiede nome, telefono, data, luogo, prodotti, note e contatto WhatsApp; genera un messaggio multilinea `wa.me` senza flusso email.
- `data/casa-del-festaiolo.json`: `galleria` usa tutti i file relativi `img/casa-del-festaiolo/*.webp`; servizi, orari, prezzo e capacità sono indicati come da verificare. `recensioni` resta vuoto.
- `casa.html`: la galleria Casa e le gallerie gonfiabili hanno immagine principale grande, miniature scorrevoli, contatore e lightbox fullscreen con frecce, chiusura, Escape e zoom nativo touch. Il pulsante WhatsApp fisso è un’icona SVG rotonda, usa il primo numero della zona e scompare durante le gallerie.
- La pagina Casa mostra tabella orari con giorno corrente (fuso `Europe/Rome`), indirizzo/link Maps e mappa incorporata senza API key. La pagina Contatti riporta indirizzo e orari della Casa, mai orari di noleggio.
