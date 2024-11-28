from db import get_db_connection
from models.User import User, UserDTO

def login_user(username, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user_data = cursor.fetchone()
    cursor.close()
    connection.close()

    if user_data:
        user = User(user_data[1], user_data[2], user_data[3]) 
        return UserDTO(user.name) #DTO podatak se vraca klijentu
    return None

def register_user(name, username, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO users (name, username, password) VALUES (%s, %s, %s)", (name, username, password))
        connection.commit()
        return True, "User registered successfully!"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()
