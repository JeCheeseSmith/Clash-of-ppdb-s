class Buildable:
    def __init__(self, name, btype, function, upgradeFunction: list, upgradeResource, timeFunction):
        self.name = name
        self.type = btype
        self.function = function
        self.upgradeFunction = upgradeFunction,
        self.upgradeResource = upgradeResource
        self.timeFunction = timeFunction

    def to_dct(self):
        return dict(name=self.name, type=self.type, function=self.function, upgradeFunction=self.upgradeFunction,
                    upgradeResource=self.upgradeResource, timeFunction=self.timeFunction)


class Building(Buildable):
    def __init__(self, name, btype, function, upgradeFunction: list, upgradeResource, timeFunction, id, level, gridX,
                 gridY,
                 sid):
        Buildable.__init__(self, name, btype, function, upgradeFunction, upgradeResource, timeFunction)
        self.id = id
        self.level = level
        self.gridX = gridX
        self.gridY = gridY
        self.sid = sid

    def to_dct(self):
        return dict(name=self.name, type=self.type, function=self.function, upgradeFunction=self.upgradeFunction,
                    upgradeResource=self.upgradeResource, timeFunction=self.timeFunction, level=self.level,
                    id=self.id, gridX=self.gridX, gridY=self.gridY, sid=self.sid)


class BuildableDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect


class BuildingDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def instantiate(self, name, sid, gridX, gridY):
        """
        Instantiate a Building Object using the info from the database
        :param name:
        :param sid:
        :param gridX:
        :param gridY:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM buildable WHERE name=%s;', (name,))  # Retrieve buildable info
        buildable = cursor.fetchone()
        return Building(name, buildable[1], buildable[2], buildable[3], buildable[4], buildable[5], None, 1, gridX,
                        gridY, sid)
