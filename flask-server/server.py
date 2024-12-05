from app_init import app, socketio  # Importovanje app i socketio iz app_init.py
from routes.auth_routes import auth_routes
from routes.approving_routes import approving_routes
from routes.theme_routes import theme_routes
from flask_socketio import SocketIO

<<<<<<< HEAD

# Update the SocketIO initialization to allow cross-origin requests from React (localhost:3000)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")
=======
# Omogućavanje svih origin-a za razvoj, uključujući localhost:3000 (React)
socketio = SocketIO(app, cors_allowed_origins="*")  # Omogućava sve origin-e za razvoj
>>>>>>> 93b4b32229f8406ed519b141c36947a8f7833752

# Registrujte rute
app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(approving_routes, url_prefix='/approving')
app.register_blueprint(theme_routes, url_prefix='/theme')

@app.route("/") 
def pocStr(): 
    return "Pocetna stranica"


# Pokrenite aplikaciju
if __name__ == "__main__":
    socketio.run(app, debug=True)  # Pokreće server koristeći SocketIO umesto app.run()

