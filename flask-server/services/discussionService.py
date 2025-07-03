from app_init import socketio 
from db import get_db_connection
from services.themeService import get_current_user_id;
from models.Discussion import DiscussionDTO, DiscussionReactionsDTO, DiscussionCommentsDTO
from app_init import send_email

def get_all_discussions():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                d.id,  
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

        discussions = cursor.fetchall() 
        print("Fetched discussions:", discussions)

        # vracamo listu dictionary objekata (DTO)
        discussion_dtos = [
            DiscussionDTO(
                discussion['id'], 
                discussion['content'],
                discussion['username'], 
                discussion['theme_name'],
                discussion['theme_id'], 
                discussion['datetime'], 
                discussion['name'],
                discussion['last_name'],
                discussion['email'],
                discussion['user_id']
            ).to_dict()
            for discussion in discussions
        ]

        return discussion_dtos

    except Exception as e:
        print(f"Error fetching discussions: {e}")
        return [] 
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def add_discussion_service(userId, themeId, discussionText):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Ubacivanje nove diskusije u bazu
        cursor.execute("""
            INSERT INTO discussions (content, user_id, theme_id, datetime)
            VALUES (%s, %s, %s, NOW())
        """, (discussionText, userId, themeId))
        connection.commit()

        # Dohvatanje ID-a nove diskusije
        discussion_id = cursor.lastrowid
        
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
        
        discussion = cursor.fetchone()
        
        if discussion:
            new_discussion_dto = DiscussionDTO(
                discussion['id'],
                discussion['content'],
                discussion['username'],
                discussion['theme_name'],
                discussion['theme_id'],
                discussion['post_time'],
                discussion['name'],
                discussion['surname'],
                discussion['email'],
                discussion['user_id']
            )

        if new_discussion_dto:
            return new_discussion_dto.to_dict()
        
        else:
            raise Exception("Failed to retrieve the new discussion.")

    except Exception as e:
        connection.rollback()
        raise Exception(f"Failed to add discussion: {str(e)}")

    finally:
        cursor.close()
        connection.close()


def delete_discussion_by_id_service(id):
    try:
        id = int(id)  
    except ValueError:
        return {"success": False, "message": "Invalid ID format"}, 400
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Provjeriti da li postoji prije brisanja
        cursor.execute('SELECT * FROM discussions WHERE id = %s', (id,))
        discussion = cursor.fetchone() 
        if not discussion:
            return {"success": False, "message": "No discussions found with the given ID"}, 404

        # BRISANJE
        cursor.execute('DELETE FROM discussions WHERE id = %s', (id,))
        connection.commit() 

        return {"success": True, "message": "Delete action successful!"}, 200
    except Exception as e:
        print(f"Error while deleting discussion: {e}")
        return {"success": False, "message": str(e)}, 500
    finally:
        cursor.close()
        connection.close()
        
   
def editDiscussion(discussion_id, theme_id, content):
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('UPDATE discussions SET content = %s, theme_id = %s, datetime = NOW() WHERE id = %s',
                       (content, theme_id, discussion_id))
        connection.commit()
        
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
        
        discussion = cursor.fetchone()
        
        if discussion:
            updated_discussion_dto = DiscussionDTO(
                discussion['id'],
                discussion['content'],
                discussion['username'],
                discussion['theme_name'],
                discussion['theme_id'],
                discussion['post_time'],
                discussion['name'],
                discussion['surname'],
                discussion['email'],
                discussion['user_id']
            )
        
        if updated_discussion_dto:
            return updated_discussion_dto.to_dict()
        
        else:
            raise Exception(f"Discussion with id {discussion_id} not found.")

    except Exception as e:
        connection.rollback()
        raise Exception(f"Failed to modify discussion with id {discussion_id}: {str(e)}")
    
    finally:
        cursor.close()
        connection.close()


