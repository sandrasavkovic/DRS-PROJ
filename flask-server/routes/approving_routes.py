from flask import Blueprint, request, jsonify
from services.approvingService import (
    get_pending_requests,
    approve_request,
    reject_request,
)

approving_routes = Blueprint("approving_routes", __name__)

@approving_routes.route("/pending-requests", methods=["GET"])
def fetch_pending_requests():
    try:
        pending_requests = get_pending_requests()
        return jsonify(pending_requests), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@approving_routes.route("/accept-request/<int:user_id>", methods=["POST"])
def accept_request(user_id):
    try:
        success = approve_request(user_id)
        if success:
            return jsonify({"success": True, "message": "Request accepted successfully"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to accept request"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@approving_routes.route("/decline-request/<int:user_id>", methods=["POST"])
def decline_request(user_id):
    try:
        success = reject_request(user_id)
        if success:
            return jsonify({"success": True, "message": "Request declined successfully"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to decline request"}), 400
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
