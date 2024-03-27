from .package import *
from .building import *
from .timer import *


class Settlement:
    def __init__(self, id, name=None, mapX=None, mapY=None, pid=None, pname=None):
        self.id = id
        self.name = name
        self.mapX = mapX
        self.mapY = mapY
        self.pid = pid
        self.pname = pname

    def to_dct(self):
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
        packageData = cursor.fetchone()
        return Package(packageData).to_dct()

    def getLevel(self, sid):
        """
        Retrieve the level for a given settlement (Level of the Castle)
        :param sid: Settlement ID
        :return: Level
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT level FROM building WHERE sid=%s AND name=%s;', (sid, 'Castle'))
        level = cursor.fetchone()

        if level is None:
            cursor.execute('SELECT level FROM building WHERE sid=%s AND name=%s;',
                           (sid, 'SatelliteCastle'))  # An outpost online has a SatelliteCastle
            level = cursor.fetchone()

        return level

    def upgradeCastle(self, sid):
        # Upgrading the Castle is rather complicated and need to be presetted
        pass

    def initialise(self, sid):
        """
        Helper function which initialises standard data for a newly created settlement
        :param sid: ID of the Settlement
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Preset Unlocked Status for each building (All are unlocked at start)
        cursor.execute('SELECT name FROM buildable;')
        buildings = cursor.fetchall()
        for buildable in buildings:
            cursor.execute('INSERT INTO unlockedbuildable(bname, sid, maxnumber) VALUES(%s,%s,%s);',
                           (buildable, sid, 1))

        # Prebuild the Castle
        self.insertBuilding(Building('Castle', 'Government', None, None, None, None, None, 1, 0, 0, sid, []))

        ### TODO Add OCCUPIEDCells for Castle

        # Preset Unlocked Status for each soldier
        cursor.execute('INSERT INTO unlockedsoldier(sname, sid, maxnumber) VALUES(%s,%s,%s);',
                       ('ArmoredFootman', sid, -1))  # Set maxnumber to -1 aka unlimited
        cursor.execute('INSERT INTO unlockedsoldier(sname, sid, maxnumber) VALUES(%s,%s,%s);', ('Guardsman', sid, -1))
        cursor.execute('INSERT INTO unlockedsoldier(sname, sid, maxnumber) VALUES(%s,%s,%s);', ('Horseman', sid, -1))
        cursor.execute('INSERT INTO unlockedsoldier(sname, sid, maxnumber) VALUES(%s,%s,%s);', ('Bowman', sid, -1))
        cursor.execute('INSERT INTO unlockedsoldier(sname, sid, maxnumber) VALUES(%s,%s,%s);', ('Bandit', sid, -1))

        self.dbconnect.commit()

    def insertBuilding(self, building: Building):
        """
        Helper function to insert a Building into the database

        Also add an ID to the Object

        :param building: Data Object as defined in building.py
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        cursor.execute('INSERT INTO building(name, level, gridx, gridy, sid, occuppiedcells) VALUES (%s,%s,%s,%s,%s,%s);',
                       (building.name, building.level, building.gridX, building.gridY,
                        building.sid, building.occupiedCells))  # Insert the Building
        cursor.execute('SELECT max(id) FROM building;')  # Retrieve building ID; gets added in database as SERIAL
        building.id = cursor.fetchone()[0]  # Set building ID

        self.dbconnect.commit()

    def reachedMaxBuildingAmount(self, bname, sid):
        """
        Gives true if a given settlement may not have anymore buildings of this type
        :param bname: Name of the Building
        :param sid: Identifier of the Settlement
        :return:
        """

        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT count(building.id) FROM building WHERE sid=%s and name=%s;', (sid, bname))  # Retrieve the current amount of buildings for this type
        nrBuildings = cursor.fetchone()[0]

        cursor.execute('SELECT maxnumber FROM unlockedbuildable WHERE bname=%s and sid=%s;', (bname, sid)) # Retrieve the max amount of buildings for this type
        nrMax = cursor.fetchone()[0]

        return nrBuildings > nrMax  # Compare

    def placeBuilding(self, building: Building, package_data_acces, timer_data_acces, building_data_acces):
        try:
            cursor = self.dbconnect.get_cursor()

            # Verify if the max buildings is not reached
            if self.reachedMaxBuildingAmount(building.name, building.sid):
                return False

            # Calculate Upgrade Costs
            cost = PackageDataAccess.evaluate(building.upgradeFunction,
                                              building.level)  # Each type has a specific upgrade function with a
            # level as input

            # Make a Resource Deficit
            deficit = Package.upgradeCost(building.upgradeResource, cost)
            cursor.execute('SELECT * FROM package WHERE id IN (SELECT pid FROM settlement WHERE id=1);',
                           (building.sid,))  # Get the current amount of resources
            total = cursor.fetchone()
            total = Package(total)  # Convert to Package Object
            total -= deficit  # Do arithmetic

            if total.hasNegativeBalance():  # Not enough resources :(
                raise Exception()

            # Insert into Database & Adjust resource amount
            self.insertBuilding(building)
            package_data_acces.update_resources(total)

            # Create Timer
            start, stop, duration = building_data_acces.calculateBuildTime(building)
            timer_data_acces.insertTimer(Timer(building.id, 'building', start, stop, duration, building.sid))

            self.dbconnect.commit()
            return True
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False

    def getBuildings(self, id):
        pass

    def createOutPost(self):
        pass

    def getNewCoordinate(self):
        """
        Generate new unique coordinates for new Settlements on the map
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
