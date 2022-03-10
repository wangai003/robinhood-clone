from flask import Blueprint, jsonify, request, session
from flask_login import login_required
from app.models import User, db
from app.forms import AddBuyingPowerForm
from decimal import *

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()



@user_routes.route('/<int:id>/add-bp', methods=['PUT'])
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

            return str(user.buying_power)

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@user_routes.route('/<int:id>/mybp')
@login_required
def get_bp(id):
    user = User.query.get(id)

    return str(user.buying_power)
