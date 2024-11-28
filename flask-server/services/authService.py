from flask import jsonify
from db import get_db_connection
from models.User import User, UserDTO

def login_user(username, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
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
