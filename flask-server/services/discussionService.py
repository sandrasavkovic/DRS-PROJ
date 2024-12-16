from app_init import socketio 
from db import get_db_connection
from services.themeService import get_current_user_id;
from models.Discussion import DiscussionDTO
from flask import jsonify

from flask import jsonify

from flask import jsonify

def get_all_discussions():
    try:
        print("DISKUSIJE GET")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # SQL upit sa JOIN-om za povezivanje sa korisnicima i temama
        cursor.execute("""
            SELECT d.id, d.title, d.content, d.user_id, d.theme_id, u.username, t.theme_name 
            FROM discussions d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN themes t ON d.theme_id = t.id
            ORDER BY d.id ASC
        """)

        discussions = cursor.fetchall()  # Svi podaci uključujući korisničko ime i ime teme
        print("Fetched discussions:", discussions)

        # Umesto DTO klase, vraćamo listu dictionary objekata
        discussion_dtos = [
            {
                'id': discussion['id'], 
                'title': discussion['title'], 
                'content': discussion['content'],
                'username': discussion['username'], 
                'theme_name': discussion['theme_name']
            }
            for discussion in discussions
        ]
        
        # Vraćamo kao JSON
        return discussion_dtos

    except Exception as e:
        print(f"Error fetching discussions: {e}")
        return []  # Vrati praznu listu u slučaju greške
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

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
# druga funkcija u themeService!
def add_new_discussion(id, title, content, user_id, theme_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('INSERT INTO discussions ( id, title, content, user_id, theme_id) VALUES (%d ,%s, %s, %d, %d)', 
                   (id, title, content, user_id, theme_id))
    connection.commit()
    cursor.close()
    connection.close()

# Funkcija za dobijanje diskusije prema ID-u
# prekopirana dole sa dopunom za try i catch!
# def get_discussion_by_id(id):
#     connection = get_db_connection()
#     cursor = connection.cursor(dictionary=True)
#     cursor.execute('SELECT * FROM discussions WHERE id = %d', (id))
#     discussion = cursor.fetchone()  # Vraća samo jednu diskusiju
#     cursor.close()
#     connection.close()
#     return discussion

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
    try:
        id = int(id)  # Convert to integer explicitly
    except ValueError:
        return {"success": False, "message": "Invalid ID format"}, 400
    connection = get_db_connection()
    cursor = connection.cursor()
    print(updated_discussion_data['title'])
    # pazi!!! i za id ide %s!!!
    try:
        # Ažuriramo samo title i content za zadati ID
        cursor.execute("""
            UPDATE discussions
            SET title = %s, 
                content = %s,
                datetime = NOW()
            WHERE id = %s
        """, (updated_discussion_data['title'], updated_discussion_data['content'], id))

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

def get_discussions_for_user_service(username):
    print("DOBAVLJAM DISKUSIJE ZA :", username)
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  
    user_id = get_current_user_id(username)

    if not user_id:
        return {"success": False, "message": "User not found"}, 404

    try:
        cursor.execute('SELECT * FROM discussions WHERE user_id = %s', (user_id,))
        discussions = cursor.fetchall()

        if not discussions:  
            return {"success": False, "message": "No discussions found for the user"}, 404

        return {"success": True, "discussions": discussions}, 200

    except Exception as e:
        print(f"Error while fetching discussions: {e}")
        return {"success": False, "message": str(e)}, 500

    finally:
        cursor.close()
        connection.close()

def get_discussion_by_id_service(id):
    print("DOBAVLJAM DISKUSIJU SA ID-em:")
    print(id)
    
    # Ensure `id` is an integer
    try:
        id = int(id)  # Convert to integer explicitly
    except ValueError:
        return {"success": False, "message": "Invalid ID format"}, 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # Wrap `id` in a tuple
        cursor.execute('SELECT * FROM discussions WHERE id = %s', (id,))
        discussion = cursor.fetchone()  # Fetch a single discussion
        if not discussion:
            return {"success": False, "message": "No discussions found with the given ID"}, 404

        return {"success": True, "discussion": discussion}, 200
    except Exception as e:
        print(f"Error while fetching discussion: {e}")
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        connection.close()

def delete_discussion_by_id_service(id):
    print("DOBAVLJAM DISKUSIJU ZA BRISANJE SA ID-em:")
    print(id)
    try:
        id = int(id)  # Convert to integer explicitly
    except ValueError:
        return {"success": False, "message": "Invalid ID format"}, 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Check if the discussion exists before deletion
        cursor.execute('SELECT * FROM discussions WHERE id = %s', (id,))
        discussion = cursor.fetchone()  # Fetch the discussion
        if not discussion:
            return {"success": False, "message": "No discussions found with the given ID"}, 404

        # Proceed with deletion
        cursor.execute('DELETE FROM discussions WHERE id = %s', (id,))
        connection.commit()  # Commit the deletion

        return {"success": True, "message": "Delete action successful!"}, 200
    except Exception as e:
        print(f"Error while deleting discussion: {e}")
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        connection.close()

       