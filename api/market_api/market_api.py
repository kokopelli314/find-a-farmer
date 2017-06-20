import os
import csv
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'markets.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
))
app.config.from_envvar('MARKETS_API_SETTINGS', silent=True)



def connect_db():
    """Opens a new database connection."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def init_db():
    """Initialize database from CSV data file."""
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())

    data_source = os.path.join(app.root_path, 'market_data.csv')
    with open (data_source, 'r') as f:
        reader = csv.reader(f)
        cursor = db.cursor()
        columns = next(reader)
        # Add each column (except FMID, which is already assigned as primary key)
        for column in columns:
            if column != 'FMID':
                add_query = 'alter table Markets add column %s varchar(255)' % column
                cursor.execute(add_query)

        # Insert data
        query = 'insert into Markets({0}) values ({1})'
        query = query.format(','.join(columns), ','.join('?' * len(columns)))
        for data in reader:
            cursor.execute(query, data)
    # Save to database
    db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')


def get_db():
    """Opens a new database connection if there currently isn't one for the application context."""
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    """Closes the database at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()
