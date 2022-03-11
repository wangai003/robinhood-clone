from .db import db


class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    symbol = db.Column(db.String(5), nullable=False)
    count = db.Column(db.Integer, nullable=False)

    user = db.relationship("User", back_populates="assets")

    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'count': self.count
        }

    def num_count(self):
        return self.count

    def str_symbol(self):
        return self.symbol
