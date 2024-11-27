from flask import Flask, request, jsonify
from db import get_db_connection

app = Flask(__name__)

# Prijava korisnika
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

# Registracija korisnika
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Ovdje ne unosimo id jer je auto_increment
        cursor.execute("INSERT INTO users (name, username, password) VALUES (%s, %s, %s)", (name, username, password))
        connection.commit()  # Potvrda unosa u bazu
        return jsonify({"success": True, "message": "Registration successful"})
    except Exception as e:
        connection.rollback()  # Otkazivanje transakcije u slučaju greške
        return jsonify({"success": False, "message": "Registration failed", "error": str(e)}), 400
    finally:
        cursor.close()  # Zatvaranje kursora
        connection.close()  # Zatvaranje veze s bazom

if __name__ == "__main__":
    app.run(debug=True)
