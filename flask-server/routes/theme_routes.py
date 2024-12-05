from flask import Flask, jsonify, request,Blueprint
from services.userService import get_all_themes, add_new_theme, get_theme_by_id

theme_routes = Blueprint("theme_routes", __name__)

# Endpoint za preuzimanje svih tema
@theme_routes.route('/api/themes', methods=['GET'])
def themes():
    try:
        themes = get_all_themes()  # Dobijanje svih tema iz baze
        return jsonify(themes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint za dodavanje nove teme
@theme_routes.route('/api/themes', methods=['POST'])
def create_theme():
    try:
        data = request.get_json()
        theme_name = data['theme_name']
        add_new_theme(theme_name)
        return jsonify({'message': 'Tema je uspešno dodata!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint za dobijanje jedne teme po ID-u
@theme_routes.route('/api/themes/<int:theme_id>', methods=['GET'])
def theme_by_id(theme_id):
    try:
        theme = get_theme_by_id(theme_id)
        if theme:
            return jsonify(theme), 200
        else:
            return jsonify({'error': 'Tema nije pronađena'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#if __name__ == '__main__':
 #   app.run(debug=True, port=5000)  # Pokrećemo server na portu 5000
