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
        # Get the start & stop
        # Check timer duration + distance
        pass

    def calculateDistance(self, to: tuple, start: tuple):
        """
        Calc grid distance between 2 grid Coordinates
        :param to: (x <INT> ,y <INT>)
        :param start: (x <INT> ,y <INT>)
        :return: int value expressing the distance
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
        """
        retrieve building info and soldiers: full reports
        :return:
        """
        pass

    def simulateAttack(self):
        pass

    def simulateOutpost(self):
        pass


