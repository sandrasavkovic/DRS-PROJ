from app_init import socketio 
from db import get_db_connection


# Funkcija za preuzimanje svih tema
def get_all_themes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM themes ORDER BY id DESC')  # Uzimanje tema po ID-u
    themes = cursor.fetchall()  # Vraća sve teme
    cursor.close()
    connection.close()
    return themes

# Funkcija za dodavanje nove teme
def add_new_theme(theme_name):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('INSERT INTO themes (theme_name) VALUES (%s)', (theme_name,))
    connection.commit()
    cursor.close()
    connection.close()

# Funkcija za dobijanje specifične teme prema ID-u (ako je potrebno)
def get_theme_by_id(theme_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM themes WHERE id = %s', (theme_id,))
    theme = cursor.fetchone()  # Vraća samo jednu temu
    cursor.close()
    connection.close()
    return theme