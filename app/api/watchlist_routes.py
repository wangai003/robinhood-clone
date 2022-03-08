from flask import Blueprint,jsonify,request
from sqlalchemy.orm import joinedload
from flask_login import current_user
from app.models import Watchlist,WatchlistStock

watchlist_routes = Blueprint('watchlists',__name__)

@watchlist_routes.route('/')
def loadWatchlist():
    print("HIT HERE")
    # figure out a way to get current user and their id replace 1 with user id
    watchlists = Watchlist.query.filter(Watchlist.user_id == 4).all()
    for watchlist in watchlists:
        stocks = WatchlistStock.query.filter(WatchlistStock.watchlist_id == watchlist.id).all()
        listStock = []
        for stock in stocks:
           listStock.append({'name':stock.name,'id':stock.id,'symbol':stock.symbol})
        watchlist.stocks = listStock
    return jsonify([{'name':watchlist.name,'id':watchlist.id,'stocks':watchlist.stocks}for watchlist in watchlists])
