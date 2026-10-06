// Hide the bundled-sample shortcut in deployments that intentionally omit trace data.
fetch('/api/health')
  .then(response => response.ok ? response.json() : null)
  .then(status => {
    if (status && !status.sampleTraceAvailable) {
      document.querySelector('#sampleTrace')?.classList.add('hidden');
    }
  })
  .catch(() => {});
