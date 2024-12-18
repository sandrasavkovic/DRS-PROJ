from flask import Flask, jsonify, request, Blueprint
from services.discussionService import get_discussions_by_theme, add_new_discussion, search_discussions_by_theme,update_discussion_service, get_discussions_for_user_service, get_discussion_by_id_service, get_discussion_reactions, delete_discussion_by_id_service, get_all_discussions, process_reaction, get_user_id_from_username, get_discussion_comments, post_new_comment, delete_comment_service

discussion_routes = Blueprint("discussion_routes", __name__)

@discussion_routes.route('/fetchReactions', methods=['POST'])
def fetch_reactions():
    data = request.get_json()
    discussion_id = data.get('discussionId')
    user_id = data.get('userId')
   
    reactions = get_discussion_reactions(discussion_id, user_id)
    return jsonify(reactions)


# za komentare
@discussion_routes.route('/fetchComments', methods=['POST'])
def fetch_comments():
    data = request.get_json()
    discussion_id = data.get('discussionId')
    
   
    reactions = get_discussion_comments(discussion_id)
    return jsonify(reactions)


@discussion_routes.route('/postComment', methods=['POST'])
def post_comment():
    data = request.get_json()
    discussion_id = data.get('discussionId')
    newComment = data.get('newComment')
    user_id = data.get('userId')
    response = post_new_comment(discussion_id, newComment, user_id)
    return jsonify(response)

@discussion_routes.route('/deleteComment', methods=['POST'])
def delete_comment():
    print("U RUTI ZA DELETE!")
    data = request.get_json()
    comment_id = data.get('commentId')
    response = delete_comment_service(comment_id)
    return jsonify(response)






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

@discussion_routes.route('/react', methods=['POST'])
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

# @discussion_routes.route('/likeDiscussion/<int:discussionId>', methods=['POST'])
# def likeDiscussion(discussionId):
#     try:
#         poruka = like_discussion(discussionId)
#         return jsonify(poruka), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @discussion_routes.route('/dislikeDiscussion/<int:discussionId>', methods=['POST'])
# def dislikeDiscussion(discussionId):
#     try:
#         poruka = dislike_discussion(discussionId)
#         return jsonify(poruka), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


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
    