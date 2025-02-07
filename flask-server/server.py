import os
from flask import Flask
from app_init import create_app, create_socketio
from routes.auth_routes import auth_routes
from routes.approving_routes import approving_routes
from routes.theme_routes import theme_routes
from routes.discussion_routes import discussion_routes
from flask_cors import CORS
from flask_socketio import emit

# Initialize Flask app & Socket.IO
app = create_app()
socketio = create_socketio(app)

# Determine environment (local or Render)
IS_RENDER = "RENDER" in os.environ

# Configure CORS
allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
if IS_RENDER:
    allowed_origins.append("https://drs-proj.onrender.com")

CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Register Blueprints
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
        emit("serverReaction", {"message": message})  # Send response back to client
    except Exception as e:
        print(f"Error occurred: {e}")
        emit("error", {"message": str(e)})

# Run application using eventlet
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Use 5000 locally, Render assigns its own
    socketio.run(app, debug=not IS_RENDER, host="0.0.0.0", port=port)
