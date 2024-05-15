from random import randrange
from math import sqrt
from .building import *
from .friend import *
from .timer import *


class Settlement:
    def __init__(self, sid, name=None, mapX=None, mapY=None, pid=None, pname=None):
        self.id = sid
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
            if level is None:  # If the outpost is not yet created, no castle is present
                level = (0,)
        return level[0]

    def upgradeCastle(self, sid, outpost=False):
        """
        Helper function to adjust the info when a castle gets upgraded
        :param sid: Settlement Identifier
        :param outpost: Bool saying it's a normal Castle or SatelliteCastle
        """
        cursor = self.dbconnect.get_cursor()

        if not outpost:
            cursor.execute('SELECT level FROM building WHERE name=%s and sid=%s;', ("Castle", sid))
            level = cursor.fetchone()

            if level == 2:
                dct = dict(WoodCuttersCamp=2, Quarry=2, Farm=2, GrainSilo=2)
            elif level == 3:
                dct = dict(Steelmine=2, Farm=3, Barracks=2, WoodStockPile=2, StoneStockPile=2, Armory=2, GrainSilo=3)
            elif level == 4:
                dct = dict(WoodCuttersCamp=3, Quarry=3, SteelMine=3, Farm=4, GrainSilo=4)
            elif level == 5:
                dct = dict(WoodCuttersCamp=4, Quarry=4, Farm=5, Barracks=3, WoodStockPile=3, StoneStockPile=3, Armory=3,
                           GrainSilo=5)
            elif level == 6:
                dct = dict(SteelMine=4, Farm=6, WoodStockPile=4, StoneStockPile=4)
            elif level == 7:
                dct = dict(WoodCuttersCamp=5, Quarry=5, SteelMine=4, Farm=7, Barracks=4, GrainSilo=6)
            else:
                dct = dict()
        else:  # Satellite Castle differs from Castle
            cursor.execute('SELECT level FROM building WHERE name=%s and sid=%s;', ("SatelliteCastle", sid))
            level = cursor.fetchone()[0]

            if level == 1:
                dct = dict(WoodCuttersCamp=1, Quarry=1, Farm=1, SteelMine=1, Barracks=1)
            elif level == 2:
                dct = dict(Farm=2)
            elif level == 3:
                dct = dict(WoodCuttersCamp=2, Quarry=2, Farm=3, SteelMine=2, Barracks=2)
            elif level == 5:
                dct = dict(WoodCuttersCamp=3, Quarry=3, Farm=4, SteelMine=3)
            else:
                dct = dict()

        for key in dct.keys():  # Adjust the maxBuilding Number
            cursor.execute('UPDATE unlocked SET maxnumber = %s WHERE sid=%s and name=%s;', (dct[key], sid, key))

        self.dbconnect.commit()

    def upgradeBarracks(self, sid):
        """
        Helper function to adjust the unlocked soldiers for a barrack
        :param sid: Settlement Identifier
        """
        cursor = self.dbconnect.get_cursor()

        cursor.execute('SELECT level FROM building WHERE name=%s and sid=%s;', ("Barracks", sid))
        levels = cursor.fetchall()
        for level in levels:  # We can have multiple barracks
            if level == 3:
                lst = ["Militia", "LongbowMan", "Knight", "Pikeman", "Huskarl"]
            elif level == 6:
                lst = ["Skirmishers", "CrossbowMan", "WarElephant", "Halbardier", "OrderKnight"]
            else:  # Nothing needs to be done
                lst = []

            for soldier in lst:  # Adjust the maxBuilding Number
                cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);', (soldier, sid, -1))
                # Soldiers don't have a max amount

        self.dbconnect.commit()

    def getOwner(self, sid):
        """
        Returns the player name of the settlement owner
        :param sid: Identifier
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (sid,))
        return cursor.fetchone()[0]

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
            cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);',
                           (buildable, sid, 1))

        # Prebuild the Castle
        self.insertBuilding(Building('Castle', 'Government', None, None, None, None, None, 1, 6, 6, sid,
                                     [[6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
                                      [6, 15], [6, 16], [6, 17], [6, 18], [6, 19], [6, 20], [7, 6], [7, 7], [7, 8],
                                      [7, 9], [7, 10], [7, 11], [7, 12], [7, 13], [7, 14], [7, 15], [7, 16], [7, 17],
                                      [7, 18], [7, 19], [7, 20], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [8, 11],
                                      [8, 12], [8, 13], [8, 14], [8, 15], [8, 16], [8, 17], [8, 18], [8, 19], [8, 20],
                                      [9, 6], [9, 7], [9, 8], [9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14],
                                      [9, 15], [9, 16], [9, 17], [9, 18], [9, 19], [9, 20], [10, 6], [10, 7], [10, 8],
                                      [10, 9], [10, 10], [10, 11], [10, 12], [10, 13], [10, 14], [10, 15], [10, 16],
                                      [10, 17], [10, 18], [10, 19], [10, 20], [11, 6], [11, 7], [11, 8], [11, 9],
                                      [11, 10], [11, 11], [11, 12], [11, 13], [11, 14], [11, 15], [11, 16], [11, 17],
                                      [11, 18], [11, 19], [11, 20], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10],
                                      [12, 11], [12, 12], [12, 13], [12, 14], [12, 15], [12, 16], [12, 17], [12, 18],
                                      [12, 19], [12, 20], [13, 6], [13, 7], [13, 8], [13, 9], [13, 10], [13, 11],
                                      [13, 12], [13, 13], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19],
                                      [13, 20], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10], [14, 11], [14, 12],
                                      [14, 13], [14, 14], [14, 15], [14, 16], [14, 17], [14, 18], [14, 19], [14, 20],
                                      [15, 6], [15, 7], [15, 8], [15, 9], [15, 10], [15, 11], [15, 12], [15, 13],
                                      [15, 14], [15, 15], [15, 16], [15, 17], [15, 18], [15, 19], [15, 20], [16, 6],
                                      [16, 7], [16, 8], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13], [16, 14],
                                      [16, 15], [16, 16], [16, 17], [16, 18], [16, 19], [16, 20], [17, 6], [17, 7],
                                      [17, 8], [17, 9], [17, 10], [17, 11], [17, 12], [17, 13], [17, 14], [17, 15],
                                      [17, 16], [17, 17], [17, 18], [17, 19], [17, 20], [18, 6], [18, 7], [18, 8],
                                      [18, 9], [18, 10], [18, 11], [18, 12], [18, 13], [18, 14], [18, 15], [18, 16],
                                      [18, 17], [18, 18], [18, 19], [18, 20], [19, 6], [19, 7], [19, 8], [19, 9],
                                      [19, 10], [19, 11], [19, 12], [19, 13], [19, 14], [19, 15], [19, 16], [19, 17],
                                      [19, 18], [19, 19], [19, 20], [20, 6], [20, 7], [20, 8], [20, 9], [20, 10],
                                      [20, 11], [20, 12], [20, 13], [20, 14], [20, 15], [20, 16], [20, 17], [20, 18],
                                      [20, 19], [20, 20]]))

        # Preset Unlocked Status for each soldier
        cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);',
                       ('ArmoredFootman', sid, -1))  # Set max number to -1 aka unlimited
        cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);', ('Guardsman', sid, -1))
        cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);', ('Horseman', sid, -1))
        cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);', ('Bowman', sid, -1))
        cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);', ('Bandit', sid, -1))

        self.dbconnect.commit()

    def insertBuilding(self, building: Building):
        """
        Helper function to insert a Building into the database

        Also add an ID to the Object

        :param building: Data Object as defined in building.py
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        cursor.execute(
            'INSERT INTO building(name, level, gridx, gridy, sid, occuppiedcells) VALUES (%s,%s,%s,%s,%s,%s);',
            (building.name, building.level, building.gridX, building.gridY,
             building.sid, building.occupiedCells))  # Insert the Building
        cursor.execute('SELECT max(id) FROM building;')  # Retrieve building ID; gets added in database as SERIAL
        building.id = cursor.fetchone()[0]  # Set building ID

        self.dbconnect.commit()

    def reachedMaxBuildingAmount(self, bname, sid):
        """
        Helper Function
        Gives true if a given settlement may not have anymore buildings of this type
        :param bname: Name of the Building
        :param sid: Identifier of the Settlement
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT count(building.id) FROM building WHERE sid=%s and name=%s;',
                       (sid, bname))  # Retrieve the current amount of buildings for this type
        nrBuildings = cursor.fetchone()[0]

        cursor.execute('SELECT maxnumber FROM unlocked WHERE name=%s and sid=%s;',
                       (bname, sid))  # Retrieve the max amount of buildings for this type
        nrMax = cursor.fetchone()[0]

        return nrBuildings > nrMax  # Compare

    def calculateCosts(self, building, package_data_acces):
        """
        Helper function
        Verify if a settlement can afford building or upgrading a certain building
        If so, a deficit will be made
        If not, an exception is thrown
        :param package_data_acces: Database Connection for handling packages related info
        :param building: Building Object
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Calculate Upgrade Costs
        cost = PackageDataAccess.evaluate(building.upgradeFunction,
                                          building.level)  # Each type has a specific upgrade function with a
        # level as input

        # Make a Resource Deficit
        deficit = Package.upgradeCost(building.upgradeResource, cost)
        cursor.execute('SELECT * FROM package WHERE id IN (SELECT pid FROM settlement WHERE id=%s);',
                       (building.sid,))  # Get the current amount of resources
        total = cursor.fetchone()
        total = Package(total)  # Convert to Package Object
        total -= deficit  # Do arithmetic

        if total.hasNegativeBalance():  # Not enough resources :(
            raise Exception(total.deficitString())

        package_data_acces.update_resources(total)  # Adjust resource amount

    def placeBuilding(self, building: Building, package_data_acces):
        try:
            if self.reachedMaxBuildingAmount(building.name, building.sid):  # Verify if the max buildings is not reached
                raise Exception(
                    "You reached the max amount of buildings for this type! Consider upgrading your Castle.")

            self.calculateCosts(building,
                                package_data_acces)  # Verify if a settlement can afford this upgrade; throws an error if not

            self.insertBuilding(building)  # Insert the new building into the database

            # Notice: No timer is created, since new building will be build instantly

            self.dbconnect.commit()
            return True, ""
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    def upgradeBuilding(self, building: Building, package_data_acces, timer_data_acces, building_data_acces):
        try:
            building.level += 1  # We want to calculate the building cost for 1 level higher than the current
            self.calculateCosts(building, package_data_acces)  # Verifies if a settlement can afford this upgrade
            building.level -= 1  # It may not yet produce resource at the new level

            start, stop, duration = building_data_acces.calculateBuildTime(building)  # Create Timer
            timer = Timer(None, building.id, 'building', start, stop, duration, building.sid)
            timer_data_acces.insertTimer(timer)  # When
            # the timer stops, the level of the building will be adjusted

            self.dbconnect.commit()
            return True, timer
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    def trainTroop(self, sid, sname, amount, soldier_data_acces, package_data_acces, timer_data_acces):
        """
        If the soldier is unlocked: Tries to adjust the resource amount and creates a timer.
        Verifies conditions too (unlocked, enough resources)
        Gives back error messages if a condition is not met.
        :param sid: Identifier of the settlement
        :param sname: Name of the soldier
        :param amount: Number of troops needed to train in parallel
        :param soldier_data_acces: DB Acces
        :param package_data_acces: DB Acces
        :param timer_data_acces: DB Acces
        :return:
        """
        try:
            if not soldier_data_acces.unlocked(sid, sname):
                raise Exception("You have not yet unlocked this soldier! Consider upgrading your Castle or building Barracks.")
            if amount > soldier_data_acces.getBarrackLevelSum(sid):  # Verify amount correctness
                raise Exception(f"You can only train {soldier_data_acces.getBarrackLevelSum(sid)} in parallel!")

            cursor = self.dbconnect.get_cursor()  # Get DB acces

            # Retrieve training cost
            cursor.execute('SELECT cost, id FROM soldier WHERE name=%s;', (sname,))
            data = cursor.fetchone()
            cost = data[0] * amount
            soldierId = data[1]  # ID of the soldier

            # Make a Resource Deficit
            cursor.execute('SELECT * FROM package WHERE id IN (SELECT pid FROM settlement WHERE id=%s);',
                           (sid,))  # Get the current amount of resources
            total = cursor.fetchone()
            total = Package(total)  # Convert to Package Object
            total.steel -= cost  # Do minus

            if total.hasNegativeBalance():  # Not enough resources :(
                raise Exception(total.deficitString())
            package_data_acces.update_resources(total)  # Adjust resource amount

            start, stop, duration = soldier_data_acces.calculateTrainTime(sname, sid)  # Create Timer(s)
            timerList = []
            for i in range(0, amount):
                timer = Timer(None, soldierId, 'soldier', start, stop, duration, sid)
                timer_data_acces.insertTimer(timer)  # When the timer stops, soldier will be inserted
                timerList.append(timer)
            return True, timerList
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    def getGrid(self, sid):
        """
        Retrieves all buildings for a given settlement and puts them in a frontend usable matrix
        :param sid: Identifier of the settlement
        :return:
        """
        grid = []  # Matrix

        cursor = self.dbconnect.get_cursor()  # Execute query
        cursor.execute('SELECT * FROM building WHERE sid=%s;', (sid,))
        records = cursor.fetchall()

        for building in records:
            grid.append({"type": building[1], "position": [building[3], building[4]], "occupiedCells": building[6]})
        return grid

    def isOutPost(self, sid: int):
        """
        Helper function to verify if a settlement is an outpost or not
        :param sid:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS(SELECT name FROM building WHERE sid=%s AND name=%s);', (sid, 'SatelliteCastle'))
        return cursor.fetchone()[0]

    @staticmethod
    def calculateDistance(to: list, start: list):
        """
        Calc grid distance between 2 grid Coordinates (Euclidean distance)
        :param to: (x <INT> ,y <INT>)
        :param start: (x <INT> ,y <INT>)
        :return: int value expressing the distance
        """
        return sqrt(pow((to[0] - start[0]), 2) + pow((to[1] - start[1]), 2))

    def getNewCoordinate(self, x=-1, y=-1):
        """
        Generate new unique coordinates for new Settlements on the map
        (0,0) , (2,0) , (0,2) , (2,2) ...

        If x and y are not -1, we can verify for outposts if this coordinate is allowed!

        :return:
        """
        if x == -1 or y == -1:
            x = randrange(0, 50)
            y = randrange(0, 50)

        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT mapX, mapY FROM settlement;')
        coordinates = cursor.fetchall()

        for coord in coordinates:
            if SettlementDataAcces.calculateDistance(coord, [x, y]) < 5:
                return self.getNewCoordinate()
        return [x, y]

    def getMap(self, pname: str, friend_data_acces: FriendDataAccess, clan_data_acces):
        """
        Retrieve the info about the map; aka settlement coordinates
        :param friend_data_acces:
        :param pname: Name of the player
        :return:
        """
        # sid, gridX,gridY, level, isOutpost
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT id,mapX,mapY,pname FROM settlement;')  # Outposts to be created are owned by admin
        data = cursor.fetchall()
        sList = []

        for settlement in data:
            isAllied = clan_data_acces.areAllies(pname, settlement[3])
            isFriend = friend_data_acces.areFriends(pname, settlement[3])
            sList.append(dict(sid=settlement[0], position=[settlement[1], settlement[2]],
                              isOutpost=self.isOutPost(settlement[0]), level=self.getLevel(settlement[0]), me=pname == settlement[3], pname=settlement[3], isFriend=isFriend, isAllied=isAllied))
        return sList
