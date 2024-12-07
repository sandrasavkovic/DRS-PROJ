from flask import jsonify
from db import get_db_connection
from flask_jwt_extended import create_access_token
from models.User import User, UserDTO
from utils.email_utils import send_email

# pravi upit u bazu i vidi koji korisnici koji nisu adminu imaju isApproved = False
# admin ga odobrava samo prvi put 
# ?? ako je rejected onda ga izbaci iz baze
cashe_for_admin = set()

def login_user(email, password):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s AND is_approved = %s", 
                       (email, password, 'APPROVED'))
        user_data = cursor.fetchone()
        print("Rezultat upita:", user_data)
        if user_data: # Paziti - citamo iz baze na user_data[0] je ID
            user = User(user_data[1], user_data[2], user_data[3], user_data[4], user_data[5], 
                    user_data[6], user_data[7], user_data[8], user_data[9], user_data[10], user_data[12])
            # Kad pravite .py fajlove za models folder pratite redoslijed polja u bazi
            user_dto = UserDTO(user.name, user.is_admin)
            print("da li je admin : ? %s", user.is_admin)
            print("prva prijava? :%s", user.first_login)
            if user.is_admin == 0 and user_data[12] == 1:
                subject = "Korisnik se prijavio!"
                body = (
                    f"Korisnik: '{user.name} {user.last_name}' je uspesno prijavljen!.\n\n"
                       )
                print("TU SAM!")
                send_email(subject, "projekat.drs6@gmail.com", body)
                try:
                    cursor.execute(
                     "UPDATE users SET first_login = %s WHERE id = %s",
                     (0, user_data[0])
                                  )
                    connection.commit()
                except Exception as e:
                    print(f"GRESKA!!: {str(e)}")
                
            access_token = create_access_token(identity={"email": email, "is_admin": user.is_admin}) #Token se kreira ako je uspjesan login
            # ne zanima ga da dobije obavestenje ako korisnik nije logovan
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