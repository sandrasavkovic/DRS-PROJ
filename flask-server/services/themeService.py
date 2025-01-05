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
    
    try:
        cursor.execute('INSERT INTO themes (theme_name, description) VALUES (%s, %s)', 
                       (theme_name, description))
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

def add_discussion_service(userId, themeId, discussionText):
    print("POKUSAJ DODAVANJA: ")
    print(userId)
    print(themeId)
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Ubacivanje nove diskusije u bazu
        cursor.execute("""
            INSERT INTO discussions (content, user_id, theme_id, datetime)
            VALUES (%s, %s, %s, NOW())
        """, (discussionText, userId, themeId))
        connection.commit()

        # Dohvatanje ID-a novokreirane diskusije
        discussion_id = cursor.lastrowid

        # Vraćanje svih podataka o novoj diskusiji
        cursor.execute("""
            SELECT 
                d.id, 
                d.content, 
                d.user_id, 
                d.theme_id, 
                d.datetime AS post_time,
                u.username, 
                u.name, 
                u.last_name AS surname, 
                u.email, 
                t.theme_name
            FROM discussions d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN themes t ON d.theme_id = t.id
            WHERE d.id = %s
        """, (discussion_id,))

        new_discussion = cursor.fetchone()

        if new_discussion:
            new_discussion_dto = {
                'id': new_discussion['id'],
                'content': new_discussion['content'],
                'username': new_discussion['username'],
                'theme_name': new_discussion['theme_name'],
                'theme_id': new_discussion['theme_id'],
                'post_time': new_discussion['post_time'],
                'name': new_discussion['name'],
                'surname': new_discussion['surname'],
                'email': new_discussion['email'],
                'user_id': new_discussion['user_id']
            }
            return new_discussion_dto
        else:
            raise Exception("Failed to retrieve the new discussion.")

    except Exception as e:
        connection.rollback()
        raise Exception(f"Failed to add discussion: {str(e)}")

    finally:
        cursor.close()
        connection.close()
   