from flask import Blueprint, jsonify, session, request, flash
from flask_login import login_required
from app.models import User, db, Bank, LinkedAccount
from app.forms import AddBankForm, EditBankForm
from flask_login import current_user, login_user, logout_user, login_required

bank_routes = Blueprint('banks', __name__)


@bank_routes.route('/')
def banks():
    banks = Bank.query.all()
    # return jsonify({bank.id: bank.name for bank in banks})
    return jsonify([{'name': bank.name, 'id': bank.id} for bank in banks])
