from flask import Flask
from routes.auth_routes import auth_routes

def create_app():
    app = Flask(__name__)
    app.register_blueprint(auth_routes, url_prefix='/auth') 
    return app

# Inicijalizacija apl
app = create_app()

@app.route("/") 
def pocStr(): 
    return "Pocetna stranica"

if __name__ == "__main__":
    app.run(debug=True)
