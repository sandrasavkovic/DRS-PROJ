from flask import jsonify
from db import get_db_connection
from models.User import User, UserDTO

# pravi upit u bazu i vidi koji korisnici koji nisu adminu imaju isApproved = False
# admin ga odobrava samo prvi put 
# ?? ako je rejected onda ga izbaci iz baze

def login_user(email, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user_data = cursor.fetchone()
    cursor.close()
    connection.close()

    if user_data: # Paziti - citamo iz baze na user_data[0] je ID
        user = User(user_data[1], user_data[2], user_data[3], user_data[4], user_data[5], 
                    user_data[6], user_data[7], user_data[8], user_data[9], user_data[10])
        # Kad pravite .py fajlove za models folder pratite redoslijed polja u bazi

        user_dto = UserDTO(user.name, user.is_admin)
        return user_dto
    return None
   
def register_user(username, password, name, last_name, address, city, country, phone_number, email):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("""
            INSERT INTO users 
            (username, password, name, last_name, address, city, country, phone_number, email, is_admin) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (username, password, name, last_name, address, city, country, phone_number, email, 0))
        connection.commit()
        return True, "User registered successfully!"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()

# funkicja za odobravanje
def user_approving(email, is_approved):
    # pristup bazi i promena is_approved
    return True

# funkcija za dobavljanje user-a na osnovu mejl adrese
def get_user_by_email(email):
   
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  # `dictionary=True` za vraćanje rezultata kao rečnik
    try:
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()  # Dohvata prvi rezultat (korisnika)
    except Exception as e:
        connection.rollback()
        user = None
        return False, str(e)
    finally:
        cursor.close()
        connection.close()
    return user