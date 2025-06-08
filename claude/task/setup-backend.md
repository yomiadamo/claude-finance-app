# Task: Build Basic Flask Backend

Create a Python Flask app (`app.py`) with the following:

- `GET /api/transactions`: Return all transactions from `transactions.json`
- `POST /api/transactions`: Add a new transaction with:
  - `date` (YYYY-MM-DD)
  - `amount` (positive or negative)
  - `category` (e.g. "groceries", "rent")
  - `description`

Store transactions in a `transactions.json` file.
Return success/failure response.