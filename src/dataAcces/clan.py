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

    def sendRequest(self, request, cname):
        cursor = self.dbconnect.get_cursor()
        try:
            cursor.execute('INSERT INTO content(id,moment,content,pname) VALUES(DEFAULT,now(),%s,%s);',
                           (request.content, request.sender,))
            cursor.execute('INSERT INTO request(id,accept) VALUES (DEFAULT,NULL);')  # Set first as NULL, True = Accepted, False = Rejected request
            cursor.execute('INSERT INTO clanrequest(id) VALUES (DEFAULT);')
            print("sksk")
            print(cname)
            # Find the clanLeader and send him the Request
            cursor.execute('SELECT pname FROM clan WHERE name=%s;', (cname,))

            print("madinn")
            clanLeader = cursor.fetchone()
            cursor.execute('INSERT INTO retrieved(mid,pname) VALUES (DEFAULT,%s);', clanLeader)
            return True
        except Exception as e:
            print("Error:", e)
            self.dbconnect.rollback()
            return False

    def get_Friendrequest(self,pname):
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
        friend_request = cursor.fetchall()
        friends = []
        for friend in friend_request:
            message_dict = {
                "id": friend[0],
                "moment": str(friend[1]),
                "content": friend[2],
                "pname": friend[3]
            }
            friends.append(message_dict)
        return friends