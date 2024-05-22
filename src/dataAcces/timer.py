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
        tid = cursor.fetchone()[0]
        timer.id = tid
        return tid

    def evaluateXP(self, timer: Timer, transfer_data_acces, player_data_acces):
        cursor = self.dbconnect.get_cursor()

        cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (timer.sid,))
        pname = cursor.fetchone()

        if timer.type == 'soldier':
            player_data_acces.updateXPandLevel(50, pname)
        elif timer.type == 'building':
            player_data_acces.updateXPandLevel(200, pname)
        else:  # For transfer timers, the sid of the owner is not strictly timer.sid
            transfer = transfer_data_acces.instantiateTransfer(timer.oid)
            pname = transfer.pname  # Correct pname
            if timer.type == 'transfer':
                player_data_acces.updateXPandLevel(100, pname)
            elif timer.type == 'attack':
                player_data_acces.updateXPandLevel(100, pname)
            elif timer.type == 'outpost':
                player_data_acces.updateXPandLevel(100, pname)

        self.dbconnect.commit()  # Commit Achievement Changes

    def evaluateQuests(self, timer: Timer, transfer_data_acces):
        """
        Update data for all quests upon timer info. E.g. adjust amount of times and check if a quest is done, if so: add XP.
        :param timer: Timer object
        :param transfer_data_acces: Data Acces
        """
        cursor = self.dbconnect.get_cursor()

        cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (timer.sid,))
        pname = cursor.fetchone()

        if timer.type == 'soldier':
            cursor.execute('UPDATE achieved SET amount = amount - 1 WHERE pname = %s and aname=%s',
                           (pname, "Hungry for more"))
        elif timer.type == 'building':
            cursor.execute('SELECT count(id) FROM building WHERE sid=%s and name=%s;', (timer.sid, 'WoodCuttersCamp'))
            count = cursor.fetchone()[0]
            if count >= 3:  # When 3 buildings is met, achieved!
                cursor.execute('UPDATE achieved SET amount = %s WHERE pname = %s and aname=%s',
                               (0, pname, "Woodcutter"))
        else:  # For transfer timers, the sid of the owner is not strictly timer.sid
            transfer = transfer_data_acces.instantiateTransfer(timer.oid)
            pname = transfer.pname  # Correct pname

            if timer.type == 'transfer':
                cursor.execute('UPDATE achieved SET amount = amount - 1 WHERE pname = %s and aname=%s',
                               (pname, "Friendly Neighbour"))
            elif timer.type == 'attack':
                cursor.execute('UPDATE achieved SET amount = amount - 1 WHERE pname = %s and aname=%s',
                               (pname, "Fighter"))
            elif timer.type == 'outpost':
                cursor.execute('UPDATE achieved SET amount = amount - 1 WHERE pname = %s and aname=%s',
                               (pname, "Kingdom Rebuilder"))

        self.dbconnect.commit()  # Commit Achievement Changes

        # When an achievement amount hit 0; add XP
        cursor.execute('SELECT aname FROM achieved WHERE amount=0 and pname=%s;',
                       (pname,))  # If amount < 0: it has already been added
        achieved = cursor.fetchall()
        for quest in achieved:
            # Set moment and amount to -1; indicating the achievement is done
            cursor.execute('UPDATE achieved SET amount = -1 WHERE aname = %s and pname = %s;', (quest, pname))

            # Add XP bonus
            cursor.execute('SELECT xpBonus FROM achievement WHERE name=%s;', (quest,))
            xpBonus = cursor.fetchone()
            cursor.execute('UPDATE player SET xp= xp + %s WHERE name=%s;', (xpBonus, pname))

        self.dbconnect.commit()  # Commit XP Bonuses & achievement updates once again

    def evaluateTimers(self, settlement_data_acces, transfer_data_acces, package_data_acces, content_data_access,
                       soldier_data_acces, timer_data_access, player_data_acces):
        """
        Evaluate all timers passed their done time
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM timer WHERE done<%s ORDER BY done LIMIT 1;',
                       (datetime.now(),))  # Sort by earliest done time
        timerDone = cursor.fetchone()

        while timerDone is not None and len(
                timerDone) != 0:  # Since timers might be removed upon attack, we have to refresh the timerDone after each simulation
            timer = Timer(timerDone[0], timerDone[1], timerDone[2], timerDone[3], timerDone[4], timerDone[5],
                          timerDone[6])

            cursor.execute('DELETE FROM timer WHERE id=%s;', (
            timer.id,))  # Delete the old timer already to make sure no request at this time has the same timer
            self.dbconnect.commit()

            self.evaluateQuests(timer,
                                transfer_data_acces)  # Check up if any quest is done and an XP bonus needs to be added
            self.evaluateXP(timer, transfer_data_acces, player_data_acces)

            if timer.type == 'soldier':
                self.simulateTroopTraining(timer)
            elif timer.type == 'building':
                self.simulateUpgrade(timer, settlement_data_acces, content_data_access)
            elif timer.type == 'transfer':
                self.simulateTransfer(timer, transfer_data_acces, package_data_acces, content_data_access,
                                      soldier_data_acces)
                print("------------------------------------------------------------------")
            elif timer.type == 'espionage':
                self.simulateEspionage(timer, transfer_data_acces, content_data_access)
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))
            elif timer.type == 'attack':
                self.simulateAttack(timer, transfer_data_acces, content_data_access, package_data_acces,
                                    soldier_data_acces, timer_data_access)
            elif timer.type == 'outpost':
                self.simulateOutpost(timer, transfer_data_acces, settlement_data_acces, content_data_access)
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))

            #cursor.execute('DELETE FROM timer WHERE id=%s;', (timer.id,))  # Delete the old timer
            self.dbconnect.commit()

            # Check for more timers
            cursor.execute('SELECT * FROM timer WHERE done<%s ORDER BY done LIMIT 1;',
                           (datetime.now(),))  # Sort by earliest done time
            timerDone = cursor.fetchone()

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

    def simulateUpgrade(self, timer: Timer, settlement_data_acces, content_data_access):
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
            name = cursor.fetchone()[0]
            if name == 'Castle':  # For castle upgrades, special functionality needs to be executed
                settlement_data_acces.upgradeCastle(timer.sid)
            elif name == 'SatelliteCastle':
                settlement_data_acces.upgradeCastle(timer.sid, True)
            elif name == 'Barracks':  # Upgrading a barrack unlocks new troops
                settlement_data_acces.upgradeBarracks(timer.sid)

            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (timer.sid,))
            pname = cursor.fetchone()

            # We need to do this locally otherwise other functionality will break due to circular includes
            from .content import Content
            content_data_access.add_message(
                Content(None, datetime.now(), f"""Your building {name} has been upgraded!""", 'admin'), pname)

            self.dbconnect.commit()
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()

    def retrieveTimers(self, pname: str, transfer_data_acces, content_data_access):
        """
        Get all timers for a certain settlement and convert to a frontend usable format
        :param transfer_data_acces:
        :param pname: Username
        :return: List of timer object with info
        """
        self.dbconnect.commit()

        cursor = self.dbconnect.get_cursor()

        # Get all befriended players incl yourself without 'admin'
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

        query = f"""SELECT * FROM timer WHERE sid IN -- Get all timers for my settlements
