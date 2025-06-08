const API_BASE_URL = 'http://localhost:5000';
let summaryChart = null;

document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
    loadSummaryChart();
    setupForm();
    setDefaultDate();
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

function setupForm() {
    const form = document.getElementById('transactionForm');
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        date: document.getElementById('date').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };
    
    try {
        showMessage('Adding transaction...', 'loading');
        
        const response = await fetch(`${API_BASE_URL}/api/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            showMessage('Transaction added successfully!', 'success');
            document.getElementById('transactionForm').reset();
            setDefaultDate();
            loadTransactions();
            loadSummaryChart();
        } else {
            showMessage(`Error: ${result.message || 'Failed to add transaction'}`, 'error');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        showMessage('Error: Unable to connect to server', 'error');
    }
}

async function loadTransactions() {
    try {
        const transactionsDiv = document.getElementById('transactions');
        transactionsDiv.innerHTML = '<div class="loading">Loading transactions...</div>';
        
        const response = await fetch(`${API_BASE_URL}/api/transactions`);
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            displayTransactions(result.data);
        } else {
            transactionsDiv.innerHTML = '<div class="error">Failed to load transactions</div>';
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactions').innerHTML = '<div class="error">Unable to connect to server</div>';
    }
}

function displayTransactions(transactions) {
    const transactionsDiv = document.getElementById('transactions');
    
    if (!transactions || transactions.length === 0) {
        transactionsDiv.innerHTML = '<div class="loading">No transactions found. Add your first transaction above!</div>';
        return;
    }
    
    // Sort transactions by date (newest first)
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    let totalBalance = 0;
    
    sortedTransactions.forEach(transaction => {
        totalBalance += transaction.amount;
        const isIncome = transaction.amount > 0;
        const amountClass = isIncome ? 'positive' : 'negative';
        const transactionClass = isIncome ? 'income' : 'expense';
        const amountDisplay = isIncome ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`;
        
        html += `
            <div class="transaction ${transactionClass}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${transaction.description}</strong>
                        <div style="color: #666; font-size: 14px;">
                            ${formatDate(transaction.date)} • ${transaction.category}
                        </div>
                    </div>
                    <div class="amount ${amountClass}">
                        ${amountDisplay}
                    </div>
                </div>
            </div>
        `;
    });
    
    // Add balance summary
    const balanceClass = totalBalance >= 0 ? 'positive' : 'negative';
    const balanceDisplay = totalBalance >= 0 ? `+$${totalBalance.toFixed(2)}` : `-$${Math.abs(totalBalance).toFixed(2)}`;
    
    html = `
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; margin-bottom: 20px; text-align: center;">
            <strong>Total Balance: <span class="amount ${balanceClass}">${balanceDisplay}</span></strong>
        </div>
    ` + html;
    
    transactionsDiv.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

async function loadSummaryChart() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/summary`);
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            renderChart(result.data);
        } else {
            console.error('Failed to load summary data');
        }
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

function renderChart(summaryData) {
    const ctx = document.getElementById('summaryChart').getContext('2d');
    
    if (summaryChart) {
        summaryChart.destroy();
    }
    
    const categoryTotals = summaryData.categoryTotals;
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    
    if (categories.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No data available. Add some transactions to see the chart.', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    const backgroundColors = amounts.map(amount => 
        amount >= 0 ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'
    );
    const borderColors = amounts.map(amount => 
        amount >= 0 ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)'
    );
    
    summaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
            datasets: [{
                label: 'Amount ($)',
                data: amounts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return value >= 0 ? `+$${value.toFixed(2)}` : `-$${Math.abs(value).toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="${type}">${text}</div>`;
    
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}