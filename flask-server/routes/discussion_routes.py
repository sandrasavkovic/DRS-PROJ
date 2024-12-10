from flask import Flask, jsonify, request, Blueprint
from services.discussionService import get_discussions_by_theme, add_new_discussion, get_discussion_by_id, search_discussions_by_theme,update_discussion_service

discussion_routes = Blueprint("discussion_routes", __name__)

# Endpoint za preuzimanje svih diskusija za određenu temu
@discussion_routes.route('/discussion/<int:theme_id>', methods=['GET'])
def discussions_by_theme(theme_id):
    try:
        discussions = get_discussions_by_theme(theme_id)  # Preuzimanje svih diskusija za temu sa ID-jem `theme_id`
        return jsonify(discussions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint za dodavanje nove diskusije
@discussion_routes.route('/discussion', methods=['POST'])
def create_discussion():
    try:
        data = request.get_json()
        title = data['title']
        content = data['content']
        user_id = data['user_id']
        theme_id = data['theme_id']
        add_new_discussion(title, content, user_id, theme_id)
        return jsonify({'message': 'Diskusija je uspešno dodata!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint za dobijanje jedne diskusije po ID-u
@discussion_routes.route('/discussion/<int:discussion_id>', methods=['GET'])
def discussion_by_id(discussion_id):
    try:
        discussion = get_discussion_by_id(discussion_id)
        if discussion:
            return jsonify(discussion), 200
        else:
            return jsonify({'error': 'Diskusija nije pronađena'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint za pretragu diskusija po temi 
@discussion_routes.route('/discussion/search/<int:theme_id>', methods=['GET'])
def search_discussions(theme_id):
    try:
        discussions = search_discussions_by_theme(theme_id)
        return jsonify(discussions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@discussion_routes.route("/discussion/<int:id>", methods=["POST"])
def update_discussion(id):
    try:
        print("EDIT ::: %d" , id)
        updated_discussion_data = request.json
        print("PODACI : ", updated_discussion_data)
        if not updated_discussion_data:
            return jsonify({"success": False, "message": "No data provided for update"}), 400

        response, status_code = update_discussion_service(id, updated_discussion_data)
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500