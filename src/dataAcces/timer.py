from .player import *


class Timer:
    def __init__(self, tid, ttype, start, done, duration, sid):
        """
        NOTE: The Primary Key of the timer is (tid, ttype), not tid! (In the database)
        :param: sid: Settlement Identifier
        :param tid: Identifier of the Object the Timer is referring to
        :param ttype: Type of the object; 'building', 'soldier', 'transfer'
        :param start: Starting time of the timer
        :param done: Stop Time of the Timer
        """
        self.id = tid
        self.type = ttype
        self.start = start
        self.done = done
        self.duration = duration
        self.sid = sid

    def to_dct(self):
        return dict(id=self.id, type=self.type, start=self.start, done=self.done, duration=self.duration, sid=self.sid)


class TimerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def insertTimer(self, timer: Timer):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('INSERT INTO timer(id,type,start,done,duration,sid) VALUES(%s, %s, %s, %s, %s, %s);',
                       (timer.id, timer.type, timer.start, timer.done, timer.duration, timer.sid))
        self.dbconnect.commit()

    def evualateTimers(self, player: Player):
        pass

    def evualateTimersSettlement(self, settlement):
        pass

    def simulateTransfer(self, timer: Timer):
        pass

    def simulateTroopTraining(self, timer: Timer):
        pass

    def simulateUpgrade(self, timer: Timer):
        ## Level + 1
        ## If building.sid = -1:

        pass
