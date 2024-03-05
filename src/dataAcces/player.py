
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
        return {'name': self.name, 'password': self.password,'avatar': self.avatar, 'gems': self.gems, 'xp': self.xp, 'level': self.level, 'logout': self.logout}



class PlayerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def get_login(self, obj):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM player WHERE name=%s AND password=%s;', (obj.name, obj.password))
        Controle = cursor.fetchone()
        if Controle:
            return True
        else:
            return False

    def add_user(self, obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO player(name,password,xp,gems,level,avatar,logout) VALUES(%s,%s,%s,%s,%s,%s,now())', (obj.name, obj.password,obj.xp,obj.gems,obj.level,obj.avatar))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False

    def initialise(self):
        """
        Creates a startUp Settlement for a new user!
        :return:
        """
        pass


    def search_player(self,name):
        cursor = self.dbconnect.get_cursor()
        cursor.execute("SELECT EXISTS(SELECT 1 FROM player WHERE name = %s)", (name,))
        Pname = cursor.fetchone()[0]
        if Pname:
            return True
        else:
            return False
