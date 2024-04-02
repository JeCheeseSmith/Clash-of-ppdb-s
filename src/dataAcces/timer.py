class Timer:
    def __init__(self, id, oid, ttype, start, done, duration, sid):
        """
        :param: id: Timer Identifier
        :param: sid: Settlement Identifier
        :param oid: Identifier of the Object the Timer is referring to
        :param ttype: Type of the object; 'building', 'soldier', 'transfer'
        :param start: Starting time of the timer
        :param done: Stop Time of the Timer
        """
        self.id = id
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

    def evaluateTimers(self, settlement_data_acces):
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
                self.simulateTransfer(timer)
            else:
                raise Exception('We dont support this timer type!!!! ' + timer.type)

    def simulateTransfer(self, timer: Timer):
        pass

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
                    'INSERT INTO troops(pid, sname, amount, transferable, discovered) VALUES(%s,%s,%s,%s,%s);',
                    (pid, sname, 1, True, True))

            cursor.execute('DELETE FROM timer WHERE id=%s;', (timer.id,))  # Delete the old timer

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

            cursor.execute('SELECT name FROM building WHERE id=%s', (timer.oid,))  # Verify if we're upgrading the Castle
            name = cursor.fetchone()
            if name == 'Castle':  # For castle upgrades, special functionality needs to be executed
                settlement_data_acces.upgradeCastle(timer.sid)

            self.dbconnect.commit()
        except Exception as e:
            print('error', e)
            self.dbconnect.rollback()
