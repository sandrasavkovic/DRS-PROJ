from flask import Blueprint, request, jsonify
from app_init import socketio 
from services.authService import login_user, register_user

# Pomocu Blueprint se samo grupisu rute - treba nam jer rute ne pisemo u server.py fajlu
auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    result = login_user(email, password)

    if result: 
        user_dto, access_token = result
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "name": user_dto.name,
                "is_admin": user_dto.is_admin
            },
            "access_token": access_token
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401


@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
 
    success, message = register_user(data.get("username"), data.get("password"), data.get("name"), data.get("last_name"), data.get("address"),
                                    data.get("city"), data.get("country"), data.get("phone_number"), data.get("email"))
    if success:
        return jsonify({"success": True, "message": "Registration successful"})
    else:
        return jsonify({"success": False, "message": message}), 400
