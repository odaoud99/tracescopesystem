/* User-supplied Huawei catalog adapter. Vendor catalog data is not bundled with TraceScope. */
(() => {
  const schema = 'tracescope-message-catalog/v1';
  const norm = value => String(value ?? '').trim().toLowerCase();
  const text = (value, max = 300) => typeof value === 'string' ? value.trim().slice(0, max) : '';
  let active = null;
  function validate(value) {
    if (!value || value.schema !== schema || !Array.isArray(value.traceTypes) || value.traceTypes.length > 100) throw new Error(`Expected ${schema} with at most 100 traceTypes.`);
    for (const trace of value.traceTypes) {
      if (!trace || typeof trace.name !== 'string' || !Array.isArray(trace.messages) || trace.messages.length > 50000) throw new Error('Invalid trace type or message list.');
      for (const item of trace.messages) if (!item || !text(item.messageId, 80) || !text(item.displayName, 160)) throw new Error('Each message needs messageId and displayName strings.');
    }
    return { product:text(value.product,100)||'User-provided catalog', version:text(value.version,80)||'Unversioned', source:text(value.source,200)||'User-provided catalog file', traceTypes:value.traceTypes.map(trace=>({name:text(trace.name,120),release:text(trace.release,80),messages:trace.messages.map(item=>({messageId:text(item.messageId,80),displayName:text(item.displayName,160),direction:text(item.direction,120),explanation:text(item.explanation,800),standard:text(item.standard,120),reference:typeof item.reference==='string'&&/^https:\/\//i.test(item.reference)?item.reference.slice(0,500):''}))}))};
  }
  function apply(events, meta={}) {
    for (const event of events||[]) {
      event.rawMessageType ??= event.messageType;event.rawMessageKind ??= event.messageKind;event.rawDirection ??= event.direction;event.messageType=event.rawMessageType;event.messageKind=event.rawMessageKind;event.direction=event.rawDirection;event.vendorCatalogEntry=null;event.catalogMatch={status:active?'unmatched':'not-loaded',catalog:active?.product||'',catalogVersion:active?.version||''};
      if (!active || !event.messageId) continue;
      const trace=active.traceTypes.find(item=>norm(item.name)===norm(meta.traceType||event.traceType));
      const entry=trace?.messages.find(item=>norm(item.messageId)===norm(event.messageId));
      if (!entry) continue;
      event.rawMessageType ??= event.messageType;
      event.vendorCatalogEntry=entry;
      event.catalogMatch={status:trace.release&&norm(trace.release)===norm(meta.release)?'exact':'compatible',catalog:active.product,catalogVersion:active.version,traceRelease:meta.release||'Unknown',source:active.source};
      event.messageType=entry.displayName;
      event.messageKind=`Huawei catalog label · ${event.catalogMatch.status} match`;
      if (!event.direction&&entry.direction) event.direction=entry.direction;
    }
  }
  window.traceScopeLoadMessageCatalog=async file=>{active=validate(JSON.parse(await file.text()));return{product:active.product,version:active.version,traceTypes:active.traceTypes.length}};
  window.traceScopeApplyMessageCatalog=apply;
})();