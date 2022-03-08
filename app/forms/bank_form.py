from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User, db



class AddBankForm(FlaskForm):
    user_id = StringField('user_id', validators=[DataRequired()])
    bank_id = StringField('bank_id', validators=[DataRequired()])
    account_number = StringField('account_number', validators=[DataRequired()])
    name = StringField('name', validators=[DataRequired()])
