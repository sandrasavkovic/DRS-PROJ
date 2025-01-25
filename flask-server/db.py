import mysql.connector
import os
import time

def get_db_connection():
    # Uzimanje vrednosti iz environment varijabli
    host = os.getenv("MYSQLHOST", "mysql-lrr3-production.up.railway.app")  # Default je 'localhost' ako nije postavljeno, izmeni za Railway ako je potrebno
    user = os.getenv("MYSQLUSER", "root")
    password = os.getenv("MYSQLPASSWORD", "duska")
    database = os.getenv("MYSQLDATABASE", "discussion_app")
    
    # Debug: Prikazivanje vrednosti varijabli
    print(f"MYSQLHOST: {host}")
    print(f"MYSQLUSER: {user}")
    print(f"MYSQLPASSWORD: {password}")
    print(f"MYSQLDATABASE: {database}")

    retries = 5  # Broj pokušaja
    delay = 5  # Interval između pokušaja (u sekundama)
    
    for attempt in range(retries):
        try:
            # Kreiranje konekcije
            connection = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database
            )
            print("Povezivanje sa bazom uspešno!")
            return connection  # Povezivanje uspešno, vraćamo konekciju

        except mysql.connector.Error as err:
            print(f"Greška prilikom povezivanja ({attempt+1}/{retries}): {err}")

        print(f"Ponovo pokušavam u {delay} sekundi...")
        time.sleep(delay)
    
    # Ako nije uspelo nakon svih pokušaja, baciti grešku
    raise Exception("Nije moguće povezivanje na MySQL nakon više pokušaja.")

# Testiranje povezivanja
try:
    connection = get_db_connection()
    if connection:
        connection.close()  # Zatvorite konekciju nakon testa
except Exception as e:
    print(f"Greška: {e}")
