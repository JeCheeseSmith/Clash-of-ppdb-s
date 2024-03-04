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
            cursor.execute('SELECT * FROM player WHERE name=%s;', (obj.pname,))
            cursor.execute('INSERT INTO clan(name,pname,description,status) VALUES(%s,%s,%s,%s)', (obj.name, cursor.fetchone()[0],obj.description,obj.status,))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False
