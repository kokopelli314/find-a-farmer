import os
import csv
import sqlite3
import json
import requests
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash
from flask_cors import CORS

ROOT_URL = '/yourmarket/api'

app = Flask(__name__)
CORS(app)   # Allow cross-origin requests
app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'markets.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',
))
app.config.from_envvar('MARKETS_API_SETTINGS', silent=True)



@app.route(ROOT_URL + '/zip/<int:zip_code>', methods=['GET'])
def get_local_markets(zip_code):
    """Return brief summary of markets near a given zip code."""
    url = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + str(zip_code)
    results = requests.get(url).content
    print(results)
    return results

@app.route(ROOT_URL + '/id/<int:market_id>', methods=['GET'])
def get_market_detail(market_id):
    """Get all data available for a single market."""
    db_entry = query_db('select * from Markets where FMID=?', (market_id,), one=True)
    return json.dumps(db_entry)


def query_db(query, args=(), one=False):
    """Wrapper for database queries. Returns dictionary in format [{'col1': 'val'}, {'col2': 'val2'}, ...]."""
    cur = get_db().cursor()
    cur.execute(query, args)
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    return (r[0] if r else None) if one else r


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


def connect_db():
    """Opens a new database connection."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

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


if __name__ == '__main__':
    app.run(debug=True)
