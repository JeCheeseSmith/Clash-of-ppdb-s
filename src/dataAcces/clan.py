class Clan:
    def __init__(self, name, leader, description, status):
        self.name = name
        self.leader = leader
        self.description = description
        self.status = status

    def to_dct(self):
        return {'name': self.name, 'leader': self.leader, 'description': self.description, 'status': self.status}


class ClanDataAccess():
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
