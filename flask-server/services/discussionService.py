from app_init import socketio 
from db import get_db_connection
from services.themeService import get_current_user_id;
from models.Discussion import DiscussionDTO
def get_discussion_reactions(discussionId, userId):
    try:
        print("HELLOOOO")
        connection = get_db_connection()
        cursor = connection.cursor()

        # Preuzimanje broja lajkova
        cursor.execute("""
            SELECT COUNT(*) FROM reactions
            WHERE discussion_id = %s AND reaction_type = 'like'
        """, (discussionId,))
        result = cursor.fetchone()
        likes = result[0] if result else 0  # Ako je rezultat None, postavi 0
        print(likes)

        # Preuzimanje broja dislajkova
        cursor.execute("""
            SELECT COUNT(*) FROM reactions
            WHERE discussion_id = %s AND reaction_type = 'dislike'
        """, (discussionId,))
        result = cursor.fetchone()
        dislikes = result[0] if result else 0 
        print(dislikes)

        # Preuzimanje reakcije korisnika (ako postoji)
        cursor.execute("""
            SELECT reaction_type FROM reactions
            WHERE discussion_id = %s AND user_id = %s
        """, (discussionId, userId))
       
        print("KORISNIK ID: ")
        print(userId)
       
        result = cursor.fetchone()
       
        print("KORISNIK")
        print(result)
        user_reaction = result[0] if result else 'none'  # Ako nema reakcije, postavi 'none'

        return {
            'likes': likes,
            'dislikes': dislikes,
            'user_reaction': user_reaction
        }

    except Exception as e:
        return {"error": f"Error fetching reactions for discussion {discussionId}: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()

# za komentare
def get_discussion_comments(discussionId):
    try:
        print("U SERVISU ZA KOMENTARE")
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT comments.id, comments.content, comments.datetime, users.username
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.discussion_id = %s;
        """
        cursor.execute(query, (discussionId,))
        result = cursor.fetchall()

        # Convert the result to a list of dictionaries for easy handling in the frontend
        comments = [
            {
                "id": row[0],
                "content": row[1],
                "datetime": row[2],
                "username": row[3]
            }
            for row in result
        ]

        return comments

    except Exception as e:
        return ({"error": f"Error fetching comments: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

def post_new_comment(discussion_id, new_comment, user_id):
    try:
        connection = get_db_connection()  # Establish connection to the database
        cursor = connection.cursor()

        # Insert the new comment into the database
        cursor.execute("""
            INSERT INTO comments (discussion_id, user_id, content, datetime)
            VALUES (%s, %s, %s, NOW())
        """, (discussion_id, user_id, new_comment))

        connection.commit()  # Commit the transaction

        # Optionally, fetch the inserted comment to return it
        cursor.execute("""
            SELECT c.id, c.content, c.datetime, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.discussion_id = %s AND c.user_id = %s
            ORDER BY c.datetime DESC
            LIMIT 1
        """, (discussion_id, user_id))
        inserted_comment = cursor.fetchone()

        return {
            "id": inserted_comment[0],
            "content": inserted_comment[1],
            "datetime": inserted_comment[2],
            "username": inserted_comment[3],
        }

    except Exception as e:
        return {"error": f"Error posting comment: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()




def get_user_id_from_username(username):
    try:
        connection = get_db_connection() 
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        
        if result:
            return result['id']
        else:
            return None
    except Exception as e:
        print(f"Error fetching user ID: {e}")
        return None
    finally:
        if connection:
            connection.close()

def process_reaction(discussion_id, user_id, reaction_type):
    try:
        print("Izmjena reakcija")
        print(reaction_type)
        print(discussion_id)
        print(user_id)
        
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT reaction_type 
            FROM reactions 
            WHERE discussion_id = %s AND user_id = %s;
        """, (discussion_id, user_id))

        result = cursor.fetchone()
        print(result)
        if result:
            existing_reaction = result['reaction_type'] 
            print(existing_reaction)
                # ako je like/dislike vec bio prisutan obrisi ga
            if existing_reaction == reaction_type:
                cursor.execute("""
                    DELETE FROM reactions 
                    WHERE discussion_id = %s AND user_id = %s;
                """, (discussion_id, user_id))
                print("Uspjesno")
            else:
                # ako je promjenjena reakcija azuriraj je
                cursor.execute("""
                    UPDATE reactions 
                    SET reaction_type = %s 
                    WHERE discussion_id = %s AND user_id = %s;
                """, (reaction_type, discussion_id, user_id))
                print("Uspjesno")
        else:
            # ako nema reakcije, dodaj novu
            print("Nema reakcija")
            cursor.execute("""
                INSERT INTO reactions (discussion_id, user_id, reaction_type) 
                VALUES (%s, %s, %s);
            """, (discussion_id, user_id, reaction_type))
        
        connection.commit()
        print("OVO OK")
        # izračunaj broj lajkova i dislajkova za diskusiju
        cursor.execute("""
            SELECT 
                SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
            FROM reactions
            WHERE discussion_id = %s;
        """, (discussion_id,))
        print("OVO e")
        counts = cursor.fetchone()
        print(counts)
        likes, dislikes = counts['likes'] or 0, counts['dislikes'] or 0

        return {'likes': likes, 'dislikes': dislikes}

    except Exception as e:
        print(f"Error processing reaction: {e}")
        return {'likes': 0, 'dislikes': 0}

    finally:
        if connection:
            connection.close()


def get_all_discussions():
    try:
        print("DISKUSIJE GET")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                d.id, 
                d.title, 
                d.content, 
                d.user_id, 
                d.theme_id, 
                u.username, 
                u.name,
                u.last_name,
                u.email,
                t.theme_name,
                d.datetime
            FROM discussions d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN themes t ON d.theme_id = t.id
            ORDER BY d.datetime DESC
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
                'theme_name': discussion['theme_name'],
                'post_time': discussion['datetime'], #myb nam ne treba ovo post time al eto nek se nadje
                'name': discussion['name'],
                'surname': discussion['last_name'],
                'email': discussion['email']
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

       