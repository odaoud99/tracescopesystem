(() => {
  let notes = [];
  const read = () => notes.slice(-30);
  const save = async value => {
    const response = await fetch('/api/agent-memory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes: value.slice(-30) }) });
    if (!response.ok) throw new Error('Could not save analyst guidance.');
    const result = await response.json(); notes = result.notes || [];
  };
  const style = document.createElement('style');
  style.textContent = '.agent-memory{border-bottom:1px solid #29384a;padding:9px 14px;background:#101b29}.agent-memory summary{font-size:11px;color:#b8c8d8;cursor:pointer}.agent-memory p{font-size:10px;color:#97a9bb;line-height:1.45;margin:8px 0}.agent-memory-form{display:flex;gap:7px}.agent-memory-form input{min-width:0;flex:1;background:#09121c;color:#e8f0f8;border:1px solid #344258;border-radius:6px;padding:8px;font-size:11px}.agent-memory-form button,.agent-memory-item button{background:#1a2b3d;color:#c9e4ef;border:1px solid #38546b;border-radius:6px;padding:7px 9px;cursor:pointer}.agent-memory-list{display:grid;gap:6px;margin-top:8px;max-height:120px;overflow:auto}.agent-memory-item{display:flex;align-items:flex-start;gap:8px;color:#c0cddd;font-size:10px;line-height:1.4}.agent-memory-item span{flex:1;overflow-wrap:anywhere}.agent-heal-status{font-size:10px;color:#a9e6bf;padding:6px 14px;background:#102019}.agent-heal-status.offline{color:#ffd28a;background:#2b2416}';
  document.head.append(style);
  const panel = document.querySelector('#assistantPanel');
  if (panel) {
    const section = document.createElement('details');
    section.className = 'agent-memory';
    section.innerHTML = '<summary>Agent memory · <span>0</span> saved corrections</summary><p>Teach TraceScope analyst guidance. Saved locally by the TraceScope server and sent with assistant questions. Do not enter subscriber identifiers or secrets.</p><form class="agent-memory-form"><input maxlength="500" aria-label="Analyst guidance" placeholder="Example: In this export, position S1AP indicates the MME-side trace point"><button type="submit">Remember</button></form><div class="agent-memory-list"></div>';
    const credit = panel.querySelector('.assistant-credit-note');
    if (credit) credit.after(section);
    const update = () => {
      const values = read(); section.querySelector('summary span').textContent = String(values.length);
      section.querySelector('.agent-memory-list').replaceChildren(...values.map((value, index) => {
        const row = document.createElement('div'); row.className = 'agent-memory-item';
        const text = document.createElement('span'); text.textContent = value;
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove saved guidance ${index + 1}`);
        remove.onclick = async () => { const latest = read(); latest.splice(index, 1); try { await save(latest); update(); } catch (error) { if (typeof toast === 'function') toast(error.message); } };
        row.append(text, remove); return row;
      }));
    };
    section.querySelector('form').onsubmit = async event => {
      event.preventDefault(); const input = section.querySelector('input'); const value = input.value.trim(); if (!value) return;
      const values = read(); if (!values.includes(value)) values.push(value);
      try { await save(values); input.value = ''; update(); if (typeof audit === 'function') audit('Agent guidance saved', 'Local analyst memory', 'Analyst added reusable guidance; content is stored in this device user profile.', [`Guidance entries: ${values.length}`]); }
      catch (error) { if (typeof toast === 'function') toast(error.message); }
    };
    update();
    fetch('/api/agent-memory').then(response => response.json()).then(result => { notes = Array.isArray(result.notes) ? result.notes : []; update(); }).catch(() => {});
  }
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (resource, options = {}) => {
    const url = typeof resource === 'string' ? resource : resource?.url || '';
    if (url.endsWith('/api/assistant/chat') && typeof options.body === 'string') {
      try { const body = JSON.parse(options.body); body.analystGuidance = read(); options = { ...options, body: JSON.stringify(body) }; } catch {}
    }
    return nativeFetch(resource, options);
  };
  const status = document.createElement('div'); status.className = 'agent-heal-status'; status.hidden = true; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); document.body.append(status);
  let delay = 1500;
  async function monitor() {
    try {
      const response = await nativeFetch('/api/health', { cache: 'no-store' }); if (!response.ok) throw new Error('Health check failed');
      if (status.dataset.recovered === 'true') { status.textContent = 'Connection restored. TraceScope is ready.'; status.classList.remove('offline'); setTimeout(() => { status.hidden = true; }, 3500); }
      status.dataset.recovered = 'false'; delay = 1500;
    } catch {
      status.hidden = false; status.classList.add('offline'); status.textContent = 'Connection interrupted. TraceScope is retrying automatically…'; status.dataset.recovered = 'true'; delay = Math.min(delay * 1.7, 15000);
    }
    setTimeout(monitor, delay);
  }
  setTimeout(monitor, 1000);
})();
