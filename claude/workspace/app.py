from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os
from datetime import datetime

app = Flask(__name__)
CORS(app)
DATA_FILE = 'transactions.json'

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_data(data):
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception:
        return False

def validate_transaction(data):
    required_fields = ['date', 'amount', 'category', 'description']
    
    if not data or not isinstance(data, dict):
        return False, "Invalid JSON data"
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    try:
        datetime.strptime(data['date'], '%Y-%m-%d')
    except ValueError:
        return False, "Invalid date format. Use YYYY-MM-DD"
    
    try:
        float(data['amount'])
    except (ValueError, TypeError):
        return False, "Amount must be a number"
    
    if not isinstance(data['category'], str) or not data['category'].strip():
        return False, "Category must be a non-empty string"
    
    if not isinstance(data['description'], str):
        return False, "Description must be a string"
    
    return True, None

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = load_data()
        return jsonify({"status": "success", "data": transactions})
    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to load transactions"}), 500

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    try:
        data = request.get_json()
        
        is_valid, error_msg = validate_transaction(data)
        if not is_valid:
            return jsonify({"status": "error", "message": error_msg}), 400
        
        transactions = load_data()
        
        transaction = {
            'id': len(transactions) + 1,
            'date': data['date'],
            'amount': float(data['amount']),
            'category': data['category'].strip(),
            'description': data['description']
        }
        
        transactions.append(transaction)
        
        if save_data(transactions):
            return jsonify({"status": "success", "data": transaction}), 201
        else:
            return jsonify({"status": "error", "message": "Failed to save transaction"}), 500
            
    except Exception as e:
        return jsonify({"status": "error", "message": "Internal server error"}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    try:
        transactions = load_data()
        
        if not transactions:
            return jsonify({
                "status": "success", 
                "data": {
                    "categoryTotals": {},
                    "totalIncome": 0,
                    "totalExpenses": 0,
                    "netBalance": 0
                }
            })
        
        category_totals = {}
        total_income = 0
        total_expenses = 0
        
        for transaction in transactions:
            amount = transaction['amount']
            category = transaction['category']
            
            if category not in category_totals:
                category_totals[category] = 0
            category_totals[category] += amount
            
            if amount > 0:
                total_income += amount
            else:
                total_expenses += abs(amount)
        
        net_balance = total_income - total_expenses
        
        return jsonify({
            "status": "success",
            "data": {
                "categoryTotals": category_totals,
                "totalIncome": total_income,
                "totalExpenses": total_expenses,
                "netBalance": net_balance
            }
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to generate summary"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
