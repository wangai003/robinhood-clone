from flask import Blueprint, jsonify

stock_routes = Blueprint('stocks', __name__)


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
