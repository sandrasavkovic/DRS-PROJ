from flask import jsonify
from db import get_db_connection
from models.User import User, UserApprovingDTO
# on vraca one korisnike kojima je is_approved = false
# i postavlja u bazi true ili false za is_approved

# Service funkcija za vraćanje korisnika sa `is_approved = False`
def get_unapproved_users():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # SQL upit za korisnike koji nisu odobreni
        cursor.execute("""
            SELECT name, last_name, email
            FROM users 
            WHERE is_approved = %s
        """, (False,))
        
        # Dohvatanje svih rezultata
        users = cursor.fetchall()
        
        # Formatiranje rezultata u listu rečnika
        result = [
            {
                "name": user[0],
                "last_name": user[1],
                "email": user[2]
            }
            for user in users
        ]
        return True, result
    except Exception as e:
        connection.rollback()
        return False, str(e)
    finally:
        cursor.close()
        connection.close()
