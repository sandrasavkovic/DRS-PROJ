from flask import Blueprint, request, jsonify
from services.authService import login_user, register_user

# Pomocu Blueprint se samo grupisu rute - treba nam jer rute ne pisemo u server.py fajlu
auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user_dto = login_user(username, password)
    if user_dto:
        return jsonify({"success": True, "message": "Login successful", "user": user_dto.name})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    success, message = register_user(name, username, password)
    if success:
        return jsonify({"success": True, "message": "Registration successful"})
    else:
        return jsonify({"success": False, "message": message}), 400
