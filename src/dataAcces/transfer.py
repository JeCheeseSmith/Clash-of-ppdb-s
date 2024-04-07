from math import sqrt, inf
from .soldier import *
from .timer import *
from .package import *

class Transfer:
    def __init__(self, id, speed, sidto, discovered, sidfrom, pid, type):
        self.id = id
        self.speed = speed
        self.sidto = sidto
        self.discovered = discovered
        self.sidfrom = sidfrom
        self.pid = pid
        self.type = type

    def to_dct(self):
        return dict(id=self.id, speed=self.speed, sidto=self.sidto, discovered=self.discovered, sidfrom=self.sidfrom,
                    pid=self.pid, type=self.type)


class TransferDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def translatePosition(self, sid):
        """
        Translate a SID to a coordinate [x,y]
        :param sid: Settlement Identifier
        :return: [int,int]
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT mapX,mapY FROM settlement WHERE id=%s;', (sid,))
        return cursor.fetchone()

    def interceptPosition(self, tid, tid2):
        pass

    def determineSpeed(self, package: Package):
        """
        For bigger transfer amounts, another base speed is determined
        :param package:
        :return:
        """
        speed = 1
        speed += package.stone % 1000
        speed += package.wood % 1000
        speed += package.food % 1000
        speed += package.steel % 1000
        return speed

    def calculateDistance(self, to: list, start: list):
        """
        Calc grid distance between 2 grid Coordinates (Euclidean distance)
        :param to: (x <INT> ,y <INT>)
        :param start: (x <INT> ,y <INT>)
        :return: int value expressing the distance
        """
        return sqrt(pow((to[0] - start[0]), 2) + pow((to[1] - start[1]), 2))

    def calculateDuration(self, soldiers, soldier_data_acces: SoldierDataAccess, to: list, start: list):
        """
        Calculates the duration for a transfer
        :param soldier_data_acces: DB Acces
        :param to: (x <INT> ,y <INT>) Coordinate going to
        :param start: (x <INT> ,y <INT>) Coordinate going from
        :param soldiers: LIST[name,amount,transferable,discoverable]
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Retrieve the minimal speed
        speed = inf
        for soldier in soldiers:
            name = soldier[0]
            cursor.execute('SELECT speed FROM soldier WHERE name=%s;', (name,))
            speed = min(cursor.fetchone()[0], speed)

        distance = TransferDataAccess.calculateDistance(to, start)  # Calc distance

        return distance / speed  # Return time

    def createTransfer(self, sidTo, sidFrom, soldiers, resources, timer_data_access: TimerDataAccess, soldier_data_acces: SoldierDataAccess, package_data_acces: PackageDataAccess):
        try:
            cursor = self.dbconnect.get_cursor()  # DB Acces

            tp = Package(resources)  # Make a transferPackage
            cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (sidFrom,))
            pid = cursor.fetchone()[0]
            sp = package_data_acces.get_resources(pid)  # Instantiate a package for the settlement

            sp -= tp
            if sp.hasNegativeBalance():
                raise Exception(sp.deficitString())

            pid = package_data_acces.add_resources(tp)  # Add the package in the database

            cursor.execute('INSERT INTO transfer(sidto, discovered, sidfrom, pid) VALUES (%s,%s,%s,%s)', (sidTo,False,sidFrom,pid))
            cursor.execute('SELECT max(id) FROM transfer;')
            tid = cursor.fetchone()

            duration = self.calculateDuration(soldiers, soldier_data_acces,  self.translatePosition(sidTo), self.translatePosition(sidFrom)) * self.determineSpeed(tp)
            timer_data_access.insertTimer(Timer(None,))

            self.dbconnect.commit()
            return True, ""
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    def createEspionage(self):
        # Spionage fails at random -> Notify person being spionaged on
        # Spionaging a settlement also gives all resource transfers
        # Spionaging an attack gives soldier infos
        pass

    def createAttack(self):
        pass

    def createOutpost(self):
        pass

    def simulateTransfer(self):
        pass

    def simulateEspionage(self):
        """
        retrieve building info and soldiers: full reports
        :return:
        """
        pass

    def simulateAttack(self):
        pass

    def simulateOutpost(self):
        pass
