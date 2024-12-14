from app_init import socketio 
from db import get_db_connection
from flask import jsonify

# Funkcija za preuzimanje svih tema
def get_all_themes():
    try:
        print("TEME GET")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM themes ORDER BY id ASC') 
        themes = cursor.fetchall()  
        print(themes)
        return themes
    except Exception as e:
        print(f"Error fetching themes: {e}")
        return [] 
    finally:
        cursor.close()
        connection.close()
from datetime import datetime

def add_new_theme(theme_name, description):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    try:
        cursor.execute('INSERT INTO themes (theme_name, description, date_time) VALUES (%s, %s, %s)', 
                       (theme_name, description, current_time))
        connection.commit()
    except Exception as e:
        connection.rollback()
        print(f"Error while adding theme: {e}")
    finally:
        cursor.close()
        connection.close()


def modify_existing_theme(theme_id, theme_name, description):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute('UPDATE themes SET theme_name = %s, description = %s WHERE id = %s', 
                       (theme_name, description, theme_id))
        connection.commit()
        
    except Exception as e:
        connection.rollback()  
        raise Exception(f"Failed to modify theme with id {theme_id}: {str(e)}")  
    
    finally:
        cursor.close()
        connection.close()

def delete_existing_theme(theme_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute('DELETE FROM themes WHERE id = %s', (theme_id,))
        connection.commit()  
        
    except Exception as e:
        connection.rollback()  
        raise Exception(f"Failed to delete theme with id {theme_id}: {str(e)}")  
    
    finally:
        cursor.close()
        connection.close()


def get_current_user_id(username):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # SQL query to get the user ID based on the username
    sql = "SELECT id FROM users WHERE username = %s"
    cursor.execute(sql, (username,))
    user = cursor.fetchone()
    
    cursor.close()
    connection.close()

    # Return the user ID if found, otherwise None
    if user:
        return user['id']
    else:
        return None

def get_id_from_theme_name(theme_name):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql = "SELECT id FROM themes WHERE theme_name = %s"
    cursor.execute(sql, (theme_name,))
    theme = cursor.fetchone()
    cursor.close()
    connection.close()

    # Return the user ID if found, otherwise None
    if theme:
        return theme['id']
    else:
        return None

def add_discussion_service(username, theme, discussionText):
    print("USAO U SERVIS!")
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    # Assuming you have a way to get user_id from session or another method
    user_id = get_current_user_id(username)  # This needs to be defined based on your app's logic

    # Assuming the 'theme' object has the 'id' and 'theme_name' properties
    theme_name = theme['theme_name']
    theme_id = get_id_from_theme_name(theme_name)

    # SQL query to insert the new discussion
    sql = """
        INSERT INTO discussions (title, content, user_id, theme_id, datetime)
        VALUES (%s, %s, %s, %s, NOW())
    """

    # Execute the query
    try:
        print(theme['theme_name'])
        print(discussionText)
        print(user_id)
        print(theme_id)
        cursor.execute(sql, (theme['theme_name'], discussionText, user_id, theme_id))
        connection.commit()
        if cursor.rowcount>0:
            return {"success": True, "message": "Discussion added!"}, 200
        else:
            return {"success": False, "message": "Failed action!"}, 404

    except Exception as e:
        print(f"Error while inserting discussion: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()