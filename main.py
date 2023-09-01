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
    data_dict = data.to_dict(orient='index')
    formatted_data = {}
    for key, value in data_dict.items():
        # print(key, type(key), key.timestamp())
        # print(key, int(round(key * 1000)))
        formatted_data[str(round(key.timestamp() * 1000))] = value
    # print(data_dict)
    # return json.dumps(data.to_dict(orient='index'))
    # return data.to_json(orient='columns')
    return formatted_data

# data = yf.download("SPY", start="2023-08-11", end="2023-08-12", interval="1m")

# print(data.head())


if __name__ == '__main__':
   app.run()
