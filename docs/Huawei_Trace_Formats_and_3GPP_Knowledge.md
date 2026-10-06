# Huawei trace import and telecom interpretation

TraceScope analyzes the supplied file locally in the browser. A successful upload still triggers the separately configured redacted AgentMail summary; this analyzer does not upload packet payloads or source files.

## Import adapters

- Standalone Huawei `.ptmf` continues through the PTMF record parser.
- ZIP archives are inspected in memory. TraceScope supports one recognized trace member per archive, stored or DEFLATE-compressed, up to 128 MiB expanded size. It does not write archive paths to disk. Multi-member, encrypted, multi-disk, and ZIP64 archives are rejected with a message rather than silently combining sessions.
- `.cap` and `.pcap` files with classic PCAP signatures are parsed for packet timestamps, captured lengths, link type, IP endpoints, transport, and ports. The current adapter handles Ethernet (including VLAN), raw IP, Linux cooked capture, and IPv4/IPv6.
- Telecom protocol labels found only by port (for example PFCP, GTP, Diameter, NGAP, or S1AP) are explicitly marked as port associations. Payload decoding, encrypted content, and protocol information elements are not inferred from a port number.

## Node provenance

Printable PTMF node-position strings remain observed node names. Known Huawei export prefixes such as `MSC`, `ATS`, `UDM`, `UDG`, `UNC`, `USM`, `USN`, and `LINK` are included in the node candidate scan. A name listed in the source filename is displayed separately as an **unverified filename hint**; TraceScope does not silently treat it as a decoded per-record Position field. Standard roles are identified only for recognizable 3GPP node/function names. Proprietary product roles remain unverified unless a licensed, versioned Huawei dictionary confirms them.

The ten supplied files were profiled locally: the set contains standalone PTMF and single-member ZIP exports; five ZIPs contain PTMF and one contains a PCAP capture (`.cap`). Across all files the existing PTMF record boundary scanner found 1,266 PTMF records, and the PCAP adapter identified 8 captured packets. Some PTMF exports contain no printable per-record node position, so their equipment attribution can only be shown as a filename hint pending a Huawei decoder or additional trace fields. No subscriber numbers or full node identifiers are copied into this project documentation.

## Standards-backed knowledge

Message explanations retain a distinction between observed labels, decoded protocol types, and inferred network roles. Protocol text alone does not establish a transaction outcome. Relevant primary references:

- [3GPP TS 23.018 — Basic call handling](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=125)
- [3GPP TS 29.002 — Mobile Application Part (MAP)](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1585)
- [3GPP TS 25.413 — UTRAN Iu RANAP](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1190)
- [3GPP TS 29.272 — MME/SGSN Diameter interfaces](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1690)
- [3GPP TS 29.274 — GTPv2-C](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1692)
- [3GPP TS 38.413 — NGAP](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3223)
- [3GPP TS 29.503 — UDM services](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342)

3GPP standards define protocol procedures and network-function behavior. They do not define Huawei's PTMF/HiDeX container layout or private internal message-code dictionaries.

## Huawei HiDeX / HedEx libraries

No public Huawei telecom trace-decoder API or SDK explicitly named “HiDeX” was identified in this project review. Huawei's public [Wireless Product Documentation Center](https://info.support.huawei.com/wireless/wirelessdoc/index_en.html) distributes product documentation libraries (including HDX documentation); that is not evidence of a PTMF decoder. A vendor decoder can be added as a versioned adapter if Huawei supplies the licensed library and format/version documentation. Until then, internal message labels remain searchable opaque labels rather than guessed 3GPP message decodes.
