from flask import jsonify
from db import get_db_connection
from flask_jwt_extended import create_access_token
from models.User import User, UserDTO
from app_init import send_email


def login_user(email, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s AND is_approved = %s", 
                       (email, password, 'APPROVED'))
        user_data = cursor.fetchone()
        print("Rezultat upita:", user_data)
        if user_data: 
            print("****************")
            user = User(user_data[1], user_data[2], user_data[3], user_data[4], user_data[5], 
                    user_data[6], user_data[7], user_data[8], user_data[9], user_data[10], user_data[12])
            user_dto = UserDTO(user.name, user.is_admin, user.username)
            print("da li je admin : ? %s", user.is_admin)
            print("prva prijava? :%s", user.first_login)
            if user.is_admin == 0 and user_data[12] == 1:
                subject = "Korisnik se prijavio!"
                body = (
                    f"Korisnik: '{user.name} {user.last_name}' je uspesno prijavljen!.\n\n"
                       )
                send_email(subject, "projekat.drs6@gmail.com", body)
                try:
                    cursor.execute(
                     "UPDATE users SET first_login = %s WHERE id = %s",
                     (0, user_data[0])
                                  )
                    connection.commit()
                except Exception as e:
                    print(f"GRESKA!!: {str(e)}")
                
            access_token = create_access_token(identity={"email": email, "is_admin": user.is_admin}) 
            return user_dto, access_token
        return None
    except Exception as e:
        connection.rollback()
        return None
    finally:
        cursor.close()
        connection.close()

   
def register_user(username, password, name, last_name, address, city, country, phone_number, email):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        print("***********************")
        print(username, name, last_name, address, city, country, phone_number, email)
        cursor.execute("""
            INSERT INTO users 
            (username, password, name, last_name, address, city, country, phone_number, email, is_admin, is_approved, first_login) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (username, password, name, last_name, address, city, country, phone_number, email, 0, 'PENDING', 1))
        connection.commit()
        
        return True, "User registered successfully!"
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()

def user_approving(email, is_approved):
    # pristup bazi i promena is_approved
    return True



def get_user_by_username_service(username):
    if not username:
        return {"error": "Username is required"}, 400  
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  
    
    try:
        query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()  
        
        if user:
            return {"user": user}, 200  
        else:
            return {"error": "User not found"}, 404 
    
    except Exception as e:
        connection.rollback()
        return {"error": str(e)}, 500
    
    finally:
        cursor.close()
        connection.close()


def update_user_service(username, updated_user_data):
    print("TUUUSAMMM")
    connection = get_db_connection()
    cursor = connection.cursor()
    try:

        cursor.execute("""
            UPDATE users 
            SET username = %s, 
            password = %s, 
            name = %s, 
            last_name = %s, 
            address = %s, 
            city = %s, 
            country = %s, 
            phone_number = %s, 
            email = %s, 
            is_admin = %s, 
            is_approved = %s, 
            first_login = %s 
            WHERE username = %s
        """, (updated_user_data["username"], updated_user_data["password"], updated_user_data["name"], 
            updated_user_data["last_name"], updated_user_data["address"], updated_user_data["city"], 
            updated_user_data["country"], updated_user_data["phone_number"], updated_user_data["email"], 
            updated_user_data["is_admin"], updated_user_data["is_approved"], updated_user_data["first_login"], username))

        connection.commit()
        
        if cursor.rowcount == 0:
            return {"success": False, "message": "User not found"}, 404

        return {"success": True, "message": "User updated successfully"}, 200
    except Exception as e:
        connection.rollback()
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        connection.close()