def get_discussion_reactions(discussionId, userId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Preuzimanje broja lajkova
        cursor.execute("""
            SELECT COUNT(*) FROM reactions
            WHERE discussion_id = %s AND reaction_type = 'like'
        """, (discussionId,))
        result = cursor.fetchone()
        likes = result[0] if result else 0  # Ako je rezultat None, postavi 0
        
        # Preuzimanje broja dislajkova
        cursor.execute("""
            SELECT COUNT(*) FROM reactions
            WHERE discussion_id = %s AND reaction_type = 'dislike'
        """, (discussionId,))
        result = cursor.fetchone()
        dislikes = result[0] if result else 0 
    
        # Preuzimanje reakcije korisnika (ako postoji)
        cursor.execute("""
            SELECT reaction_type FROM reactions
            WHERE discussion_id = %s AND user_id = %s
        """, (discussionId, userId))
       
        result = cursor.fetchone()
       
        user_reaction = result[0] if result else 'none'  # Ako nema reakcije, postavi 'none'
        
        discussion_reactions_dto = DiscussionReactionsDTO(likes, dislikes, user_reaction)
        return discussion_reactions_dto.to_dict()

    except Exception as e:
        return {"error": f"Error fetching reactions for discussion {discussionId}: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()


# Ovdje imaju 3 slucaja
# Korisnik je vec reagovao sa istom reakcijom --> brisanje te reakcije
# Korisnik je vec reagovao ali drugm reakcijom --> azuriranje reakcije
# Korisnik nije reagovao --> dodavanje reakcije
def process_reaction(discussion_id, user_id, reaction_type):
    try:
        reakcija = None
        
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
            else:
                # ako je promjenjena reakcija azuriraj je
                cursor.execute("""
                    UPDATE reactions 
                    SET reaction_type = %s 
                    WHERE discussion_id = %s AND user_id = %s;
                """, (reaction_type, discussion_id, user_id))
                reakcija = reaction_type
        else:
            # ako nema reakcije, dodaj novu
            print("Nema reakcija")
            cursor.execute("""
                INSERT INTO reactions (discussion_id, user_id, reaction_type) 
                VALUES (%s, %s, %s);
            """, (discussion_id, user_id, reaction_type))
            reakcija = reaction_type
        connection.commit()
       
        # izračunaj broj lajkova i dislajkova za diskusiju
        cursor.execute("""
            SELECT 
                SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) AS likes,
                SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) AS dislikes
            FROM reactions
            WHERE discussion_id = %s;
        """, (discussion_id,))
      
        counts = cursor.fetchone()
        likes, dislikes = counts['likes'] or 0, counts['dislikes'] or 0
        discussion_reactions_dto = DiscussionReactionsDTO(likes, dislikes, reakcija)
        return discussion_reactions_dto.to_dict()

    except Exception as e:
        print(f"Error processing reaction: {e}")
        return {'likes': 0, 'dislikes': 0}

    finally:
        if connection:
            connection.close()


def get_discussion_comments(discussionId):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
             SELECT comments.id, comments.content, comments.datetime, comments.user_id, users.username
             FROM comments
            JOIN users ON comments.user_id = users.id
             WHERE comments.discussion_id = %s;
            """

        cursor.execute(query, (discussionId,))
        result = cursor.fetchall()
        
        comments_dtos = [
            DiscussionCommentsDTO(
                row[0],
                row[1],
                row[2],
                row[4],
                row[3]
            ).to_dict()
            for row in result
        ]

        query= """
            SELECT COUNT(*) FROM comments WHERE discussion_id = %s;
        """
        cursor.execute(query, (discussionId,))
        count = cursor.fetchone()[0]
        
        print(comments_dtos)
        print(count)
        return comments_dtos, count
    

    except Exception as e:
        return ({"error": f"Error fetching comments: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()


def post_new_comment(discussion_id, new_comment, user_id, mentions):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # dodavanje u bazu
        cursor.execute("""
            INSERT INTO comments (discussion_id, user_id, content, datetime)
            VALUES (%s, %s, %s, NOW())
        """, (discussion_id, user_id, new_comment))
        connection.commit()

        cursor.execute("""
            SELECT c.id, c.content, c.datetime, u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.discussion_id = %s AND c.user_id = %s
            ORDER BY c.datetime DESC
            LIMIT 1
        """, (discussion_id, user_id))
        inserted_comment = cursor.fetchone()
        
        # Mention 
        if mentions:
            print("MENTIONS POSTOJI")
            for username in mentions:
                cursor.execute("""
                    SELECT * FROM users WHERE username = %s
                """, (username,))
                mentioned_user = cursor.fetchone()
                print(mentioned_user)
                if mentioned_user:
                    # izbegavamo slucaj pominjanja samog sebe 
                    #if(mentioned_user[0] != user_id):
                        print(f"User {username} (ID: {mentioned_user[0]}) was mentioned.")  
                        subject = "Neko Vas je pomenuo u komentaru!"
                        body = f"Poštovani {mentioned_user[1]},\n\n Pomenuti ste u komentaru od strane {inserted_comment[3]}, Sadržaj komentara : \n {inserted_comment[1]}!"
                        send_email(subject, mentioned_user[9], body) 

        comment_dto = DiscussionCommentsDTO(inserted_comment[0], 
                                            inserted_comment[1], 
                                            inserted_comment[2],
                                            inserted_comment[3], 
                                            user_id,)
        return comment_dto.to_dict()

    except Exception as e:
        return {"error": f"Error posting comment: {str(e)}"}, 500
    finally:
        cursor.close()
        connection.close()


def delete_comment_service(comment_id):
    try:
        try:
            comment_id = int(comment_id)
        except ValueError:
            return {"success": False, "message": "Invalid comment ID format"}, 400

        connection = get_db_connection()  
        cursor = connection.cursor(dictionary=True)

        cursor.execute('SELECT * FROM comments WHERE id = %s', (comment_id,))
        comment = cursor.fetchone()
        
        if not comment:
            return {"success": False, "message": "Comment not found"}, 404

        cursor.execute('DELETE FROM comments WHERE id = %s', (comment_id,))
        connection.commit() 

        return {"success": True, "message": "Comment deleted successfully"}, 200

    except Exception as e:
        return {"success": False, "message": str(e)}, 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def get_user_id_from_username(username):
    try:
        connection = get_db_connection() 
        cursor = connection.cursor(dictionary=True)
        print(username)
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        result = cursor.fetchone()
        print(result['id'])
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

