from flask import Blueprint, request, jsonify
from flask_socketio import emit
from services.approvingService import (
    get_pending_requests,
    approve_request,
    reject_request,
)
from app_init import socketio  # Pretpostavka da je socketio inicijalizovan

approving_routes = Blueprint("approving_routes", __name__)

def emit_pending_requests():
    try:
        pending_requests = get_pending_requests()
        socketio.emit("pendingRequestsUpdate", pending_requests) 
    except Exception as e:
        socketio.emit("error", {"message": str(e)}) 

@socketio.on("getPendingRequests")
def handle_get_pending_requests():
    emit_pending_requests()

@socketio.on("acceptRequest")
def handle_accept_request(data):
    user_id = data.get("userId")
    try:
        success = approve_request(user_id)
        if success:
            pending_requests = get_pending_requests()
            socketio.emit("pendingRequestsUpdate", pending_requests)
        else:
            emit("error", {"message": "Failed to accept request"})
    except Exception as e:
        emit("error", {"message": str(e)})

@socketio.on("rejectRequest")
def handle_reject_request(data):
    user_id = data.get("userId")
    try:
        success = reject_request(user_id)
        if success:
            pending_requests = get_pending_requests()
            socketio.emit("pendingRequestsUpdate", pending_requests)
        else:
            emit("error", {"message": "Failed to reject request"})
    except Exception as e:
        emit("error", {"message": str(e)})

