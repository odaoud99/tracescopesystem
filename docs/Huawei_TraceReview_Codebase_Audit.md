# Huawei TraceReview codebase audit

## Scope and coverage

A read-only inventory and relevance review covered the supplied Huawei UDM TraceReview 23.1.0 directory and CSP TraceReview client directory. The UDM tree contains 1,397 files (about 653 MB); CSP contains 332 files (about 159 MB). Every file was inventoried by path/type/size. Readable text, configuration, documentation, logs, and scripts were scanned for trace viewer/parser details. Binary libraries and executables were not run; they were classified from metadata and surrounding configuration. Two PDF guides were present but their text was not extractable in the review environment, so their contents remain unverified. No trace-specific user data or identifiers are reproduced here.

## Findings relevant to TraceScope

- The UDM 23.1.0 profiles configure trace-type-specific parsers and header mappings. The user-message trace mapping separates fields such as `MessageType`, `MessageName`, `MessageFlow`, `MessageLength`, `MessageContent`, `TraceType`, `StatusCode`, and `MessageID`.
- Huawei's message labels/direction are selected from versioned parser property catalogs; `MessageID` and `StatusCode` are separate header fields. Therefore a PTMF raw type code must not be assumed to equal the displayed `MessageID` without a format definition.
- The user-trace catalogs include AMF, UDM, AUSF, and related 5G service labels; interface catalogs include MAP and Diameter families. These are Huawei parser labels and need standards correlation before presenting them as normative protocol decodes.
- The global configuration declares export formats including PTMF, CSV, TXT, protocol text, and CAP, and references an installed PTMF-to-CAP native converter. No independently licensed/public decoder SDK source was found.
- The reviewed CSP viewer documentation describes field filters, filter inversion, find/find-all, same-type message comparison, selected/anonymized exports, and format conversion. These are candidate workflow improvements; this audit does not claim they are current TraceScope capabilities.
- Compatibility is tied to a matching CSP/UDM release. Huawei's fallback parser behavior can use a newer parser when no exact one matches; TraceScope now marks user-supplied catalog results as exact, compatible, unmatched, or not loaded instead of silently applying a fallback.

## Changes applied

TraceScope now accepts a user-supplied JSON message catalog, validates it as data, keys matches on the explicit `MessageID` plus trace type, keeps the raw message label, and distinguishes exact-release from compatible-release matches. The parser reads the `MessageID` column from supported delimited exports. The PTMF binary adapter still does not map its internal type code to `MessageID`; records without explicit matching IDs stay unmatched. An empty template and schema guide are in `trace-catalog.template.json` and `TraceScope_Message_Catalog_Adapter.md`.

No Huawei parser tables, explanation resources, binaries, or private labels were copied. The inspected bundles appear to contain proprietary Huawei parser components, and the review did not find separate license terms for redistributing parser metadata. Keep future catalog packages versioned and sourced from an authorized license/vendor release. Correlate labels to the applicable 3GPP release, for example [TS 29.503 (UDM services)](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342) or [TS 29.002 (MAP)](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1585).

## Reference configuration locations

Under the reviewed `omu\workspace\adaptor\clientadaptor\UDM\23.1.0` profile:

- `style\defaultstyle\conf\trace\TraceConfig.xml`
- `style\defaultstyle\conf\trace\TraceTree\201_USER Message Trace\2001_USER\TraceConfig.xml`
- `...\2001_USER\TraceMsgTypeParser.properties`
- `...\2001_USER\TraceMsgTableHeaderMapping.properties`
- `style\defaultstyle\conf\trace\TraceTree\201_Interface Message Trace\...`
- `style\defaultstyle\conf\trace\MsgExplain\DetailExplainCfgFile.properties`
- `Ptmf2capDll\tmf2pcap.dll`
- `README_en.md` and `verdesc.xml`

Within the CSP tree, relevant viewer workflow resources are under `style\defaultstyle\locale\en_US\tracereview\`, including filter, compare, find, save, and popup resource property files.