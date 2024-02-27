from database import *

class Player:
    def __init__(self, name, password, avatar, gems, xp, level, logout):
        self.name = name
        self.password = password
        self.avatar = avatar
        self.gems = gems
        self.xp = xp
        self.level = level
        self.logout = logout
        
    def to_dct(self):
        return {'id': self.id, 'text': self.text, 'author': self.author}


class PlayerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
       
    def get_quotes(self):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM player;')
        temp = cursor.fetchall()
        print(temp)


