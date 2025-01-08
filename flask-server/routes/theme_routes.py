from flask import Flask, jsonify, request,Blueprint
from services.themeService import get_all_themes, add_new_theme, modify_existing_theme, delete_existing_theme
theme_routes = Blueprint("theme_routes", __name__)

@theme_routes.route('/theme', methods=['GET'])
def themes():
    try:
        themes = get_all_themes() 
        return jsonify(themes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@theme_routes.route('/add_theme', methods=['POST'])
def create_theme():
    try:
        data = request.get_json()
        theme_name = data['theme_name']
        description = data['description']
        
        new_theme = add_new_theme(theme_name, description)
        
        if 'error' in new_theme:
            return jsonify(new_theme), 400  # Ako postoji greška - vraćamo status 400
        
        return jsonify(new_theme), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@theme_routes.route('/modify_theme/<int:theme_id>', methods=['PUT'])
def modify_theme(theme_id):
    try:
        data = request.get_json()
        theme_name = data.get('theme_name')
        description = data.get('description')

        if not theme_name or not description:
            return jsonify({'error': 'Theme name and description are required'}), 400
    
        retVal = modify_existing_theme(theme_id, theme_name, description)
        
        if 'error' in retVal:
            return jsonify(retVal), 400  # Ako postoji greška - vraćamo status 400
        
        return jsonify({'message': 'Tema je uspešno modifikovana!'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500  
    
@theme_routes.route('/delete_theme/<int:theme_id>', methods=['DELETE'])
def delete_theme(theme_id):
    try:
        delete_existing_theme(theme_id)
        return jsonify({'message': 'Tema je uspešno obrisana!'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 


# Endpoint za dobijanje jedne teme po ID-u myb ne treba
@theme_routes.route('/theme/<int:theme_id>', methods=['GET'])
def theme_by_id(theme_id):
    try:
        theme = ""
        #theme = get_theme_by_id(theme_id)
        if theme:
            return jsonify(theme), 200
        else:
            return jsonify({'error': 'Tema nije pronađena'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#if __name__ == '__main__':
 #   app.run(debug=True, port=5000)  # Pokrećemo server na portu 5000

