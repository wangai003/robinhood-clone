from app.models import db, User

demo_info = {
    'first_name': 'Demo',
    'last_name': 'User',
    'email': 'demo@aa.io',
    'password': 'password',
    'buying_power': 100000
}

demo_user = User(**demo_info)


# Adds a demo user, you can add other users here if you want
def seed_users():
    db.session.add(demo_user)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
