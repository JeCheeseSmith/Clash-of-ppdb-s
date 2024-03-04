class Buildable:
    def __init__(self, name, type, function, storage, cost, drawback):
        self.name = name
        self.type = type
        self.function = function
        self.storage = storage
        self.cost = cost,
        self.drawback = drawback

    def to_dct(self):
        return dict(name=self.name, type=self.type, function=self.function, storage=self.storage, cost=self.cost, drawback=self.drawback)


class Building(Buildable):
    def __init__(self, name, type, function, storage, cost, drawback, id, level, gridX, gridY):
        super(Buildable, self).__init__(name, type, function, storage, cost, drawback)
        self.id = id
        self.level = level
        self.gridX = gridX
        self.gridY = gridY

    def to_dct(self):
        return dict(name=self.name, type=self.type, function=self.function, storage=self.storage, level=self.level,
                    id=self.id, gridX=self.gridX, gridY=self.gridY, cost=self.cost, drawback=self.drawback)


class BuildableDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect


class BuildingDataAccess:

    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