(SELECT id FROM settlement WHERE pname='{pname}') -- All my settlements
UNION
-- Timers interacting with friendly
SELECT * FROM timer WHERE type='transfer' OR type='espionage' OR type='attack' OR type = 'outpost' AND oid IN
( -- Transfer interacting with friendly
SELECT id FROM transfer WHERE pname IN({friendly}) -- Transfer owned by friendly
UNION
-- Someone's Transfers interacting with friendly transfers
SELECT id FROM transfer WHERE totype=True and idto IN (SELECT id FROM transfer WHERE pname IN({friendly}))
UNION
-- Someone's Transfers going to friendly settlements
SELECT id FROM transfer WHERE totype=False and idto IN (SELECT id FROM settlement WHERE pname IN ({friendly}))
-- And add all other visible transfers too
UNION
SELECT id FROM transfer WHERE discovered=True
);"""
        cursor.execute(query)
        data = cursor.fetchall()
        newData = []

        for info in data:
            timer = Timer(info[0], info[1], info[2], info[3], info[4], info[5],
                          info[6])
            newInfo = {}

            if timer.type == 'building':  # Retrieve building id in frontend = position
                cursor.execute('SELECT gridX,gridY FROM building WHERE id=%s and sid=%s;', (timer.oid, timer.sid))
                newInfo["ID"] = cursor.fetchone()
            elif timer.type == 'transfer' or timer.type == 'attack' or timer.type == 'outpost':
                if not self.__integrity(timer.oid, timer.id, content_data_access):
                    continue
                newInfo = self.addTransferTimerInfo(newInfo, timer, pname, transfer_data_acces, friendly)
                newInfo["ID"] = timer.oid

                height = 0  # Calc and set the height of arrows for the frontend
                for new_info in newData:
                    if "height" in new_info.keys() and "to" in new_info.keys() and "from" in new_info.keys():
                        if new_info["to"] == newInfo["to"] and new_info["from"] == newInfo["from"]:
                            height += 1
                newInfo["height"] = height
            elif timer.type == 'soldier':
                newInfo["ID"] = timer.oid
                cursor.execute('SELECT name FROM soldier WHERE id=%s;', (timer.oid,))
                newInfo["sname"] = cursor.fetchone()[0]
            else:
                newInfo["ID"] = timer.oid

            newInfo["type"] = timer.type
            newInfo["totalDuration"] = timer.duration
            newInfo["duration"] = int(
                (timer.done - datetime.now()).total_seconds())  # Give back time format from frontEnd

            newData.append(newInfo)
        return newData

    def __integrity(self, transferID, timerID, content_data_access):
        """
        Check if the things we want to do on this transfer are valid (e.g. check if the transfer you're doing with goes to an existing transfer)
        If not, False will be returned and the data is removed
        :param transferID:
        :param timerID:
        :param content_data_access:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM transfer WHERE id=%s;', (transferID,))
        transfer = cursor.fetchone()
        tid = transfer[0]
        idTo = transfer[2]
        toType = transfer[3]
        idFrom = transfer[4]
        fromType = transfer[5]
        pid = transfer[6]
        pname = transfer[7]

        from .content import Content

        if toType:
            cursor.execute('SELECT EXISTS( SELECT id FROM transfer WHERE id =%s);', (idTo,))
            exist = cursor.fetchone()
            if not exist[0]:
                content_data_access.add_message(
                    Content(None, datetime.now(), f"""Your transfer couldn't be made. It got lost!""",
                            'admin'), pname)  # Notify sender

                # Delete data from database
                cursor.execute('DELETE FROM timer WHERE id=%s;', (timerID,))
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (tid,))
                cursor.execute('DELETE FROM package WHERE id=%s;', (pid,))
                cursor.execute('DELETE FROM troops WHERE pid=%s;', (pid,))
                self.dbconnect.commit()
                return False
        return True

    def addTransferTimerInfo(self, newInfo: dict, timer: Timer, pname: str, transfer_data_acces, friendly: str):
        """
        Helper function to add needed info for frontend to a transfer timer
        :param newInfo:
        :param timer:
        :param transfer_data_acces:
        :param pname: Player requesting info
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT * FROM transfer WHERE id=%s;', (timer.oid,))
        transfer = cursor.fetchone()  # tid, discovered, idTo, toType, idFrom, fromType, pid

        # Add info to dict
        newInfo["to"] = transfer_data_acces.translatePosition(transfer[2], transfer[3])
        newInfo["from"] = transfer_data_acces.translatePosition(transfer[4], transfer[5])

        query = f""" -- Transfer interacting with friendly
