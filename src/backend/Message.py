from database import *


class Message:
    def __init__(self,id,moment,content,pname):
        self.id=id
        self.moment=moment
        self.content=content
        self.pname=pname

    def to_dct(self):
        return {'id':self.id,'moment':self.moment}


class Retrieve:
    def __init__(self,id,sname):
        self.id=id
        self.sname=sname

    def to_dct(self):
        return {'id':self.id,'naam':self.sname}


class MessageDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def add_message(self,obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO message(id,moment,content,pname) VALUES(%s,%s,%s,%s)', (obj.id,obj.moment,obj.content,obj.pname,))
            self.dbconnect.commit()
            return True
        except:
            print("hallo")
            self.dbconnect.rollback()
            return False

    def add_message2(self,obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES(%s,%s)', (obj.id,obj.sname))
            self.dbconnect.commit()
            return True
        except:
            print("hallo")
            self.dbconnect.rollback()
            return False

