from .db import db

class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    symbol = db.Column(db.String(5), nullable=False)
    count = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", back_populates="assets")
