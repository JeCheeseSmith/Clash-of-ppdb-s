class Friend:
    def __init__(self, pname1, pname2):
        self.pname1 = pname1
        self.pname2 = pname2

    def to_dct(self):
        return {'name': self.pname1, 'friend': self.pname2}


class FriendDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def accept_Friendrequest(self, State, id, pname, sname):
        try:
            cursor = self.dbconnect.get_cursor()
            if State:
                cursor.execute('INSERT INTO friend(pname1,pname2) VALUES (%s,%s);', (pname, sname,))

            cursor.execute('DELETE FROM friendrequest WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM request WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM content WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM retrieved WHERE mid=%s;', (id,))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def get_Friendrequest(self, pname):
        cursor = self.dbconnect.get_cursor()

        call = """
                            SELECT *
                            FROM friendRequest 
                            INNER JOIN content ON friendrequest.id = content.id 
                            WHERE friendrequest.id IN (     
                                SELECT mid
                                FROM retrieved
                                WHERE pname = %s
                            );
                """
        cursor.execute(call, (pname,))
        friend_request = cursor.fetchall()
        friends = []
        for friend in friend_request:
            message_dict = {
                "id": friend[0],
                "moment": friend[2],
                "content": friend[3],
                "pname": friend[4]
            }
            friends.append(message_dict)
        return friends

    def send_Friendrequest(self, request, pname):
        cursor = self.dbconnect.get_cursor()

        # Check if they're not already friends
        query = """SELECT *
                    FROM friend
                    WHERE (pname1 = %s AND pname2 = %s)
                    OR (pname1 = %s AND pname2 = %s);
                """
        cursor.execute(query, (pname, request.sender, request.sender, pname))
        a = cursor.fetchone()
        if a is not None:
            return False

        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES (DEFAULT,now(),%s,%s);',
                           (request.content, request.sender,))

            cursor.execute('SELECT max(id) FROM content;')
            Rid = cursor.fetchone()

            cursor.execute('INSERT INTO request(id,accept) VALUES (%s,NULL);', (Rid,))
            cursor.execute('INSERT INTO friendrequest(id) VALUES (%s);', (Rid,))

            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (Rid, pname))
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False
