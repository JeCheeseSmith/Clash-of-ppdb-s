

class Settlement:
    def __init__(self, name, mapX, mapY, pid, pname):
        self.id = id
        self.name = name
        self.mapX = mapX
        self.mapY = mapY
        self.pid = pid
        self.pname = pname

    def to_dict(self):
        return dict(id=self.id, name=self.name, mapX=self.mapX, mapY=self.mapY, pid=self.pid, pname=self.pname)


class SettlementDataAcces:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect