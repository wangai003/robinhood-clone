from app.models import db, Watchlist


def seed_watchlists():
    tech = Watchlist(user_id=1, name='Tech')
    random = Watchlist(user_id=1, name='Random')
    eft = Watchlist(user_id=1, name='EFT')

    db.session.add(tech)
    db.session.add(random)
    db.session.add(eft)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_watchlists():
    db.session.execute('TRUNCATE watchlists RESTART IDENTITY CASCADE;')
    db.session.commit()
