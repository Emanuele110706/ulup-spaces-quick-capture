// UluP Spaces — Quick Capture
// Popup logic: legge la chiave API salvata, carica i progetti dell'utente
// via REST API, e crea un nodo (+ opzionalmente un task col link della
// pagina) nel progetto scelto.

// ⚠️ Deve puntare al dominio ESATTO senza redirect di mezzo: ulupspaces.com
// (senza www) risponde con un 308 verso www.ulupspaces.com, e sul salto
// cross-origin il browser toglie l'header Authorization per sicurezza —
// la richiesta arriva al server senza chiave e viene rifiutata. Puntando
// direttamente qui non c'è nessun redirect da seguire.
const API_BASE = 'https://www.ulupspaces.com/api/v1';

const els = {
  states: {
    noKey: document.getElementById('state-no-key'),
    loading: document.getElementById('state-loading'),
    error: document.getElementById('state-error'),
    form: document.getElementById('state-form'),
    success: document.getElementById('state-success'),
  },
  errorMessage: document.getElementById('error-message'),
  successMessage: document.getElementById('success-message'),
  projectSelect: document.getElementById('project-select'),
  nameInput: document.getElementById('name-input'),
  colorRow: document.getElementById('color-row'),
  saveUrlCheckbox: document.getElementById('save-url-checkbox'),
  urlPreview: document.getElementById('url-preview'),
  btnSave: document.getElementById('btn-save'),
  btnRetry: document.getElementById('btn-retry'),
  btnOpenOptions: document.getElementById('btn-open-options'),
  btnOpenOptions2: document.getElementById('btn-open-options-2'),
};

let selectedColor = 'blue';
let currentTab = null;
let apiKey = null;

function showState(name) {
  Object.entries(els.states).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}

els.btnOpenOptions.addEventListener('click', openOptions);
els.btnOpenOptions2.addEventListener('click', openOptions);
els.btnRetry.addEventListener('click', () => init());

els.colorRow.addEventListener('click', (e) => {
  const btn = e.target.closest('.swatch');
  if (!btn) return;
  selectedColor = btn.dataset.color;
  [...els.colorRow.children].forEach((c) => c.classList.remove('selected'));
  btn.classList.add('selected');
});

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    // 🩺 Mostriamo il messaggio reale del server invece di uno fisso per
    // status code: "401" può voler dire header assente o chiave scaduta,
    // ed è il server (non noi) a saperlo con certezza.
    let message = `Errore ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore JSON parse failure, keep generic message
    }
    if (res.status === 429) {
      message = 'Troppe richieste in poco tempo. Aspetta un momento e riprova.';
    }
    throw new Error(message);
  }

  return res.status === 204 ? null : res.json();
}

async function init() {
  showState('loading');

  const stored = await chrome.storage.local.get(['apiKey', 'lastProjectId']);
  apiKey = stored.apiKey;

  if (!apiKey) {
    showState('noKey');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  try {
    const projects = await apiFetch('/projects');
    const list = Array.isArray(projects) ? projects : projects?.data || [];

    if (!list.length) {
      els.errorMessage.textContent =
        'Non hai ancora nessun progetto su UluP Spaces. Creane uno prima di usare Quick Capture.';
      showState('error');
      return;
    }

    els.projectSelect.innerHTML = '';
    list.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      els.projectSelect.appendChild(opt);
    });

    if (stored.lastProjectId && list.some((p) => String(p.id) === String(stored.lastProjectId))) {
      els.projectSelect.value = stored.lastProjectId;
    }

    const title = (currentTab?.title || '').trim();
    els.nameInput.value = title.length > 120 ? title.slice(0, 117) + '…' : title || 'Nuovo nodo';

    els.urlPreview.textContent = currentTab?.url || '';
    els.saveUrlCheckbox.addEventListener('change', () => {
      els.urlPreview.style.display = els.saveUrlCheckbox.checked ? 'block' : 'none';
    });

    selectedColor = 'blue';
    [...els.colorRow.children].forEach((c) => c.classList.remove('selected'));
    els.colorRow.children[0].classList.add('selected');

    showState('form');
  } catch (err) {
    els.errorMessage.textContent = err.message || 'Errore imprevisto.';
    showState('error');
  }
}

els.btnSave.addEventListener('click', async () => {
  const projectId = els.projectSelect.value;
  const name = els.nameInput.value.trim();

  if (!name) {
    els.nameInput.focus();
    return;
  }

  els.btnSave.disabled = true;
  els.btnSave.textContent = 'Salvo…';

  try {
    const node = await apiFetch(`/projects/${projectId}/nodes`, {
      method: 'POST',
      body: JSON.stringify({ name, color: selectedColor }),
    });

    await chrome.storage.local.set({ lastProjectId: projectId });

    let taskWarning = '';
    if (els.saveUrlCheckbox.checked && currentTab?.url) {
      try {
        await apiFetch(`/nodes/${node.id}/tasks`, {
          method: 'POST',
          body: JSON.stringify({ content: currentTab.url }),
        });
      } catch (taskErr) {
        taskWarning = ' (link non salvato: ' + taskErr.message + ')';
      }
    }

    els.successMessage.textContent = `"${name}" salvato${taskWarning}`;
    showState('success');
    setTimeout(() => window.close(), 1400);
  } catch (err) {
    els.errorMessage.textContent = err.message || 'Errore imprevisto durante il salvataggio.';
    showState('error');
  } finally {
    els.btnSave.disabled = false;
    els.btnSave.textContent = 'Salva in UluP Spaces';
  }
});

init();
