import yfinance as yf
from flask import Flask, render_template, request
import json
app = Flask(__name__)


# @app.route('/')
# def home():
#    return render_template('index.html')

@app.route('/getData', methods=['POST'])
def get_ticker_data():
    print(request.json)
    ticker = request.json['ticker']
    start = request.json['start']
    end = request.json['end']
    interval = request.json['interval']
    data = yf.download(ticker, start=start, end=end, interval=interval)
    return data.to_json(orient='columns')

# data = yf.download("SPY", start="2023-08-11", end="2023-08-12", interval="1m")

# print(data.head())


if __name__ == '__main__':
   app.run()
