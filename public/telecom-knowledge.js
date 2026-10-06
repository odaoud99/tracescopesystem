/* Conservative, standards-linked annotations. A matching label is not a full protocol decode. */
(() => {
  const refs = {
    'RANAP': ['3GPP TS 25.413 · UTRAN Iu RANAP', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1190'],
    'MAP': ['3GPP TS 29.002 · Mobile Application Part', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1585'],
    'BSSAP': ['3GPP TS 48.008 · BSS to MSC layer 3', 'https://www.3gpp.org/dynareport/48008.htm'],
    'ISUP': ['3GPP TS 23.018 · Basic call handling', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=125'],
    'Diameter': ['3GPP TS 29.272 · MME/SGSN Diameter interfaces', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1690'],
    'GTP-C': ['3GPP TS 29.274 · GTPv2-C', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1692'],
    'GTP-U': ['3GPP TS 29.281 · GTP user plane', 'https://www.3gpp.org/dynareport/29281.htm'],
    'NGAP': ['3GPP TS 38.413 · NG Application Protocol', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3223'],
    'UDM': ['3GPP TS 29.503 · Unified Data Management services', 'https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342'],
    'PFCP': ['3GPP TS 29.244 · PFCP', 'https://www.3gpp.org/dynareport/29244.htm'],
    'S1AP': ['3GPP TS 36.413 · S1 Application Protocol', 'https://www.etsi.org/deliver/etsi_ts/136400_136499/136413/19.00.00_60/ts_136413v190000p.pdf'],
    'LTE NAS': ['3GPP TS 24.301 · EPS NAS', 'https://www.etsi.org/deliver/etsi_ts/124300_124399/124301/12.08.00_60/ts_124301v120800p.pdf']
  };
  const knowledge = {
    'RANAP': ['UTRAN Iu control-plane protocol between the radio network controller and core-network functions. A text label alone does not identify the specific RANAP procedure or its outcome.', '3G'],
    'MAP': ['Legacy SS7 application protocol used for subscriber and mobility procedures in 2G/3G core networks. Operation names and TCAP context are needed for procedure-level interpretation.', '2G / 3G'],
    'BSSAP': ['GSM A-interface signalling family between the BSS and MSC. A message name is needed to distinguish BSS management from direct-transfer signalling.', '2G'],
    'ISUP': ['Circuit-switched call-control signalling. A call setup, release, or cause conclusion requires the actual ISUP message and parameters, not a node label alone.', '2G / 3G'],
    'Diameter': ['Authentication, mobility, policy, or charging signalling depending on the application and peer interface. The application ID and command code are required to identify the transaction.', '4G / 5G interworking'],
    'GTP-C': ['Control-plane tunnel/session signalling. The interface, version, message type, and cause information are needed to establish the procedure result.', '2G / 3G / 4G / 5G'],
    'GTP-U': ['User-plane tunnel traffic. A port or label identifies a likely encapsulation only; TEID, inner packet, and bearer/session context are needed for deeper interpretation.', '2G / 3G / 4G / 5G'],
    'S1AP': ['LTE access control-plane protocol between eNodeB and MME. Procedure code and information elements are required for a full decode.', '4G'],
    'NGAP': ['5G NG-RAN control-plane protocol between gNB and AMF. Procedure code and information elements are required for a full decode.', '5G'],
    'PFCP': ['Control protocol used between session-management and user-plane functions. The node role, message type, and cause/IEs are needed to interpret session state.', '4G / 5G'],
    'UDM': ['5G subscriber-data management function. A node-name match does not prove that a particular Nudm service operation occurred.', '5G'],
    'SCCP': ['SS7 signalling transport/subsystem addressing. SCCP presence alone does not identify the MAP or call-control operation carried above it.', '2G / 3G'],
    'TCAP': ['Transaction framework commonly carrying MAP and other SS7 application exchanges. Begin/Continue/End and component operations are needed to follow a transaction.', '2G / 3G'],
    'SIP': ['Session initiation signalling commonly used in IMS. A message method and response code are required to describe session setup or release.', 'IMS']
  };
  const nodeRoles = [
    [/^(?:MSC|MSC-S|MSC\d*)\b/i, 'Mobile switching centre / MSC family', '3GPP role family; exact combined-node functions depend on deployment.'],
    [/^SGSN\b/i, 'Serving GPRS support node', '3GPP node role.'], [/^GGSN\b/i, 'Gateway GPRS support node', '3GPP node role.'],
    [/^HLR\b/i, 'Home location register', '3GPP node role.'], [/^HSS\b/i, 'Home subscriber server', '3GPP node role.'],
    [/^MME\b/i, 'Mobility management entity', '3GPP node role.'], [/^(?:SGW|S-GW)\b/i, 'Serving gateway', '3GPP node role.'],
    [/^(?:PGW|P-GW)\b/i, 'Packet data network gateway', '3GPP node role.'], [/^RNC\b/i, 'Radio network controller', '3GPP node role.'],
    [/^(?:NODEB|NODE B)\b/i, 'UTRAN Node B', '3GPP node role.'], [/^(?:ENB|E-NODEB)\b/i, 'E-UTRAN eNodeB', '3GPP node role.'],
    [/^(?:GNB|G-NODEB)\b/i, 'NG-RAN gNodeB', '3GPP node role.'], [/^AMF\b/i, 'Access and mobility management function', '3GPP network function.'],
    [/^SMF\b/i, 'Session management function', '3GPP network function.'], [/^UPF\b/i, 'User plane function', '3GPP network function.'],
    [/^UDM\b/i, 'Unified data management', '3GPP network function.'], [/^UDR\b/i, 'Unified data repository', '3GPP network function.'],
    [/^AUSF\b/i, 'Authentication server function', '3GPP network function.'], [/^PCF\b/i, 'Policy control function', '3GPP network function.'],
    [/^SCP\b/i, 'Service communication proxy', '3GPP 5GC role when supported by trace evidence.'],
    [/^(?:ATS|UDG|UNC|USM|USN|LINK|DRA|NEF)\b/i, 'Huawei/vendor node label', 'Exact product role is vendor-specific; this label alone does not establish a 3GPP function.']
  ];
  window.traceScopeFileNodeHints = (...names) => {
    const found = new Set();
    const prefixes = '(?:MSC\\d{1,3}|ATS\\d{1,3}|UDM\\d{1,3}|UDG\\d{1,3}|UNC\\d{1,3}|USM\\d{1,3}|MME_[A-Z0-9-]+|USN_[A-Z0-9-]+|LINK_[A-Z0-9-]+)';
    for (const name of names) {
      const text=String(name || '');
      for (const match of text.matchAll(new RegExp(`(?:^|[^A-Z0-9])(${prefixes})(?=$|[^A-Z0-9])`, 'ig'))) found.add(match[1].toUpperCase());
      for (const match of text.matchAll(/(?:^|[^A-Z0-9])(MSC\d{1,3})(?=[A-Z][a-z])/g)) found.add(match[1].toUpperCase());
    }
    return [...found];
  };

  window.traceScopeNodeRole = (name) => {
    const role = nodeRoles.find(([pattern]) => pattern.test(String(name || '')));
    return role ? { role:role[1], basis:role[2] } : { role:'Observed network-element label', basis:'No role was inferred from the identifier alone.' };
  };
  const originalAnalyzeTrace = window.analyzeTrace;
  if (originalAnalyzeTrace) window.analyzeTrace = function(records, meta) {
    const checks = [
      ['2G', /\b(?:BSSAP|BSSMAP|GERAN|GSM|BSC|BTS|GSM-R)\b/i],
      ['3G', /\b(?:RANAP|UTRAN|UMTS|RNC|Node\s?B|IuCS|IuPS)\b/i],
      ['4G', /\b(?:S1AP|E-?UTRAN|eNodeB|eNB|MME|SGsAP|LTE NAS|EPS NAS|EPC)\b/i],
      ['5G', /\b(?:NGAP|5GC|5G[- ]NR|gNB|AMF|SMF|UPF|PFCP)\b/i]
    ];
    for (const event of records) {
      const fields = [['message type',event.messageType],['protocol',event.protocol],['position',event.node],['direction',event.direction],...((event.observed||[]).map(value=>['trace text',value]))].filter(([,value])=>value);
      const evidence=[];
      for (const [technology, pattern] of checks) {
        for (const [field,value] of fields) {
          const match=String(value).match(pattern);
          if (match) { evidence.push({technology,field,value:match[0]}); break; }
        }
      }
      event.technologyEvidence=evidence;
      event.technologies=evidence.map(item=>item.technology);
    }
    const result=originalAnalyzeTrace(records,meta),counts=new Map();
    for(const event of records)for(const item of event.technologyEvidence||[]){if(!counts.has(item.technology))counts.set(item.technology,{records:0,evidence:new Set()});counts.get(item.technology).records++;counts.get(item.technology).evidence.add(`${item.field}: ${item.value}`)}
    result.technologies=[...counts].map(([key,item])=>({key,name:({ '2G':'2G · GSM / GERAN','3G':'3G · UMTS / UTRAN','4G':'4G · LTE / EPC','5G':'5G · NR / 5GC' })[key],records:item.records,evidence:[...item.evidence].slice(0,4)}));
    result.source='Explicit protocol, technology, and network-element signatures; evidence retained per record';
    return result;
  };
  const originalDescription = window.describeTelecom;
  window.describeTelecom = (event) => {
    const base = originalDescription ? originalDescription(event) : { summary:'Observed trace record; no trusted message decoder matched.', basis:'No decoder match.', reference:'', referenceLabel:'' };
    const techNote=(event?.technologyEvidence||[]).map(item=>`${item.technology} signature in ${item.field}: ${item.value}`).join('; ');
    if (event?.property === 'Packet capture') {
      const packetFamily = event.protocol || event.transportProtocol || 'Packet';
      return { ...base, summary:`${packetFamily} packet observed between the captured IP endpoints. ${String(event.protocolEvidence || '').includes('service-port') ? 'The telecom family is associated from a standard port only; packet payload and protocol information elements were not decoded.' : 'Packet payload and protocol information elements were not decoded.'}`, basis:[event.protocolEvidence || 'Packet header fields only.',techNote].filter(Boolean).join(' · '), reference:refs[packetFamily]?.[1] || '', referenceLabel:refs[packetFamily]?.[0] || '' };
    }
    if (base?.reference) return techNote ? { ...base, basis:`${base.basis} Technology evidence: ${techNote}.` } : base;
    const haystack = [event?.messageType, event?.protocol, event?.property, ...(event?.observed || [])].filter(Boolean).join(' ').toUpperCase();
    const family = ['NGAP','RANAP','BSSAP','MAP','DIAMETER','GTP-C','GTP-U','PFCP','S1AP','LTE NAS','UDM','SCCP','TCAP','ISUP','SIP'].find(name => haystack.includes(name));
    if (!family) return base;
    const canonical = family === 'DIAMETER' ? 'Diameter' : family;
    const entry = knowledge[canonical];
    if (!entry) return base;
    const internal = event?.property === 'Internal Message' || event?.property === 'Internal';
    return {
      ...base,
      summary:internal ? `Huawei internal trace event references ${canonical}. ${entry[0]} The internal label does not prove an external protocol message was sent.` : entry[0],
      basis:[internal ? 'Vendor-internal message label; the external protocol exchange needs a separate decoded record.' : `Recognized ${canonical} signature/label; procedure fields have not been decoded.`,techNote?`Technology evidence: ${techNote}.`:'' ].filter(Boolean).join(' '),
      reference:refs[canonical]?.[1] || '', referenceLabel:refs[canonical]?.[0] || ''
    };
  };
  const originalLoadFile = window.loadFile;
  if (originalLoadFile) window.loadFile = async function(file) { window.traceScopeActiveFileNames = [file?.name || '']; return originalLoadFile(file); };
  const originalRender = window.render;
  if (originalRender) window.render = function(nodeList) {
    originalRender(nodeList);
    const hints = window.traceScopeFileNodeHints(...(window.traceScopeActiveFileNames || []));
    if (hints.length) {
      const list = document.querySelector('#nodes');
      const card = document.createElement('div');
      card.className = 'node-hints';
      card.style.cssText = 'margin:10px 6px 4px;padding:9px;border:1px dashed #b78b3a;border-radius:8px;color:#d9c28f;font-size:10px;line-height:1.6';
      card.textContent = `Export filename hints · unverified: ${hints.join(', ')}`;
      list?.append(card);
    }
    document.querySelectorAll('.node[data-node]').forEach(el => {
      const info = window.traceScopeNodeRole(el.dataset.node);
      el.title = `${info.role} — ${info.basis}`;
      el.setAttribute('aria-label', `${el.dataset.node}: ${info.role}; ${info.basis}`);
    });
  };
})();
