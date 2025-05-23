class Content:
    def __init__(self, cid, moment, content, sender):
        self.id = cid
        self.moment = moment
        self.content = content
        self.sender = sender

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender}


class Request(Content):
    def __init__(self, cid, moment, content, sender, accept):
        super().__init__(cid, moment, content, sender)
        self.accept = accept

    def to_dct(self):
        return {'id': self.id, 'moment': self.moment, 'content': self.content, 'sender': self.sender,
                'accept': self.accept}


class ContentDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def isFriendRequest(self, rid):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS( SELECT * FROM friendrequest WHERE id =%s);', (rid,))
        result = cursor.fetchone()[0]
        return result

    def isClanRequest(self, rid):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT EXISTS( SELECT * FROM clanrequest WHERE id =%s);', (rid,))
        result = cursor.fetchone()[0]
        return result

    def add_message(self, obj: Content, pname):
        """
        :param obj:
        :param pname: Receiver
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()

            # Insert the message into content
            cursor.execute('INSERT INTO content(moment,content,pname) VALUES(now(),%s,%s);',
                           (obj.content, obj.sender,))

            # Get ID and insert into specialisation message
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

    def get_chatbox(self, pname, sname):
        chatbox = []  # Last 10 messages
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
                                ) ORDER BY content.moment DESC
                                LIMIT 10

                        """
        cursor.execute(message1, (sname, pname,))
        messages = cursor.fetchall()

        # Select messages from pname to sname
        cursor.execute(message1, (pname, sname,))
        messages += cursor.fetchall()  # Append

        for message in messages:
            c = Content(message[0], str(message[2]), message[3], message[4])
            chatbox.append(c.to_dct())

        return sorted(chatbox, key=lambda x: x['moment'])

    def send_groupchat(self, cname, obj):
        try:
            cursor = self.dbconnect.get_cursor()

            # Insert the message into content
            cursor.execute('INSERT INTO content(moment,content,pname) VALUES(now(),%s,%s);',
                           (obj.content, obj.sender,))

            # Get ID and insert into specialization message
            cursor.execute('SELECT max(id) FROM content;')
            Rid = cursor.fetchone()
            cursor.execute('INSERT INTO message(id) VALUES (%s);', Rid)

            # Add message to retrieved chat
            cursor.execute('INSERT INTO shared(mid,cname) VALUES (%s,%s);', (Rid, cname,))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def get_groupchat(self, cname):
        chatbox = []  # Last 10 messages
        cursor = self.dbconnect.get_cursor()

        # Select messages from cname to pname
        message1 = """
                                    SELECT *
                                    FROM message
                                    INNER JOIN content ON message.id = content.id 
                                    WHERE message.id IN (     
                                            SELECT mid
                                            FROM shared
                                            WHERE cname = %s   
                                        )
                                    ORDER BY message.id DESC
                                """
        cursor.execute(message1, (cname,))
        messages = cursor.fetchall()

        for message in messages:
            c = Content(message[0], str(message[2]), message[3], message[4])
            chatbox.append(c.to_dct())

        return sorted(chatbox, key=lambda x: x['moment'])
