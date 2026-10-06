# TraceScope message catalog adapter

TraceScope supports optional, user-provided message catalogs. The adapter is intentionally empty by default: the Huawei UDM/CSP TraceReview installation supplied for review contains proprietary parser tables, a message parser, explanation resources, native binaries, and version-specific configuration. No vendor catalogs or binaries were copied into TraceScope.

## Supported JSON shape

A catalog is matched only when both its trace type and an explicit message ID from the imported record are available. At present, TraceScope reads `MessageID` from CSV/text exports with a matching header. The PTMF binary parser does not claim that its two-byte type code is the viewer's separate `MessageID`, so those records remain unmatched until an authorized format definition establishes the mapping.

```json
{
  "schema": "tracescope-message-catalog/v1",
  "product": "Authorized catalog name",
  "version": "Catalog version",
  "source": "Approved source or license reference",
  "traceTypes": [
    {
      "name": "Exact trace type name from the export",
      "release": "Exact trace release, when known",
      "messages": [
        {
          "messageId": "Exact message ID string from the export",
          "displayName": "Approved readable label",
          "direction": "Optional documented direction",
          "explanation": "Optional short catalog explanation",
          "standard": "Optional normative standard citation",
          "reference": "Optional HTTPS reference"
        }
      ]
    }
  ]
}
```

The UI retains the original message label and annotates a match as **exact** when the trace type and release match, or **compatible** when the release cannot be confirmed. No match is displayed as unmatched. Catalog text is treated as data and rendered as text; HTTPS links only are accepted. A catalog is held in memory for the current browser session.

## Findings incorporated from Huawei TraceReview

The read-only review of the supplied UDM 23.1.0 and CSP TraceReview trees found that Huawei's viewer uses trace-type-specific configuration and parser-property catalogs to map message type/name/direction, while its table header mapping separately exposes fields such as `MessageID`, `StatusCode`, and `MessageContent`. This supports a version-aware catalog adapter and explains why TraceScope must not substitute an assumed type-code mapping. The catalog adapter reports these dependencies without bundling the proprietary tables.

Huawei's README ties trace compatibility to a matching CSP/UDM version. TraceScope therefore surfaces release match quality rather than silently falling back to another parser. The reviewed viewer also supports field filters, invert filtering, finding, same-type message comparison, selection/anonymization exports, and several export formats; these are future workflow directions, not claims of current TraceScope support.

The review found no separate decoder SDK license or public source for the bundled parser. Use only catalogs the organization is authorized to extract and use, and keep any parser/table package versioned with an approved source. For protocol meaning, correlate vendor labels with the applicable normative source rather than treating the Huawei label itself as a standard decode: [3GPP TS 29.503 (UDM services)](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342) and [3GPP TS 29.002 (MAP)](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1585) are examples.