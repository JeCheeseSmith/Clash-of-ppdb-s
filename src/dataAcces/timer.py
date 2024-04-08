from datetime import datetime
from random import choice


class Timer:
    def __init__(self, tid, oid, ttype, start, done, duration, sid):
        """
        :param: id: Timer Identifier
        :param: sid: Settlement Identifier
        :param oid: Identifier of the Object the Timer is referring to
        :param ttype: Type of the object; 'building', 'soldier', 'transfer'
        :param start: Starting time of the timer
        :param done: Stop Time of the Timer
        """
        self.id = tid
        self.oid = oid
        self.type = ttype
        self.start = start
        self.done = done
        self.duration = duration
        self.sid = sid

    def to_dct(self):
        return dict(id=self.id, oid=self.oid, type=self.type, start=self.start, done=self.done, duration=self.duration,
                    sid=self.sid)


class TimerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def insertTimer(self, timer: Timer):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('INSERT INTO timer(oid,type,start,done,duration,sid) VALUES(%s, %s, %s, %s, %s, %s);',
                       (timer.oid, timer.type, timer.start, timer.done, timer.duration, timer.sid))
        self.dbconnect.commit()

        # Update the id
        cursor.execute('SELECT max(id) FROM timer;')
        id = cursor.fetchone()[0]
        timer.id = id
        return id

    def evaluateTimers(self, settlement_data_acces, transfer_data_acces, package_data_acces, content_data_access):
        """
        Evaluate all timers passed their done time
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM timer WHERE done<now();')
        timersDone = cursor.fetchall()

        for timerArray in timersDone:  # Redirect timer functionality to specific function
            timer = Timer(timerArray[0], timerArray[1], timerArray[2], timerArray[3], timerArray[4], timerArray[5],
                          timerArray[6])
            if timer.type == 'soldier':
                self.simulateTroopTraining(timer)
            elif timer.type == 'building':
                self.simulateUpgrade(timer, settlement_data_acces)
            elif timer.type == 'transfer':
                self.simulateTransfer(timer, transfer_data_acces, package_data_acces, content_data_access)
            elif timer.type == 'espionage':
                pid = self.simulateEspionage(timer, transfer_data_acces, content_data_access)
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))
                cursor.execute('DELETE FROM package WHERE id=%s;', (pid,))
            elif timer.type == 'attack':
                self.simulateAttack(timer)
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))
            elif timer.type == 'outpost':
                self.simulateOutpost(timer)
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))

            cursor.execute('DELETE FROM timer WHERE id=%s;', (timer.id,))  # Delete the old timer
            self.dbconnect.commit()

    def simulateTroopTraining(self, timer: Timer):
        """
        Increase the amount of a soldier by 1.
        :param timer: Complete Timer Object
        """
        try:
            cursor = self.dbconnect.get_cursor()

            cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (timer.sid,))  # Retrieve package id
            pid = cursor.fetchone()

            cursor.execute('SELECT name FROM soldier WHERE id=%s;', (timer.oid,))  # Retrieve soldier name
            sname = cursor.fetchone()

            # Check if the soldier name is already in the package
            cursor.execute('SELECT EXISTS(SELECT * FROM troops WHERE pid=%s and sname=%s);', (pid, sname))
            exist = cursor.fetchone()[0]

            if exist:
                cursor.execute('UPDATE troops SET amount=amount+1 WHERE pid=%s and sname=%s;',
                               (pid, sname))  # Increment the troop amount
            else:  # Insert into the package
                cursor.execute(
                    'INSERT INTO troops(pid, sname, amount, discovered) VALUES(%s,%s,%s,%s);',
                    (pid, sname, 1, False))

            self.dbconnect.commit()
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()

    def simulateUpgrade(self, timer: Timer, settlement_data_acces):
        """
        Increment the level of a building with 1. If the Castle is to be upgraded, execute the extra functionality
        :param timer: Complete Timer Object
        :param settlement_data_acces: DB Acces
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()
            cursor.execute('UPDATE building SET level=level+1 WHERE id=%s;', (timer.oid,))  # Do level +1
            cursor.execute('DELETE FROM timer WHERE id=%s;', (timer.id,))  # Delete the old timer

            cursor.execute('SELECT name FROM building WHERE id=%s',
                           (timer.oid,))  # Verify if we're upgrading the Castle
            name = cursor.fetchone()
            if name == 'Castle':  # For castle upgrades, special functionality needs to be executed
                settlement_data_acces.upgradeCastle(timer.sid)
            elif name == 'SatelliteCastle':
                settlement_data_acces.upgradeCastle(timer.sid, True)
            elif name == 'Barracks':  # Upgrading a barrack unlocks new troops
                settlement_data_acces.upgradeBarracks(timer.sid)

            self.dbconnect.commit()
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()

    def retrieveTimers(self, pname: str, transfer_data_acces, package_data_acces):
        """
        Get all timers for a certain settlement and convert to a frontend usable format
        :param transfer_data_acces:
        :param pname: User name
        :return: List of timer object with info
        """
        cursor = self.dbconnect.get_cursor()

        # Get all befriended players incl yourself withouth 'admin'
        friendly = f"""
-- Subquery to get all players friendly associated with player 'a'
SELECT pname2 AS pname FROM friend WHERE pname1 = '{pname}' UNION SELECT pname1 AS pname FROM friend WHERE pname2 = '{pname}' -- All friends
UNION
-- All clan members
SELECT pname FROM member WHERE cname IN (SELECT cname FROM member WHERE pname='{pname}' )
UNION
-- Player its self
SELECT '{pname}'
-- Except the admin (since everyone is a friend with admin
EXCEPT
SELECT 'admin'
"""

        query = """SELECT * FROM timer WHERE sid IN -- Get all timers for my settlements
(SELECT id FROM settlement WHERE pname=%s) -- All my settlements
UNION
-- Timers interacting with friendly
SELECT * FROM timer WHERE type='transfer' OR type='espionage' OR type='attack' OR type = 'outpost' AND oid IN
( -- Transfer interacting with friendly
SELECT id FROM transfer WHERE pname IN(%s) -- Transfer owned by friendly
UNION
-- Someone's Transfers interacting with friendly transfers
SELECT id FROM transfer WHERE totype=True and idto IN (SELECT id FROM transfer WHERE pname IN(%s))
UNION
-- Someone's Transfers going to friendly settlements
SELECT id FROM transfer WHERE totype=False and idto IN (SELECT id FROM settlement WHERE pname IN (%s))
-- And add all other visible transfers too
UNION
SELECT id FROM transfer WHERE discovered=True
);"""
        cursor.execute(query, (pname, friendly, friendly, friendly))
        data = cursor.fetchall()
        newData = []

        print(data)

        for info in data:
            timer = Timer(info[0], info[1], info[2], info[3], info[4], info[5],
                          info[6])
            newInfo = {}

            if timer.type == 'building':  # Retrieve building id in frontend = position
                cursor.execute('SELECT gridX,gridY FROM building WHERE id=%s and sid=%s;', (timer.oid, timer.sid))
                newInfo["ID"] = cursor.fetchone()
            elif timer.type == 'transfer' or timer.type == 'attack' or timer.type == 'outpost':
                newInfo = self.addTransferTimerInfo(newInfo, timer, transfer_data_acces)
                newInfo["ID"] = timer.oid
            else:
                newInfo["ID"] = timer.oid

            newInfo["type"] = timer.type
            newInfo["totalDuration"] = timer.duration
            newInfo["duration"] = int(
                (timer.done - datetime.now()).total_seconds())  # Give back time format from frontEnd

            newData.append(newInfo)
        return newData

    def addTransferTimerInfo(self, newInfo: dict, timer: Timer, transfer_data_acces):
        """
        Helper function to add needed info for frontend to a transfer timer
        :param newInfo:
        :param timer:
        :param transfer_data_acces:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM transfer WHERE id=%s;', (timer.oid,))
        transfer = cursor.fetchone()  # tid, discovered, idTo, toType, idFrom, fromType, pid

        # Add info to dict
        newInfo["to"] = transfer_data_acces.translatePosition(transfer[2], transfer[3])
        newInfo["from"] = transfer_data_acces.translatePosition(transfer[4], transfer[5])
        newInfo["discovered"] = transfer[1]
        newInfo["tid"] = transfer[0]

        return newInfo

    def simulateTransfer(self, timer: Timer, transfer_data_acces, package_data_acces, content_data_access):
        """
        Execute an actual succeeding resource transfer
        :param timer: Transfer Timer Object
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Instanstiate Usable Data Objects
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        tp = transfer_data_acces.instantiatePackageWithSoldiers(transfer.pid)  # Transfer package
        # TODO Add support to allow transfers to transfers
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (transfer.idTo,))
        spid = cursor.fetchone()[0]
        sp = transfer_data_acces.instantiatePackageWithSoldiers(spid)  # Soldier Package

        # Update correct data in the database
        sp += tp
        package_data_acces.update_resources(sp)

        # Notify the users at the end of a transfer
        from .content import \
            Content  # We need to do this locally otherwise other functionality will break due to circular includes

        cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (transfer.idTo,))
        receiver = cursor.fetchone()[0]
        content_data_access.add_message(Content(None, datetime.now(),
                                                "Accept my gift for you! Please make sure to take care of my men! - " + transfer.pname,
                                                'admin'), receiver)  # Notify receiver
        content_data_access.add_message(
            Content(None, datetime.now(), f"""Your transfer to {receiver} succeeded.""", 'admin'),
            transfer.pname)  # Notify sender

        # Delete data from database
        cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))
        cursor.execute('DELETE FROM package WHERE id=%s;', (transfer.pid,))
        cursor.execute('DELETE FROM troops WHERE pid=%s;', (transfer.pid,))

    def setTransfersDiscovered(self, pname):
        """
        Turns all transfers owned by a person to discovered
        :param pname: Name of the player
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('UPDATE transfer SET discovered=True WHERE pname=%s;', (pname,))
        self.dbconnect.commit()

    def setTroopsDiscovered(self, pid):
        """
        Sets all troops in a package to Discovered
        :param pid: Package id
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('UPDATE troops SET discovered=True WHERE pid=%s;', (pid,))
        self.dbconnect.commit()

    def simulateEspionage(self, timer: Timer, transfer_data_acces, content_data_access):
        """
        Simulates an espionage. By success, the sender will be updated with info

        # Espionage a settlement sets all transfers to discovered
        # Espionage an attack sets soldier info to discovered
        # Sender and/or receiver may be notified
        """
        # Instantiate Usable Data Objects
        success = choice([True, False])  # Espionage fails at random
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pname,name FROM settlement WHERE id=%s;', (transfer.idTo,))
        data = cursor.fetchone()
        receiver, receiverCastle = data[0], data[1]

        if transfer.toType:  # If you spied on a transfer, verify if it still exists
            cursor.execute('SELECT EXISTS(SELECT id FROM transfer WHERE id=%s);', (transfer.id,))
            if not cursor.fetchone()[0]:  # Doesn't exist anymore
                return transfer.pid

        # We need to do this locally otherwise other functionality will break due to circular includes
        from .content import Content

        if success:  # Espionage worked out
            if transfer.toType:  # To a Transfer
                self.setTroopsDiscovered(transfer.pid)
                receiverMessage = ""
                senderMessage = f"""You successfully spied on a transfer of {receiver}. Their info is now visible on the map!"""""
            else:  # To a settlement
                self.setTroopsDiscovered(transfer.pid)  # Set the troops of the settlement to discovered
                self.setTransfersDiscovered(receiver)  # Set transfers owned by the receiver to discovered
                receiverMessage = ""
                senderMessage = f"""You successfully spied on {receiverCastle}. Their info is now visible on the map!"""""
        else:  # Spy has been found!
            receiverMessage = f"""{transfer.pname} tried to spy on you! How dishonorable!"""""
            senderMessage = f"""Your spy to {receiver} got caught! Be mindful of the consequences."""""

        # Notify both players
        if receiverMessage != "":
            content_data_access.add_message(Content(None, datetime.now(), receiverMessage, 'admin'),
                                        receiver)  # Notify receiver
        content_data_access.add_message(Content(None, datetime.now(), senderMessage, 'admin'),
                                        transfer.pname)  # Notify sender
        return transfer.pid

    def simulateAttack(self, timer: Timer):
        # Check if object still exists, else: troops get lost; notify the player
        # Keep in mind that an attack towards another transfer could result in a transfer failure of another one!

        # Choose a random winner
        # Loser: all troops die
        # Winner: continious transfer
        # If done < transfer.done: All troops get lost and will not return

        # TODO also deleted associated package, transfer, other timers and other transfer
        pass

    def simulateOutpost(self, timer: Timer, transfer_data_acces):
        """
        Transfer the created Outpost from the admin account to the new player
        :param timer: Timer Object
        :return:
        """
        # Instantiate Usable Data Objects
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (timer.sid,))
        oldPid = cursor.fetchone()[0]

        # Change ownership of admin to user and change pid: store all from transfer
        cursor.execute('UPDATE settlement SET pname = %s, pid = %s WHERE id=%s;', (transfer.pname, transfer.pid, timer.sid, ) )
        cursor.execute('DELETE FROM package WHERE id=%s;', (oldPid,))  # Delete the old package

        # TODO Initialise sattelcastle + maxNumberofBuildings
        pass
