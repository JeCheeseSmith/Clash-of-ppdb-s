from database import *

class Player:
    def __init__(self, name, password, avatar, gems, xp, level, logout):
        self.name = name
        self.password = password
        self.avatar = avatar
        self.gems = gems
        self.xp = xp
        self.level = level
        self.logout = logout
        
    def to_dct(self):
        return {'id': self.id, 'text': self.text, 'author': self.author}


class PlayerDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
       
    def get_quotes(self):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT name FROM Player')
        quote_objects = list()
        for row in cursor:
            quote_obj = Player(row[0], row[1], row[2])
            quote_objects.append(quote_obj)
        return quote_objects
    
    def get_quote(self, iden):
        cursor = self.dbconnect.get_cursor()
        # See also SO: https://stackoverflow.com/questions/45128902/psycopg2-and-sql-injection-security
        cursor.execute('SELECT name FROM "user" WHERE name=%s', (iden,))
        row = cursor.fetchone()   
        return Player(row[0], row[1], row[2])
     
    def add_quote(self, quote_obj): 
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO User(name) VALUES(%s,%s)', (quote_obj.text, quote_obj.author,))
            # get id and return updated object
            cursor.execute('SELECT LASTVAL()')
            iden = cursor.fetchone()[0]
            quote_obj.id = iden
            self.dbconnect.commit()
            return quote_obj
        except:
            self.dbconnect.rollback()
            raise Exception('Unable to save quote!')
