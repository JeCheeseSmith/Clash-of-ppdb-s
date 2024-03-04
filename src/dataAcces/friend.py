class Friend:
    def __init__(self, pname1, pname2):
        self.pname1 = pname1
        self.pname2 = pname2

    def to_dct(self):
        return {'name': self.pname1, 'friend': self.pname2}


class FriendDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect



    def send_Friendrequest(self,request,sname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',(request.content, request.sender))
            cursor.execute('INSERT INTO request(id,accept) VALUES (DEFAULT,NULL);')  # Set first as NULL, True = Accepted, False = Rejected request
            cursor.execute('INSERT INTO friendrequest(id) VALUES (DEFAULT);')
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (DEFAULT,%s);',sname)
            return True
        except:
            self.dbconnect.rollback()
            return False