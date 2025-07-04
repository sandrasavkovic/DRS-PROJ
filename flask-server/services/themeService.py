from app_init import socketio 
from db import get_db_connection
from flask import jsonify

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
        cursor.execute('SELECT COUNT(*) FROM themes WHERE theme_name = %s', (theme_name,))
        count = cursor.fetchone()[0]
        
        if count > 0:
            return {"error": "Theme name already exists."}
        
        # Ako tema ne postoji, dodajemo je
        cursor.execute('INSERT INTO themes (theme_name, description) VALUES (%s, %s)', 
                       (theme_name, description))
        connection.commit()

        # Dohvatanje poslednje dodate teme
        theme_id = cursor.lastrowid
        new_theme = {
            "id": theme_id,
            "theme_name": theme_name,
            "description": description
        }
        return new_theme 

    except Exception as e:
        connection.rollback()
        print(f"Error while adding theme: {e}")
        return {"error": "An error occurred while adding the theme."}
    
    finally:
        cursor.close()
        connection.close()


def modify_existing_theme(theme_id, theme_name, description):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        # Provera da li tema sa datim imenom postoji i njeno poređenje sa prosleđenim ID-jem
        cursor.execute('SELECT id FROM themes WHERE theme_name = %s', (theme_name,))
        result = cursor.fetchone()
        
        if result:
            existing_id = result[0]
            if existing_id != theme_id:
                return {"error": "Theme name already exists."}

        cursor.execute('UPDATE themes SET theme_name = %s, description = %s WHERE id = %s', 
                       (theme_name, description, theme_id))
        connection.commit()
        return None
        
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

    sql = "SELECT id FROM users WHERE username = %s"
    cursor.execute(sql, (username,))
    user = cursor.fetchone()
    
    cursor.close()
    connection.close()

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

    if theme:
        return theme['id']
    else:
        return None
