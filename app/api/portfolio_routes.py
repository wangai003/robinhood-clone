from flask import Blueprint, jsonify, request, session
from flask_login import current_user, login_required
from app.models import User
from .buying_power_routes import buying_power_routes
from .bank_account_routes import bank_account_routes
from .asset_routes import asset_routes
from .watchlist_routes import watchlist_routes

portfolio_routes = Blueprint('portfolio', __name__)

portfolio_routes.register_blueprint(
    buying_power_routes, url_prefix='/buying-power')
portfolio_routes.register_blueprint(
    bank_account_routes, url_prefix='/bank-accounts')
portfolio_routes.register_blueprint(asset_routes, url_prefix='/assets')
portfolio_routes.register_blueprint(watchlist_routes, url_prefix='/watchlists')


@portfolio_routes.route('/')
@login_required
def get_portfolio():
    """
    Fetches the portfolio of current_user
    """
    user = User.query.get(current_user.id).to_dict()

    portfolio = {
        'buying_power': user['buying_power'],
        'bank_accounts': user['bank_accounts'],
        'assets': user['assets'],
        'watchlists': user['watchlists']
    }

    # print(portfolio)

    return portfolio
