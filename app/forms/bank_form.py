from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User, db, LinkedAccount


def acct_exists(form, field):
    number = field.data
    acct = LinkedAccount.query.filter(LinkedAccount.account_number == number).first()
    if acct:
        raise ValidationError('Invalid bank account. Please enter a different account number.')


class AddBankForm(FlaskForm):
    user_id = StringField('user_id', validators=[DataRequired()])
    bank_id = StringField('bank_id', validators=[DataRequired()])
    account_number = StringField('account_number', validators=[DataRequired(), acct_exists, Length(min=10, max=10, message='Please enter a valid account number.')])
    name = StringField('name', validators=[DataRequired(message='Please enter a valid name.'), Length(min=3, message='Name must be at least 3 characters long.')])


class EditBankForm(FlaskForm):
    user_id = StringField('user_id', validators=[DataRequired()])
    bank_id = StringField('bank_id', validators=[DataRequired()])
    account_number = StringField('account_number', validators=[DataRequired(), Length(min=10, max=10, message='Please enter a valid account number.')])
    name = StringField('name', validators=[DataRequired(message='Please enter a valid name.'), Length(min=3, message='Name must be at least 3 characters long.')])
