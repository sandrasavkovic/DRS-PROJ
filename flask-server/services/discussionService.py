from app_init import socketio 
from db import get_db_connection

# Funkcija za preuzimanje svih diskusija za specifičnu temu
def get_discussions_by_theme(theme_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM discussions WHERE theme_id = %s ORDER BY id ASC', (theme_id,))
    discussions = cursor.fetchall()  # Vraća sve diskusije za zadatu temu
    cursor.close()
    connection.close()
    return discussions

# Funkcija za dodavanje nove diskusije
def add_new_discussion(id, title, content, user_id, theme_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('INSERT INTO discussions ( id, title, content, user_id, theme_id) VALUES (%d ,%s, %s, %d, %d)', 
                   (id, title, content, user_id, theme_id))
    connection.commit()
    cursor.close()
    connection.close()

# Funkcija za dobijanje diskusije prema ID-u
def get_discussion_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM discussions WHERE id = %d', (id))
    discussion = cursor.fetchone()  # Vraća samo jednu diskusiju
    cursor.close()
    connection.close()
    return discussion

# Funkcija za pretragu diskusija po temi (ako je potrebno)
def search_discussions_by_theme(theme_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        'SELECT * FROM discussions WHERE theme_id = %d ',
        (theme_id,)
    )
    discussions = cursor.fetchall()  # Vraća diskusije koje odgovaraju pretrazi
    cursor.close()
    connection.close()
    return discussions


def update_discussion_service(id, updated_discussion_data):
    print("Update discussion with ID:", id)
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Ažuriramo samo title i content za zadati ID
        cursor.execute("""
            UPDATE discussions
            SET title = %s, 
                content = %s
            WHERE id = %d
        """, (updated_discussion_data["title"], updated_discussion_data["content"], id))

        connection.commit()

        # Proveravamo da li je ažuriran neki red
        if cursor.rowcount == 0:
            return {"success": False, "message": "Discussion not found"}, 404

        return {"success": True, "message": "Discussion updated successfully"}, 200
    except Exception as e:
        connection.rollback()
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        connection.close()
