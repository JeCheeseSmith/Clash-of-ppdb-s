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

    @staticmethod
    def makeDict(query, cursor, pname):
        """
        Helper function to retrieve all requests and their info from the database and put them into a usable format
        Removes duplicate code!
        :param query: SQL query
        :param pname: Username
        :param cursor: Database Acces
        :return:
        """
        cursor.execute(query, (pname,))
        data = cursor.fetchall()
        objects = []
        for item in data:
            message_dict = {
                "id": item[0],
                "moment": item[2],
                "content": item[3],
                "pname": item[4]
            }
            objects.append(message_dict)
        return objects

    @staticmethod
    def __removeOldRequests(old, cursor):
        """
        Helper function to remove duplicate code
        :param old: List of request id's (rid) to remove
        :param cursor: Database Cursor
        :return:
        """
        for rid in old:
            cursor.execute('DELETE FROM clanRequest WHERE id=%s;', (rid,))
            cursor.execute('DELETE FROM request WHERE id=%s;', (rid,))
            cursor.execute('DELETE FROM content WHERE id=%s;', (rid,))
            cursor.execute('DELETE FROM retrieved WHERE mid=%s;', (rid,))

    def isMember(self, pname):
        """
        Check if a member is not already in a clan; Helper Function
        :param pname: Player name
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Check if they're not already in a clan (Member or Leader)
        cursor.execute('SELECT EXISTS(SELECT cname FROM member WHERE pname=%s);', (pname,))
        queryCheckmember = cursor.fetchone()[0]

        return queryCheckmember

    def areAllies(self, pname1, pname2):
        """
        Verify if 2 persons are in the same clan
        :param pname1: player name
        :param pname2:
        :return:
        """
        if not (self.isMember(pname1) and self.isMember(pname2)):  # If they're not both members of a clan
            return False

        cursor = self.dbconnect.get_cursor()

        # Retrieve clan names
        cursor.execute('SELECT cname FROM member WHERE pname=%s;', (pname1,))
        cname1 = cursor.fetchone()[0]
        if cname1 is None:  # player1 is clanLeader
            cursor.execute('SELECT name FROM clan WHERE pname=%s;', (pname1,))
            cname1 = cursor.fetchone()[0]

        cursor.execute('SELECT cname FROM member WHERE pname=%s;', (pname2,))
        cname2 = cursor.fetchone()[0]
        if cname2 is None:  # player2 is clanLeader
            cursor.execute('SELECT name FROM clan WHERE pname=%s;', (pname2,))
            cname2 = cursor.fetchone()[0]

        return cname1 == cname2  # Check if they're in the same clan

    def add_clan(self, obj):
        """
        Insert a clan (+ clanLeader) into the database and verify the integrity
        :param obj: Clan Object
        :return:
        """
        if not self.isMember(obj.pname):
            try:
                cursor = self.dbconnect.get_cursor()

                cursor.execute('SELECT * FROM player WHERE name=%s;', (obj.pname,))
                player_name = cursor.fetchone()[0]
                cursor.execute('INSERT INTO clan(name,pname,description,status) VALUES(%s,%s,%s,%s);',
                               (obj.name, player_name, obj.description, obj.status,))
                cursor.execute('INSERT INTO member(pname,cname) VALUES(%s,%s);', (obj.pname, obj.name,))

                # Update the clan achievement
                cursor.execute('UPDATE achieved SET amount = %s WHERE pname = %s and aname=%s', (0, obj.pname, "Travisia's Uniter"))

                # Commit to the database
                self.dbconnect.commit()

                return True
            except Exception as e:
                print("Error:", e)
                self.dbconnect.rollback()
                return False
        else:
            return False

    def get_clan(self, obj):
        """
        Retrieve information of a clan if it exists
        :param obj: Clan Class
        :return:
        """
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

    def get_clanrequest(self, pname):
        """
        Retrieve the requests of this type for the leader
        :param pname: Name of the clan leader
        :return:
        """
        cursor = self.dbconnect.get_cursor()

        # Retrieved content en niet message of request morgen oplossen
        querry = """
                            SELECT *
                            FROM clanrequest 
                            INNER JOIN content ON clanrequest.id = content.id
                            WHERE clanrequest.id IN (     
                                SELECT mid
                                FROM retrieved
                                WHERE pname = %s
                            );
                            """
        return self.makeDict(querry, cursor, pname)

    def sendRequest(self, request, cname):
        """
        Send a request to join the clan; insert the data into the database
        :param request: Request object
        :param cname: Name of the clan
        :return:
        """
        if not self.isMember(request.sender):  # Check if they're not already in a clan (Member or Leader)
            try:
                cursor = self.dbconnect.get_cursor()

                # Insert the content
                cursor.execute('INSERT INTO content(moment,content,pname) VALUES(now(),%s,%s);',
                               (request.content, request.sender,))

                # Retrieve the latest ID to use as Foreign Key
                cursor.execute('SELECT max(id) FROM content;')
                rid = cursor.fetchone()

                # Create a request and its specialization
                cursor.execute('INSERT INTO request(id,accept) VALUES (%s,NULL);',
                               (rid,))  # Set first as NULL, True = Accepted, False = Rejected request
                cursor.execute('INSERT INTO clanrequest(id) VALUES (%s);', (rid,))

                # Find the clanLeader and send him the Request
                cursor.execute('SELECT pname FROM clan WHERE name=%s;', (cname,))
                clanLeader = cursor.fetchone()
                cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (%s,%s);', (rid, clanLeader))

                # Commit to database
                self.dbconnect.commit()
                return True
            except Exception as e:
                print("Error:", e)
                self.dbconnect.rollback()
                return False
        else:
            return False

    def accept_clanrequest(self, state, id, pname, sname):
        """
        Accept a clan request and remove it from the database
        Also remove all other clan requests from this person
        :param state: State of acceptance
        :param id: ID of the message
        :param pname: Name of the clanleader
        :param sname: Name of the request sender
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()
            oldRequests = [(id,)]  # Preset list

            # Retrieve the clan name based on the pname/clanleader
            cursor.execute('SELECT name FROM clan WHERE clan.pname=%s;', (pname,))
            cname = cursor.fetchone()

            if state:
                cursor.execute('INSERT INTO member(pname,cname) VALUES (%s,%s);', (sname, cname,))

                # When accepted; make sure to delete other old requests too
                cursor.execute('SELECT id FROM clanrequest NATURAL JOIN content WHERE content.pname=%s;', (sname,))
                oldRequests = cursor.fetchall()
                oldRequests.append(id)

            # Remove each old request
            self.__removeOldRequests(oldRequests, cursor)

            self.dbconnect.commit()  # Make sure to commit the actions
            return True

        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def leaveClan(self, name):
        """
        Remove a member from the memberlist in the clan
        :param name: name of the player
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()

            # Remove the membership
            cursor.execute('DELETE FROM member WHERE pname=%s;', (name,))
            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False

    def deleteClan(self, cname, lname):
        """
        Deletes all members & leader & clanRequests of the clan
        :param cname: Clan name
        :param lname: Clan leader name
        :return:
        """
        try:
            cursor = self.dbconnect.get_cursor()

            # Delete the clan
            cursor.execute('DELETE FROM clan WHERE name=%s;', (cname,))

            # Delete the members
            cursor.execute('DELETE FROM member WHERE cname=%s;', (cname,))

            # Remove each now 'old' request towards the Clan
            cursor.execute('SELECT id FROM clanrequest NATURAL JOIN retrieved WHERE retrieved.pname=%s;', (lname,))
            oldRequests = cursor.fetchall()

            self.__removeOldRequests(oldRequests, cursor)

            self.dbconnect.commit()
            return True
        except:
            self.dbconnect.rollback()
            return False
