from flask import Flask, abort, jsonify, make_response

app = Flask(__name__)
ROOT_URL = '/yourmarket/api'

markets = [
    {
        'zip': 80526,
        'name': u'thing'
    },
    {
        'zip': 80526,
        'name': u'other'
    }
]

@app.route(ROOT_URL + '/zip/<int:zip_code>', methods=['GET'])
def get_local_markets(zip_code):
    results = [market for market in markets if market['zip'] == zip_code]
    if len(results) == 0:
        abort(404)
    return jsonify({'markets': results})

@app.route(ROOT_URL + '/id/<int:market_id>', methods=['GET'])
def get_market_detail(market_id):
    return jsonify

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)
