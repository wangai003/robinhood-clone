from flask import Blueprint, jsonify, request
from sqlalchemy.orm import joinedload
from flask_login import current_user, login_required
from app.models import Asset, db
from app.forms.buy_asset_form import BuyAssetForm
asset_routes = Blueprint('assets', __name__)


@asset_routes.route('/', methods=["GET"])
@login_required
def load_assets():
    assets = Asset.query.filter(Asset.user_id == current_user.id).all()
    data = {asset.symbol: {asset.to_dict()} for asset in assets}
    return jsonify({asset.symbol: {asset.to_dict()} for asset in assets})


@asset_routes.route('/', methods=['POST'])
@login_required
def buy_assets():
    form = BuyAssetForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit()):
        asset = Asset(
            user_id=current_user.id,
            # name=form.data['name'],
            symbol=form.data['symbol'],
            count=form.data['count']
        )
        db.session.add(asset)
        db.session.commit()
        print(asset)
        return asset.to_dict()
    return("200")


@asset_routes.route('/<int:id>', methods=['PUT'])
@login_required
def buy_sell_assets(id):
    form = BuyAssetForm()
    print("*************IN PUT")
    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit()):
        asset = Asset.query.get(id)
        setattr(asset, 'count', form.data["count"] + asset.num_count())
        db.session.commit()
        return asset.to_dict()
    return("200")


@asset_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def sell_all_assets(id):
    form = BuyAssetForm()
    print("***************IN DELETE")
    form['csrf_token'].data = request.cookies['csrf_token']
    if(form.validate_on_submit()):
        asset = Asset.query.get(id)
        db.session.delete(asset)
        db.session.commit()
        return asset.to_dict()
    return("200")
