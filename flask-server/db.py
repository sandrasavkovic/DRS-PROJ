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
    host = os.getenv("MYSQL_HOST", "db")  # Default je 'localhost' ako nije postavljeno
    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD","duska")
    database = os.getenv("MYSQL_DATABASE", "discussion_app")
    
     # Debug: Prikazivanje vrednosti varijabli
    print(f"MYSQL_HOST: {host}")
    print(f"MYSQL_USER: {user}")
    print(f"MYSQL_PASSWORD: {password}")
    print(f"MYSQL_DATABASE: {database}")

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