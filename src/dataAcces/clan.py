class Clan:
    def __init__(self, name, pname, description, status):
        self.name = name
        self.pname = pname
        self.description = description
        self.status = status

    def to_dct(self):
        return {'name': self.name, 'pname': self.pname, 'description': self.description, 'status': self.status}


class ClanDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def add_clan(self, obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO clan(name,pname,status,description) VALUES(%s,%s,%s,%s)', (obj.name, obj.leader,obj.description,obj.status,))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False
