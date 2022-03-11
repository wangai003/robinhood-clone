from app.models import db, BankAccount


def seed_bank_accounts():
    acc_1 = BankAccount(
        user_id=1, bank_id=1, name='Chase bank', account_number=1234567890)
    acc_2 = BankAccount(user_id=1, bank_id=2, name='BoA',
                        account_number=9876543210)

    db.session.add(acc_1)
    db.session.add(acc_2)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_bank_accounts():
    db.session.execute('TRUNCATE bank_accounts RESTART IDENTITY CASCADE;')
    db.session.commit()
