from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Email, ValidationError, Length, NumberRange
from app.models import User, db, BankAccount


class AddBuyingPowerForm(FlaskForm):
    buying_power = IntegerField('buying_power', validators=[DataRequired(), NumberRange(min=0, max=None, message='Please enter a positive value.')])
