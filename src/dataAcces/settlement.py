from .package import *


class Settlement:
    def __init__(self, id, name=None, mapX=None, mapY=None, pid=None, pname=None):
        self.id = id
        self.name = name
        self.mapX = mapX
        self.mapY = mapY
        self.pid = pid
        self.pname = pname

    def to_dict(self):
        return dict(id=self.id, name=self.name, mapX=self.mapX, mapY=self.mapY, pid=self.pid, pname=self.pname)


class SettlementDataAcces:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
        self.latestMap = (2, 4)

    def getResources(self, obj):
        """
        Get the resource/Package information for a settlement
        :param obj: A settlement Object
        :return: Package in dct form
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pid FROM settlement WHERE settlement.id=%s;', (obj.id,))
        pid = cursor.fetchone()
        cursor.execute('SELECT * FROM package WHERE package.id=%s;', (pid,))
        return Package(cursor.fetchone()).to_dct()

    def createOutPost(self):
        pass

    def getNewCoordinate(self):
        """
        Generate new coordinates for new Settlements
        (0,0) , (2,0) , (0,2) , (2,2) ...
        :return:
        """
        x = self.latestMap[0]
        y = self.latestMap[1]
        if x == y:
            x += 2
        elif x > y:
            x = y
            y = self.latestMap[0]
        elif x < y:
            x += 2
        self.latestMap = (x, y)
        return self.latestMap
