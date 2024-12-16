class Discussion:
    def __init__(self, id, title, content, user_id, theme_id):
        self.id = id 
        self.title = title 
        self.content = content
        self.user_id = user_id
        self.theme_id = theme_id

#Iz baze vadimo user_id, theme_id, a vracamo username i theme_name
class DiscussionDTO:
    def __init__(self, id, title, content, username, theme_name):
        self.id = id
        self.title = title
        self.content = content
        self.user_id = username
        self.theme_id = theme_name
    
    # Dodajemo metodu za pretvaranje objekta u dictionary
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'user_id': self.user_id,
            'theme_id': self.theme_id
        }
