from tokenize import String
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired



class CreateWatchlistForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    user_id = StringField('name',validators=[DataRequired()])
