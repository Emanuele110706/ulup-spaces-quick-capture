# UluP Spaces — Quick Capture

Estensione per Chrome (Manifest V3) che salva qualsiasi pagina web come nodo in uno dei tuoi progetti su [UluP Spaces](https://ulupspaces.com), in un click — usando la [REST API pubblica](https://ulupstudio.com/developers) di UluP Spaces.

## Cosa fa

- Legge il titolo della pagina che stai guardando e lo propone come nome del nodo.
- Scegli in quale progetto salvarlo e un colore.
- Se vuoi, aggiunge anche il link della pagina come task dentro il nodo appena creato.
- Tutto passa dalla REST API pubblica (`https://www.ulupspaces.com/api/v1`) con la tua chiave personale — nessun server intermedio, nessun dato che passa da altre parti.

## Installazione (da sorgente)

L'estensione non è ancora sul Chrome Web Store, quindi va caricata "unpacked":

1. Scarica o clona questo repo.
2. Apri `chrome://extensions` in Chrome.
3. Attiva **Modalità sviluppatore** (in alto a destra).
4. Clicca **Carica estensione non pacchettizzata** e seleziona la cartella del repo.

## Configurazione

1. Vai su [UluP Spaces → Profilo → REST API & SDK](https://ulupspaces.com/?view=profile) e genera una chiave API.
2. Clic destro sull'icona dell'estensione → **Opzioni**.
3. Incolla la chiave e salva. Resta salvata solo in locale, nel tuo browser (`chrome.storage.local`) — non viene mai inviata da nessun'altra parte se non alla REST API di UluP Spaces.

## Come si usa

Apri il popup dall'icona dell'estensione su qualsiasi pagina, scegli il progetto, controlla/modifica il nome del nodo, scegli un colore e salva. Fatto.

## Stack

Vanilla JS, HTML e CSS — nessuna dipendenza, nessun bundler. Manifest V3.

## Contribuire

Pull request benvenute. Il codice è volutamente semplice (nessun framework) per restare facile da leggere e modificare.

## Licenza

MIT — vedi [LICENSE](./LICENSE).
