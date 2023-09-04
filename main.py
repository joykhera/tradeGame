import yfinance as yf
from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/getData', methods=['POST'])
@cross_origin()
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
        formatted_data[str(round(key.timestamp() * 1000))] = value
    return json.dumps(formatted_data)

if __name__ == '__main__':
   app.run()
