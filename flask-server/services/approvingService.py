from app_init import socketio 
from db import get_db_connection
from flask_mail import Message, Mail
from utils.email_utils import send_email
import logging

def get_pending_requests():
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE is_approved = 'PENDING'")
        pending_requests = cursor.fetchall()
        print(f"Pending requests fetched: {pending_requests}") 
        return pending_requests
    finally:
        cursor.close()
        connection.close()

def approve_request(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE id = %s AND is_approved = 'PENDING'", (user_id,))
        user = cursor.fetchone()
        if user is None:
            return False
        cursor.execute(
            "UPDATE users SET is_approved = 'APPROVED' WHERE id = %s AND is_approved = 'PENDING'",
            (user_id,)
        )
        connection.commit()
        print(cursor.rowcount)
        if cursor.rowcount > 0:
            subject = "Uspesno ste prijavljeni na aplikaciju za diskusije!"
            body = f"Poštovani {user[3]} {user[4]},\n\nVaša prijava je uspešno prihvaćena!\n\nPozdrav,\nAdministrator"
            send_email(subject, user[9], body)  
            return True
        return False
    except Exception as e:
        print(f"Error occurred: {str(e)}") 
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()

def reject_request(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM users WHERE id = %s AND is_approved = 'PENDING'", (user_id,))
        user = cursor.fetchone()
        if user is None:
            return False
        cursor.execute(
            "UPDATE users SET is_approved = 'DECLINED' WHERE id = %s AND is_approved = 'PENDING'",
            (user_id,),
        )
        connection.commit()

        if cursor.rowcount > 0:
             #socketio.emit('pending_requests_updated', {'pending_users': get_pending_requests()})
             return True
        
        return False
    except Exception as e:
        print(f"Error occurred: {str(e)}") 
        connection.rollback()
        return False
    finally:
        cursor.close()
        connection.close()
