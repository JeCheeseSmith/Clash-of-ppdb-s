class Clan:
    def __init__(self, name, pname, description, status):
        self.name = name
        self.pname = pname
        self.description = description
        self.status = status

    def to_dct(self):
        return {'name': self.name, 'pname': self.pname, 'description': self.description, 'status': self.status}


class ClanDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect

    def add_clan(self, obj):
        cursor = self.dbconnect.get_cursor()
        try: # Insert Clan Object into the Database
            cursor.execute('SELECT * FROM player WHERE name=%s;', (obj.pname,))
            cursor.execute('INSERT INTO clan(name,pname,description,status) VALUES(%s,%s,%s,%s);',
                           (obj.name, cursor.fetchone()[0], obj.description, obj.status,))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False

    def get_clan(self, obj):
        cursor = self.dbconnect.get_cursor()
        cursor.execute('SELECT pname,status,description FROM clan WHERE name=%s;',
                       (obj.name,))  # Get the data from the clan with this name
        result = cursor.fetchone()

        if result:  # If there is a clan with this name
            obj.pname = result[0]
            obj.status = result[1]
            obj.description = result[2]
        else:
            obj.leader = "Not found"
            obj.status = "Clan doesn't exists"
            obj.description = "The clan you we're trying to find with name: " + obj.name + ("doesn't exists yet. Maybe "
                                                                                            "you want to create your "
                                                                                            "own clan instead?")
        return obj

    def get_clanrequest(self,pname):
        cursor = self.dbconnect.get_cursor()

        #Retrieved content en niet message of request morgen oplossen
        call = """
                            SELECT *
                            FROM clanrequest 
                            INNER JOIN content ON clanrequest.id = content.id
                            WHERE clanrequest.id IN (     
                                SELECT mid
                                FROM retrieved
                                WHERE pname = %s
                            );
                            """
        cursor.execute(call, (pname,))
        clan_request = cursor.fetchall()
        clans = []
        for  clan in clan_request:
            message_dict = {
                "id": clan[0],
                "moment": clan[2],
                "content": clan[3],
                "pname":  clan[4]
            }
            clans.append(message_dict)
        return clans

    def sendRequest(self, request, cname):
        cursor = self.dbconnect.get_cursor()

        print(request.sender,cname)

        # Check if they're not already in a clan
        queryCheck = """
                    SELECT (
                    SELECT EXISTS(SELECT *
                    FROM member
                    WHERE pname=%s)
                        
                    UNION
                        
                    SELECT EXISTS(
                    SELECT *
                    FROM clan
                    WHERE pname=%s)
                    );
                    """
        cursor.execute(queryCheck, (request.sender,request.sender))
        queryCheck = cursor.fetchone()[0]

        if queryCheck:
            return False

        try:
            # Insert the content
            cursor.execute('INSERT INTO content(moment,content,pname) VALUES(now(),%s,%s);',
                           (request.content, request.sender,))

            # Retrieve the latest ID to use as Foreign Key
            cursor.execute('SELECT max(id) FROM content;')
            rid = cursor.fetchone()

            # Create a request and its specialization
            cursor.execute('INSERT INTO request(id,accept) VALUES (%s,NULL);', (rid,))  # Set first as NULL, True = Accepted, False = Rejected request
            cursor.execute('INSERT INTO clanrequest(id) VALUES (%s);', (rid,))

            # Find the clanLeader and send him the Request
            cursor.execute('SELECT pname FROM clan WHERE name=%s;', (cname,))
            clanLeader = cursor.fetchone()
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (rid,clanLeader) )

            # Commit to database
            self.dbconnect.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def accept_clanrequest(self,State,id,pname, sname):
        """
        Accept a clan request and remove it from the database
        Also remove all other clan requests from this person
        :param State: State of acceptance
        :param id: ID of the message
        :param pname: Name of the clanleader
        :param sname: Name of the request sender
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()
            oldRequests = [(id,)] # Preset list

            # Retrieve the clan name based on the pname/clanleader
            cursor.execute('SELECT name FROM clan WHERE clan.pname=%s;', (pname,))
            cname = cursor.fetchone()

            if State:
                print('a')
                cursor.execute('INSERT INTO member(pname,cname) VALUES (%s,%s);', (sname, cname,))

                # When accepted; make sure to delete other old requests too
                cursor.execute('SELECT id FROM clanrequest NATURAL JOIN content WHERE content.pname=%s;', (sname,))
                oldRequests = cursor.fetchall()
                oldRequests.append(id)

            # Remove each old request
            for rid in oldRequests:
                cursor.execute('DELETE FROM clanRequest WHERE id=%s;', (rid,))
                cursor.execute('DELETE FROM request WHERE id=%s;', (rid,))
                cursor.execute('DELETE FROM content WHERE id=%s;', (rid,))
                cursor.execute('DELETE FROM retrieved WHERE mid=%s;', (rid,))

            self.dbconnect.commit()
            return True

        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False
