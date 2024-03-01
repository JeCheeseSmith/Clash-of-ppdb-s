from database import *


class Message:
    def __init__(self,id,moment,content,pname):
        self.id=id
        self.moment=moment
        self.content=content
        self.pname=pname

    def to_dct(self):
        return {'id':self.id,'moment':self.moment}


class MessageDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def add_message(self,obj,test):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO message(id,moment,content,pname) VALUES(%s,%s,%s,%s)', (obj.id,obj.moment,obj.content,obj.pname))
            self.dbconnect.commit()
            test = True
            return obj
        except:
            self.dbconnect.rollback()
            test = False


