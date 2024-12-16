from flask import Flask, jsonify, request, Blueprint
from services.discussionService import get_discussions_by_theme, add_new_discussion, search_discussions_by_theme,update_discussion_service, get_discussions_for_user_service, get_discussion_by_id_service, delete_discussion_by_id_service, get_all_discussions

discussion_routes = Blueprint("discussion_routes", __name__)

@discussion_routes.route('/getAllDiscussions', methods=['GET'])
def getAllDiscussions():
    try:
        discussions = get_all_discussions()
        return jsonify(discussions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
# @discussion_routes.route('/discussion/<int:discussion_id>', methods=['GET'])
# def discussion_by_id(discussion_id):
#     try:
#         discussion = get_discussion_by_id(discussion_id)
#         if discussion:
#             return jsonify(discussion), 200
#         else:
#             return jsonify({'error': 'Diskusija nije pronađena'}), 404
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# Endpoint za pretragu diskusija po temi 
@discussion_routes.route('/discussion/search/<int:theme_id>', methods=['GET'])
def search_discussions(theme_id):
    try:
        discussions = search_discussions_by_theme(theme_id)
        return jsonify(discussions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@discussion_routes.route("/editDiscussion", methods=["POST"])
def update_discussion():
    try:
        # Extract query parameter
        print("EDITUJEM DISKUSIJU")
        
        discussion_id = request.args.get('id')
        if not discussion_id:
            return jsonify({"success": False, "message": "Discussion ID is missing"}), 400

        # Extract JSON body
        updated_discussion_data = request.json  # or request.get_json()
        if not updated_discussion_data:
            return jsonify({"success": False, "message": "No data provided for update"}), 400

        print(f"EDITING DISCUSSION: {discussion_id}")
        print(f"UPDATED DATA: {updated_discussion_data}")

        # Call the service with extracted data
        response, status_code = update_discussion_service(discussion_id, updated_discussion_data)
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error updating discussion: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@discussion_routes.route("/get_discussions_for", methods=['GET'])
def get_discussions_for_user():
    try:
        print("TRAZIM DISKUSIJE KORISNIKA!")
        # Get the username from the query parameters
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400

        # Call the service function
        response, status_code = get_discussions_for_user_service(username)
        print(response)
        # Return the response and the appropriate status code
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error in get_discussions_for_user: {e}")
        return jsonify({"error": "An error occurred while fetching discussions"}), 500

@discussion_routes.route("/get_discussion_by_id", methods=['GET'])
def get_discussion_for_id():
    try:
        print("TRAZIM DISKUSIJE KORISNIKA!")
        # Get the username from the query parameters
        discussionId = request.args.get('discussionId')
        if not discussionId:
            return jsonify({"error": "discussionId is required"}), 400

        # Call the service function
        response, status_code = get_discussion_by_id_service(discussionId)
        print(response)
        # Return the response and the appropriate status code
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error in get_discussions_for_user: {e}")
        return jsonify({"error": "An error occurred while fetching discussions"}), 500
    
@discussion_routes.route("/deleteDiscussion",methods =['POST'])
def delete_discussion_by_id():
    try:
        print("TRAZIM DISKUSIJE KORISNIKA!")
        # Get the username from the query parameters
        # Call the service function
        discussionId = request.json
        response, status_code = delete_discussion_by_id_service(discussionId)
        print(response)
        # Return the response and the appropriate status code
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error in get_discussions_for_user: {e}")
        return jsonify({"error": "An error occurred while fetching discussions"}), 500
    