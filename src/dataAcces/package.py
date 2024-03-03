class Package:
    def __init__(self, id, stone, wood, steel, food, gems, xp):
        self.id = id
        self.stone = stone
        self.wood = wood
        self.steel = steel
        self.food = food
        self.gems = gems
        self.xp = xp


class PackageDataAccess():
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
