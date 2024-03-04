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

    def to_dct(self):
        return dict(name=self.name, type=self.type, health=self.health, damage=self.damage, capacity=self.capacity,
                    consumption=self.consumption, speed=self.speed, stealth=self.stealth)


class SoldierDataAccess():
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
