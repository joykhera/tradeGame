const ticker = 'AAPL'
const interval = '1m'
const start = '2023-08-11'
const end = '2023-08-12'

const rawResponse = await fetch('http://127.0.0.1:5000/getData', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ticker: ticker, start: start, end: end, interval: interval })
});
const content = await rawResponse.json();
console.log('content', content)
// console.log('content', await rawResponse.text())