SELECT id FROM transfer WHERE pname IN({friendly}) -- Transfer owned by friendly
UNION
-- Someone's Transfers interacting with friendly transfers
SELECT id FROM transfer WHERE totype=True and idto IN (SELECT id FROM transfer WHERE pname IN({friendly}))
UNION
-- Someone's Transfers going to friendly settlements
SELECT id FROM transfer WHERE totype=False and idto IN (SELECT id FROM settlement WHERE pname IN ({friendly}))
-- And add all other visible transfers too
UNION
SELECT id FROM transfer WHERE discovered=True
"""
        cursor.execute(query)
        friended = cursor.fetchall()
        newInfo["discovered"] = (transfer[0],) in friended
        newInfo["tid"] = transfer[0]
        newInfo["toType"] = transfer[3]

        return newInfo

    def simulateTransfer(self, timer: Timer, transfer_data_acces, package_data_acces, content_data_access,
                         soldier_data_acces):
        """
        Execute an actual succeeding resource transfer
        :param soldier_data_acces:
        :param content_data_access:
        :param package_data_acces:
        :param transfer_data_acces:
        :param timer: Transfer Timer Object
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Instantiate Usable Data Objects
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        tp = transfer_data_acces.instantiatePackageWithSoldiers(transfer.pid, soldier_data_acces,
                                                                package_data_acces)  # Transfer package
        if not transfer.toType:
            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (transfer.idTo,))
            receiver = cursor.fetchone()[0]  # Get receivers name

        # Notify the users at the end of a transfer
        from .content import \
            Content  # We need to do this locally otherwise other functionality will break due to circular includes

        if transfer.toType:  # To a transfer
            cursor.execute('SELECT pid FROM transfer WHERE id=%s;', (transfer.idTo,))
            spid = cursor.fetchone()
            if spid is None:  # Transfer couldn't be met; return to base
                content_data_access.add_message(
                    Content(None, datetime.now(), f"""Your transfer couldn't be made. It got lost!""",
                            'admin'),
                    transfer.pname)  # Notify sender

                # Delete data from database
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (timer.oid,))
                cursor.execute('DELETE FROM package WHERE id=%s;', (transfer.pid,))
                cursor.execute('DELETE FROM troops WHERE pid=%s;', (transfer.pid,))
                self.dbconnect.commit()
                return
            else:
                spid = spid[0]
            cursor.execute('SELECT pname FROM transfer WHERE id=%s;', (transfer.idTo,))
            receiver = cursor.fetchone()[0]

        else:  # To a settlement
            cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (transfer.idTo,))
            spid = cursor.fetchone()[0]
        sp = transfer_data_acces.instantiatePackageWithSoldiers(spid, soldier_data_acces,
                                                                package_data_acces)  # Package going to
        # Update correct data in the database
        sp += tp
        package_data_acces.update_resources(sp)

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
        self.dbconnect.commit()

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
        if transfer.toType:
            cursor.execute('SELECT pname FROM transfer WHERE id=%s;', (transfer.idTo,))
            receiver = cursor.fetchone()[0]
        else:
            cursor.execute('SELECT pname,name FROM settlement WHERE id=%s;', (transfer.idTo,))
            data = cursor.fetchone()
            receiver, receiverCastle = data[0], data[1]

        if transfer.toType:  # If you spied on a transfer, verify if it still exists
            cursor.execute('SELECT EXISTS(SELECT id FROM transfer WHERE id=%s);', (transfer.idTo,))
            if not cursor.fetchone()[0]:  # Doesn't exist anymore
                return

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
        return

    def __returnToBase(self, transfer, transfer_data_acces, timer_data_access, soldier_data_acces, package_data_acces):
        """
        Helper function to send all transfer back home who went to 'transfer'
        :param transfer:
        :param transferDefendant:
        :param transfer_data_acces:
        :param timer_data_access:
        :param soldier_data_acces:
        :param package_data_acces:
        :return:
        """
        cursor = self.dbconnect.get_cursor()
        # Get transfer going to the transfer that doesn't exist anymore now
        cursor.execute('SELECT id FROM transfer WHERE totype=True and idTo=%s EXCEPT SELECT %s;',
                       (transfer.id, transfer.id))  # Except itsself

        transfers = cursor.fetchall()
        for tid in transfers:  # Send them back to where they came from
            transfer_data_acces.returnToBase(transfer_data_acces.instantiateTransfer(tid[0]), timer_data_access,
                                             soldier_data_acces, package_data_acces)
            self.dbconnect.commit()

    def simulateAttack(self, timer: Timer, transfer_data_acces, content_data_access, package_data_acces,
                       soldier_data_acces, timer_data_access):
        """
        Simulate an attack towards another player. A winner is chosen randomly.

        # Keep in mind that an attack towards another transfer could result in a transfer failure of another one!
        # The failed transfers will be sent back to the owner
        # If the attack doesn't reach the transfer is attacking, the soldiers will get 'lost'
        :param timer_data_access:
        :param soldier_data_acces:
        :param package_data_acces:
        :param content_data_access:
        :param timer: Timer object
        :param transfer_data_acces:
        :return:
        """
        # Instantiate Usable Data Objects
        success = True #choice([True, False])  # Choose a random winner
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        cursor = self.dbconnect.get_cursor()

        # We need to do this locally otherwise other functionality will break due to circular includes
        from .content import Content
        from .package import Package

        if transfer.toType:
            cursor.execute('SELECT EXISTS(SELECT id FROM transfer WHERE id=%s);', (transfer.idTo,))
            status = cursor.fetchone()
            if not status[0]:  # Doesn't exist anymore
                content_data_access.add_message(Content(None, datetime.now(),
                                                        "Your soldiers could not reach the transfer they we're chasing. Sadly, they got lost in the wilderness..",
                                                        'admin'),
                                                transfer.pname)  # Notify sender
                # Delete attack transfer
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (transfer.id,))
                cursor.execute('DELETE FROM package WHERE id=%s;', (transfer.pid,))
                cursor.execute('DELETE FROM troops WHERE pid=%s;', (transfer.pid,))
                self.dbconnect.commit()
                return

        # Retrieve Player name of the defender
        if transfer.toType:
            cursor.execute('SELECT pname FROM transfer WHERE id=%s;', (transfer.idTo,))
            defendant = cursor.fetchone()[0]
        else:
            cursor.execute('SELECT pname FROM settlement WHERE id=%s;', (transfer.idTo,))
            defendant = cursor.fetchone()[0]

        if success:  # Attacker won
            if transfer.toType:  # To a transfer
                # Merge transfer resource amounts into current transfer
                transferDefendant = transfer_data_acces.instantiateTransfer(transfer.idTo)
                ap = package_data_acces.get_resources(transfer.pid)  # Attacker package
                dp = package_data_acces.get_resources(transferDefendant.pid)  # Defendant package
                ap += dp
                package_data_acces.update_resources(ap)  # Update database

                # Get transfers going to the transfer that doesn't exist anymore now and send them back home
                self.__returnToBase(transferDefendant, transfer_data_acces, timer_data_access, soldier_data_acces, package_data_acces)

                attackerMessage = f"""We successfully captured the transfer of {defendant}! Returning home now, my Lord."""
                defendantMessage = f"""You're transfer has been attacked and captured by {transfer.pname}!"""
            else:  # Attack to a settlement
                package_data_acces.calc_resources(transfer.idTo, None,
                                                  datetime.now())  # Re-evaluate resources of defendant

                # Retrieve package of defendant
                cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (transfer.idTo,))
                pidTo = cursor.fetchone()[0]
                cursor.execute('SELECT * FROM package WHERE id=%s;', (pidTo,))
                dp = list(cursor.fetchone())  # Defendant resources

                # Calculate amount that will be stolen
                print(dp)

                ap = package_data_acces.get_resources(transfer.pid)  # Attacker package
                capacity = soldier_data_acces.getCapacity(transfer.pid)  # Amount an attacker can take with
                resourceStolen = choice([1, 2, 3, 4])  # Choose a random resource
                print(ap.to_dct(), capacity, dp[resourceStolen])
                stolen = min(capacity, dp[resourceStolen])  # Amount that will be stolen
                oldDp = Package(dp)
                dp[resourceStolen] -= stolen
                dp = Package(dp)
                ap = oldDp - dp
                ap.id = transfer.pid
                print(dp.to_dct(), ap.to_dct())

                # Adjust new resources to database
                package_data_acces.update_resources(dp)
                package_data_acces.update_resources(ap)

                # Kill all soldiers in defendant settlement :(
                cursor.execute('DELETE FROM troops WHERE pid=%s;', (pidTo,))

                attackerMessage = f"""We successfully raided the settlement of {defendant}! Returning home now, my Lord."""
                defendantMessage = f"""You've been attacked by {transfer.pname}!"""

            transfer_data_acces.returnToBase(transfer, timer_data_access, soldier_data_acces,
                                             package_data_acces, timer)  # Let the original transfer also return to base
            if transfer.toType:  # Delete defendant transfer, timer and package
                cursor.execute('DELETE FROM transfer WHERE id=%s;', (transferDefendant.id,))
                cursor.execute('DELETE FROM package WHERE id=%s;', (transferDefendant.pid,))
                cursor.execute('DELETE FROM troops WHERE pid=%s;', (transferDefendant.pid,))
                cursor.execute("DELETE FROM timer WHERE oid=%s AND type IN('transfer','espionage','outpost','attack');",
                               (transferDefendant.id,))
                if defendant == 'admin':  # We attack an outpost transfer
                    cursor.execute('DELETE FROM settlement WHERE id=%s AND pname=%s;', (transferDefendant.sid, 'admin'))
        else:  # Defendant won
            # Get transfers going to the attack that doesn't exist anymore now
            cursor.execute('SELECT id FROM transfer WHERE totype=True and idTo=%s;',
                           (transfer.id,))
            transfers = cursor.fetchall()
            for tid in transfers:  # Send them back to where they came from
                transfer_data_acces.returnToBase(transfer_data_acces.instantiateTransfer(tid[0]), timer_data_access,
                                                 soldier_data_acces, package_data_acces)
                self.dbconnect.commit()

            # Delete attack transfer
            cursor.execute('DELETE FROM transfer WHERE id=%s;', (transfer.id,))
            cursor.execute('DELETE FROM package WHERE id=%s;', (transfer.pid,))
            cursor.execute('DELETE FROM troops WHERE pid=%s;', (transfer.pid,))

            # Create messages
            defendantMessage = f"""We successfully defended ourself to an attack of {transfer.pname} !"""
            attackerMessage = f"""You lost the attack battle against {defendant}."""

        # Notify both users
        content_data_access.add_message(Content(None, datetime.now(), attackerMessage, 'admin'),
                                        transfer.pname)  # Notify attacker
        content_data_access.add_message(Content(None, datetime.now(), defendantMessage, 'admin'),
                                        defendant)  # Notify defendant
        self.dbconnect.commit()

    def simulateOutpost(self, timer: Timer, transfer_data_acces, settlement_data_acces, content_data_access):
        """
        Transfer the created Outpost from the admin account to the new player
        :param content_data_access:
        :param settlement_data_acces:
        :param transfer_data_acces:
        :param timer: Timer Object
        :return:
        """
        # Instantiate Usable Data Objects
        transfer = transfer_data_acces.instantiateTransfer(timer.oid)
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pid FROM settlement WHERE id=%s;', (timer.sid,))
        oldPid = cursor.fetchone()[0]

        # Change ownership of admin to user and change pid: store all from transfer
        cursor.execute('UPDATE settlement SET pname = %s, pid = %s WHERE id=%s;',
                       (transfer.pname, transfer.pid, timer.sid,))
        cursor.execute('DELETE FROM package WHERE id=%s;', (oldPid,))  # Delete the old package

        # Preset Unlocked Status for each building (All are unlocked at start)
        cursor.execute('SELECT name FROM buildable;')
        buildings = cursor.fetchall()
        for buildable in buildings:
            cursor.execute('INSERT INTO unlocked(name, sid, maxnumber) VALUES(%s,%s,%s);',
                           (buildable, timer.sid, 1))

        # Initialise Satellite Castle and preset unlocked Status
        cursor.execute(
            'INSERT INTO building(name, level, gridx, gridy, sid, occuppiedcells) VALUES(%s,%s,%s,%s,%s,%s);',
            ('SatelliteCastle', 1, 6, 6, timer.sid,
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

        settlement_data_acces.upgradeCastle(timer.sid, True)  # Upgrade the Satellite Castle to level 1

        # We need to do this locally otherwise other functionality will break due to circular includes
        from .content import Content

        content_data_access.add_message(Content(None, datetime.now(),
                                                "You successfully established an outpost! Come take a look :)",
                                                'admin'),
                                        transfer.pname)  # Notify user
