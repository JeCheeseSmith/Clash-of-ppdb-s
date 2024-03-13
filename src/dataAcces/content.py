
class Content:
    def __init__(self, id, moment, content, sender):
        self.id = id
        self.moment = moment
        self.content = content
        self.sender = sender

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender}

class Request(Content):
    def __init__(self, id, moment, content, sender, accept):
        super().__init__(id, moment, content, sender)
        self.accept = accept

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender,
                'accept': self.accept}


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

    def add_message(self, obj, pname):
        try:
            cursor = self.dbconnect.get_cursor()

            # Insert the message into content
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',
                           (obj.content, obj.sender,))

            # Get ID and insert into specilisation message
            cursor.execute('SELECT max(id) FROM content;')
            Rid = cursor.fetchone()
            cursor.execute('INSERT INTO message(id) VALUES (%s);', Rid)

            # Add message to retrieved chat
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (Rid, pname,))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def get_chatbox(self, Pname, Sname):
        chatbox = {} # Last 10 messages
        cursor = self.dbconnect.get_cursor()

         # Select messages from sname to pname
        message1 = """
                            SELECT *
                            FROM message
                            INNER JOIN content ON message.id = content.id and content.pname=%s 
                            WHERE message.id IN (     
                                    SELECT mid
                                    FROM retrieved
                                    WHERE pname = %s   
                                )
                            LIMIT 10;
                        """
        cursor.execute(message1, (Sname, Pname,))
        messages = cursor.fetchall()

        for message in messages:
            c = Content(message[0], str(message[2]), message[3], message[4])
            chatbox[c.moment]=c.to_dct()

        # Select messages from pname to sname
        message2 = """
                                        SELECT *
                                        FROM message
                                        INNER JOIN content ON message.id = content.id and content.pname=%s 
                                        WHERE message.id IN (     
                                                SELECT mid
                                                FROM retrieved
                                                WHERE pname = %s   
                                            )
                                        LIMIT 10;
                                    """
        cursor.execute(message2, (Pname, Sname,))

        messages = cursor.fetchall()
        for message in messages:
            c = Content(message[0], str(message[2]), message[3], message[4])
            chatbox[c.moment]=c.to_dct()

        all_messages = chatbox + chatbox2
        all_messages = sorted(all_messages, key=lambda x: x['moment'])
        return all_messages
