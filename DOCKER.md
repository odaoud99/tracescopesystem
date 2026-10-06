# Run TraceScope with Docker

## Requirements

- Docker Engine/Desktop with the Compose plugin.
- No Node.js installation is needed on the host.

## Start

From the project directory, run:

```sh
docker compose up --build -d
```

Open <http://127.0.0.1:4173/>. TraceScope listens only on the host loopback address by default. To choose a different local port, set `TRACESCOPE_PORT` in `.env` (copy `.env.example` to `.env`).

## Enable the NVIDIA, Tavily, and AgentMail integrations

Put API keys in the ignored `.env` file, or use the existing ignored `.env.local` file:

```sh
docker compose --env-file .env.local up --build -d
```

Compose passes the keys into the container at runtime. When AgentMail is configured, TraceScope sends a redacted summary to `odaoud@umniah.com` and `umniaher075@gmail.com` after each trace upload. The summary includes aggregate counts and recognized message types; it omits the source filename, subscriber identifiers, and raw payloads. AgentMail API keys scoped to an inbox are discovered automatically; set `AGENTMAIL_INBOX_ID` only if your key needs an explicit sending inbox. The Docker image does not include `.env.local` or any other `.env` file. Keep these files private and do not commit them.

If no keys are supplied, the viewer still runs; AI chat and web research report that their providers are not configured.

## Common commands

```sh
docker compose ps
docker compose logs -f tracescope
docker compose down
docker compose up --build -d
```

The container health check uses `/api/health`. Uploaded traces are parsed in the browser and are not persisted in the container. Audit history and saved research items remain in the browser profile. The supplied PTMF sample is intentionally excluded from the Docker image; upload a trace from your computer instead.

## Security notes

- The service runs as a non-root user with a read-only container filesystem, dropped Linux capabilities, and `no-new-privileges`.
- The published port is bound to `127.0.0.1`; remove that restriction only if you intentionally configure a protected deployment.
- This Compose setup does not provide user authentication, TLS termination, or shared storage. Do not expose it directly to an untrusted network.
- Assistant requests send selected trace context to NVIDIA when configured; Tavily searches are sent only after the user submits them.

## Build details

The image uses the official `node:24-alpine` image. The build context excludes environment files, trace captures, local development folders, and generated documentation. Only the server, UI, and public JavaScript modules are copied into the image.
