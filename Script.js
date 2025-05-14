document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    loadCurrencies();
    loadHistory();
}


async function loadCurrencies() {
    try {
        const response = await fetch(`https://api.fxratesapi.com/currencies`);
        const data = await response.json();
        console.log(data);
        const currencies = Object.keys(data);
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        currencies.forEach(currency => {
            const option1 = new Option(currency, currency);
            const option2 = new Option(currency, currency);
            fromCurrency.add(option1);
            toCurrency.add(option2);
        });
    } catch (error) {
        console.error('Error loading currencies:', error);
    }
}


async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    try {
        const response = await fetch(`https://api.fxratesapi.com/convert?from=${from}&to=${to}&amount=${amount}`);
        const result = await response.json();
        const convertedAmount = result.result;
        displayResult(convertedAmount);
        saveToHistory(from, to, amount, convertedAmount);
    } catch (error) {
        console.error('Error converting currency:', error);
    }
}


function displayResult(convertedAmount) {
    document.getElementById('result').textContent = `Converted Amount: ${convertedAmount}`;
}

function saveToHistory(from, to, amount, result) {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    history.push(`${amount} ${from} = ${result} ${to}`);
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    updateHistory();
}

function loadHistory() {
    updateHistory();
}

function updateHistory() {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}
