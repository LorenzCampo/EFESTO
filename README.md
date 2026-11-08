# EFESTO – mappe mentali

Sito statico (HTML + CSS + JavaScript, nessuna dipendenza, nessuna build).

## Struttura
```
efesto/
├── index.html        pagina e struttura dell'interfaccia
├── css/style.css     aspetto (tema chiaro/scuro automatico)
└── js/
    ├── core.js       stato, utilità, costanti
    ├── render.js     misure dei riquadri e disegno della mappa
    ├── storage.js    salvataggio nel browser, annulla, elenco mappe
    ├── actions.js    aggiungi/elimina rami, colori, testo, immagini
    ├── export.js     PNG, SVG, JSON, stampa
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
