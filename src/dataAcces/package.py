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

    @staticmethod
    def __upgradeCost(upgradeResource: int, amount: int):
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
        if function[0] == 0:  # [0,4000,0]: A zero at the begin, means that x should be calculate as 2^x
            x = int(exp2(x))
        return polyval(function, x)
