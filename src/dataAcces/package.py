from numpy import polyval
from numpy import exp2
from datetime import datetime


class Package:
    def __init__(self, args):
        """
        Standard constructor
        :param args: 0: id, 1: stone, 2: wood, 3: steel, 4: food, 5: gems, 6: xp
        """
        self.id = args[0]
        self.stone = args[1]
        self.wood = args[2]
        self.steel = args[3]
        self.food = args[4]
        self.gems = args[5]
        self.xp = args[6]

    def to_dct(self):
        return dict(id=self.id, stone=self.stone, wood=self.wood, steel=self.steel, food=self.food, gems=self.gems,
                    xp=self.xp)

    def deficitString(self):
        """
        Helper function to make an error message for the lack of resources

        PRECONDITION: Must be called on a package with negative amounts
        :return:
        """
        error = "Not enough resources to continue your action. You lack the following:"
        if self.stone < 0:
            error += " Stone: " + str(self.stone)
        if self.wood < 0:
            error += " Wood: " + str(self.wood)
        if self.food < 0:
            error += " Food: " + str(self.food)
        if self.steel < 0:
            error += " Steel: " + str(self.steel)
        return error

    def __add__(self, other):
        """
        Overload of + operator to calculate the sum of packages
        :param other: Package Object to take the sum with
        :return: Result
        """
        self.stone += other.stone
        self.wood += other.wood
        self.steel += other.steel
        self.food += other.steel
        self.gems += other.gems
        self.xp += other.xp
        return self

    def __neg__(self):
        """
        Overloaded negation operator
        :return:
        """
        self.stone *= -1
        self.wood *= -1
        self.steel *= -1
        self.food *= -1
        self.gems *= -1
        self.xp *= -1
        return self

    def __sub__(self, other):
        """
        Overload of - operator to calculate the difference of packages
        :param other: Package Object to take the difference with
        :return: Result
        """
        self.stone -= other.stone
        self.wood -= other.wood
        self.steel -= other.steel
        self.food -= other.steel
        self.gems -= other.gems
        self.xp -= other.xp
        return self

    @staticmethod
    def upgradeCost(upgradeResource: int, amount: int):
        """
        Helper function to transform an upgradeResource and an amount into package
        :param upgradeResource: Identifier for the resource type/Index Array
        :param amount: Number of resources
        :return:
        """
        if upgradeResource == 1:  # Stone
            return Package([0, amount, 0, 0, 0, 0, 0])
        elif upgradeResource == 2:  # Wood
            return Package([0, 0, amount, 0, 0, 0, 0])
        elif upgradeResource == 3:
            return Package([0, 0, 0, amount, 0, 0, 0])
        elif upgradeResource == 4:
            return Package([0, 0, 0, 0, amount, 0, 0])
        elif upgradeResource == 12:  # E.g. Stone AND Wood
            return Package([0, amount, amount, 0, 0, 0, 0])

    def hasNegativeBalance(self):
        """
        Returns True if any of the resource has a negative amount
        :return:
        """
        if self.stone < 0:
            return True
        elif self.wood < 0:
            return True
        elif self.steel < 0:
            return True
        elif self.wood < 0:
            return True
        else:
            return False


class PackageDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def get_resources(self, pid):
        """
        Retrieve a Package object for a given id
        :param pid: Package ID in database
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM package WHERE id=%s;', pid)
        return Package(cursor.fetchone())

    def add_resources(self, package):
        """
        Creates a new package in the database
        :param package: Package Object
        :return: ID of the package in the database
        """

        # Insert into the database
        cursor = self.dbconnect.get_cursor()
        cursor.execute('INSERT INTO package(stone,wood,steel,food,xp,gems) VALUES(%s,%s,%s,%s,%s,%s);',
                       (package.stone, package.wood, package.steel, package.food, package.xp, package.gems))

        # Retrieved pid
        cursor.execute('SELECT max(id) FROM package;')
        pid = cursor.fetchone()
        package.id = pid

        self.dbconnect.commit()

        return pid

    def update_resources(self, package):
        """
        Updates the values of an already existing package in the database
        :param package: Package Object
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('UPDATE package SET stone = %s , wood = %s , steel = %s , food = %s , gems = %s , '
                       'xp = %s WHERE id=%s;',
                       (package.stone, package.wood, package.steel, package.food, package.gems, package.xp,
                        package.id))
        self.dbconnect.commit()

    def calc_resources(self, pname, timestamp):
        """
        Function to re-evaluate resources number with
        :return:
        """

        cursor = self.dbconnect.get_cursor()

        # Tijd omzetten van een string naar een timestamp en het verschil berekenen tussen twee timestamps
        timestamp_new = datetime.strptime(timestamp, "%Y-%m-%d %H:%M:%S.%f")
        time = datetime.now()
        calculated_time = abs(time - timestamp_new)
        calculated_time = int(calculated_time.total_seconds())

        # Generated resources
        Generated_wood = 0
        Generated_stone = 0
        Generated_steel = 0
        Generated_food = 0

        # Player resources
        cursor.execute('SELECT name FROM player WHERE name=%s;', (pname,))
        name = cursor.fetchone()
        cursor.execute('SELECT pid FROM settlement WHERE pname=%s;', name)
        pid = cursor.fetchone()[0]
        cursor.execute('SELECT wood FROM package WHERE id=%s;', (pid,))
        Pwood = cursor.fetchone()[0]
        cursor.execute('SELECT stone FROM package WHERE id=%s;', (pid,))
        Pstone = cursor.fetchone()[0]
        cursor.execute('SELECT steel FROM package WHERE id=%s;', (pid,))
        Psteel = cursor.fetchone()[0]
        cursor.execute('SELECT food FROM package WHERE id=%s;', (pid,))
        Pfood = cursor.fetchone()[0]

        # Maximum storage
        Wood = 0
        Stone = 0
        Steel = 0
        Food = 0

        # Search the person his buildings on the settlement
        cursor.execute('SELECT name FROM player WHERE name=%s;', (pname,))
        name = cursor.fetchone()
        cursor.execute('SELECT id FROM settlement WHERE pname=%s;', name)
        sid = cursor.fetchone()[0]
        cursor.execute('SELECT * FROM building WHERE sid=%s;', (sid,))
        buildings = cursor.fetchall()

        # Find the right functions to calculate the resources
        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("WoodCuttersCamp",))
        Wood_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("Quarry",))
        Stone_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("SteelMine",))
        Steel_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("Farm",))
        Food_function = cursor.fetchone()[0]

        # Find the right storage functions
        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("WoodStockPile",))
        Wood_Storage_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("StoneStockPile",))
        Stone_Storage_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("Armory",))
        Steel_Storage_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("GrainSilo",))
        Food_Storage_function = cursor.fetchone()[0]

        cursor.execute('SELECT function FROM buildable WHERE name=%s;', ("Castle",))
        Castle_Storage_function = cursor.fetchone()[0]

        # Check if there is a building to generate resources OR to store resources
        for building in buildings:
            if building[1] == "WoodCuttersCamp":
                print("test")
                Generated_wood += PackageDataAccess.evaluate(Wood_function, calculated_time)
            if building[1] == "Quarry":
                Generated_stone += PackageDataAccess.evaluate(Stone_function, calculated_time)

            if building[1] == "SteelMine":
                Generated_steel += PackageDataAccess.evaluate(Steel_function, calculated_time)

            if building[1] == "Farm":
                Generated_food += PackageDataAccess.evaluate(Food_function, calculated_time)

            if building[1] == "WoodStockPile":
                Level = building[2]
                Wood += PackageDataAccess.evaluate(Wood_Storage_function, Level)

            if building[1] == "StoneStockPile":
                Level = building[2]
                Stone += PackageDataAccess.evaluate(Stone_Storage_function, Level)

            if building[1] == "Armory":
                Level = building[2]
                Steel += PackageDataAccess.evaluate(Steel_Storage_function, Level)

            if building[1] == "GrainSilo":
                Level = building[2]
                Food += PackageDataAccess.evaluate(Food_Storage_function, Level)

            if building[1] == "Castle":
                Level = building[2]
                MainStorage = PackageDataAccess.evaluate(Castle_Storage_function, Level)
                Wood += MainStorage
                Stone += MainStorage
                Steel += MainStorage
                Food += MainStorage

        # Updaten van resources op de juiste manier

        # Problemen met het berekenen van resources door gebruik te maken van tijd in seconden onze functie is niet accuraat
        # De gebouwen die resources generaten upgraden niet op de juiste manier

        self.dbconnect.commit()

    def get_soldiers(self):
        """
        Method to get all soldiers contained in this package
        :return:
        """
        pass

    @staticmethod
    def evaluate(function: list, x: int):
        """
        Evaluate a 'function' according to our format
        :param function: [500,5,10] means 500x^2 + 5x + 10
        :param x: Variable in the function
        :return:
        """
        if isinstance(function, tuple):  # Prevent weird python bug where function is converted to a tuple of lists
            function = function[0]
        if function[0] == 0:  # [0,4000,0]: A zero at the beginning, means that x should be calculated as 2^x
            x = int(exp2(x))
        result = int(polyval(function, x))
        return result
