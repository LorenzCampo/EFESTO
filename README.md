# EFESTO – mappe mentali

Sito statico (HTML + CSS + JavaScript, nessuna dipendenza, nessuna build).

## Struttura
```
efesto/
├── index.html        pagina e struttura dell'interfaccia
├── css/style.css     aspetto (tema chiaro/scuro automatico)
├── css/fonts.css     font accessibili (Lexend, Atkinson Hyperlegible, OpenDyslexic)
├── fonts/            file dei font (licenza OFL)
├── css/fonts.css     font accessibili (Lexend, Atkinson Hyperlegible, OpenDyslexic)
├── fonts/            file dei font (licenza OFL, funzionano offline)
└── js/
    ├── core.js       stato, utilità, costanti
    ├── render.js     misure dei riquadri e disegno della mappa
    ├── storage.js    salvataggio nel browser, annulla, elenco mappe
    ├── actions.js    aggiungi/elimina rami, colori, testo, immagini
    ├── export.js     PDF, PNG, SVG, JSON, stampa
    └── main.js       eventi e avvio
```
I file JS vanno caricati in questo ordine (già impostato in `index.html`).

## Provarlo in locale
```
cd efesto
python3 -m http.server 8000
```
poi apri http://localhost:8000 (funziona anche aprendo `index.html` con doppio clic).

## Pubblicarlo online
Carica l'intera cartella su Netlify (trascina la cartella), Cloudflare Pages, Vercel o GitHub Pages: è tutto statico.

## Note
- Le mappe si salvano nel `localStorage` del browser (per dispositivo). Per backup o spostamenti usa «Scarica mappa (JSON)».
- Per avere account e mappe sincronizzate tra dispositivi serve aggiungere un backend (es. Supabase o Firebase): il punto da modificare è `storage.js`.

## Uso rapido
- Doppio clic / doppio tocco su un riquadro: modifica il testo.
- `+` accanto al riquadro (compare passandoci sopra o selezionandolo): aggiunge un ramo lì.
- Quadratino in basso a destra del riquadro selezionato: lo allarga/restringe (⤢ nella barra per tornare automatico).
- Spostare il collegamento: trascina un ramo sopra un altro (si evidenzia tratteggiato) oppure seleziona il ramo, premi 🔗 e tocca il nuovo ramo.
- Ctrl+B / Ctrl+I / Ctrl+U: grassetto, corsivo, sottolineato.
- Nelle esportazioni (PNG/SVG/PDF) i font accessibili vengono inclusi solo se il sito è servito via web (http/https), non aprendo il file con doppio clic.

## Esportazione
Il pulsante in alto a destra apre il foglio «Esporta», con anteprima e opzioni:
- **PDF**: foglio A4/A3/Letter, orientamento (auto/orizzontale/verticale), margini, titolo sul foglio. Contiene la mappa come immagine ad alta risoluzione (300 dpi).
- **PNG**: risoluzione 1×–4×, sfondo bianco o trasparente, pulsante «Copia» negli appunti.
- **SVG**: vettoriale, sfondo bianco o trasparente.
- **JSON**: file di backup, riapribile con «Importa mappa» nel pannello Mappe.
- **Stampa**: usa le stesse impostazioni di foglio, orientamento e margini del PDF.
Le scelte vengono ricordate al prossimo utilizzo.
