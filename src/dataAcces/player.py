from src.dataAcces.settlement import *

from src.dataAcces.content import *


class Player:
    def __init__(self, name, password, avatar, gems, xp, level, logout, pid):
        self.name = name
        self.password = password
        self.avatar = avatar
        self.gems = gems
        self.xp = xp
        self.level = level
        self.logout = logout
        self.pid = pid

    def to_dct(self):
        return {'name': self.name, 'password': self.password, 'avatar': self.avatar, 'gems': self.gems, 'xp': self.xp,
                'level': self.level, 'logout': self.logout, 'pid': self.pid}


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
        """
        Initialise all standard data for the user.
        - Create a player in the database
        - Create Settlement + Standard Values (Package)
        - Send a welcome message to the user
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        try:
            # Create the player
            cursor.execute(
                'INSERT INTO player(name,password,xp,gems,level,avatar,logout) VALUES(%s,%s,%s,%s,%s,%s,now())',
                (obj.name, obj.password, obj.xp, obj.gems, obj.level, obj.avatar))

            # Create a package for the settlement
            cursor.execute('INSERT INTO package(stone,wood,steel,food) VALUES(%s,%s,%s,%s)',
                           (500, 500, 500, 500))  # All resource are initialised at the maximum

            # Create a settlement & link the package
            cursor.execute('INSERT INTO settlement(name,mapx,mapy,pid,pname) VALUES(%s,%s,%s,%s,%s)',
                           (obj.name + " Castle", 0, 0,))

            # Send a message to the user from the system
            # TODO: Call message send here

            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False

    def search_player(self, name):
        cursor = self.dbconnect.get_cursor()
        cursor.execute("SELECT EXISTS(SELECT 1 FROM player WHERE name = %s)", (name,))
        Pname = cursor.fetchone()[0]
        if Pname:
            return True
        else:
            return False
