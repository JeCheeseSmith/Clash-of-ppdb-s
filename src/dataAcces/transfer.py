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

    def getPosition(self, tid):

        pass

    def calculateDistance(self, to: tuple, start: tuple):
        """
        Calc grid distance between 2 grid Coordinates
        :param to:
        :param start:
        :return: int value
        """
        pass

    def calculateDuration(self, speed, distance):
        pass

    def createTransfer(self):
        pass

    def createEspionage(self):
        pass

    def createAttack(self):
        pass

    def createOutpost(self):
        pass

    def simulateTransfer(self):
        pass
    def simulateEspionage(self):
        pass

    def simulateAttack(self):
        pass

    def simulateOutpost(self):
        pass


