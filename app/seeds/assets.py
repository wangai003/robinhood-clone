from app.models import db, Asset


def seed_assets():
    aapl = Asset(user_id=1, symbol='AAPL', count=35)
    tsla = Asset(user_id=1, symbol='TSLA', count=90)
    fb = Asset(user_id=1, symbol='FB', count=9)
    nvda = Asset(user_id=1, symbol='NVDA', count=10)
    nflx = Asset(user_id=1, symbol='NFLX', count=50)
    amd = Asset(user_id=1, symbol='AMD', count=3)
    gme = Asset(user_id=1, symbol='GME', count=420)

    db.session.add(aapl)
    db.session.add(tsla)
    db.session.add(fb)
    db.session.add(nvda)
    db.session.add(nflx)
    db.session.add(amd)
    db.session.add(gme)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_assets():
    db.session.execute('TRUNCATE assets RESTART IDENTITY CASCADE;')
    db.session.commit()
