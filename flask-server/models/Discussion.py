class Discussion:
    def __init__(self, id, content, user_id, theme_id, datetime):
        self.id = id 
        self.content = content
        self.user_id = user_id
        self.theme_id = theme_id
        self.datetime = datetime

# Za prikaz diskusija u discussionDisplay nam trebaju SVE ove info
class DiscussionDTO:
    def __init__(self, id, content, username, theme_name, theme_id, post_time, name, surname, email, user_id):
        self.id = id
        self.content = content
        self.username = username
        self.theme_name = theme_name
        self.theme_id = theme_id
        self.post_time = post_time
        self.name = name
        self.surname = surname
        self.email = email
        self.user_id = user_id
    
    # Metoda za pretvaranje u dict objekat
    def to_dict(self):
        return {
            'id': self.id, 
            'content': self.content,
            'username': self.username, 
            'theme_name': self.theme_name,
            'theme_id': self.theme_id, 
            'post_time': self.post_time, 
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'user_id' : self.user_id
        }

class DiscussionReactionsDTO:
    def __init__(self, likes, dislikes, user_reaction): 
        self.likes = likes 
        self.dislikes = dislikes
        self.user_reaction = user_reaction
    
    # Metoda za pretvaranje u dict objekat
    def to_dict(self):
        return {
            'likes': self.likes, 
            'dislikes': self.dislikes,
            'user_reaction': self.user_reaction
        }

class DiscussionCommentsDTO:
    def __init__(self, id, content, datetime, username, user_id): 
        self.id = id 
        self.content = content
        self.datetime = datetime
        self.username = username
        self.user_id = user_id

    # Metoda za pretvaranje u dict objekat
    def to_dict(self):
        return {
            'id': self.id, 
            'content': self.content,
            'datetime': self.datetime,
            'username': self.username,
            'user_id': self.user_id,
        }
