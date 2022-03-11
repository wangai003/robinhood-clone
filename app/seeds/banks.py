from app.models import db, Bank

banks = ['Chase', 'Wells Fargo', 'Bank of America', 'Capital One', 'Navy Federal Credit Union', 'USAA', 'U.S. Bank',
         'Citibank', 'Chime', 'Citizens Bank', 'TD Bank', 'Ally Bank', 'Fidelity', 'Huntington Bank', 'Charles Swab']


def seed_banks():
    chase = Bank(
        name="Chase", url="https://www.chase.com")
    bank_of_america = Bank(
        name="Bank of America", url="https://www.bankofamerica.com/")
    wells_fargo = Bank(
        name="Wells Fargo", url="https://www.wellsfargo.com")
    capital_one = Bank(
        name="Capital One", url="https://www.capitalone.com")
    navy_federal_credit_union = Bank(
        name="Navy Federal Credit Union", url="https://www.navyfederal.org/")
    usaa = Bank(
        name="USAA", url="https://www.usaa.com/")
    us_bank = Bank(
        name="U.S. Bank", url="https://www.usbank.com")
    citibank = Bank(
        name="Citibank", url="https://www.citi.com/")
    chime = Bank(
        name="Chime", url="https://www.chime.com/")
    citizens_bank = Bank(
        name="Citizens Bank", url="https://www.citizensbank.com/")
    td_bank = Bank(
        name="TD Bank", url="https://www.td.com/")
    ally_bank = Bank(
        name="Ally Bank", url="https://www.ally.com/")
    fidelity = Bank(
        name="Fidelity", url="https://www.fidelity.com/")
    huntington_bank = Bank(
        name="Huntington Bank", url="https://www.huntington.com/")
    charles_swab = Bank(
        name="Charles Swab", url="https://www.schwab.com/")

    db.session.add(chase)
    db.session.add(bank_of_america)
    db.session.add(wells_fargo)
    db.session.add(capital_one)
    db.session.add(navy_federal_credit_union)
    db.session.add(usaa)
    db.session.add(us_bank)
    db.session.add(citibank)
    db.session.add(chime)
    db.session.add(citizens_bank)
    db.session.add(td_bank)
    db.session.add(ally_bank)
    db.session.add(fidelity)
    db.session.add(huntington_bank)
    db.session.add(charles_swab)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the banks table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_banks():
    db.session.execute('TRUNCATE banks RESTART IDENTITY CASCADE;')
    db.session.commit()
