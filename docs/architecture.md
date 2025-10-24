# Architecture (overview)

- Frontend: React + TypeScript (dashboard, KDS, PDV)
- Backend: Node.js/NestJS or Express (REST + WebSocket)
- DB: PostgreSQL (persistent)
- Queue: Redis for print jobs and background tasks
- Print-agent: Node-based worker, drivers for ESC/POS, Bluetooth, USB
- CI/CD: GitHub Actions; Deploy via Helm to Kubernetes or manual VPS

