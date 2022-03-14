from calendar import month
from tempfile import gettempdir
import requests
from os import environ, times
from flask import Blueprint, jsonify, request
from datetime import datetime, time
from dateutil.relativedelta import relativedelta
import pytz

stock_routes = Blueprint('stocks', __name__)

IN_PRODUCTION = environ.get('FLASK_ENV') == 'production'

API_KEY = environ.get('API_KEY')
SANDBOX_API_KEY = environ.get('SANDBOX_API_KEY')
# TOKEN = API_KEY if IN_PRODUCTION else SANDBOX_API_KEY
TOKEN = 'c8lu8i2ad3ie52go2ls0'

BASE_URL = 'https://finnhub.io/api/v1'


def get_time_stamp(time):
    return int(pytz.timezone('America/New_York').localize(time).timestamp())


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

    data = {stock[0]: {'symbol': stock[0], 'name': stock[1]}
            for stock in sorted(AMEX + NASDAQ + NYSE) if len(stock) == 2}

    return jsonify(data)


@stock_routes.route('/search/<query>')
def test(query):
    print(query)
    AMEX = [line.strip().split('\t')
            for line in open('app/utils/AMEX.txt')][1:]
    NASDAQ = [line.strip().split('\t')
              for line in open('app/utils/NASDAQ.txt')][1:]
    NYSE = [line.strip().split('\t')
            for line in open('app/utils/NYSE.txt')][1:]
    data = [{'symbol': stock[0], 'name': stock[1]}
            for stock in sorted(AMEX + NASDAQ + NYSE) if len(stock) == 2]
    # data is a list of objects
    res = []
    print("asdkbasjhdbasjhdbasjhb")
    for something in data:
        symbol = something["symbol"]
        name = something["name"]
        if(query.lower() in symbol.lower() or query.lower() in name.lower()):
            res.append(something)
    print(res)
    return jsonify(res)


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
    time_frame = request.args.get('time-frame')

    if time_frame not in ['1D', '1W', '1M', '3M', '1Y']:
        return {'error': 'Time frame out of scope.'}, 404

    # Changes day to Friday if its a weekend
    today = datetime.today()
    if today.isoweekday() == 6:
        today = datetime.today().replace(hour=9, minute=0, second=0) + \
            relativedelta(days=-1)
    elif today.isoweekday() == 7:
        today = datetime.today().replace(hour=9, minute=0, second=0) + \
            relativedelta(days=-2)

    initial_open = today.replace(hour=9, minute=0, second=0)

    open_times = {
        '1D': get_time_stamp(initial_open),
        '1W': get_time_stamp(initial_open + relativedelta(weeks=-1, days=+1)),
        '1M': get_time_stamp(initial_open + relativedelta(months=-1, days=+1)),
        '3M': get_time_stamp(initial_open + relativedelta(months=-3, days=+1)),
        '1Y': get_time_stamp(initial_open + relativedelta(years=-1))
    }

    open = open_times[time_frame]
    close = get_time_stamp(today.replace(hour=18, minute=1, second=0))

    resolutions = {
        '1D': '5',
        '1W': '5',
        '1M': '60',
        '3M': 'D',
        '1Y': 'D'
    }

    params = {
        'symbol': symbol,
        'resolution': resolutions[time_frame],
        'from': open,
        'to': close,
        'token': TOKEN
    }
    res = requests.get(f'{BASE_URL}/stock/candle', params=params).json()

    data = [{'time': t, 'price': c} for t, c in zip(res['t'], res['c'])]

    # Filters times from data that are between 6:30AM PST and 1AM PST
    if time_frame in ['1W', '1M']:
        data = [d for d in data if time(datetime.fromtimestamp(d['time']).hour, datetime.fromtimestamp(d['time']).minute) >= time(6, 30)
                and time(datetime.fromtimestamp(d['time']).hour, datetime.fromtimestamp(d['time']).minute) < time(13, 0)
                and datetime.fromtimestamp(d['time']).minute % 10 == 0]

    return jsonify(data)


@ stock_routes.route('<symbol>/financials')
def stock_financials(symbol):
    symbol = symbol.upper()
    params = {
        'symbol': symbol,
        'metric': 'all',
        'token': TOKEN
    }
    res = requests.get(f'{BASE_URL}/stock/metric',
                       params=params).json()['metric']

    data = {
        'market_cap': res['marketCapitalization'],
        '52_week_high': res['52WeekHigh'],
        '52_week_low': res['52WeekLow'],
        'pe_ratio': res['peNormalizedAnnual'],
        'dividend_yield': res['dividendYieldIndicatedAnnual'],
    }

    return jsonify(data)
