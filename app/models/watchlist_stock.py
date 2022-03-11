from .db import db


class WatchlistStock(db.Model):
    __tablename__ = 'watchlist_stocks'

    id = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(
        "watchlists.id"), nullable=False)
    symbol = db.Column(db.String(5), nullable=False)

    watchlist = db.relationship("Watchlist", back_populates="stocks")

    def to_dict(self):
        return {
            'id': self.id,
            'watchlist_id': self.watchlist_id,
            'symbol': self.symbol
        }
