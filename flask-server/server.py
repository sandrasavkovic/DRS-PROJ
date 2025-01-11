from flask import Flask
from app_init import create_app, create_socketio, mail, socketio
from routes.auth_routes import auth_routes
from routes.approving_routes import approving_routes
from routes.theme_routes import theme_routes
from routes.discussion_routes import discussion_routes
from flask_socketio import SocketIO, emit
from werkzeug.exceptions import HTTPException


# Initialize the app and socket
app = create_app()
socketio = create_socketio(app)

# You can set this to True if you're in a development environment to allow all host headers
ALLOWED_HOSTS = ['drs-proj-production.up.railway.app', 'localhost']  # Add your domain and localhost if needed

# Middleware to check Host header
@app.before_request
def check_host():
    host = request.headers.get('Host')
    if host not in ALLOWED_HOSTS:
        raise HTTPException("Invalid Host header")

# Register blueprints
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
    socketio.run(app, debug=False, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
