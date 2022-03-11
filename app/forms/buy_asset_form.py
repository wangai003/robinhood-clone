from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class BuyAssetForm(FlaskForm):
    # name = StringField('name', validators=[DataRequired()])
    symbol = StringField('symbol', validators=[DataRequired()])
    count = IntegerField('count', validators=[DataRequired()])
