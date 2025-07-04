class User:
    def __init__(self, username, password, name, last_name, address, city, country, phone_number, email, is_admin=False, is_approved=False, first_login = True):
        self.username = username
        self.password = password
        self.name = name
        self.last_name = last_name
        self.address = address
        self.city = city
        self.country = country
        self.phone_number = phone_number
        self.email = email
        self.is_admin = is_admin
        self.is_approved = is_approved
        self.first_login = first_login
    def __repr__(self):
        user_type = "Administrator" if self.is_admin else "User"
        return (
            f"{user_type}(username='{self.username}', email='{self.email}', "
            f"first_name='{self.name}', last_name='{self.last_name}')"
        )

class UserDTO:
    def __init__(self, name, is_admin, username):
        self.name = name
        self.is_admin = is_admin
        self.username = username

    def __repr__(self):
        return f"UserDTO(name={self.name}, is_admin={self.is_admin})"

class UserApprovingDTO:
    def __init__(self, name, last_name, email, is_approved):
        self.name = name
        self.last_name = last_name
        self.email = email
        self.is_approved = is_approved