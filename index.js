var barCount = 60;
var initialDateStr = '01 Apr 2017 00:00 Z';

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

var barData = await getData(initialDateStr, barCount);
console.log(barData)
function lineData() { return barData.map(d => { return { x: d.x, y: d.c } }) };

var chart = new Chart(ctx, {
    type: 'candlestick',
    data: {
        datasets: [{
            label: 'CHRT - Chart.js Corporation',
            data: barData
        }]
    }
});

async function getData() {
    const ticker = 'AAPL'
    const interval = '1m'
    const start = '2023-08-11'
    const end = '2023-08-12'

    const response = await fetch('/api/getData', {
    // const response = await fetch('http://127.0.0.1:5000/getData', {
        method: 'POST',
        mode: 'no-cors',
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({ ticker, start, end, interval })
        body: JSON.stringify({ ticker: ticker, start: start, end: end, interval: interval })
    });

    const tickerData = await response.json();
    // console.log('content', data)
    const chartData = []
    for (const [date, data] of Object.entries(tickerData)) {
        chartData.push({
            x: date,
            o: data['open'],
            h: data['high'],
            l: data['low'],
            c: data['close']
        })
    }
    return chartData;
}

var update = function () {
    var dataset = chart.config.data.datasets[0];

    // candlestick vs ohlc
    var type = document.getElementById('type').value;
    dataset.type = type;

    // linear vs log
    var scaleType = document.getElementById('scale-type').value;
    chart.config.options.scales.y.type = scaleType;

    // color
    var colorScheme = document.getElementById('color-scheme').value;
    if (colorScheme === 'neon') {
        dataset.color = {
            up: '#01ff01',
            down: '#fe0000',
            unchanged: '#999',
        };
    } else {
        delete dataset.color;
    }

    // border
    var border = document.getElementById('border').value;
    var defaultOpts = Chart.defaults.elements[type];
    if (border === 'true') {
        dataset.borderColor = defaultOpts.borderColor;
    } else {
        dataset.borderColor = {
            up: defaultOpts.color.up,
            down: defaultOpts.color.down,
            unchanged: defaultOpts.color.up
        };
    }

    // mixed charts
    var mixed = document.getElementById('mixed').value;
    if (mixed === 'true') {
        chart.config.data.datasets = [
            {
                label: 'CHRT - Chart.js Corporation',
                data: barData
            },
            {
                label: 'Close price',
                type: 'line',
                data: lineData()
            }
        ]
    }
    else {
        chart.config.data.datasets = [
            {
                label: 'CHRT - Chart.js Corporation',
                data: barData
            }
        ]
    }

    chart.update();
};

document.getElementById('update').addEventListener('click', update);

console.log(location)