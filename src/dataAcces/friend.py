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
            # If State is True accept
            if State:
                cursor.execute('INSERT INTO friend(pname1,pname2) VALUES (%s,%s);', (pname, sname,)) # Insert the pname and sname as friends in the database table friend
            # Delete the request that was send after it is accepted or declined
            cursor.execute('DELETE FROM friendrequest WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM request WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM content WHERE id=%s;', (id,))
            cursor.execute('DELETE FROM retrieved WHERE mid=%s;', (id,))
            # Commit to database
            self.dbconnect.commit()
            return True
        except Exception as e:
            # Checks if there is an exception and prints the error
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def get_Friendrequest(self, pname):
        cursor = self.dbconnect.get_cursor()
        # Retrieved friendrequest based on the content and retrieved
        Query="""SELECT *
                 FROM friendRequest 
                 INNER JOIN content ON friendrequest.id = content.id 
                 WHERE friendrequest.id IN (     
                        SELECT mid
                        FROM retrieved
                        WHERE pname = %s
                 );
        """
        cursor.execute(Query, (pname,))
        friend_request=cursor.fetchall()
        friends = []
        for friend in friend_request:
            message_dict = {
                "id": friend[0],
                "moment": friend[2],
                "content": friend[3],
                "pname": friend[4]
            }
            friends.append(message_dict)
            # Return a list of all friendrequests out of the content table
        return friends


    def send_Friendrequest(self, request, pname):
        cursor = self.dbconnect.get_cursor()

        # Check if they're not already friends
        Query ="""SELECT *
                  FROM friend
                  WHERE (pname1 = %s AND pname2 = %s) OR (pname1 = %s AND pname2 = %s);
        """
        cursor.execute(Query, (pname, request.sender, request.sender, pname))
        Controle = cursor.fetchone()
        # If there already friends it will not send a request
        if Controle is not None:
            return False

        # You can't befriend yourself
        if pname == request.sender:
            return False

        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES (DEFAULT,now(),%s,%s);',(request.content, request.sender,)) # Insert the content in the database table content
            cursor.execute('SELECT max(id) FROM content;') # Get always the id of the content to use it for the other inserts
            Rid = cursor.fetchone()
            cursor.execute('INSERT INTO request(id,accept) VALUES (%s,NULL);', (Rid,)) # Insert the request in the database table request
            cursor.execute('INSERT INTO friendrequest(id) VALUES (%s);', (Rid,)) # Insert the request in the database table friendrequest
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (Rid, pname)) # Insert the request in the database table retrieved
            # Commit to database
            self.dbconnect.commit()
            return True
        except Exception as e:
            # Checks if there is an exception and prints the error
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def removeFriend(self, pname, sname):
        try:
            cursor = self.dbconnect.get_cursor()
            # Delete the friendship :'(
            cursor.execute('DELETE FROM friend where (pname2=%s and pname1=%s) OR (pname2=%s and pname1=%s);', (pname, sname, sname, pname))
            # Commit to database
            self.dbconnect.commit()
            return True
        except Exception as e:
            # Checks if there is an exception and prints the error
            print("Error:", e)
            self.dbconnect.rollback()
            return False


    def get_friends(self,pname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('SELECT pname2 FROM friend WHERE pname1 = %s UNION SELECT pname1 FROM friend WHERE pname2 = %s;',(pname, pname,)) # Retrieve the player his friends
            friends=cursor.fetchall()
            all_friends=[]
            for friend in friends:
                message_dict={
                    "pname":friend[0]
                }
                all_friends.append(message_dict)
            # Return a list of the player his friends
            return all_friends
        except Exception as e:
            # Checks if there is an exception and prints the error
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def add_admin(self,pname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO friend(pname1,pname2) VALUES (%s,%s);', (pname,"admin",)) # Insert the pname and admin as friends in the database table friend
            # Commit to database
            self.dbconnect.commit()
        except Exception as e:
            # Checks if there is an exception and prints the error
            print("Error:", e)
            self.dbconnect.rollback()
            return False


