from enum import unique
from .db import db

class Bank(db.Model):
    __tablename__ = 'banks'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    url = db.Column(db.String(255), nullable=False, unique=True)

    linked_accounts = db.relationship("LinkedAccount", back_populates="bank")
