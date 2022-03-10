from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import current_user
from app.models import Asset, db
from app.forms.buy_asset_form import BuyAssetForm
asset_routes = Blueprint('assets', __name__)

@asset_routes.route('/', methods=["GET"])
def load_assets():
    assets = Asset.query.filter(Asset.user_id == current_user.id).all()
    return jsonify([{'id': asset.id, 'name': asset.name, 'symbol': asset.symbol,  'count': asset.count} for asset in assets])

@asset_routes.route('/', methods=['POST'])
def buy_assets():
    form = BuyAssetForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit()):
        asset = Asset(
            name=form.data['name'],
            symbol=form.data['symbol'],
            count=form.data['count']
        )
        db.session.add(asset)
        db.session.commit()
        return asset.to_dict()
    return("200")
