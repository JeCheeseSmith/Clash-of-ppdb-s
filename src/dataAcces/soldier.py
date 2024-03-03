class Soldier:
    def __init__(self, name, type, health, damage, capacity, consumption, speed, stealth):
        self.name = name
        self.type = type
        self.health = health
        self.damage = damage
        self.capacity = capacity
        self.consumption = consumption
        self.speed = speed
        self.stealth = stealth


class SoldierDataAccess():
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
