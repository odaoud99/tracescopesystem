(() => {
  const SVG = 'http://www.w3.org/2000/svg';
  const area = document.querySelector('#systemGraphView');
  if (!area) return;
  const globalButton = document.createElement('button');
  globalButton.type = 'button'; globalButton.id = 'systemMapTop'; globalButton.className = 'btn'; globalButton.textContent = '◉ Obsidian map';
  globalButton.setAttribute('aria-label', 'Open the Obsidian system mind graph');
  document.querySelector('#researchBtn')?.before(globalButton);
  globalButton.addEventListener('click', () => {
    document.querySelector('main.main')?.classList.remove('hidden');
    document.querySelector('#empty')?.classList.add('hidden');
    window.setView?.('obsidian');
  });
  const style = document.createElement('style');
  style.textContent = `
    .center[data-view="obsidian"]{background:linear-gradient(180deg,#10201f,#090f13)}.view-tab.active[data-view="obsidian"]{background:#18372f;border-color:#3b7767;color:#aef0dc}
    .system-graph-view{height:100%;min-height:0;overflow:auto;padding:18px 20px 26px;background:radial-gradient(ellipse at 48% 38%,#122528 0,#0b141b 52%,#090e14 100%);color:#e7eff5}
    .system-graph-shell{max-width:1540px;margin:0 auto;display:grid;gap:12px}
    .system-graph-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
    .system-graph-head h2{font:650 18px var(--display);margin:2px 0 5px;color:#dff9f2}
    .system-graph-head p{font-size:11px;line-height:1.5;color:#9aafba;margin:0;max-width:720px}
    .system-graph-tools{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:9px;border:1px solid #263d43;border-radius:9px;background:#0d1a20}
    .system-graph-tools input{min-width:190px;flex:1;height:38px;padding:8px 11px;border:1px solid #38515a;border-radius:7px;color:#e8f1f4;background:#081117;font:11px var(--sans)}
    .system-graph-tools button{height:38px;padding:7px 11px;border:1px solid #365159;border-radius:7px;background:#14282c;color:#cce9e4;font:600 11px var(--sans);cursor:pointer}
    .system-graph-tools button:hover{border-color:#58cba9;color:#eafff9}.system-graph-tools button:focus-visible,.system-graph-tools input:focus-visible,.graph-node:focus-visible{outline:2px solid #70d8bd;outline-offset:2px}
    .system-graph-stage{overflow:auto;border:1px solid #273c43;border-radius:11px;background-color:#0a1319;background-image:radial-gradient(#29404a 1px,transparent 1px);background-size:22px 22px;box-shadow:0 12px 36px #0004;touch-action:none}
    .system-graph-svg{display:block;width:100%;min-width:1120px;height:auto;min-height:620px;user-select:none}
    .graph-edge{fill:none;stroke:#57727a;stroke-width:1.55;opacity:.66;transition:stroke .2s,opacity .2s,stroke-width .2s}.graph-edge.is-related{stroke:#79d9c0;stroke-width:2.5;opacity:1}
    .graph-edge.is-dimmed{opacity:.1}.graph-edge-label{fill:#91a9ae;font:10px var(--mono);paint-order:stroke;stroke:#0a1319;stroke-width:4px;stroke-linejoin:round;text-anchor:middle}.graph-edge-label.is-related{fill:#c1f1e4}.graph-edge-label.is-dimmed{opacity:.1}
    .graph-node rect{fill:#12232a;stroke:#49616a;stroke-width:1.4;rx:12;transition:fill .2s,stroke .2s,filter .2s,opacity .2s}.graph-node:hover rect,.graph-node.is-selected rect{fill:#173239;stroke:#78d7bd;stroke-width:2;filter:drop-shadow(0 5px 12px #51c9a733)}
    .graph-node.is-dimmed{opacity:.17}.graph-node.is-related rect{stroke:#589d91}.graph-node-title{fill:#effaf7;font:600 14px var(--display)}.graph-node-copy{fill:#a8bdc2;font:10.5px var(--sans)}
    .system-graph-bottom{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(250px,.9fr);gap:12px}.graph-legend,.graph-inspector{border:1px solid #263d43;border-radius:9px;background:#0d1a20;padding:12px 14px}.graph-legend{display:flex;align-items:center;gap:15px;flex-wrap:wrap;color:#adc0c7;font-size:10px}.graph-legend span{display:flex;align-items:center;gap:6px}.graph-dot{width:8px;height:8px;border-radius:50%;background:#54bfd0}.graph-dot.analysis{background:#54c6a4}.graph-dot.ai{background:#b49af7}.graph-dot.ops{background:#e9b866}
    .graph-inspector h3{font:650 13px var(--display);color:#dff9f2;margin:0 0 6px}.graph-inspector p{font-size:10px;line-height:1.55;color:#a9bbc2;margin:0 0 9px}.graph-links{display:flex;flex-wrap:wrap;gap:6px}.graph-link{padding:5px 7px;border:1px solid #304951;border-radius:6px;background:#12242a;color:#a9ded1;font-size:9px}.graph-open-view{display:none;margin-top:9px;border:0;background:none;padding:0;color:#80d9c1;font-size:10px;text-decoration:underline;cursor:pointer}
    @media(max-width:760px){.system-graph-view{padding:13px 10px 22px}.system-graph-head{flex-direction:column}.system-graph-tools input{flex-basis:100%}.system-graph-svg{min-height:530px}.system-graph-bottom{grid-template-columns:1fr}}
  `;
  document.head.append(style);
  area.innerHTML = `<div class="system-graph-shell">
    <header class="system-graph-head"><div><span class="eyebrow">SYSTEM MAP · OBSIDIAN CANVAS</span><h2>TraceScope mind graph</h2><p>Explore how trace data moves through analysis, network views, research, AI assistance, audit, and deployment. Select a node to see its connections; drag empty space to pan.</p></div></header>
    <div class="system-graph-tools"><input id="graphSearch" type="search" placeholder="Find a system component…" aria-label="Find a system component"><button type="button" id="graphZoomOut" aria-label="Zoom out">−</button><button type="button" id="graphReset" aria-label="Reset graph view">Fit graph</button><button type="button" id="graphZoomIn" aria-label="Zoom in">+</button><button type="button" id="graphDownload">Download .canvas</button></div>
    <div class="system-graph-stage" id="systemGraphStage" aria-label="Interactive TraceScope system relationship graph"></div>
    <div class="system-graph-bottom"><div class="graph-legend"><span><i class="graph-dot"></i>Trace data</span><span><i class="graph-dot analysis"></i>Analysis views</span><span><i class="graph-dot ai"></i>AI and knowledge</span><span><i class="graph-dot ops"></i>Operations and governance</span><span>Arrows show information or control flow</span></div><aside class="graph-inspector" id="graphInspector" aria-live="polite"><h3>Choose a node</h3><p>Its incoming and outgoing connections will be highlighted in the graph.</p><div class="graph-links"></div></aside></div>
  </div>`;

  const stage = area.querySelector('#systemGraphStage');
  const inspector = area.querySelector('#graphInspector');
  const viewLinks = {
    'Trace upload': 'timeline', 'Browser parser': 'timeline', 'Trace event model': 'timeline',
    'Technology agent': 'flow', 'Telecom knowledge': 'timeline', 'Timeline + inspector': 'timeline',
    'Call flow': 'flow', 'Network route': 'flow', 'Audit log': 'audit'
  };
  let map, svg, selectedId = '0a12bc34de56f789', zoom = 1, origin = { x: 0, y: 0 }, drag;
  const titleOf = node => (node.text || node.label || '').split('\n')[0].replace(/^#+\s*/, '').trim();
  function el(tag, attrs = {}, content) {
    const item = document.createElementNS(SVG, tag);
    for (const [name, value] of Object.entries(attrs)) item.setAttribute(name, String(value));
    if (content !== undefined) item.textContent = content;
    return item;
  }
  function sidePoint(node, side) {
    const x = node.x, y = node.y, w = node.width, h = node.height;
    return side === 'left' ? [x, y + h / 2] : side === 'right' ? [x + w, y + h / 2] : side === 'top' ? [x + w / 2, y] : [x + w / 2, y + h];
  }
  function nodeColor(node) { return node.color || '#58c6b0'; }
  function setViewBox() {
    const width = 1540 / zoom, height = 1000 / zoom;
    svg?.setAttribute('viewBox', `${origin.x} ${origin.y} ${width} ${height}`);
  }
  function draw() {
    const nodes = map.nodes, byId = new Map(nodes.map(node => [node.id, node]));
    svg = el('svg', { class: 'system-graph-svg', viewBox: '0 0 1540 1000', role: 'img', 'aria-label': 'TraceScope component relationship graph' });
    const defs = el('defs'); const marker = el('marker', { id: 'graphArrow', markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: 'auto', markerUnits: 'strokeWidth' });
    marker.append(el('path', { d: 'M0,0 L8,4 L0,8 z', fill: '#79b8aa' })); defs.append(marker); svg.append(defs);
    const edgeLayer = el('g', { class: 'graph-edges' }), nodeLayer = el('g', { class: 'graph-nodes' });
    map.edges.forEach(edge => {
      const from = byId.get(edge.fromNode), to = byId.get(edge.toNode); if (!from || !to) return;
      const [x1, y1] = sidePoint(from, edge.fromSide || 'right'), [x2, y2] = sidePoint(to, edge.toSide || 'left');
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const related = selectedId && (edge.fromNode === selectedId || edge.toNode === selectedId);
      const path = el('path', { d: `M${x1},${y1} Q${mx},${my - (x2 - x1) * .035} ${x2},${y2}`, class: `graph-edge${related ? ' is-related' : ''}`, 'data-edge': edge.id, 'marker-end': 'url(#graphArrow)' });
      edgeLayer.append(path);
      if (edge.label) edgeLayer.append(el('text', { x: mx, y: my - 8, class: `graph-edge-label${related ? ' is-related' : ''}`, 'data-label-edge': edge.id }, edge.label));
    });
    nodes.forEach(node => {
      const g = el('g', { class: 'graph-node', transform: `translate(${node.x} ${node.y})`, tabindex: '0', role: 'button', 'aria-label': titleOf(node), 'data-id': node.id });
      const rect = el('rect', { width: node.width, height: node.height, rx: 12, stroke: nodeColor(node), 'stroke-width': 1.5 }); g.append(rect);
      const lines = (node.text || node.label || '').split('\n').filter(Boolean);
      let y = 27;
      lines.slice(0, 4).forEach((line, i) => {
        const clean = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
        g.append(el('text', { x: 15, y, class: i === 0 ? 'graph-node-title' : 'graph-node-copy' }, clean)); y += i === 0 ? 24 : 17;
      });
      if (node.id === selectedId) g.classList.add('is-selected');
      g.addEventListener('click', event => { event.stopPropagation(); select(node.id); });
      g.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(node.id); } });
      nodeLayer.append(g);
    });
    svg.append(edgeLayer, nodeLayer); stage.replaceChildren(svg); applySearch(); setViewBox();
  }
  function select(id) {
    selectedId = id; const node = map.nodes.find(item => item.id === id); if (!node) return;
    const title = titleOf(node), related = map.edges.filter(edge => edge.fromNode === id || edge.toNode === id);
    const copy = (node.text || '').split('\n').slice(1).filter(Boolean).map(line => line.replace(/\*\*/g, '')).join(' ');
    inspector.querySelector('h3').textContent = title; inspector.querySelector('p').textContent = copy;
    const links = inspector.querySelector('.graph-links'); links.replaceChildren(...related.map(edge => {
      const from = map.nodes.find(item => item.id === edge.fromNode), to = map.nodes.find(item => item.id === edge.toNode);
      const chip = document.createElement('span'); chip.className = 'graph-link'; chip.textContent = `${titleOf(from)} ${edge.label || '→'} ${titleOf(to)}`; return chip;
    }));
    let open = inspector.querySelector('.graph-open-view'); if (!open) { open = document.createElement('button'); open.type = 'button'; open.className = 'graph-open-view'; inspector.append(open); }
    if (viewLinks[title]) { open.textContent = `Open ${viewLinks[title] === 'flow' ? 'call flow' : viewLinks[title] === 'audit' ? 'audit log' : 'timeline'} view`; open.style.display = 'inline'; open.onclick = () => window.setView?.(viewLinks[title]); }
    else open.style.display = 'none';
    draw();
  }
  function applySearch() {
    const q = area.querySelector('#graphSearch').value.trim().toLowerCase();
    const matches = new Set(map.nodes.filter(node => !q || `${titleOf(node)} ${node.text || ''}`.toLowerCase().includes(q)).map(node => node.id));
    const active = new Set([selectedId]); map.edges.forEach(edge => { if (active.has(edge.fromNode)) active.add(edge.toNode); if (active.has(edge.toNode)) active.add(edge.fromNode); });
    svg.querySelectorAll('.graph-node').forEach(g => { const id = g.dataset.id; g.classList.toggle('is-dimmed', q ? !matches.has(id) : false); g.classList.toggle('is-related', active.has(id) && id !== selectedId); });
    svg.querySelectorAll('.graph-edge').forEach(path => { const edge = map.edges.find(item => item.id === path.dataset.edge); const show = !q || matches.has(edge.fromNode) || matches.has(edge.toNode); path.classList.toggle('is-dimmed', !show); const label = svg.querySelector(`[data-label-edge="${edge.id}"]`); label?.classList.toggle('is-dimmed', !show); });
  }
  function reset() { zoom = 1; origin = { x: 0, y: 0 }; selectedId = '0a12bc34de56f789'; area.querySelector('#graphSearch').value = ''; select(selectedId); }
  area.querySelector('#graphSearch').addEventListener('input', applySearch);
  area.querySelector('#graphZoomIn').onclick = () => { zoom = Math.min(zoom * 1.2, 2.4); setViewBox(); };
  area.querySelector('#graphZoomOut').onclick = () => { zoom = Math.max(zoom / 1.2, .65); setViewBox(); };
  area.querySelector('#graphReset').onclick = reset;
  area.querySelector('#graphDownload').onclick = () => {
    const blob = new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'TraceScope_System_Map.canvas'; a.click(); URL.revokeObjectURL(url);
  };
  stage.addEventListener('pointerdown', event => { if (event.target.closest('.graph-node')) return; drag = { x: event.clientX, y: event.clientY, ox: origin.x, oy: origin.y }; stage.setPointerCapture(event.pointerId); });
  stage.addEventListener('pointermove', event => { if (!drag) return; const rect = svg.getBoundingClientRect(); origin.x = drag.ox - (event.clientX - drag.x) * (1540 / zoom) / rect.width; origin.y = drag.oy - (event.clientY - drag.y) * (1000 / zoom) / rect.height; setViewBox(); });
  stage.addEventListener('pointerup', () => { drag = null; });
  fetch('/public/system-map.canvas').then(response => { if (!response.ok) throw new Error('System map is unavailable.'); return response.json(); }).then(data => {
    const ids = data.nodes.map(item => item.id); if (new Set(ids).size !== ids.length || data.edges.some(edge => !ids.includes(edge.fromNode) || !ids.includes(edge.toNode))) throw new Error('The Canvas file has an invalid relationship.');
    map = data; draw(); select(selectedId);
  }).catch(error => { stage.textContent = error.message; });
  window.renderSystemGraph = () => { if (map) applySearch(); };
})();
