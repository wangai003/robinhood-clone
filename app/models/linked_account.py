from .db import db

class LinkedAccount(db.Model):
    __tablename__ = 'linked_accounts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    bank_id = db.Column(db.Integer, db.ForeignKey("banks.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    account_number = db.Column(db.String(16), nullable=False, unique=True)

    user = db.relationship("User", back_populates="linked_accounts")
    bank = db.relationship("Bank", back_populates="linked_accounts")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id' : self.user_id,
            'bank_id' : self.bank_id,
            'bank_name': self.bank.name,
            'account_number' : self.account_number,
        }
