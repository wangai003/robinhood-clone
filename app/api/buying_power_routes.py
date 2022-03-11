from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db
from app.forms import AddBuyingPowerForm
from decimal import *

buying_power_routes = Blueprint('buying_power', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@buying_power_routes.route('/add', methods=['PUT'])
@login_required
def add_bp(id):
    user = User.query.get(id)

    form = AddBuyingPowerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        val = Decimal(user.buying_power) + Decimal(form.data['buying_power'])
        user.buying_power = val

        db.session.add(user)
        db.session.commit()

        return float(user.buying_power)

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@buying_power_routes.route('/subtract', methods=['PUT'])
@login_required
def subtract_bp(id):
    user = User.query.get(id)

    form = AddBuyingPowerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        val = Decimal(user.buying_power) - Decimal(form.data['buying_power'])
        user.buying_power = val

        db.session.add(user)
        db.session.commit()

        return float(user.buying_power)

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
