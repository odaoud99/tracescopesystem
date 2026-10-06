/* Local Huawei export adapters. ZIP members are read in memory and never extracted. */
(() => {
  const supportedMember = /\.(?:ptmf|cap|pcap|bin|dat|txt|log|csv)$/i;
  const MAX_ARCHIVE_BYTES = 128 * 1024 * 1024;
  const decoder = new TextDecoder();

  function u16(view, offset, little = true) { return view.getUint16(offset, little); }
  function u32(view, offset, little = true) { return view.getUint32(offset, little); }
  async function inflateRaw(data) {
    if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot decompress ZIP exports. Use a current Chrome or Edge build.');
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function readZip(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
      if (u32(view, i) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('ZIP directory is missing or the archive is damaged.');
    if (u16(view, eocd + 4) || u16(view, eocd + 6) || u16(view, eocd + 8) !== u16(view, eocd + 10)) throw new Error('Multi-disk ZIP exports are not supported.');
    const count = u16(view, eocd + 10), centralSize = u32(view, eocd + 12), centralAt = u32(view, eocd + 16);
    if (count === 0xffff || centralAt === 0xffffffff || centralSize === 0xffffffff) throw new Error('ZIP64 exports are not supported yet.');
    if (count > 256 || centralAt + centralSize > bytes.length) throw new Error('ZIP directory exceeds supported limits.');
    const entries = [];
    let at = centralAt, totalExpanded = 0;
    for (let i = 0; i < count; i++) {
      if (at + 46 > bytes.length || u32(view, at) !== 0x02014b50) throw new Error('ZIP directory entry is invalid.');
      const flags = u16(view, at + 8), method = u16(view, at + 10), compressedSize = u32(view, at + 20), expandedSize = u32(view, at + 24);
      const nameLength = u16(view, at + 28), extraLength = u16(view, at + 30), commentLength = u16(view, at + 32), localAt = u32(view, at + 42);
      const nameBytes = bytes.subarray(at + 46, at + 46 + nameLength);
      const name = (flags & 0x800 ? decoder : new TextDecoder('latin1')).decode(nameBytes);
      at += 46 + nameLength + extraLength + commentLength;
      if (name.endsWith('/') || !supportedMember.test(name)) continue;
      if (flags & 1) throw new Error('Password-protected ZIP entries cannot be read in TraceScope.');
      if (expandedSize > MAX_ARCHIVE_BYTES || (totalExpanded += expandedSize) > MAX_ARCHIVE_BYTES) throw new Error('ZIP expansion exceeds the 128 MiB safety limit.');
      if (localAt + 30 > bytes.length || u32(view, localAt) !== 0x04034b50) throw new Error('ZIP member header is invalid.');
      const localNameLength = u16(view, localAt + 26), localExtraLength = u16(view, localAt + 28), dataAt = localAt + 30 + localNameLength + localExtraLength;
      if (dataAt + compressedSize > bytes.length) throw new Error('ZIP member data is truncated.');
      const compressed = bytes.subarray(dataAt, dataAt + compressedSize);
      let data;
      if (method === 0) data = compressed.slice();
      else if (method === 8) data = await inflateRaw(compressed);
      else throw new Error(`ZIP compression method ${method} is not supported.`);
      if (data.length !== expandedSize) throw new Error('ZIP member size does not match its directory entry.');
      entries.push({ name: name.split(/[\\/]/).pop(), bytes: data });
    }
    if (!entries.length) throw new Error('No supported trace member was found inside this ZIP archive.');
    if (entries.length > 1) throw new Error(`This ZIP contains ${entries.length} supported trace members. Import one trace per archive so separate sessions stay distinct.`);
    return entries[0];
  }

  function isPcap(bytes) {
    if (bytes.length < 24) return false;
    const sig = [...bytes.subarray(0, 4)].map(x => x.toString(16).padStart(2, '0')).join('');
    return ['d4c3b2a1', 'a1b2c3d4', '4d3cb2a1', 'a1b23c4d'].includes(sig);
  }
  function ipv6(bytes, at) {
    const parts = [];
    for (let i = 0; i < 16; i += 2) parts.push(((bytes[at + i] << 8) | bytes[at + i + 1]).toString(16));
    return parts.join(':');
  }
  function decodePcap(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const sig = [...bytes.subarray(0, 4)].map(x => x.toString(16).padStart(2, '0')).join('');
    const little = sig === 'd4c3b2a1' || sig === '4d3cb2a1', nano = sig === '4d3cb2a1' || sig === 'a1b23c4d';
    const linkType = u32(view, 20, little), records = [], nodes = new Set();
    const v4 = (i) => `${bytes[i]}.${bytes[i + 1]}.${bytes[i + 2]}.${bytes[i + 3]}`;
    let at = 24;
    while (at + 16 <= bytes.length) {
      const sec = u32(view, at, little), fraction = u32(view, at + 4, little), caplen = u32(view, at + 8, little), wirelen = u32(view, at + 12, little);
      at += 16;
      if (caplen > bytes.length - at) throw new Error('PCAP packet is truncated.');
      const packetAt = at, packet = bytes.subarray(at, at + caplen); at += caplen;
      let offset = 0, etherType = 0;
      if (linkType === 1) {
        if (packet.length < 14) continue;
        etherType = (packet[12] << 8) | packet[13]; offset = 14;
        while ([0x8100, 0x88a8, 0x9100].includes(etherType) && packet.length >= offset + 4) { etherType = (packet[offset + 2] << 8) | packet[offset + 3]; offset += 4; }
      } else if (linkType === 101 || linkType === 228 || linkType === 229) {
        offset = 0; etherType = (packet[0] >> 4) === 6 ? 0x86dd : 0x0800;
      } else if (linkType === 113) {
        if (packet.length < 16) continue;
        etherType = (packet[14] << 8) | packet[15]; offset = 16;
      } else if (linkType === 276) {
        if (packet.length < 20) continue;
        etherType = (packet[0] << 8) | packet[1]; offset = 20;
      } else continue;
      let source = '', destination = '', ipProto = '', l4 = offset;
      if (etherType === 0x0800 && packet.length >= offset + 20 && (packet[offset] >> 4) === 4) {
        const ihl = (packet[offset] & 15) * 4;
        if (packet.length < offset + ihl) continue;
        source = v4(offset + 12); destination = v4(offset + 16); ipProto = packet[offset + 9]; l4 = offset + ihl;
      } else if (etherType === 0x86dd && packet.length >= offset + 40 && (packet[offset] >> 4) === 6) {
        source = ipv6(packet, offset + 8); destination = ipv6(packet, offset + 24); ipProto = packet[offset + 6]; l4 = offset + 40;
      } else continue;
      let transport = ipProto === 6 ? 'TCP' : ipProto === 17 ? 'UDP' : ipProto === 132 ? 'SCTP' : ipProto === 1 || ipProto === 58 ? 'ICMP' : `IP-${ipProto}`;
      let sourcePort = null, destinationPort = null;
      if ([6, 17, 132].includes(ipProto) && packet.length >= l4 + 4) { sourcePort = (packet[l4] << 8) | packet[l4 + 1]; destinationPort = (packet[l4 + 2] << 8) | packet[l4 + 3]; }
      const ports = [sourcePort, destinationPort].filter(Number.isFinite);
      let protocol = '';
      if (ports.includes(2123)) protocol = 'GTP-C'; else if (ports.includes(2152)) protocol = 'GTP-U'; else if (ports.includes(8805)) protocol = 'PFCP';
      else if (ports.includes(36412)) protocol = 'S1AP'; else if (ports.includes(38412)) protocol = 'NGAP';
      else if ([3868, 5658, 2905].some(p => ports.includes(p))) protocol = 'Diameter';
      else if ([5060, 5061].some(p => ports.includes(p))) protocol = 'SIP';
      else protocol = transport;
      if (protocol === 'GTP-C' || protocol === 'GTP-U' || protocol === 'PFCP') {
        // Packet-level port association only; the payload is not dissembled here.
      }
      nodes.add(source); nodes.add(destination);
      const timestampMs = sec * 1000 + Math.floor(fraction / (nano ? 1e6 : 1e3));
      records.push({ index:records.length, offset:packetAt, end:packetAt + caplen, node:source, source, destination, direction:`${source} → ${destination}`, subscriber:'', size:caplen, recordSize:caplen, bytes:packet, payload:packet.subarray(l4), observed:[`${transport} ${sourcePort ?? ''} → ${destinationPort ?? ''}`.trim(), `PCAP link type ${linkType}; captured ${caplen} of ${wirelen} bytes`], timestamp:new Date(timestampMs).toISOString(), timestampMs, property:'Packet capture', propertyCode:null, typeCode:null, protocol, transportProtocol:transport, protocolEvidence:protocol===transport?'IP transport header':'IANA service-port association; payload not decoded', messageType:protocol === transport ? `${transport} packet` : `${protocol} traffic (port association)`, messageLabel:protocol, messageKind:'Packet capture', technologies:protocol==='NGAP'?['5G']:protocol==='S1AP'?['4G']:protocol==='GTP-U'||protocol==='GTP-C'?[]:protocol==='PFCP'?['5G']:[] });
    }
    return { records, nodes:[...nodes].filter(Boolean), linkType, packetCapture:true };
  }

  window.traceScopeImportFile = async (file) => {
    let bytes = new Uint8Array(await file.arrayBuffer()), memberName = file.name;
    if (file.name.toLowerCase().endsWith('.zip') || (bytes[0] === 0x50 && bytes[1] === 0x4b)) {
      const member = await readZip(bytes); bytes = member.bytes; memberName = member.name;
    }
    const parsed = isPcap(bytes) ? decodePcap(bytes) : null;
    return { bytes, memberName, parsed, format:parsed?'PCAP':(memberName.split('.').pop()||'unknown').toUpperCase() };
  };
})();
