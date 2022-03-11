from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User, db, BankAccount


# def acct_exists(form, field):
#     number = field.data
#     acct = BankAccount.query.filter(BankAccount.account_number == number).first()
#     if acct:
#         raise ValidationError('Account number already exists. Please enter a different account number.')


# class AddBankForm(FlaskForm):
#     user_id = StringField('user_id', validators=[DataRequired()])
#     bank_id = StringField('bank_id', validators=[DataRequired()])
#     account_number = StringField('account_number', validators=[DataRequired(), acct_exists, Length(min=10, max=10, message='Please enter a valid account number.')])
#     name = StringField('name', validators=[DataRequired(message='Please enter a valid name.'), Length(min=3, message='Name must be at least 3 characters long.')])


class AddBuyingPowerForm(FlaskForm):
    buying_power = StringField('buying_power', validators=[DataRequired()])
