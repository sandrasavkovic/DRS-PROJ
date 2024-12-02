from flask_mail import Message
from flask import current_app

def send_email(subject, recipient, body):
    mail = current_app.extensions['mail'] 
    msg = Message(subject, recipients=[recipient])
    msg.body = body
    mail.send(msg)
