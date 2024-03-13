
class Content:
    def __init__(self, id, moment, content, sender):
        self.id = id
        self.moment = moment
        self.content = content
        self.sender = sender

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender}

class Request(Content):
    def __init__(self ,id, moment, content, sender, accept):
        super().__init__(id, moment, content, sender)
        self.accept = accept

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender, 'accept': self.accept}


class Retrieve:
    def __init__(self, id, sname):
        self.id = id
        self.sname = sname

    def to_dct(self):
        return {'id': self.id, 'sname': self.sname}

class ClanRequestDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

class TransferRequestDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

class FriendRequestDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect


class ContentDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def add_message(self,obj,sname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',(obj.content, obj.sender,))
            cursor.execute('SELECT max(id) FROM content;')
            Rid = cursor.fetchone()
            cursor.execute('INSERT INTO message(id) VALUES (%s);',Rid)
            cursor.execute('SELECT name FROM player WHERE name=%s;', (sname,))
            receiver = cursor.fetchone()
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (Rid,receiver[0],))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False


    def get_chatbox(self, pname,sname):
        cursor = self.dbconnect.get_cursor()
        message1 = """
                    SELECT *
                    FROM message
                    INNER JOIN content ON message.id = content.id and content.pname=%s 
                    WHERE message.id IN (     
                            SELECT mid
                            FROM retrieved
                            WHERE pname = %s   
                        );
                """
        cursor.execute(message1, (sname,pname,))
        messages =cursor.fetchall()
        chatbox =[]
        for message in messages:
            message_dict ={
                "moment": message[2],
                "content": message[3],
                "pname": message[4]
            }
            chatbox.append(message_dict)

        message2 = """
                                SELECT *
                                FROM message
                                INNER JOIN content ON message.id = content.id and content.pname=%s 
                                WHERE message.id IN (     
                                        SELECT mid
                                        FROM retrieved
                                        WHERE pname = %s   
                                    );
                            """
        cursor.execute(message2, (pname, sname,))
        messages2 = cursor.fetchall()
        chatbox2 = []
        for message in messages2:
            message_dict = {
                "moment": message[2],
                "content": message[3],
                "pname": message[4]
            }
            chatbox2.append(message_dict)

        all_messages = chatbox + chatbox2
        all_messages = sorted(all_messages, key=lambda x: x['moment'])
        return all_messages

