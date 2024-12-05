import mysql.connector
# ###################
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
<<<<<<< HEAD
        password="iiva6070", #pisi svoju sifru za root korisnika!
=======
        password="sandra", #pisi svoju sifru za root korisnika!
>>>>>>> 93b4b32229f8406ed519b141c36947a8f7833752
        database="discussion_app"
    )