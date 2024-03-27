from numpy import polyval
from numpy import exp2


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

    def calc_resources(self, timestamp):
        """
        Function to re-evaluate resources number with
        :return:
        """
        pass

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
        print(function, x)
        if isinstance(function, tuple):  # Prevent weird python bug where function is converted to a tuple of lists
            function = function[0]
        if function[0] == 0:  # [0,4000,0]: A zero at the beginning, means that x should be calculated as 2^x
            x = int(exp2(x))
        result =  int(polyval(function, x))
        print(result)
        return result
