from app.models import db, WatchlistStock


def seed_watchlist_stocks():
    aapl_1 = WatchlistStock(watchlist_id=1, symbol='AAPL')
    tsla_1 = WatchlistStock(watchlist_id=1, symbol='TSLA')
    fb_1 = WatchlistStock(watchlist_id=1, symbol='FB')
    nvda_1 = WatchlistStock(watchlist_id=1, symbol='NVDA')
    nflx_1 = WatchlistStock(watchlist_id=1, symbol='NFLX')
    twlo_1 = WatchlistStock(watchlist_id=1, symbol='TWLO')
    amzn_1 = WatchlistStock(watchlist_id=1, symbol='AMZN')
    googl_1 = WatchlistStock(watchlist_id=1, symbol='GOOGL')

    amd_2 = WatchlistStock(watchlist_id=2, symbol='AMD')
    gme_2 = WatchlistStock(watchlist_id=2, symbol='GME')
    bb_2 = WatchlistStock(watchlist_id=2, symbol='BB')
    mrna_2 = WatchlistStock(watchlist_id=2, symbol='MRNA')
    ko_2 = WatchlistStock(watchlist_id=2, symbol='KO')
    qqq_2 = WatchlistStock(watchlist_id=2, symbol='QQQ')
    googl_2 = WatchlistStock(watchlist_id=2, symbol='GOOGL')

    voo_3 = WatchlistStock(watchlist_id=3, symbol='VOO')
    vym_3 = WatchlistStock(watchlist_id=3, symbol='VYM')
    vti_3 = WatchlistStock(watchlist_id=3, symbol='VTI')
    qqq_3 = WatchlistStock(watchlist_id=3, symbol='QQQ')

    db.session.add(aapl_1)
    db.session.add(tsla_1)
    db.session.add(fb_1)
    db.session.add(nvda_1)
    db.session.add(nflx_1)
    db.session.add(twlo_1)
    db.session.add(amzn_1)
    db.session.add(googl_1)

    db.session.add(amd_2)
    db.session.add(gme_2)
    db.session.add(bb_2)
    db.session.add(mrna_2)
    db.session.add(ko_2)
    db.session.add(qqq_2)
    db.session.add(googl_2)

    db.session.add(voo_3)
    db.session.add(vym_3)
    db.session.add(vti_3)
    db.session.add(qqq_3)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_watchlist_stocks():
    db.session.execute('TRUNCATE watchlist_stocks RESTART IDENTITY CASCADE;')
    db.session.commit()
