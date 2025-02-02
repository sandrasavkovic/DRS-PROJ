from flask import Flask, jsonify, request, Blueprint
from services.discussionService import (
    get_all_discussions,
    add_discussion_service, 
    delete_discussion_by_id_service,
    editDiscussion,
    get_discussion_reactions,  
    process_reaction,
    get_discussion_comments, 
    post_new_comment, 
    delete_comment_service,

    get_discussions_for_user_service, get_discussion_by_id_service, get_user_id_from_username
)
# dodano za tokene
from flask_jwt_extended import jwt_required

discussion_routes = Blueprint("discussion_routes", __name__)

#KORISTI SE!!!
@discussion_routes.route('/getAllDiscussions', methods=['GET'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def getAllDiscussions():
    try:
        discussions = get_all_discussions()
        return jsonify(discussions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#KORISTI SE!!!    
@discussion_routes.route('/addDiscussion', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def add_discussion():
    try:
        print("Usao u funkciju za dodavanje diskusije")
        # kroz data.themeId ..
        data = request.get_json()
        print(data)
        if not data:
            return jsonify({"success": False, "message": "No data provided for update"}), 400

        userId = data.get('userId')
        themeId = data.get('themeId')
        discussion_text = data.get('discussionText')
     
        newDiscussion = add_discussion_service(userId, themeId, discussion_text)
        print(newDiscussion)
        return jsonify(newDiscussion), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

#KORISTI SE!!!
@discussion_routes.route("/deleteDiscussion",methods =['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def delete_discussion_by_id():
    try:
        discussionId = request.json
        response, status_code = delete_discussion_by_id_service(discussionId)
        print(response)
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error in get_discussions_for_user: {e}")
        return jsonify({"error": "An error occurred while fetching discussions"}), 500

#KORISTI SE!!!
#Najnovija ruta za edit diskusije
@discussion_routes.route('/edit/<int:discussion_id>', methods=['PUT'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def edit_discussion(discussion_id):
    try:
        print("RUTA PRONADJENA")
        data = request.get_json()
        theme_id = data.get('theme_id')
        content = data.get('content')
        updatedDiscussion = editDiscussion(discussion_id, theme_id, content)
        return jsonify(updatedDiscussion), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500  

#KORISTI SE!!!
@discussion_routes.route('/fetchReactions', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def fetch_reactions():
    try:
        data = request.get_json()
        discussion_id = data.get('discussionId')
        user_id = data.get('userId')
    
        reactions = get_discussion_reactions(discussion_id, user_id)
        return jsonify(reactions), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# KORISTI SE!!!
@discussion_routes.route('/react', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def react_to_discussion():
    try:
        data = request.get_json()
        discussion_id = data.get('discussionId')
        user_id = data.get('userId')
        reaction_type = data.get('reactionType')

        if not all([discussion_id, user_id, reaction_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        response = process_reaction(discussion_id, user_id, reaction_type)
        return jsonify(response), 200
   
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#KORISTI SE!!!
# za komentare
@discussion_routes.route('/fetchComments', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def fetch_comments():
    try:
        data = request.get_json()
        discussion_id = data.get('discussionId')
        reactions = get_discussion_comments(discussion_id)
        return jsonify(reactions), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#KORISTI SE!!!
@discussion_routes.route('/postComment', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def post_comment():
    try:
        data = request.get_json()
        discussion_id = data.get('discussionId')
        new_comment = data.get('newComment')
        user_id = data.get('userId')
        mentions = data.get('mentions')  

        response = post_new_comment(discussion_id, new_comment, user_id, mentions)
        return jsonify(response), 200
   
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#KORISTI SE!!!
@discussion_routes.route('/deleteComment', methods=['POST'])
@jwt_required() # Ovo se dodaje kod svih ruta servera => tokeni!
def delete_comment():
    try:
        print("U RUTI ZA DELETE!")
        data = request.get_json()
        comment_id = data.get('commentId')
        response = delete_comment_service(comment_id)
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    





@discussion_routes.route('/getUserId/<username>', methods=['GET'])
def get_user_id_by_username(username):
    try:
        user_id = get_user_id_from_username(username) 
        if user_id is not None:
        #    print("@@@@@@@@@@@@@@@@@@@@@@@")
         #   print(user_id)
            return jsonify({'userId': user_id}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    

    



