from flask import Blueprint, jsonify, request
from app.models import db, BankAccount
from app.forms import AddBankForm, EditBankForm
from flask_login import current_user, login_required

bank_account_routes = Blueprint('bank_accounts', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@bank_account_routes.route('/')
@login_required
def linked():
    """
    gets all bank accounts linked to user
    """
    current_user_id = int(current_user.id)

    accounts = BankAccount.query.filter_by(user_id=current_user_id).all()

    return jsonify({account.id: {'id': account.id, 'name': account.name, 'user': account.user_id, 'bank_id': account.bank_id, 'bank_name': account.bank.name, 'account_number': account.account_number} for account in accounts})


@bank_account_routes.route('/add', methods=['POST'])
@login_required
def add_bank():
    """
    Links new Bank to logged in User
    """
    form = AddBankForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        bank = BankAccount(
            user_id=form.data['user_id'],
            bank_id=form.data['bank_id'],
            name=form.data['name'],
            account_number=form.data['account_number']
        )
        db.session.add(bank)
        db.session.commit()

        return bank.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@bank_account_routes.route('/delete/<int:id>', methods=['DELETE'])
@login_required
def remove_account(id):
    acct = BankAccount.query.get(id)

    if(current_user.id == acct.user_id):
        db.session.delete(acct)
        db.session.commit()

    return "Bank Account Unlinked"


@bank_account_routes.route('/edit/<int:id>', methods=['PUT'])
@login_required
def update_bank(id):
    post = BankAccount.query.get(id)

    form = EditBankForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        post.user_id = form.data['user_id']
        post.bank_id = form.data['bank_id']
        post.name = form.data['name']
        post.account_number = form.data['account_number']

        try:
            db.session.add(post)
            db.session.commit()

            return post.to_dict()

        except:

            return {'errors': ['account_number : Invalid bank account. Please enter a different account number.']}, 401

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
