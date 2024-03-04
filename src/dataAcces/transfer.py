class Transfer:
    def __init__(self, id, speed, sidto, discovered, sidfrom, pid):
        self.id = id
        self.speed = speed
        self.sidto = sidto
        self.discovered = discovered
        self.sidfrom = sidfrom
        self.pid = pid

    def to_dct(self):
        return dict(id=self.id, speed=self.speed, sidto=self.sidto, discovered=self.discovered, sidfrom=self.sidfrom,
                    pid=self.pid)


class TransferDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
