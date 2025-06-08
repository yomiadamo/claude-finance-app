# App Architecture

- Backend: Python (Flask)
  - REST endpoints:
    - GET /api/transactions
    - POST /api/transactions
    - GET /api/summary?month=YYYY-MM
  - Stores data in JSON files locally.

- Frontend: HTML + JavaScript + Chart.js
  - Fetches and displays transaction data from the backend.
  - Lets users add transactions and view charts.

- No authentication needed (local use only).