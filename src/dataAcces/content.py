
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
        super(Content, self).__init__(id, moment, content, sender)
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

    def SEND_message(self,obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',(obj.id, obj.moment, obj.content, obj.pname,))
            cursor.execute('INSERT INTO message(id) VALUES (DEFAULT);')
            self.dbconnect.commit()
            return True
        except:
            print("hallo")
            self.dbconnect.rollback()
            return False

    def add_message2(self, obj):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES(%s,%s)', (obj.id, obj.sname))
            self.dbconnect.commit()
            return True
        except:
            print("hallo")
            self.dbconnect.rollback()
            return False

    def get_chatbox(self, pname):
        cursor = self.dbconnect.get_cursor()
        cursor.execute("SELECT EXISTS(SELECT 1 FROM content WHERE pname = %s)" ,(pname,))
        name = cursor.fetchone()[0]
        print(name)

        if name:
            messages = """
                    SELECT id, moment, content, pname
                    FROM content
                    WHERE pname = %s
                    ORDER BY moment DESC
                    LIMIT 10
                """
            cursor.execute(messages, (pname,))
            messages =cursor.fetchall()
            chatbox =[]
            for message in messages:
                message_dict ={
                    "id" :message[0],
                    "moment" :str(message[1]),
                    "content" :message[2],
                    "pname" :message[3]
                }
                chatbox.append(message_dict)
                return chatbox
        else:
            return None
