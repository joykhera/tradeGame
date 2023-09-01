const ticker = 'AAPL'
const interval = '1m'
// const date = new Date('2023-08-16')
// const period1 = date.getTime() / 1000
// const period2 = date.setDate(date.getDate() + 1) / 1000

// const interval = '1d'
const date1 = new Date('2023-08-10')
const date2 = new Date('2023-08-15')
const period1 = date1.getTime() / 1000
const period2 = date2.getTime() / 1000

const rawResponse = await fetch('http://127.0.0.1:5000/getData', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ticker: "SPY", start:"2023-08-11", end:"2023-08-12", interval:"1m" })
});
console.log('rawResponse', rawResponse)
const content = await rawResponse.json();
console.log('content', content)
// console.log('content', await rawResponse.text())