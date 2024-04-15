from math import inf
from .soldier import *
from .friend import *
from .settlement import *


class Transfer:
    def __init__(self, tid: int, discovered: bool, idTo: int, toType: bool, idFrom: int, fromType: bool, pid: int,
                 pname: str):
        self.id = tid
        self.discovered = discovered
        self.idTo = idTo
        self.toType = toType
        self.idFrom = idFrom
        self.fromType = fromType
        self.pid = pid
        self.pname = pname

    def to_dct(self):
        return dict(id=self.id, idTo=self.idTo, discovered=self.discovered, idFrom=self.idFrom,
                    pid=self.pid, toType=self.toType, fromType=self.fromType, pname=self.pname)


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

    def extent(self, soldierDict, discovered):
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
                soldierDict[name[0]] = dict(amount=0, discovered=discovered)
        return soldierDict

    def __restructure(self, soldiers: list, discovered):
        """
        Helper function to reformat the list from frontend to a backend usable format
        :param soldiers:
        :param discovered:
        :return:
        """
        soldierDct = dict()
        for soldier in soldiers:
            soldierDct[soldier[0]] = dict(amount=soldier[1], discovered=discovered)
        return self.extent(soldierDct, discovered)

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

    def areEnemies(self, idFrom, fromType, idTo, toType, friend_data_acces, clan_data_acces):
        """
        Helper function which verifies if 2 objects are befriended or not
        :param idFrom:
        :param fromType:
        :param idTo:
        :param toType:
        :param friend_data_acces:
        :param clan_data_acces:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        if toType:  # Going to a transfer; retrieve transfer owner
            cursor.execute('SELECT pname FROM transfer WHERE id=%s;', (idTo,))
        else:
            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (idTo,))
        pname1 = cursor.fetchone()[0]

        if fromType:
            cursor.execute('SELECT pname FROM transfer WHERE id=%s;', (idFrom,))
        else:
            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (idFrom,))
        pname2 = cursor.fetchone()[0]

        return not (friend_data_acces.areFriends(pname1, pname2) or clan_data_acces.areAllies(pname1, pname2))

    def getNumberOfSettlements(self, sid: int):
        """
        Retrieve the number of settlements for a player
        :param sid: Identifier of the main settlement of a player
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT count(id) FROM settlement WHERE pname IN (SELECT pname FROM settlement WHERE id=%s);',
                       (sid,))
        return cursor.fetchone()[0]

    def getMaxNumberOfSettlements(self, sid: int):
        """
        Retrieve the maximal number of settlements a user may have (= Chancery level + 1)
        :param sid: Settlement Identifier
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT level FROM building WHERE sid=%s and name=%s;', (sid, 'Chancery'))
        return cursor.fetchone()[0] + 1

    def hasChancery(self, sid: int):
        """
        Verify if a settlement contains a chancery and may create an outpost
        :param sid: Settlement ID
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS(SELECT id FROM building WHERE sid=%s and name=%s);', (sid, 'Chancery'))
        return cursor.fetchone()[0]

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

    def instantiatePackageWithSoldiers(self, pid, soldier_data_acces, package_data_acces):
        """
        Helper function to create PackageWithSoldier from database info
        :param pid:
        :param soldier_data_acces:
        :param package_data_acces:
        :return:
        """
        return PackageWithSoldier(package_data_acces.get_resources(pid),
                                  self.extent(soldier_data_acces.getTroops(pid, 'package'), False))

    def instantiateTransfer(self, tid: int):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM transfer WHERE id=%s;', (tid,))
        data = cursor.fetchone()
        if data is None:
            return None
        return Transfer(tid, data[1], data[2], data[3], data[4], data[5], data[6], data[7])

    def returnToBase(self, transfer: Transfer, timer_data_access, soldier_data_acces, package_data_acces):
        """
        Helper function to delete the current transfer and make a new transfer towards home (idFrom)
        :param package_data_acces:
        :param soldier_data_acces:
        :param timer_data_access:
        :param transfer: Old transfer
        """
        cursor = self.dbconnect.get_cursor()
        oldTid = transfer.id
        cursor.execute("SELECT id FROM timer WHERE oid=%s and type IN('attack','outpost','transfer')", (oldTid,))
        originalTimerID = cursor.fetchone()[0]  # Already get the original timer ID before we make any changes

        if transfer.toType:  # If we went to a transfer x, the start location will be the end of x
            cursor.execute('SELECT idTo FROM transfer WHERE id=%s;', (transfer.idTo,))
            transfer.idTo = cursor.fetchone()[0]
            # TODO Unsure if this works in frontend, since it goes towards the same settlement now
        # else:  # We went to a settlement, now leaving from there: transfer data doesn't need to be adjusted

        # Make a resource transfer back home
        cursor.execute(
            'INSERT INTO transfer(idto, totype, idfrom, fromtype, discovered, pid, pname) VALUES (%s,%s,%s,%s,%s,%s,%s)',
            (transfer.idFrom, False, transfer.idTo, False, True, transfer.pid,
             transfer.pname))  # Insert new transfer into the database
        cursor.execute('SELECT max(id) FROM transfer;')  # Retrieve the tid
        transfer.id = cursor.fetchone()[0]

        # Add a new timer
        start, stop, duration = self.calculateDuration(soldier_data_acces.getTroops(transfer.pid, 'package'),
                                                       package_data_acces.get_resources(transfer.pid),
                                                       self.translatePosition(transfer.idTo, transfer.toType),
                                                       self.translatePosition(transfer.idFrom, transfer.fromType))
        timer = Timer(None, transfer.id, 'transfer', start, stop, duration, transfer.idTo)
        timer_data_access.insertTimer(timer)

        # Delete the old transfer and old timer in the database (package is recycled)
        cursor.execute('DELETE FROM transfer WHERE id=%s;', (oldTid,))
        cursor.execute('DELETE FROM timer WHERE id=%s;', (originalTimerID,))

        # Commit Data
        self.dbconnect.commit()

    def updateResourceTroops(self, sidFrom: int, soldiers: dict, resources: list, package_data_acces: PackageDataAccess,
                             soldier_data_acces: SoldierDataAccess, discovered: bool):
        """
        Helper function to update the resource and soldiers amounts in the settlement and insert the new correct data into the database
        :param discovered:
        :param sidFrom: Settlement Identifier we will subtract the soldiers from
        :param soldiers: Soldier Dict in backend format; item in dict is of the following format: {soldier_name: {'amount': int, 'discovered': bool}}
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
                                self.extent(soldier_data_acces.getTroops(sidFrom, 'settlement'),
                                            discovered))  # settlementPackage

        # Do arithmetic and verify result
        sp -= tp
        if sp.hasNegativeBalance():
            raise Exception(sp.deficitString())

        package_data_acces.add_resources(tp)  # Add the package in the database
        package_data_acces.update_resources(sp)  # Update the sp accordingly

        return tp  # Return Transfer Package with Troops

    def createTransfer(self, idTo: int, toType: bool, idFrom: int, fromType: bool, soldiers: list, resources: list,
                       tType: str, pname: str,
                       timer_data_access: TimerDataAccess,
                       package_data_acces: PackageDataAccess, clan_data_acces: ClanDataAccess,
                       friend_data_acces: FriendDataAccess,
                       soldier_data_acces: SoldierDataAccess):
        try:
            cursor = self.dbconnect.get_cursor()  # DB Acces

            if tType == 'attack':  # You can only attack enemies!
                if not self.areEnemies(idFrom, fromType, idTo, toType, friend_data_acces, clan_data_acces):
                    raise Exception("You can't attack your allies!")

            # Restructure to a backend format
            soldiers = self.__restructure(soldiers, False)

            # Adjust resource & troop info
            tp = self.updateResourceTroops(idFrom, soldiers, resources, package_data_acces, soldier_data_acces, False)

            # Insert transfer into the database
            cursor.execute(
                'INSERT INTO transfer(idto, totype, idfrom, fromtype, discovered, pid, pname) VALUES (%s,%s,%s,%s,%s,%s,%s)',
                (idTo, toType, idFrom, fromType, False, tp.package.id, pname))
            cursor.execute('SELECT max(id) FROM transfer;')  # Retrieve the tid
            tid = cursor.fetchone()[0]

            # Add a timer
            start, stop, duration = self.calculateDuration(soldiers, tp.package, self.translatePosition(idTo, toType),
                                                           self.translatePosition(idFrom, fromType))
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

        # Retrieve player name
        cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (sidFrom,))
        pname = cursor.fetchone()[0]

        # Insert transfer into the database
        cursor.execute(
            'INSERT INTO transfer(idto, totype, idfrom, fromtype, discovered, pid, pname) VALUES (%s,%s,%s,%s,%s,%s,%s)',
            (idTo, toType, sidFrom, False, False, pid, pname))
        cursor.execute('SELECT max(id) FROM transfer;')  # Retrieve the tid
        tid = cursor.fetchone()[0]  # Transfer ID

        start, stop, duration = self.calculateDuration(None, None, self.translatePosition(idTo, toType),
                                                       self.translatePosition(sidFrom, False))
        timer = Timer(None, tid, 'espionage', start, stop, duration, idTo)
        timer_data_access.insertTimer(timer)
        return timer

    def createOutpost(self, sid: int, coordTo: list, outpostName: str, soldiers: list, resources: list,
                      timer_data_access: TimerDataAccess,
                      package_data_acces: PackageDataAccess, clan_data_acces: ClanDataAccess,
                      friend_data_acces: FriendDataAccess,
                      soldier_data_acces: SoldierDataAccess, settlement_data_acces: SettlementDataAcces):
        """
        PRECONDITION: sid refers to the main settlement of the user

        Starts a timer to create an outpost, makes an outpost transfer and presets the outpost settlement data

        :param sid: Identifier of the main settlement
        :param coordTo: Coordinate the outpost needs to be created
        :param resources: Resources to give with
        :param soldiers: Soldiers that go with
        :param outpostName: Name of the new settlement

        :param soldier_data_acces:
        :param friend_data_acces:
        :param package_data_acces:
        :param timer_data_access:
        :param clan_data_acces:
        :return: success: Status and timer (error or timer object)
        """
        try:
            if not self.hasChancery(sid):
                raise Exception('You cannot create an outpost yet. You should first unlock the chancery!')
            if self.getMaxNumberOfSettlements(sid) < self.getNumberOfSettlements(sid) + 1:
                raise Exception(
                    'You reached the maximal number of outposts for your kingdom! Consider upgrading the chancery.')
            if settlement_data_acces.getNewCoordinate(coordTo[0], coordTo[1]) != coordTo:  # Coordinate is not excepted
                raise Exception('Your outpost is too close to others, make sure to remain a safe distance!')

            cursor = self.dbconnect.get_cursor()  # DB Acces

            # Retrieve player name
            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (sid,))
            pname = cursor.fetchone()[0]

            # Create an empty package
            pid = package_data_acces.add_resources(Package([0, 0, 0, 0, 0, 0, 0]))
            # Create a new settlement on admin account, when the timer runs out, this settlement will be added to the player
            # Note: since every user is befriended with the admin, this settlement can't be attacked yet :)
            cursor.execute('INSERT INTO settlement(name,mapx,mapy,pid,pname) VALUES(%s,%s,%s,%s,%s);',
                           (outpostName, coordTo[0], coordTo[1], pid, 'admin'))
            cursor.execute('SELECT max(id) FROM settlement;')  # Get the settlement ID
            sidTo = cursor.fetchone()[0]

            # Create the transfer and return timer
            return self.createTransfer(sidTo, False, sid, False, soldiers, resources, 'outpost', pname,
                                       timer_data_access, package_data_acces, clan_data_acces,
                                       friend_data_acces, soldier_data_acces)
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
            return False, e

    @staticmethod
    def getInfo(pid: int, pname: str, customer: str, soldier_data_acces: SoldierDataAccess, clan_data_acces: ClanDataAccess,
                friend_data_acces: FriendDataAccess, package_data_acces: PackageDataAccess):
        """
        Retrieve the visible soldiers from a transfer + the resource in the transfer
        :param package_data_acces:
        :param friend_data_acces:
        :param clan_data_acces:
        :param pid: ID of the package
        :param pname: Name of the player info is retrieved from
        :param customer: Name of the player wanting info on the transfer
        :param soldier_data_acces:
        :return:
        """
        # Retrieve needed data
        dct = dict()
        package = package_data_acces.get_resources(pid)
        troops = soldier_data_acces.getTroops(pid, 'package')
        allied = (friend_data_acces.areFriends(pname, customer) or clan_data_acces.areAllies(pname, customer) or pname == customer )

        for troop in troops.keys():  # Reform to frontend format
            if troops[troop]["discovered"] or allied:  # Add the troop info if they are discovered or if allied
                dct[troop] = troops[troop]["amount"]
        return dct | package.to_dct()  # Return the merge of the 2 dicts
