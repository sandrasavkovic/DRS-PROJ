import mysql.connector
# ###################
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="duska", #pisi svoju sifru za root korisnika!
        database="discussion_app"
    )