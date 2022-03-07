from ntpath import join
import requests
from os import environ
from flask import Blueprint, jsonify, request
import time
import datetime
import pytz

stock_routes = Blueprint('stocks', __name__)

IN_PRODUCTION = environ.get('FLASK_ENV') == 'production'

API_KEY = environ.get('API_KEY')
SANDBOX_API_KEY = environ.get('SANDBOX_API_KEY')
TOKEN = API_KEY if IN_PRODUCTION else SANDBOX_API_KEY

BASE_URL = 'https://finnhub.io/api/v1'


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


@stock_routes.route('/<symbol>/quote')
def stock_quote(symbol):
    symbol = symbol.upper()
    params = {
        'symbol': symbol,
        'token': TOKEN
    }
    res = requests.get(f'{BASE_URL}/quote', params=params).json()

    data = {
        'current': res['c'],
        'change': res['d'],
        'change_percent': res['dp'],
        'open': res['o'],
        'previous_close': res['pc'],
        'high': res['h'],
        'low': res['l'],
    }

    return jsonify(data)


@stock_routes.route('/<symbol>/candles')
def stock_candles(symbol):
    symbol = symbol.upper()

    # Open pre-hours for Robinhood at 9AM EST in unix timestamp
    open = int(pytz.timezone('America/New_York').localize(datetime.datetime.today().replace(
        hour=9, minute=0, second=0)).timestamp())

    # Close after-hours for Robinhood at 4PM EST in unix timestamp
    close = int(pytz.timezone('America/New_York').localize(datetime.datetime.today().replace(
        hour=18, minute=0, second=0)).timestamp())

    params = {
        'symbol': symbol,
        'resolution': request.args.get('resolution') or 5,
        'from': request.args.get('from') or open,
        'to': request.args.get('to') or close,
        'token': TOKEN
    }

    res = requests.get(f'{BASE_URL}/stock/candle', params=params).json()

    data = [{'time': t, 'price': c} for t, c in zip(res['t'], res['c'])]

    return jsonify(data)


# @stock_routes.route('/<symbol>/company')
# def stock_company(symbol):
#     info = requests.get(
#         f'{BASE_URL}/stock/{symbol}/company', params={'token': KEY}
#     ).json()

#     data = {
#         'symbol': info['symbol'],
#         'name': info['companyName'],
#         'CEO': info['CEO'],
#         'employees': info['employees'],
#         'headquarters': f"{info['city']}, {info['country']}",
#     }

#     return jsonify(data)


# @stock_routes.route('/<symbol>/news')
# def stock_news(symbol):
#     count = request.args.get('count') or 1
#     latest_news = requests.get(
#         f'{BASE_URL}/stock/{symbol}/news/last/{count}', params={'token': KEY}
#     ).json()

#     data = [
#         {
#             'datetime': news['datetime'],
#             'headline': news['headline'],
#             'summary': news['summary'],
#             'url': news['url'],
#             'image': news['image']
#         }
#         for news in latest_news
#     ]

#     return jsonify(data)
