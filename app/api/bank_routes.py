from flask import Blueprint, jsonify, session, request, flash
from flask_login import login_required
from app.models import User, db, Bank, LinkedAccount
from app.forms import AddBankForm
from flask_login import current_user, login_user, logout_user, login_required

bank_routes = Blueprint('banks', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@bank_routes.route('/')
def banks():
    banks = Bank.query.all()
    # return jsonify({bank.id: bank.name for bank in banks})
    return jsonify([{'name': bank.name, 'id': bank.id} for bank in banks])


@bank_routes.route('/linked')
def linked():
  current_user_id = int(current_user.id)

  # account = LinkedAccount.query.filter(LinkedAccount.user_id.like(1)).all()
  accounts = LinkedAccount.query.filter_by(user_id=current_user_id).all()

  # return f'{current_user_id}'

  return jsonify([{'id': account.id, 'name': account.name, 'user': account.user_id, 'account_number': account.account_number} for account in accounts])

@bank_routes.route('/addbank', methods=['POST'])
def add_bank():
    """
    Links new Bank to logged in User
    """
    form = AddBankForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        bank = LinkedAccount(
            user_id=form.data['user_id'],
            bank_id=form.data['bank_id'],
            name=form.data['name'],
            account_number=form.data['account_number']
        )
        db.session.add(bank)
        db.session.commit()

        return bank.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401



@bank_routes.route('/delete/<int:id>')
def remove_account(id):
    acct = LinkedAccount.query.get(id)

    if(current_user.id == acct.user_id):
      db.session.delete(acct)
      db.session.commit()

    return "Bank Account Unlinked"
