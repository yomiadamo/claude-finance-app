# Personal Finance Manager

A web-based personal finance application that allows users to track income and expenses with interactive visualizations.

## Features

- **Transaction Management**: Add and view income/expense transactions
- **Category Tracking**: Organize transactions by category (salary, groceries, rent, etc.)
- **Budget Summary Chart**: Interactive bar chart showing spending/income by category
- **Real-time Balance**: Live calculation of total balance
- **Responsive Design**: Clean, modern interface

## Tech Stack

**Backend:**
- Python Flask
- Flask-CORS for cross-origin requests
- JSON file storage for transaction data

**Frontend:**
- HTML5/CSS3
- Vanilla JavaScript
- Chart.js for data visualization

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd code/backend
   ```

2. Install required dependencies:
   ```bash
   pip install flask flask-cors
   ```

3. Run the Flask server:
   ```bash
   flask run
   ```
   
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd code/frontend
   ```

2. Open `index.html` in your web browser or serve it with a local web server:
   ```bash
   python -m http.server 8000
   ```
   
   Then visit `http://localhost:8000`

## API Endpoints

### GET /api/transactions
Returns all transactions in JSON format.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "date": "2024-01-15",
      "amount": 1500.00,
      "category": "salary",
      "description": "Monthly salary"
    }
  ]
}
```

### POST /api/transactions
Add a new transaction.

**Request Body:**
```json
{
  "date": "2024-01-15",
  "amount": -50.00,
  "category": "groceries",
  "description": "Weekly grocery shopping"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "date": "2024-01-15",
    "amount": -50.00,
    "category": "groceries",
    "description": "Weekly grocery shopping"
  }
}
```

### GET /api/summary
Returns budget summary with category totals and overall statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "categoryTotals": {
      "salary": 1500.00,
      "groceries": -200.00,
      "rent": -800.00
    },
    "totalIncome": 1500.00,
    "totalExpenses": 1000.00,
    "netBalance": 500.00
  }
}
```

## Usage

1. **Adding Transactions**: Fill out the form with date, amount (positive for income, negative for expenses), category, and description.

2. **Viewing Summary**: The budget summary chart automatically updates to show spending patterns by category. Green bars represent income categories, red bars represent expense categories.

3. **Transaction History**: All transactions are displayed in chronological order with running balance calculation.

## File Structure

```
finance-app/
├── code/
│   ├── backend/
│   │   ├── app.py              # Flask application
│   │   └── transactions.json   # Data storage (created automatically)
│   └── frontend/
│       ├── index.html          # Main UI
│       └── script.js           # JavaScript functionality
├── claude/                     # Claude documentation
└── README.md                   # This file
```

## Contributing

This is a personal project built with assistance from Claude AI. Feel free to fork and customize for your own use.