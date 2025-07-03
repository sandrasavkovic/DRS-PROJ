from flask import Blueprint, request, jsonify
from app_init import socketio 
from services.authService import login_user, register_user, get_user_by_username_service, update_user_service
from routes.approving_routes import emit_pending_requests
# Pomocu Blueprint se samo grupisu rute - treba nam jer rute ne pisemo u server.py fajlu
auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        print("Primljeni podaci:", email, password)

        result = login_user(email, password)

        if result: 
            user_dto, access_token = result
            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "name": user_dto.name,
                    "is_admin": user_dto.is_admin,
                    "username" : user_dto.username,
                },
                "access_token": access_token
            })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401
    except Exception as e:
        print("Greška na serveru:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500


@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    success, message = register_user(data.get("username"), data.get("password"), data.get("name"), data.get("last_name"), data.get("address"),
                                    data.get("city"), data.get("country"), data.get("phone_number"), data.get("email"))
    if success:
        emit_pending_requests()
        return jsonify({"success": True, "message": "Registration successful"})
    else:
        return jsonify({"success": False, "message": message}), 400

@auth_routes.route("/get_user_by_username", methods=['GET'])
def get_user_by_username():
    username = request.args.get('username')  
    
    # If no username is provided, return an error
    if not username:
        return jsonify({"error": "Username is required"}), 400

    # Call the service function to get user data
    user_data, status_code = get_user_by_username_service(username)
    
    return jsonify(user_data), status_code

@auth_routes.route("/users/<string:username>", methods=["POST"])
def update_user(username):
    try:
        print("EDIT ::: %s" , username)
        updated_user_data = request.json
        print("PODACI : ", updated_user_data)
        if not updated_user_data:
            return jsonify({"success": False, "message": "No data provided for update"}), 400

        response, status_code = update_user_service(username, updated_user_data)
        return jsonify(response), status_code

    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500