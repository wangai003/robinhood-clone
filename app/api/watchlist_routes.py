from crypt import methods
from unicodedata import name
from flask import Blueprint, jsonify, request, Response
from sqlalchemy import func, true
from sqlalchemy.orm import joinedload
from flask_login import current_user, login_required
from app.models import Watchlist, WatchlistStock, db
from app.forms import CreateWatchlistForm

watchlist_routes = Blueprint('watchlists', __name__)


def checkWatchlistName(name):
    name = name.strip()
    watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.id).filter(
        func.lower(Watchlist.name) == func.lower(name)).all()
    if(watchlists):
        print("same one")
        return True

    else:
        print("no same one")
        return False


def checkStockInWatchlist(symbol, company, watchlistId):
    print(symbol)
    print(company)
    stocks = WatchlistStock.query.filter(WatchlistStock.watchlist_id == watchlistId).filter(func.lower(
        WatchlistStock.name) == func.lower(company)).filter(func.lower(WatchlistStock.symbol) == func.lower(symbol)).all()
    if(stocks):
        print("exists")
        return True
    else:
        print("Doesnt exist")
        return False


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@watchlist_routes.route('/', methods=['POST', 'GET'])
@login_required
def loadOrCreateWatchlist():
    if(request.method == 'POST'):
        print("HIT CREATE")
        form = CreateWatchlistForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        # check if it exists inside of the request
        if(form.validate_on_submit()):
            watchlist = Watchlist(
                user_id=form.data['user_id'],
                name=form.data['name']
            )
            if(checkWatchlistName(watchlist.name)):
                return {"error": "Watchlist already exists"}
                # return Response("{'error':'Watchlist already exists'}", status= 422, mimetype='application/json')
            db.session.add(watchlist)
            db.session.commit()
            return watchlist.to_dict()
        return("200")
    else:
        print("HIT LOAD")
        # figure out a way to get current user and their id replace 1 with user id
        # current_user doesnt exist for some reason but it exists in delete
        watchlists = Watchlist.query.filter(
            Watchlist.user_id == current_user.id).order_by(Watchlist.id).all()
        for watchlist in watchlists:
            stocks = WatchlistStock.query.filter(
                WatchlistStock.watchlist_id == watchlist.id).order_by(WatchlistStock.id).all()
            listStock = []
            for stock in stocks:
                listStock.append(
                    {'name': stock.name, 'id': stock.id, 'symbol': stock.symbol})
            watchlist.stocks = listStock
        return jsonify([{'name': watchlist.name, 'id': watchlist.id, 'stocks': watchlist.stocks}for watchlist in watchlists])


@watchlist_routes.route('/<int:id>', methods=['DELETE', 'PATCH'])
@login_required
def deleteOrEditWatchlist(id):
    if(request.method == 'DELETE'):
        print("Hitting Delete")
        print(id)
        watchlist = Watchlist.query.get(id)
        if(current_user.id == watchlist.user_id):
            db.session.delete(watchlist)
            db.session.commit()
        return watchlist.to_dict()
    else:
        print("HITTING EDIT")
        print(id)
        form = CreateWatchlistForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        watchlist = Watchlist.query.get(id)
        if(current_user.id == watchlist.user_id and form.validate_on_submit()):
            if(checkWatchlistName(form.data["name"])):
                return {"error": "Watchlist already exists"}
            setattr(watchlist, 'name', form.data["name"])
            db.session.commit()
            return watchlist.to_dict()
        return "200"


@watchlist_routes.route('/<int:id>/stocks', methods=['POST'])
@login_required
def addStockToWatchlist(id):
    print(id)
    split = request.json['name'].split()
    symbol = split.pop()
    joined = ' '.join(str(e) for e in split)
    print(symbol)
    print(joined)
    stock = WatchlistStock(
        watchlist_id=id,
        name=joined,
        symbol=symbol)
    if(checkStockInWatchlist(symbol, joined, id)):
        return {"error": "Stock already exists within watchlist"}
    db.session.add(stock)
    db.session.commit()
    return stock.to_dict()


@watchlist_routes.route('/<int:watchlistId>/stocks/<int:stockId>', methods=['DELETE'])
@login_required
def deleteStock(watchlistId, stockId):
    print(watchlistId)
    print(stockId)
    stock = WatchlistStock.query.get(stockId)
    watchlist = Watchlist.query.get(watchlistId)
    if(watchlistId == stock.watchlist_id and watchlist.user_id == current_user.id):
        db.session.delete(stock)
        db.session.commit()
        return stock.to_dict()
    else:
        # error is here
        print("ERROR")
    return "200"
