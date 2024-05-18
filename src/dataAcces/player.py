from datetime import datetime, timedelta

from .content import *
from .package import *


class Player:
    def __init__(self, name, password, xp, level, logout, pid):
        self.name = name
        self.password = password
        self.xp = xp
        self.level = level
        self.logout = logout
        self.pid = pid

    def to_dct(self):
        return {'name': self.name, 'password': self.password, 'xp': self.xp,
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
                'INSERT INTO player(name,password,xp,level,logout) VALUES(%s,%s,%s,%s,now());',
                (obj.name, obj.password, obj.xp, obj.level))

            # Create a package for the settlement
            pid = package_data_acces.add_resources(
                Package([0, 1000, 1000, 1000, 1000, 50, 0]))  # All resource are initialised at the maximum

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

    # Update xp and/or level
    def updateXPandLevel(self, XP, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT xp FROM player where name=%s;', (pname,))
        Xp = cursor.fetchone()[0]
        Xp += XP
        cursor.execute('SELECT level FROM player where name=%s;', (pname,))
        Level = cursor.fetchone()[0]
        while Xp / 1000 >= 1:
            Level += 1
            Xp -= 1000
            cursor.execute('UPDATE player SET level = %s WHERE name=%s;', (Level, pname,))
        cursor.execute('UPDATE player SET xp = %s WHERE name=%s;', (Xp, pname,))
        self.dbconnect.commit()

    def getXPandLevel(self, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT xp FROM player where name=%s;', (pname,))
        Xp = cursor.fetchone()[0]
        cursor.execute('SELECT level FROM player where name=%s;', (pname,))
        Level = cursor.fetchone()[0]
        return Level, Xp

    def getPlayers(self):
        cursor = self.dbconnect.get_cursor()
        # Select players in order by there level
        leaderboard = """
               SELECT name, level
               FROM player
               WHERE name != 'admin'
               ORDER BY level DESC
               LIMIT 5;
           """
        cursor.execute(leaderboard)
        leaderboard = cursor.fetchall()
        leaderboardList = []

        for player in leaderboard:
            leaderboardList.append((player[0], player[1]))

        return leaderboardList

    def getAchieved(self, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT aname, task FROM achieved  JOIN achievement ON aname =name WHERE pname=%s and achieved.amount<=-1;', (pname,))
        achieved = cursor.fetchall()
        lst = []
        for quest in achieved:
            lst.append(dict(aname=quest[0], task=quest[1]))
        return lst

    def checkWheel(self, name):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT last_timespin FROM player WHERE name=%s;', (name,))
        time = cursor.fetchone()[0]

        current_time = datetime.now()

        if time is None:
            cursor.execute('UPDATE PLAYER SET last_timespin = %s where name=%s;', (current_time, name,))
            self.dbconnect.commit()
            return True
        else:
            if current_time-time >= timedelta(days=1):
                cursor.execute('UPDATE PLAYER SET last_timespin = %s where name=%s;', (current_time, name,))
                self.dbconnect.commit()
                return True
            else:
                return False

    def updateGems(self, sid, quantity):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pid from settlement where id=%s;', (sid,))
        pid = cursor.fetchone()[0]

        cursor.execute('UPDATE package SET gems = gems + %s WHERE id=%s;', (quantity, pid,))
        self.dbconnect.commit()
