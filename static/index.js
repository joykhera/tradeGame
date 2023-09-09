const ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

class StockChart {
    constructor() {
        // this.barData = await this.getData(initialDateStr, barCount)
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
        // this.getData(initialDateStr, barCount).then(data => console.log(data))

    }

    lineData = () => { return this.barData.map(d => { return { x: d.x, y: d.c } }) }

    getData = async () => {
        const ticker = 'AAPL'
        const interval = '1m'
        const start = '2023-08-11'
        const end = '2023-08-12'

        const response = await fetch('/getData', {
            // const response = await fetch('http://127.0.0.1:5000/getData', {
            method: 'POST',
            // mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({ ticker, start, end, interval })
            body: JSON.stringify({ ticker: ticker, start: start, end: end, interval: interval })
        });

        const tickerData = await response.json();
        // console.log('tickerData', tickerData)
        // console.log('content', data)
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

    update = () => {
        var dataset = this.chart.config.data.datasets[0];
        this.chart.config.options.scales.y.type = 'linear';

        dataset.color = {
            up: '#01ff01',
            down: '#fe0000',
            unchanged: '#999',
        };

        // border
        var defaultOpts = Chart.defaults.elements['candlestick'];
        dataset.borderColor = defaultOpts.borderColor;

        // mixed charts
        this.chart.config.data.datasets = [
            {
                label: 'CHRT - Chart.js Corporation',
                data: this.barData
            },
            // {
            //     label: 'Close price',
            //     type: 'line',
            //     data: this.lineData()
            // }
        ]
        console.log(this.chart.config.data.datasets)
 
        const delayBetweenPoints = 10000 / this.barData.length;
        const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
        const animationOptions = {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    console.log(ctx.index, ctx.index * delayBetweenPoints)
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        }
        this.chart.config.options.animation = animationOptions
        this.chart.update();
    }
};

const stockChart = new StockChart();