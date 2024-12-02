from app_init import socketio 
from db import get_db_connection


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
        cursor.execute(
            "UPDATE users SET is_approved = 'APPROVED' WHERE id = %s AND is_approved = 'PENDING'",
            (user_id,)
        )
        connection.commit()

        if cursor.rowcount > 0:
            socketio.emit('request_approved', {'user_id': user_id}, broadcast=True)
            return True
        return False
    finally:
        cursor.close()
        connection.close()


def reject_request(user_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(
            "UPDATE users SET is_approved = 'DECLINED' WHERE id = %s AND is_approved = 'PENDING'",
            (user_id,),
        )
        connection.commit()

        if cursor.rowcount > 0:
             socketio.emit('request_rejected', {'user_id': user_id}, broadcast=True)
             return True
        return False
    finally:
        cursor.close()
        connection.close()
