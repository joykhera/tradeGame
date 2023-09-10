const ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

let numDatapoints = 50;
document.getElementById('numDatapoints').addEventListener('input', (e) => numDatapoints = e.target.value)
 
let interval = 500;
document.getElementById('interval').addEventListener('input', (e) => interval = e.target.value)

const tickerOptions = ['TSLA', 'AAPL', 'F', 'NVDA', 'AMD']
const today = new Date()
const latestDate = new Date()
latestDate.setDate(today.getDate() - 1)
const earliestDate = new Date()
earliestDate.setDate(today.getDate() - 29)
const timeDiff = latestDate.getTime() - earliestDate.getTime();
let cash = 1000;
let shares = 0;

class StockChart {
    constructor(){
        this.ticker = tickerOptions[Math.floor(Math.random() * tickerOptions.length)]
        let day = 0;

        while (day < 1 || day > 5) {
            const randomTime = Math.random() * timeDiff;
            const randomDate = new Date(earliestDate.getTime() + randomTime)
            this.startDate = randomDate.toISOString().split('T')[0]
            this.endDate = new Date(randomDate.getTime() + 86400000).toISOString().split('T')[0]
            day = randomDate.getDay();
        }

        this.chart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: this.ticker + ' ' + this.startDate,
                    data: this.barData
                }]
            },
        })

        this.getData().then(data => this.barData = data).then(() => this.update())
        console.log(this.ticker, this.startDate, this.endDate)
    }

    lineData = () => { return this.barData.map(d => { return { x: d.x, y: d.c } }) }

    getData = async () => {
        const ticker = 'AAPL'
        const interval = '1m'
        const start = '2023-08-11'
        const end = '2023-08-12'

        const response = await fetch('/getData', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ ticker: ticker, start: start, end: end, interval: interval })
            body: JSON.stringify({ ticker: this.ticker, start: this.startDate, end: this.endDate, interval: interval })
        });

        const tickerData = await response.json();

        const chartData = []
        for (const [date, data] of Object.entries(tickerData)) {
            chartData.push({
                x: date,
                o: data['Open'],
                h: data['High'],
                l: data['Low'],
                c: data['Close']
            })
        }
        return chartData;
    }

    update = (index = 0) => {
        const dataset = this.chart.config.data.datasets[0];
        this.chart.config.options.scales.y.type = 'linear';

        dataset.color = {
            up: '#01ff01',
            down: '#fe0000',
            unchanged: '#999',
        };

        // border
        const defaultOpts = Chart.defaults.elements['candlestick'];
        dataset.borderColor = defaultOpts.borderColor;
        const data = this.barData.filter((d, i) => i >= index - numDatapoints && i < index);
        // console.log(index, this.barData, data)

        // mixed charts
        this.chart.config.data.datasets = [
            {
                label: this.ticker + ' ' + this.startDate,
                data: data
            },
        ]
        // console.log(this.chart.config.data.datasets)

        this.chart.update();

        if (index <= this.barData.length) {
            // console.log(index)
            setTimeout(() => this.update(index + 1), interval);
        }
    }
};

const stockChart = new StockChart();
const cashElement = document.getElementById('cash')
const sharesElement = document.getElementById('shares')

document.getElementById('buy').addEventListener('click', () => {
    const latestPrice = stockChart.chart.config.data.datasets[0].data[stockChart.chart.config.data.datasets[0].data.length - 1].c
    if (cash >= latestPrice) {
        shares += 1
        cash -= latestPrice
        sharesElement.innerHTML = `Shares: ${shares}`
        cashElement.innerHTML = `Cash: $${cash}`
    }
})

document.getElementById('sell').addEventListener('click', () => {
    const latestPrice = stockChart.chart.config.data.datasets[0].data[stockChart.chart.config.data.datasets[0].data.length - 1].c
    if (shares > 0) {
        shares -= 1
        cash += latestPrice
        sharesElement.innerHTML = `Shares: ${shares}`
        cashElement.innerHTML = `Cash: $${cash}`
    }
})