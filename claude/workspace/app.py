from flask import Flask, request, jsonify
import json, os

app = Flask(__name__)
DATA_FILE = 'transactions.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE) as f:
            return json.load(f)
    return []

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    return jsonify(load_data())

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    transactions = load_data()
    transactions.append(data)
    with open(DATA_FILE, 'w') as f:
        json.dump(transactions, f)
    return jsonify({"status": "success"})
