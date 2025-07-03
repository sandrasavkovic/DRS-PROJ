from flask import Flask
from multiprocessing import Process
from app_init import create_app, create_socketio, send_email, send_mail_worker, mail_queue, socketio  # Import initialization functions and extensions
from routes.auth_routes import auth_routes  # Import blueprints
from routes.approving_routes import approving_routes
from routes.theme_routes import theme_routes
from routes.discussion_routes import discussion_routes
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Import CORS


# Inicijalizacija soketa
app = create_app()
 

socketio = create_socketio(app)

CORS(app) 

# Registracija blueprint-a
app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(approving_routes, url_prefix="/approving")
app.register_blueprint(theme_routes, url_prefix='/theme')
app.register_blueprint(discussion_routes, url_prefix='/discussion')


@app.route("/")
def home():
    return "Welcome to the home page!"

# WebSocket event handler
@socketio.on("button_click")
def handle_button_click():
    try:
        message = "Cao"
        print("Received 'button_click' event from client.")
        emit("serverReaction", {"message": message})  # Send a response back to the client
    except Exception as e:
        print(f"Error occurred: {e}")
        emit("error", {"message": str(e)})

# Run the application
if __name__ == "__main__":
    mail_proc = Process(target=send_mail_worker,
                        args=(mail_queue,),
                        daemon=True)
    mail_proc.start()
    socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)

