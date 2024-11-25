from flask import Flask, jsonify
from db import get_db_connection  # Uvoz funkcije za povezivanje s bazom

app = Flask(__name__)

# Members API Route
@app.route("/members")
def members():
    connection = get_db_connection()  # Povezivanje s bazom
    cursor = connection.cursor()

    # SQL upit za dohvatanje članova iz baze
    cursor.execute("SELECT username FROM users")
    rows = cursor.fetchall()  # Dohvata sve rezultate

    # Zatvaranje veze
    cursor.close()
    connection.close()

    # Formatiranje podataka za slanje klijentu
    members_list = [row[0] for row in rows]  # Izvlači samo prvu kolonu (username)
    return jsonify({"members": members_list})

if __name__ == "__main__":
    app.run(debug=True)
