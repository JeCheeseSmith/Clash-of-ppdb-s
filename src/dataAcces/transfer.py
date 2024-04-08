from math import inf
from .soldier import *
from .friend import *
from .timer import Timer, TimerDataAccess
from .package import *
from .settlement import *

class Transfer:
    def __init__(self, tid: int, discovered: bool, idTo: int, toType: bool, idFrom: int, fromType: bool, pid: int):
        self.id = tid
        self.discovered = discovered
        self.idTo = idTo
        self.toType = toType
        self.idFrom = idFrom
        self.fromType = fromType
        self.pid = pid

    def to_dct(self):
        return dict(id=self.id, sidto=self.idTo, discovered=self.discovered, sidfrom=self.idFrom,
                    pid=self.pid, toType=self.toType, fromType=self.fromType)


class TransferDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    @staticmethod
    def determineSpeed(package: Package):
        """
        For bigger transfer amounts, another base speed is determined
        :param package:
        :return:
        """
        speed = 1
        if package is not None:  # (None = Espionage or Attack)
            speed += package.stone % 1000
            speed += package.wood % 1000
            speed += package.food % 1000
            speed += package.steel % 1000
        return speed

    def __extent(self, soldierDict, discovered, transferable):
        """
        Helper function to add soldiers with amount 0 to the dictionary
        :param soldierDict:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT name FROM soldier;')
        names = cursor.fetchall()
        for name in names:
            if soldierDict.get(name[0]) is None:
                soldierDict[name[0]] = dict(amount=0, transferable=transferable, discovered=discovered)
        return soldierDict

    def __restructure(self, soldiers: list, discovered, transferable):
        """
        Helper function to reformat the list from frontend to a backend usable format
        :param soldiers:
        :param discovered:
        :return:
        """
        soldierDct = dict()
        for soldier in soldiers:
            soldierDct[soldier[0]] = dict(amount=soldier[1], transferable=soldier[2], discovered=discovered)
        return self.__extent(soldierDct, discovered, transferable)

    def translatePosition(self, oid, transfer):
        """
        Translate a SID to a coordinate [x,y]
        :param oid: Settlement or Transfer Identifier
        :param transfer: Bool indicating the id option
        :return: [int,int]
        """
        cursor = self.dbconnect.get_cursor()
        if transfer:  # If it's a transfer, we take the middle of the 2 sids
            cursor.execute('SELECT idTo,toType,idFrom, fromtype FROM transfer WHERE id=%s;', (oid,))
            ids = cursor.fetchone()
            sidTo = self.translatePosition(ids[0], ids[1])  # This can go recursively for transfers on transfers
            sidFrom = self.translatePosition(ids[2], ids[3])
            midX = int((sidTo[0] + sidFrom[0]) / 2)
            midY = int((sidTo[1] + sidFrom[1]) / 2)
            return [midX, midY]
        else:
            cursor.execute('SELECT mapX,mapY FROM settlement WHERE id=%s;', (oid,))
            return cursor.fetchone()

    @staticmethod
    def areInSameClan(sidTo, sidFrom, clan_data_acces: ClanDataAccess, settlement_data_acces: SettlementDataAcces):
        """
        Helper function to verify if 2 settlements are allies
        :param sidTo: Settlement Identifier 1
        :param sidFrom: Settlement Identifier 2
        :param clan_data_acces: Access DB
        :param settlement_data_acces: DB Access
        :return:
        """
        pname1 = settlement_data_acces.getOwner(sidTo)
        pname2 = settlement_data_acces.getOwner(sidFrom)
        return clan_data_acces.areAllies(pname1, pname2)

    @staticmethod
    def areFriends(sidTo, sidFrom, friend_data_acces: FriendDataAccess, settlement_data_acces: SettlementDataAcces):
        """
        Helper function to verify if 2 settlements are befriended
        :param sidTo: Settlement Identifier 1
        :param sidFrom: Settlement Identifier 2
        :param friend_data_acces: DB acces
        :param settlement_data_acces: acces DB
        :return:
        """
        pname1 = settlement_data_acces.getOwner(sidTo)
        pname2 = settlement_data_acces.getOwner(sidFrom)
        return friend_data_acces.areFriends(pname1, pname2)

    def doesIntercept(self, tid, tid2):
        # TODO Gives true if an attack on a transfer will succeed (this can change over time!) - see notes
        pass

    def calculateDuration(self, soldiers: dict, package: Package, to: list, start: list):
        """
        Calculates the duration for a transfer
        :param package:
        :param to: (x <INT> ,y <INT>) Coordinate going to
        :param start: (x <INT> ,y <INT>) Coordinate going from
        :param soldiers:
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        if soldiers is not None:
            speed = inf  # Retrieve the minimal speed
            for name in soldiers.keys():
                cursor.execute('SELECT speed FROM soldier WHERE name=%s;', (name,))
                speed = min(cursor.fetchone()[0], speed)
        else:  # Espionage
            speed = 1

        distance = SettlementDataAcces.calculateDistance(to, start)  # Calc distance

        duration = distance / speed * self.determineSpeed(package)
        start = datetime.now()
        stop = start + timedelta(seconds=duration)

        return start, stop, int(duration)  # Return time

    def updateResourceTroops(self, sidFrom: int, soldiers: dict, resources: list, package_data_acces: PackageDataAccess,
                             soldier_data_acces: SoldierDataAccess, discovered: bool, transferable: bool):
        """
        Helper function to update the resource and soldiers amounts in the settlement and insert the new correct data into the database
        :param transferable:
        :param discovered:
        :param sidFrom: Settlement Identifier we will subtract the soldiers from
        :param soldiers: Soldier Dict in backend format; item in dict is of the following format: {soldier_name: {'transferable': bool, 'amount': int, 'discovered': bool}}
        :param resources: Array of amounts 0: id, 1: stone , ...
        :param package_data_acces: DB Acces
        :param soldier_data_acces: DB Acces
        :return:
        """
        # Retrieve pid for the settlement sidFrom
        cursor = self.dbconnect.get_cursor()  # DB Acces
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (sidFrom,))
        pid = cursor.fetchone()

        # Instantiate packages
        tp = PackageWithSoldier(Package(resources), soldiers)  # transferPackage
        sp = PackageWithSoldier(package_data_acces.get_resources(pid),
                                self.__extent(soldier_data_acces.getTroops(sidFrom, 'settlement'), discovered,
                                              transferable))  # settlementPackage

        # Do arithmetic and verify result
        sp -= tp
        if sp.hasNegativeBalance():
            raise Exception(sp.deficitString())

        package_data_acces.add_resources(tp)  # Add the package in the database
        package_data_acces.update_resources(sp)  # Update the sp accordingly

        return tp  # Return Transfer Package with Troops

    def createTransfer(self, idTo: int, toType: bool, idFrom: int, fromType: bool, soldiers: list, resources: list, tType: str,
                       timer_data_access: TimerDataAccess,
                       package_data_acces: PackageDataAccess, clan_data_acces: ClanDataAccess,
                       friend_data_acces: FriendDataAccess, settlement_data_acces: SettlementDataAcces,
                       soldier_data_acces: SoldierDataAccess):
        try:
            cursor = self.dbconnect.get_cursor()  # DB Acces
            transferable = False
            print(idTo, toType, idFrom, fromType, soldiers, resources, tType)

            # TODO when an attack returns it might return from a tid, need support for that!

            # Verify they have the correct status to each other: friends or allies for transfers, None for outpost, enemies for attacks
            if tType == 'transfer':
                if not (TransferDataAccess.areInSameClan(idTo, idFrom, clan_data_acces, settlement_data_acces)
                        or TransferDataAccess.areFriends(idFrom, idTo, friend_data_acces, settlement_data_acces)):
                    raise Exception("You can't send a transfer to an enemy")

            elif tType == 'attack':
                if TransferDataAccess.areInSameClan(idTo, idFrom, clan_data_acces, settlement_data_acces) or TransferDataAccess.areFriends(idFrom, idTo, friend_data_acces, settlement_data_acces):
                    raise Exception("You can't attack your allies!")
                transferable = True

            # Restructure to a backend format
            soldiers = self.__restructure(soldiers, False, transferable)

            # Adjust resource & troop info
            tp = self.updateResourceTroops(idFrom, soldiers, resources, package_data_acces, soldier_data_acces, False,
                                           transferable)

            # Insert transfer into the database
            cursor.execute(
                'INSERT INTO transfer(idto, totype, idfrom, fromtype, discovered, pid) VALUES (%s,%s,%s,%s,%s,%s)',
                (idTo, toType, idFrom, fromType, False, tp.package.id))
            cursor.execute('SELECT max(id) FROM transfer;')  # Retrieve the tid
            tid = cursor.fetchone()

            # Add a timer
            start, stop, duration = self.calculateDuration(soldiers, tp.package, self.translatePosition(idTo, False),
                                                           self.translatePosition(idFrom, False))
            timer = Timer(None, tid, tType, start, stop, duration, idTo)
            timer_data_access.insertTimer(timer)

            self.dbconnect.commit()
            return True, timer
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    def createEspionage(self, idTo: int, sidFrom: int, toType: bool, timer_data_access: TimerDataAccess):
        cursor = self.dbconnect.get_cursor()

        # Retrieve pid from the package we're going to
        if toType:  # Transfer
            cursor.execute('SELECT pid FROM transfer WHERE id=%s;', (idTo,))
        else:  # Settlement
            cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (idTo,))
        pid = cursor.fetchone()[0]  # This will be added in the transfer

        # Insert transfer into the database
        cursor.execute(
            'INSERT INTO transfer(idto, totype, idfrom, fromtype, discovered, pid) VALUES (%s,%s,%s,%s,%s,%s)',
            (idTo, toType, sidFrom, False, False, pid))
        cursor.execute('SELECT max(id) FROM transfer;')  # Retrieve the tid
        tid = cursor.fetchone()[0]  # Transfer ID

        start, stop, duration = self.calculateDuration(None, None, self.translatePosition(idTo, toType),
                                                       self.translatePosition(sidFrom, False))
        timer = Timer(None, tid, 'espionage', start, stop, duration, idTo)
        timer_data_access.insertTimer(timer)
        return timer

    def createOutpost(self):
        pass
