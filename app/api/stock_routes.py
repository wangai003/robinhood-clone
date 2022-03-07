import requests
from os import environ
from flask import Blueprint, jsonify, request

stock_routes = Blueprint('stocks', __name__)

IN_PRODUCTION = environ.get('FLASK_ENV') == 'production'

API_KEY = environ.get('API_KEY')
SANDBOX_API_KEY = environ.get('SANDBOX_API_KEY')

API_URL = 'https://cloud.iexapis.com/stable'
SANDBOX_API_URL = 'https://sandbox.iexapis.com/stable'

KEY = API_KEY if IN_PRODUCTION else SANDBOX_API_KEY
BASE_URL = API_URL if IN_PRODUCTION else SANDBOX_API_URL


@stock_routes.route('/')
def stock_symbols():
    """
    Returns list of stock symbol data as json
    """
    AMEX = [line.strip().split('\t')
            for line in open('app/utils/AMEX.txt')][1:]
    NASDAQ = [line.strip().split('\t')
              for line in open('app/utils/NASDAQ.txt')][1:]
    NYSE = [line.strip().split('\t')
            for line in open('app/utils/NYSE.txt')][1:]

    data = [{'symbol': stock[0], 'name': stock[1]}
            for stock in sorted(AMEX + NASDAQ + NYSE) if len(stock) == 2]

    return jsonify(data)


@stock_routes.route('/<symbol>/company')
def stock_company(symbol):
    info = requests.get(
        f'{BASE_URL}/stock/{symbol}/company', params={'token': KEY}
    ).json()

    data = {
        'symbol': info['symbol'],
        'name': info['companyName'],
        'CEO': info['CEO'],
        'employees': info['employees'],
        'headquarters': f"{info['city']}, {info['country']}",
    }

    return jsonify(data)


@stock_routes.route('/<symbol>/quote')
def stock_quote(symbol):
    quote = requests.get(
        f'{BASE_URL}/stock/{symbol}/quote', params={'token': KEY}
    ).json()

    data = {
        'open': quote['open'],
        'close': quote['close'],
        'change': quote['change'],
        'change_percent': quote['changePercent'],
        'high': quote['high'],
        'low': quote['low'],
        'week52_high': quote['week52High'],
        'week52_low': quote['week52Low'],
        'average_total_volume': quote['avgTotalVolume'],
        'total_volume': quote['volume']
    }

    return jsonify(data)


@stock_routes.route('/<symbol>/news')
def stock_news(symbol):
    count = request.args.get('count') or 1
    latest_news = requests.get(
        f'{BASE_URL}/stock/{symbol}/news/last/{count}', params={'token': KEY}
    ).json()

    data = [
        {
            'datetime': news['datetime'],
            'headline': news['headline'],
            'summary': news['summary'],
            'url': news['url'],
            'image': news['image']
        }
        for news in latest_news
    ]

    return jsonify(data)
