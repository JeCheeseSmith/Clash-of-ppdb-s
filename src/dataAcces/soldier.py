from datetime import datetime, timedelta


class Soldier:
    def __init__(self, name, type, health, damage, capacity, consumption, speed, stealth):
        self.name = name
        self.type = type
        self.health = health
        self.damage = damage
        self.capacity = capacity
        self.consumption = consumption
        self.speed = speed
        self.stealth = stealth

    def to_dct(self):
        return dict(name=self.name, type=self.type, health=self.health, damage=self.damage, capacity=self.capacity,
                    consumption=self.consumption, speed=self.speed, stealth=self.stealth)


class SoldierDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def calculateTrainTime(self, sname):
        """
        Helper function to retrieve the start,stop and duration for a timer to train a soldier
        :param sname: Name of the soldier
        :return: start: now() , stop: datetime, duration: int
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT trainingTime from soldier where name=%s;', (sname,))
        duration = cursor.fetchone()[0]
        start = datetime.now()
        stop = start + timedelta(seconds=duration)
        return start, stop, duration

    def unlocked(self, sid, sname):
        """
        Gives True if a settlement unlocked this type of soldier
        :param sid: Identifier of the settlement
        :param sname: Name of the soldier
        :return: success: bool
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS(SELECT * FROM unlocked WHERE name=%s and sid=%s);', (sname, sid))
        unlocked = cursor.fetchone()[0]
        if unlocked:
            return True
        else:
            return False

    def getUnlockedSoldiers(self, sid):
        """
        Retrieves all soldier with their update status
        :param sid: Identifier of the settlement
        :return: Array of soldier name and unlocked status (True/False)
        """
        cursor = self.dbconnect.get_cursor()
        querry = """SELECT soldier.name,True FROM soldier JOIN unlocked on soldier.name = unlocked.name
                    UNION
                    SELECT soldier.name,False FROM soldier WHERE name NOT IN (SELECT soldier.name FROM soldier JOIN unlocked on soldier.name = unlocked.name WHERE sid=%s);"""
        cursor.execute(querry, (sid,))
        return cursor.fetchall()

    def getTroops(self, id, type):
        cursor = self.dbconnect.get_cursor()
        if type == 'settlement':
            cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (id,) )
            pid = cursor.fetchone()[0]
            print(pid)
            return self.getTroops(pid, 'package')
        elif type == 'transfer':
            cursor.execute('SELECT pid FROM transfer WHERE id=%s;', (id,))
            pid = cursor.fetchone()[0]
            return self.getTroops(pid, 'package')
        else:  # type == 'package':
            cursor.execute('SELECT sname, amount, transferable, discovered FROM troops WHERE pid=%s;', (id,))
            return cursor.fetchall()

