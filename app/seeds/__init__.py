from flask.cli import AppGroup
from .users import seed_users, undo_users
from .banks import seed_banks, undo_banks
from .assets import seed_assets, undo_assets
from .bank_accounts import seed_bank_accounts, undo_bank_accounts
from .watchlist import seed_watchlists, undo_watchlists
from .watchlist_stocks import seed_watchlist_stocks, undo_watchlist_stocks

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users()
    seed_banks()
    seed_assets()
    seed_bank_accounts()
    seed_watchlists()
    seed_watchlist_stocks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_banks()
    undo_assets()
    undo_bank_accounts()
    undo_watchlists()
    undo_watchlist_stocks()
    # Add other undo functions here
