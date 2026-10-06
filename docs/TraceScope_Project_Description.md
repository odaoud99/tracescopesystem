# TraceScope — Project description

**TraceScope** is a local-first telecom trace analysis workbench for core-network engineers. It organizes Huawei LMT user-trace exports and supported text logs into a searchable event timeline, call-flow sequence, technology-aware infrastructure route, and message inspector with telecom context.

## Purpose

Make exported signaling easier to review one record at a time: identify what the file contains, which protocol label was recognized, what role a message commonly plays, and which evidence remains missing.

## Capabilities

- Browser-side parsing of standalone and ZIP-wrapped Huawei PTMF traces, supported text/log rows, and classic PCAP/`.cap` packet headers.
- Optional user-provided, version-aware message catalogs keyed by trace type and explicit message ID, with visible exact/compatible/unmatched status.
- Timeline search and message inspection with timestamps, positions, decoded fields, printable strings, and a bounded hex view.
- Call-flow sequence with participant lanes and arrows only for decoded endpoints.
- Vendor-neutral 2G GSM/GPRS, 3G UMTS, 4G LTE/EPC, and 5G 5GS route references that follow trace technology signatures.
- Telecom message explanations, interpretation basis, and 3GPP specification links.
- Text/voice assistant via NVIDIA GLM-5.3, with record citations and local viewer commands.
- Explicit Tavily Huawei research, browser-local documents/sources, activity/decision audit, and JSON export.
- Optional AgentMail delivery of redacted trace summaries to the configured work inbox after an upload.
- Curated assistant memory for engineer-supplied corrections, stored in the local profile and passed back as unverified context.
- Loopback health monitoring with bounded server restart attempts after an unexpected shutdown.
- Interactive Obsidian system mind graph with node search, relationship highlighting, pan/zoom, and `.canvas` export.

## Operating model

The browser parses the selected file. A local Node.js server serves the UI, stores short analyst guidance notes, and proxies external APIs. Credentials belong in the ignored `.env.local` file and are not delivered to browser code. The app is served at `http://127.0.0.1:4173/`.

Docker Compose deployment is available through `Dockerfile` and `compose.yaml`. It binds to host loopback by default, passes API keys at runtime, and excludes trace captures and environment files from the image.

## Evidence and limitations

TraceScope is an engineering review aid, not a full vendor protocol dissector or live network inventory. It recognizes a subset of Huawei PTMF message identifiers and protocol signatures. A decoded label is not proof that every information element was interpreted. PCAP port matches are protocol-family hints, not payload decodes. Observed node positions are kept distinct from node names guessed from export filenames. Dashed topology links are reference/inferred relationships, not proof of a hop in the capture. A request does not establish successful procedure completion. Validate conclusions against raw records, a qualified dissector, the applicable 3GPP release, and network-side evidence.

When configured, assistant questions send selected trace context to NVIDIA; subscriber identifiers are omitted by default and raw payload bytes are excluded. Research queries go to Tavily only after explicit submission. Audit and saved research items are stored in the current browser profile. Follow organizational trace-handling policy.

Analyst memory is explicitly curated: add or remove short notes in the assistant panel. The assistant receives those notes on later questions but treats them as unverified and defers to trace evidence. The health monitor retries connectivity; the local server retries up to three restarts per recovery window. This recovery path does not repair malformed trace data or make autonomous edits to captures.

## Audience

Mobile core/access engineers, network operations and support teams, and telecom trainees.

## Current implementation

Single-page browser UI (`index.html`), local Node.js server (`server.mjs`), network path module (`public/network-path.js`), assistant memory and recovery monitor (`public/agent-memory.js`), Obsidian map view (`public/system-graph.js`, `public/system-map.canvas`), and Docker packaging (`Dockerfile`, `compose.yaml`).
