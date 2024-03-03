import dataAcces

class Package:
    def __init__(self, id, stone, wood, steel, food, gems, xp):
        self.id = id
        self.stone = stone
        self.wood = wood
        self.steel = steel
        self.food = food
        self.gems = gems
        self.xp = xp

class Soldier:
    def __init__(self,name,type,health,damage,capacity,consumption,speed,stealth):
        self.name = name
        self.type = type
        self.health = health
        self.damage = damage
        self.capacity = capacity
        self.consumption = consumption
        self.speed = speed
        self.stealth = stealth




class PackageDataAccess(dataAcces):
    def __init__(self,dbconnect):
        super(PackageDataAccess, self).__init__(dbconnect)
