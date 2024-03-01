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
        return {'name': self.name, 'password': self.password}


class PlayerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
       
    def get_login(self,obj):
        cursor=self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM player WHERE name=%s AND password=%s;',(obj.name,obj.password))
        Controle=cursor.fetchone()
        if Controle:
            return True
        else:
            return False

    def add_user(self,obj):
        cursor=self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO player(name,password) VALUES(%s,%s)', (obj.name,obj.password,))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False


