from .db import db

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)

    user = db.relationship("User", back_populates="watchlists")
    watchlist_stocks = db.relationship("WatchlistStock", back_populates="watchlist")
