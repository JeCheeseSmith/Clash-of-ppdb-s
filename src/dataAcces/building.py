from .package import *
from datetime import datetime, timedelta


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
                 sid, occupiedCells: list):
        Buildable.__init__(self, name, btype, function, upgradeFunction, upgradeResource, timeFunction)
        self.id = id
        self.level = level
        self.gridX = gridX
        self.gridY = gridY
        self.sid = sid
        self.occupiedCells = occupiedCells

    def to_dct(self):
        return dict(name=self.name, type=self.type, function=self.function, upgradeFunction=self.upgradeFunction,
                    upgradeResource=self.upgradeResource, timeFunction=self.timeFunction, level=self.level,
                    id=self.id, gridX=self.gridX, gridY=self.gridY, sid=self.sid, occupiedCells=self.occupiedCells)


class BuildableDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect


class BuildingDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def calculateBuildTime(self, building: Building):
        """
        Retrieves the building timeFunction and calculate (datetime format) the start (now()) , stop and duration for the upgrade
        :param building: Building Object
        :return: start: now() , stop: datetime, duration: int
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT timefunction from buildable where name=%s;', (building.name,))
        timeFunction = cursor.fetchone()[0]

        duration = PackageDataAccess.evaluate(timeFunction, building.level)
        start = datetime.now()
        stop = start + timedelta(seconds=duration)

        return start, stop, duration

    def retrieve(self, gridX, gridY, sid):
        """
        Instantiate a complete Building Object from existing data in the database
        :param gridX: X location
        :param gridY: Y location on the grid
        :param sid: Settlement Identifier
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM building WHERE sid=%s and gridx=%s and gridy=%s;', (sid, gridX, gridY))
        dataBuilding = cursor.fetchone()

        cursor.execute('SELECT * FROM buildable WHERE name=%s;', (dataBuilding[1],))
        dataBuildable = cursor.fetchone()

        return Building(dataBuildable[0], dataBuildable[1], dataBuildable[2], dataBuildable[3], dataBuildable[4],
                        dataBuildable[5], dataBuilding[0], dataBuilding[2], gridX, gridY, sid, dataBuilding[6])

    def instantiate(self, name, sid, gridX, gridY, occupiedCells):
        """
        Instantiate a Building Object using the info from the database
        :param name:
        :param sid:
        :param gridX:
        :param gridY:
        :param occupiedCells:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM buildable WHERE name=%s;', (name,))  # Retrieve buildable info
        buildable = cursor.fetchone()
        return Building(name, buildable[1], buildable[2], buildable[3], buildable[4], buildable[5], None, 1, gridX,
                        gridY, sid, occupiedCells)

    def moveBuilding(self, building: Building):
        """
        Update the occupied Cells & Position
        Remember: gridX & gridY is Unique!
        :param building: The building Object containing new cells & position
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()
            cursor.execute('UPDATE building SET gridX = %s, gridY= %s, occuppiedcells= %s  WHERE id=%s;', (building.gridX, building.gridY, building.occupiedCells, building.id))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False
