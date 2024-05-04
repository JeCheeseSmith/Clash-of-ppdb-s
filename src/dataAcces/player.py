from .content import *
from .package import *


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
        control = cursor.fetchone()

        if control:
            cursor.execute('SELECT min(id) FROM settlement WHERE settlement.pname=%s;', (obj.name,))  # Get the first settlement ID
            sid = cursor.fetchone()[0]
            return True, sid
        else:
            return False, None

    def add_user(self, obj, settlement_data_acces, content_data_access, package_data_acces):
        """
        Initialise all standard data for the user.
        - Create a player in the database
        - Create Settlement + Standard Values (Package)
        - Send a welcome message to the user
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()

            # Create the player
            cursor.execute(
                'INSERT INTO player(name,password,xp,gems,level,avatar,logout) VALUES(%s,%s,%s,%s,%s,%s,now());',
                (obj.name, obj.password, obj.xp, obj.gems, obj.level, obj.avatar))

            # Create a package for the settlement
            pid = package_data_acces.add_resources(
                Package([0, 1000, 1000, 1000, 1000, 0, 0]))  # All resource are initialised at the maximum

            # Create a settlement & link the package
            location = settlement_data_acces.getNewCoordinate()
            cursor.execute('INSERT INTO settlement(name,mapx,mapy,pid,pname) VALUES(%s,%s,%s,%s,%s);',
                           (obj.name + " Castle", location[0], location[1], pid, obj.name))

            # Get the settlement ID
            cursor.execute('SELECT max(id) FROM settlement;')
            sid = cursor.fetchone()[0]
            self.dbconnect.commit()

            # Initialise the standard values
            settlement_data_acces.initialise(sid)

            # Send a message to the user from the system
            content_data_access.add_message(Content(None, None, "Welcome to Travisia!", "admin"), obj.name)

            # Add achievements
            cursor.execute('SELECT name, amount FROM achievement;')
            quests = cursor.fetchall()
            for tup in quests:
                cursor.execute('INSERT INTO achieved(pname, aname, amount) VALUES(%s,%s,%s);', (obj.name, tup[0], tup[1]))
            self.dbconnect.commit()

            return True, sid
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False, None

    def search_player(self, name):
        cursor = self.dbconnect.get_cursor()
        cursor.execute("SELECT EXISTS(SELECT 1 FROM player WHERE name = %s)", (name,))
        Pname = cursor.fetchone()[0]
        if Pname:
            return True
        else:
            return False

    def retrieveClan(self, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT cname FROM member where pname=%s;', (pname,))
        member = cursor.fetchone()
        return member

    def registerLogOut(self, name):
        """
        Saves the current logout time to the database
        :param name: Name of the player
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('UPDATE player SET logout=NOW() WHERE name=%s;', (name,))
        self.dbconnect.commit()

    def getplayers(self):
        cursor = self.dbconnect.get_cursor()
        # Select players in order by there level
        leaderboard = """
               SELECT name, level
               FROM player
               ORDER BY level DESC, name ASC
               LIMIT 10;
           """
        cursor.execute(leaderboard)
        leaderboard = cursor.fetchall()
        leaderboardlist = []

        for player in leaderboard:
            leaderboardlist.append((player[0], player[1]))

        return leaderboardlist

    def getAchieved(self, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT aname, task FROM achieved  JOIN achievement ON aname =name WHERE pname=%s and achieved.amount<=-1;', (pname,))
        achieved = cursor.fetchall()
        lst = []
        for quest in achieved:
            lst.append(dict(aname=quest[0], task=quest[1]))
        return lst