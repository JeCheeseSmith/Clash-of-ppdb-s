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
        :return: succes: bool
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS(SELECT * FROM unlockedsoldier WHERE sname=%s and sid=%s);', (sname, sid))
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
        querry = """SELECT name,True FROM soldier JOIN unlockedsoldier on soldier.name = unlockedsoldier.sname WHERE sid=%s
                    UNION
                    SELECT name,False FROM soldier WHERE name NOT IN (SELECT name FROM soldier JOIN unlockedsoldier on soldier.name = unlockedsoldier.sname WHERE sid=%s);"""
        cursor.execute(querry, (sid, sid))
        return cursor.fetchall()
