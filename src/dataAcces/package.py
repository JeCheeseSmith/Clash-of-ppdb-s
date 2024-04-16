from numpy import polyval
from numpy import exp2
from abc import abstractmethod


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

    @abstractmethod
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

    @abstractmethod
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

    @abstractmethod
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

    @abstractmethod
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

    @abstractmethod
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


class PackageWithSoldier:
    """
    Specialised Class to ease arithmetic with Soldier Amounts

    We chose to implement this as a composition class do certainly not disturb any other functionality which was already written
    """

    def __init__(self, package: Package, soldiers):
        """
        :param package: See Package Class
        :param soldiers: Dict: [soldier.name]: {amount}
        It is important that all possible soldiers are present in this dict!
        """
        self.package = package
        self.soldiers = soldiers

    def hasNegativeBalance(self):
        if self.package.hasNegativeBalance():
            return True
        else:
            for name in self.soldiers.keys():
                if self.soldiers[name]['amount'] < 0:
                    return True
        return False

    def deficitString(self):
        deficitString = "You lack the following amounts of soldiers: "
        for name in self.soldiers.keys():
            amount = self.soldiers[name]['amount']
            if amount < 0:
                deficitString += name + ", " + str(amount) + " "

        if self.package.hasNegativeBalance():
            deficitString += " | " + self.package.deficitString()

        return deficitString

    def __neg__(self):
        self.package = -self.package
        for name in self.soldiers.keys():
            self.soldiers[name]["amount"] = - self.soldiers[name]["amount"]
        return self

    def __add__(self, other):
        """
        :param other:
        :return:
        """
        self.package += other.package
        for name in self.soldiers.keys():
            self.soldiers[name]["amount"] += other.soldiers[name]["amount"]
        return self

    def __sub__(self, other):
        self + (-other)
        other = - other  # Reset negation of other
        return self


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
        cursor.execute('SELECT * FROM package WHERE id=%s;', (pid,))
        return Package(cursor.fetchone())

    def add_resources(self, package):
        """
        Creates a new package in the database
        Possible add all troops
        :param package: Package Object
        :return: ID of the package in the database
        """
        cursor = self.dbconnect.get_cursor()

        # Insert resources into the database
        if isinstance(package, PackageWithSoldier):
            cursor.execute('INSERT INTO package(stone,wood,steel,food,xp,gems) VALUES(%s,%s,%s,%s,%s,%s);',
                           (package.package.stone, package.package.wood, package.package.steel, package.package.food,
                            package.package.xp, package.package.gems))
        elif isinstance(package, Package):
            cursor.execute('INSERT INTO package(stone,wood,steel,food,xp,gems) VALUES(%s,%s,%s,%s,%s,%s);',
                           (package.stone, package.wood, package.steel, package.food, package.xp, package.gems))

        # Retrieved pid
        cursor.execute('SELECT max(id) FROM package;')
        pid = cursor.fetchone()

        # Set pid
        if isinstance(package, PackageWithSoldier):
            package.package.id = pid
        elif isinstance(package, Package):
            package.id = pid

        # Insert data for each soldier
        if isinstance(package, PackageWithSoldier):
            for soldier in package.soldiers.keys():
                amount = package.soldiers[soldier]['amount']
                discovered = package.soldiers[soldier]['discovered']
                if amount != 0:
                    cursor.execute(
                        'INSERT INTO troops(pid, sname, amount, discovered) VALUES (%s, %s, %s, %s);',
                        (package.package.id, soldier, amount, discovered))

        self.dbconnect.commit()

        return pid

    def update_resources(self, package):
        """
        Updates the values of an already existing package in the database
        :param package: Package Object
        """
        cursor = self.dbconnect.get_cursor()

        if isinstance(package, Package):
            cursor.execute('UPDATE package SET stone = %s , wood = %s , steel = %s , food = %s , gems = %s , '
                           'xp = %s WHERE id=%s;',
                           (package.stone, package.wood, package.steel, package.food, package.gems, package.xp,
                            package.id))
        elif isinstance(package, PackageWithSoldier):
            self.update_resources(package.package)
            for soldier in package.soldiers.keys():  # Update data for each soldier
                amount = package.soldiers[soldier]['amount']
                discovered = package.soldiers[soldier]['discovered']

                if amount != 0:  # Don't insert useless info
                    # Check if we need to insert or update this troop!
                    cursor.execute('SELECT EXISTS(SELECT sname,pid FROM troops WHERE sname=%s AND pid=%s);',
                                   (soldier, package.package.id))

                    if cursor.fetchone()[0]:  # It exists, so update
                        cursor.execute(
                            'UPDATE troops SET amount = %s ,discovered = %s WHERE pid=%s AND sname=%s;',
                            (amount, discovered, package.package.id, soldier))
                    else:  # Insert
                        cursor.execute(
                            'INSERT INTO troops(pid, sname, amount,discovered) VALUES (%s, %s, %s, %s);',
                            (package.package.id, soldier, amount, discovered))

        self.dbconnect.commit()

    def calc_consumption(self, sid, calculated_time=1):
        """
        Retrieves the amount of food per time unit consumed in a settlement
        :param calculated_time:
        :param sid: Identifier of the settlement
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (sid,))
        pid = cursor.fetchone()[0]  # Retrieve package id

        # Check how many soldiers there are and calculate there consumption
        cursor.execute('SELECT * FROM troops WHERE pid=%s;', (pid,))
        Soldiers = cursor.fetchall()

        Total_Consumption = 0

        # Calculate for every soldier what he/she consumes
        for soldier in Soldiers:
            cursor.execute('SELECT consumption FROM soldier WHERE name=%s;', (soldier[1],))
            Consumption = cursor.fetchone()[0]
            C = calculated_time * Consumption
            C *= soldier[2]
            Total_Consumption += C

        return Total_Consumption

    def calc_resources(self, sid, start, stop):
        """
        Function to re-evaluate resources number with
        start: Start Time of the interval to calculate resource from
        stop: end time towards resources need to be calculated
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        if start is None:  # Logout time from player needs to be used & updated
            cursor.execute('SELECT logout FROM player WHERE name IN (SELECT pname FROM settlement WHERE id=%s);',
                           (sid,))
            start = cursor.fetchone()[0]
        cursor.execute('UPDATE player SET logout = %s WHERE name IN (SELECT pname FROM settlement WHERE id=%s);',
                       (stop, sid))

        # Calculated difference in timestamp
        calculated_time = abs(start - stop)
        calculated_time = int(calculated_time.total_seconds())
        calculated_time = calculated_time / 3600  # Calculation in hour

        # Generated resources
        Generated_wood = 0
        Generated_stone = 0
        Generated_steel = 0
        Generated_food = 0

        # Player resources
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (sid,))
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
                Level = building[2]
                Generated_wood += PackageDataAccess.evaluate(Wood_function, calculated_time) * Level
            if building[1] == "Quarry":
                Level = building[2]
                Generated_stone += PackageDataAccess.evaluate(Stone_function, calculated_time) * Level

            if building[1] == "SteelMine":
                Level = building[2]
                Generated_steel += PackageDataAccess.evaluate(Steel_function, calculated_time) * Level

            if building[1] == "Farm":
                Level = building[2]
                Generated_food += PackageDataAccess.evaluate(Food_function, calculated_time) * Level

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

        # Check how many soldiers there are and calculate there consumption
        cursor.execute('SELECT * FROM troops WHERE pid=%s;', (pid,))
        Soldiers = cursor.fetchall()

        Total_Consumption = int(self.calc_consumption(sid, calculated_time))

        # Update the resources in the right way
        Newp_wood = round(min(Generated_wood + Pwood, Wood))
        Newp_stone = round(min(Generated_stone + Pstone, Stone))
        Newp_steel = round(min(Generated_steel + Psteel, Steel))
        Newp_food = round(min(Generated_food + Pfood - Total_Consumption, Food))

        # Check for possible troop starvation
        for soldier in Soldiers:
            cursor.execute('SELECT consumption FROM soldier WHERE name=%s;', (soldier[1],))
            Consumption = cursor.fetchone()[0]
            if Newp_food >= 0:
                break
            for i in range(1, soldier[2] + 1):
                Newp_food += Consumption
                if i == soldier[2]:
                    cursor.execute('DELETE FROM troops WHERE pid=%s and sname=%s;', (pid, soldier[1],))
                else:
                    cursor.execute('UPDATE troops SET amount = %s WHERE pid=%s;', (soldier[2] - i, pid,))
                if Newp_food >= 0:
                    break
            if Newp_food >= 0:
                break

        Newp_food = round(max(Newp_wood, 0))  # Food can't be negative

        # Update all resources
        cursor.execute('UPDATE package SET stone = %s , wood = %s , steel = %s , food = %s  WHERE id=%s;',
                       (Newp_stone, Newp_wood, Newp_steel, Newp_food, pid))
        self.dbconnect.commit()

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
