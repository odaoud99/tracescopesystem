# TraceScope

TraceScope is a local web application for reviewing telecom network traces. **Do not open `index.html` directly** from GitHub or from a `file://` URL. The interface depends on a local Node.js server for its JavaScript modules and API routes.

## Run on Windows

1. Install Node.js 20 or newer.
2. Download the repository ZIP from GitHub and extract it, or clone it:

   ```powershell
   git clone https://github.com/odaoud99/tracescopesystem.git
   cd tracescopesystem
   ```

3. In PowerShell, from the project folder, run:

   ```powershell
   npm start
   ```

   There are no npm packages to install.

4. Open <http://127.0.0.1:4173/> in your browser. Keep the PowerShell window open while using TraceScope. Press **Ctrl+C** there to stop the server.

If port 4173 is already in use, select another port before starting:

```powershell
$env:PORT = "4174"
npm start
```

Then open <http://127.0.0.1:4174/>.

## Optional integrations

Trace import, message review, network path, and telecom explanations work without API keys. To enable the NVIDIA, Tavily, or AgentMail integrations, copy `.env.example` to `.env.local` and add your own keys. Keep `.env.local` private; it is ignored by Git. Never paste API keys into source files or commit them.

## Docker

Docker is optional. Start Docker Desktop first, then run from the project folder:

```powershell
docker compose up --build -d
```

Open <http://127.0.0.1:4173/>. See [DOCKER.md](DOCKER.md) for environment and security details.

## Supported imports

TraceScope handles Huawei PTMF traces, supported text/CSV exports, single-trace ZIP archives, and classic PCAP/`.cap` packet headers. The viewer keeps observed fields separate from inferred network context; it is an analysis aid, not a full Huawei protocol decoder.