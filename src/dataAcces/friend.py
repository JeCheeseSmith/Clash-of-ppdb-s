class Friend:
    def __init__(self, pname1, pname2):
        self.pname1 = pname1
        self.pname2 = pname2

    def to_dct(self):
        return {'name': self.pname1, 'friend': self.pname2}


class FriendDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def accept_Friendrequest(self,State,pname,sname):
        cursor = self.dbconnect.get_cursor()
        if State==True:
            try:
                cursor.execute('INSERT INTO friend(pname1,pname2) VALUES (%s,%s);',(pname,sname,))
                self.dbconnect.commit()
                return True
            except Exception as e:
                print("Error:", e)
                self.dbconnect.rollback()
                return False
        else:
            return False

    def get_Friendrequest(self,pname):
        cursor = self.dbconnect.get_cursor()

        #Retrieved content en niet message of request morgen oplossen
        call = '''
                    SELECT * 
                    FROM friendrequest 
                    WHERE id IN (
                        SELECT mid 
                        FROM retrieved
                        WHERE pname = %s
                    );
                '''
        cursor.execute(call, (pname,))
        friend_request = cursor.fetchall()
        friends = []
        for friend in friends:
            print(friend[1])
            message_dict = {
                "id": friend[0],
                "accept": friend[1],
            }
            friends.append(message_dict)
        return friends



    def send_Friendrequest(self,request,sname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES (DEFAULT,now(),%s,%s);',(request.content, request.sender,))
            cursor.execute('INSERT INTO request(id,accept) VALUES (DEFAULT,NULL);')  # Set first as NULL, True = Accepted, False = Rejected request
            cursor.execute('INSERT INTO friendrequest(id) VALUES (DEFAULT);')
            cursor.execute('SELECT name FROM player WHERE name=%s;', (sname,))
            receiver = cursor.fetchone()
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (DEFAULT,%s);', receiver)
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:",e)
            self.dbconnect.rollback()
            return False