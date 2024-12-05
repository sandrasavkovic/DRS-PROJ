from flask import Flask
from flask_socketio import SocketIO
from flask_mail import Mail
from extensions import jwt 

mail = Mail()
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    app = Flask(__name__)
    
    # JWT
    app.config["JWT_SECRET_KEY"] = "dianaSandra123" 
    
    # Mail 
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'projekat.drs6@gmail.com' 
    app.config['MAIL_PASSWORD'] = 'mlfb ayje vbez nnch'  
    app.config['MAIL_DEFAULT_SENDER'] = 'projekat.drs6@gmail.com'
    
    mail.init_app(app)
    jwt.init_app(app)

    return app

def create_socketio(app):
    socketio.init_app(app, debug=True) 
    return socketio
