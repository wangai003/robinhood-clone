from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User, db, LinkedAccount



class AddBuyingPowerForm(FlaskForm):
    buying_power = StringField('buying_power', validators=[DataRequired()])
