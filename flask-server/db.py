import mysql.connector
import os

#def get_db_connection():
 #   return mysql.connector.connect(
  #      host=os.getenv("MYSQL_HOST", "localhost"),
   #     user=os.getenv("MYSQL_USER", "root"),
    #    password=os.getenv("MYSQL_PASSWORD", ""),
     #   database=os.getenv("MYSQL_DATABASE", "discussion_app")
    #)

def get_db_connection():
    # Uzimanje vrednosti iz environment varijabli
    host = os.getenv("MYSQLHOST", "mysql-lrr3.railway.internal")  # Default je 'localhost' ako nije postavljeno izmeni ako treba za railway
    user = os.getenv("MYSQLUSER", "root")
    password = os.getenv("MYSQLPASSWORD","duska")
    database = os.getenv("MYSQLDATABASE", "discussion_app")
    
     # Debug: Prikazivanje vrednosti varijabli
    print(f"MYSQLHOST: {host}")
    print(f"MYSQLUSER: {user}")
    print(f"MYSQLPASSWORD: {password}")
    print(f"MYSQLDATABASE: {database}")

    try:
        # Kreiranje konekcije
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        print("Povezivanje sa bazom uspešno!")
        return connection
    except mysql.connector.Error as err:
        print(f"Greška prilikom povezivanja: {err}")
        return None

# Testiranje povezivanja
connection = get_db_connection()
if connection:
    connection.close()  # Zatvorite konekciju nakon testa