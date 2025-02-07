from flask_socketio import SocketIO
from flask import Flask
from flask_mail import Mail, Message
from extensions import jwt 
from multiprocessing import Process, Queue
import time
mail = Mail()
mail_queue = Queue()
socketio = SocketIO(cors_allowed_origins="*")

def send_mail_worker(queue):
    """Worker process that sends emails from the queue."""
    app = create_app()  # Create a new app context for the worker
    with app.app_context():
        while True:
            try:
                # Get mail data from the queue
                subject, recipient, body = queue.get()
                if subject is None:  # Stop signal
                    break
                msg = Message(subject=subject, recipients=[recipient], body=body)
                mail.send(msg)
                print(f"Email sent to {recipient}")
            except Exception as e:
                print(f"Failed to send email: {e}")
                time.sleep(1)  # Wait before retrying in case of errors


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


def send_email(subject, recipient, body):
    """Enqueue email data."""
    mail_queue.put((subject, recipient, body))
    print(f"Email queued for {recipient}")