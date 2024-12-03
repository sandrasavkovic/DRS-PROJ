from app_init import app, socketio  # Importovanje app i socketio iz app_init.py
from routes.auth_routes import auth_routes
from routes.approving_routes import approving_routes
from flask_socketio import SocketIO

# Omogućavanje svih origin-a za razvoj, uključujući localhost:3000 (React)
socketio = SocketIO(app, cors_allowed_origins="*")  # Omogućava sve origin-e za razvoj

# Registrujte rute
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(approving_routes, url_prefix='/approving')

@app.route("/") 
def pocStr(): 
    return "Pocetna stranica"


# Pokrenite aplikaciju
if __name__ == "__main__":
    socketio.run(app, debug=True)  # Pokreće server koristeći SocketIO umesto app.run()

