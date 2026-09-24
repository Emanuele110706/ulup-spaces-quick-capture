const input = document.getElementById('api-key');
const status = document.getElementById('status');
const button = document.getElementById('save');

chrome.storage.local.get(['apiKey'], ({ apiKey }) => {
  if (apiKey) input.value = apiKey;
});

button.addEventListener('click', async () => {
  const value = input.value.trim();
  if (!value) {
    status.textContent = 'Inserisci una chiave prima di salvare.';
    status.className = 'err';
    return;
  }
  await chrome.storage.local.set({ apiKey: value });
  status.textContent = 'Salvata. Puoi chiudere questa pagina e usare Quick Capture.';
  status.className = 'ok';
});
