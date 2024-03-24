from numpy import polyval
from numpy import exp2

class Package:
    def __init__(self, args):
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
