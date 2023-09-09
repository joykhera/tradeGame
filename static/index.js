const ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
const curDataLen = 50;

class StockChart {
    constructor() {
        this.chart = new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: 'CHRT - Chart.js Corporation',
                    data: this.barData
                }]
            },
        })
        this.getData().then(data => this.barData = data).then(() => this.update())
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
            body: JSON.stringify({ ticker: ticker, start: start, end: end, interval: interval })
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
        const data = this.barData.filter((d, i) => i >= index - curDataLen && i < index);
        // console.log(index, this.barData, data)

        // mixed charts
        this.chart.config.data.datasets = [
            {
                label: 'CHRT - Chart.js Corporation',
                data: data
            },
        ]
        // console.log(this.chart.config.data.datasets)
 
        this.chart.update();
        // window.requestAnimationFrame(() => this.update(index + 1));
        console.log(index)
        setTimeout(() => this.update(index + 1), 500);
    }
};

const stockChart = new StockChart();