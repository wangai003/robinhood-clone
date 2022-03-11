from flask import Blueprint, jsonify
from app.models import Bank
from flask_login import login_required

bank_routes = Blueprint('banks', __name__)


@bank_routes.route('/')
def banks():
    banks = Bank.query.all()
    # return jsonify({bank.id: bank.name for bank in banks})
    return jsonify({bank.id: {'name': bank.name, 'id': bank.id} for bank in banks})
