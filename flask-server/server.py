from flask import Flask
from routes.auth_routes import auth_routes
from flask_mail import Mail, Message

def create_app():
    app = Flask(__name__)
    app.register_blueprint(auth_routes, url_prefix='/auth') 
    return app

# Inicijalizacija apl
app = create_app()

# konfiguracija za slanje obavestenja preko mejla 
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True 
app.config['MAIL_USE_SSL'] = False 
app.config['MAIL_USERNAME'] = 'projekat.drs6@gmail.com'  # Vaš e-mail
app.config['MAIL_PASSWORD'] = 'admin0609002'           # Vaša lozinka
app.config['MAIL_DEFAULT_SENDER'] = 'projekat.drs6@gmail.com'

mail = Mail(app)

# funkcijaa za slanje poruke, body je poruka
def send_email(subject, recipient, body):
    msg = Message(subject, recipients=[recipient])
    msg.body = body
    mail.send(msg)
    
# 2 slucaja, kada je zahtev korisnika za logovanje prihvaceno 
    
@app.route('/approve_user/<email>', methods=['POST'])
def approve_user(email):
    # Pretpostavljamo da imate funkciju za ažuriranje statusa korisnika
    user = get_user_by_id(user_id)  # Dohvatite korisnika iz baze
    if user:
        # Primer za odobrenje korisnika
        user.status = 'approved'  # Ažurirajte status u bazi
        db.session.commit()

        # Pošaljite e-mail korisniku
        subject = "Vaša registracija je odobrena"
        body = f"Poštovani {user.username},\n\nVaša registracija na našu platformu je odobrena.\n\nPozdrav,\nAdministrator"
        send_email(subject, user.email, body)
        return "Korisnik je odobren i e-mail poslat."

# kada nije prihvaceno
@app.route('/reject_user/<user_id>', methods=['POST'])
def reject_user(user_id):
    user = get_user_by_id(user_id)  # Dohvatite korisnika iz baze
    if user:
        # Primer za odbijanje korisnika
        user.status = False # Ažurirajte status u bazi
       # db.session.commit()

        # Pošaljite e-mail korisniku
        subject = "Vaša registracija je odbijena"
        body = f"Poštovani {user.username},\n\nNažalost, Vaša registracija na našu platformu je odbijena.\n\nPozdrav,\nAdministrator"
        send_email(subject, user.email, body)
        return "Korisnik je odbijen i e-mail poslat."


@app.route("/") 
def pocStr(): 
    return "Pocetna stranica"

if __name__ == "__main__":
    app.run(debug=True)
