from app_init import app, socketio
from routes.auth_routes import auth_routes
from routes.approving_routes import approving_routes
from flask_socketio import SocketIO

# Update the SocketIO initialization to allow cross-origin requests from React (localhost:3000)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

# Register your routes
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(approving_routes, url_prefix='/approving')

# Run the app
if __name__ == "__main__":
    socketio.run(app, debug=True)


    
# 2 slucaja, kada je zahtev korisnika za logovanje prihvaceno 

# @app.route('/approve_user/<email>', methods=['POST'])
# def approve_user(email):
#     # Pretpostavljamo da imate funkciju za ažuriranje statusa korisnika
#     user = get_user_by_id(user_id)  # Dohvatite korisnika iz baze
#     if user:
#         # Primer za odobrenje korisnika
#         user.status = 'approved'  # Ažurirajte status u bazi
#         db.session.commit()

#         # Pošaljite e-mail korisniku
#         subject = "Vaša registracija je odobrena"
#         body = f"Poštovani {user.username},\n\nVaša registracija na našu platformu je odobrena.\n\nPozdrav,\nAdministrator"
#         send_email(subject, user.email, body)
#         return "Korisnik je odobren i e-mail poslat."

# # kada nije prihvaceno
# @app.route('/reject_user/<user_id>', methods=['POST'])
# def reject_user(user_id):
#     user = get_user_by_id(user_id)  # Dohvatite korisnika iz baze
#     if user:
#         # Primer za odbijanje korisnika
#         user.status = False # Ažurirajte status u bazi
#        # db.session.commit()

#         # Pošaljite e-mail korisniku
#         subject = "Vaša registracija je odbijena"
#         body = f"Poštovani {user.username},\n\nNažalost, Vaša registracija na našu platformu je odbijena.\n\nPozdrav,\nAdministrator"
#         send_email(subject, user.email, body)
#         return "Korisnik je odbijen i e-mail poslat."


@app.route("/") 
def pocStr(): 
    return "Pocetna stranica"

if __name__ == "__main__":
    app.run(debug=True)
