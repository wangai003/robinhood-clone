from crypt import methods
from flask import Blueprint,jsonify,request
from sqlalchemy.orm import joinedload
from flask_login import current_user
from app.models import Watchlist,WatchlistStock,db
from app.forms import CreateWatchlistForm
watchlist_routes = Blueprint('watchlists',__name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages




@watchlist_routes.route('/',methods = ['POST', 'GET'])
def loadOrCreateWatchlist():
    if(request.method == 'POST'):
        print ("HIT CREATE")
        form = CreateWatchlistForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        # check if it exists inside of the request
        if(form.validate_on_submit()):
            watchlist = Watchlist(
                user_id = form.data['user_id'],
                name = form.data['name']
                )
            db.session.add(watchlist)
            db.session.commit()
            return watchlist.to_dict()
        return("200")
    else:
        print("HIT LOAD")
        # figure out a way to get current user and their id replace 1 with user id
        #current_user doesnt exist for some reason but it exists in delete
        watchlists = Watchlist.query.filter(Watchlist.user_id == 4).all()
        for watchlist in watchlists:
            stocks = WatchlistStock.query.filter(WatchlistStock.watchlist_id == watchlist.id).all()
            listStock = []
            for stock in stocks:
                listStock.append({'name':stock.name,'id':stock.id,'symbol':stock.symbol})
            watchlist.stocks = listStock
        return jsonify([{'name':watchlist.name,'id':watchlist.id,'stocks':watchlist.stocks}for watchlist in watchlists])

@watchlist_routes.route('/<int:id>',methods=['DELETE','PATCH'])
def deleteOrEditWatchlist(id):
    if(request.method =='DELETE'):
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
            setattr(watchlist,'name',form.data["name"])
            db.session.commit()
            return watchlist.to_dict()
        return "200"
