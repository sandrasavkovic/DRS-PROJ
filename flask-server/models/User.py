# User
class User:
    def __init__(self, name, username, password):
        self.name = name
        self.username = username
        self.password = password

    def __repr__(self):
        return f"User(name={self.name}, username={self.username})"

# UserDTO
class UserDTO:
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f"UserDTO(name={self.name})"
