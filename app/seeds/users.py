from app.models import db, User

demo_user = {
    'first_name': 'Demo',
    'last_name': 'Lition',
    'email': 'demo@aa.io',
    'password': 'password'
}


# Adds a demo user, you can add other users here if you want
# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(**demo_user)

    db.session.add(demo)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
