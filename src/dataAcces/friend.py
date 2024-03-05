class Friend:
    def __init__(self, pname1, pname2):
        self.pname1 = pname1
        self.pname2 = pname2

    def to_dct(self):
        return {'name': self.pname1, 'friend': self.pname2}


class FriendDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def get_Friendrequest(self,pname):
        cursor = self.dbconnect.get_cursor()
        call = '''
                    SELECT * 
                    FROM friendrequest 
                    WHERE id IN (
                        SELECT id 
                        FROM content 
                        WHERE pname = %s
                    );
                '''
        cursor.execute(call, (pname,))
        friend_request = cursor.fetchall()
        friends = []
        for friend in friends:
            message_dict = {
                "id": friend[0],
                "accept": friend[1],
            }
            friends.append(message_dict)
        return friends



    def send_Friendrequest(self,request,sname):
        cursor = self.dbconnect.get_cursor()
        try:
            print("a")
            print(request.to_dct())
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',(request.content, request.pname))
            print("b")
            cursor.execute('INSERT INTO request(id,accept) VALUES (DEFAULT,NULL);')  # Set first as NULL, True = Accepted, False = Rejected request
            print("c")
            cursor.execute('INSERT INTO friendrequest(id) VALUES (DEFAULT);')
            print("d")
            print(sname)
            # cursor.execute('SELECT name FROM player WHERE name=%s;', sname,)
            # receiver = cursor.fetchone()
            # print('t')
            # print(receiver[0])

            print('t')
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (DEFAULT);')

            #DEZE WORDT NIET GEDAAN VRAAG VOOR KARS!!

            print("e")
            return True
        except:
            self.dbconnect.rollback()
            return False