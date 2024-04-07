from dataAcces.player import *
from dataAcces.content import *
from dataAcces.achievement import *
from dataAcces.building import *
from dataAcces.package import *
from dataAcces.settlement import *
from dataAcces.soldier import *
from dataAcces.transfer import *
from dataAcces.timer import *
from dataAcces.friend import *
from dataAcces.clan import *
from database import *
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.templating import render_template

# INITIALIZE SINGLETON SERVICES
app = Flask("Travisia", static_folder="frontend/dist/static", template_folder="frontend/dist")
connection = DBConnection()
DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"
CORS(app)

player_data_access = PlayerDataAccess(connection)  # Run on the same connection to minimise usage / # of connections
content_data_access = ContentDataAccess(connection)
clan_data_acces = ClanDataAccess(connection)
friend_data_access = FriendDataAccess(connection)
settlement_data_acces = SettlementDataAcces(connection)
package_data_acces = PackageDataAccess(connection)
building_data_acces = BuildingDataAccess(connection)
timer_data_acces = TimerDataAccess(connection)
soldier_data_acces = SoldierDataAccess(connection)


@app.route("/signup", methods=["POST"])
def add_player():
    """
    API request to sign up as a new player with a unique name and password

    JSON Input Format:
    {
    "name": <string> | Username
    "password": <string> | Password
    }

    JSON Output Format:
    {
    "success": <bool> | State of Signrequest
    "message": <string> | Standard reply
    "sid": <INT> | ID of the home settlement
    }
    """
    data = request.json
    name = data.get("name")
    password = data.get("password")
    Player_obj = Player(name=name, password=password, avatar=None, gems=50, xp=0, level=0, logout=None, pid=None)
    Controle = player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)
    if Controle[0]:
        friend_data_access.add_admin(name)
        return jsonify({"success": Controle[0], "message": "Signed in successful", "sid": Controle[1]})
    else:
        return jsonify({"success": Controle[0], "message": "Signed in failed", "sid": Controle[1]})


@app.route("/login", methods=["POST"])
def get_login():
    """
    API request to log in as a player with a unique name and password

    JSON Input Format:
    {
    "name": <string> | Username
    "password": <string> | Password
    }

    JSON Output Format:
    {
    "success": <bool> | State of Loginrequest
    "message": <string> | Standard reply
    "sid": <INT> | ID of the home settlement
    }
    """
    data = request.json
    player_name = data.get("name")
    player_password = data.get("password")
    Player_obj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,
                        logout=None, pid=None)
    Controle = player_data_access.get_login(Player_obj)
    if Controle:
        # Update all data for this player
        cursor = package_data_acces.dbconnect.get_cursor()
        cursor.execute('SELECT id FROM settlement WHERE pname=%s;', (player_name,))
        settlements = cursor.fetchall()
        for sid in settlements:
            package_data_acces.calc_resources(sid, None, datetime.now())

        update()

        return jsonify({"success": Controle[0], "message": "Login successful", "sid": Controle[1]})
    else:
        return jsonify({"success": Controle[0], "message": "Login failed", "sid": Controle[1]})


@app.route("/logout", methods=["POST"])
def logout():
    """
    JSON Input Format (POST):
    {
    "name": <string> | Player name
    }
    :return:
    JSON Output Format (POST):
    {
    "success": <bool> | State of transaction
    }
    """
    data = request.json
    success = player_data_access.registerLogOut(data.get("name"))  # Call the desired functionality
    return jsonify(success)


@app.route("/chat", methods=["POST", "GET"])
def update_chat():
    """
    POST: API request to send a message to another player
    GET: API request to get messages from the player

    JSON Input Format (POST):
    {
    "content": <string> | Actual text in the message
    "pname": <string> | Player name of the receiver
    "sname": <string> | Player name of the sender
    }

    JSON Input Format (GET):
    {
    "pname": <string> | Player name of current logged in user
    "sname": <string> | Player name of the person you're chatting with
    }

    JSON Output Format (POST):
    {
    "success": <bool> | State of Send of the message
    "message": <string> | Standard reply
    }

    JSON Output Format (GET):
    List with messages returned in json format, ordered by moment
    """
    if request.method == "POST":
        data = request.json
        message_pname = data.get("pname")
        message_sname = data.get("sname")
        message_content = data.get("content")
        Chat_obj = Content(None, None, message_content, message_sname)
        Controle = content_data_access.add_message(Chat_obj, message_pname)
        if Controle:
            return jsonify({"success": Controle, "message": "message send successful"})
        else:
            return jsonify({"success": Controle, "message": "Failed to send message"})
    else:  # request.method == "GET":
        data = request.args
        message_pname = data.get("pname")
        message_sname = data.get("sname")
        obj = content_data_access.get_chatbox(message_pname, message_sname)
        return jsonify(obj)


@app.route("/groupchat", methods=["POST", "GET"])
def update_groupchat():
    """
    POST: API request to send a message to another player
    GET: API request to get messages from the player

    JSON Input Format (POST):
    {
    "content": <string> | Actual text in the message
    "pname": <string> | Player name of the receiver
    "sname": <string> | Player name of the sender
    }

    JSON Input Format (GET):
    {
    "pname": <string> | Player name of current logged in user
    "sname": <string> | Player name of the person you're chatting with
    }

    JSON Output Format (POST):
    {
    "success": <bool> | State of Send of the message
    "message": <string> | Standard reply
    }

    JSON Output Format (GET):
    List with messages returned in json format, ordered by moment
    """
    if request.method == "POST":
        data = request.json
        message_pname = data.get("pname")
        message_cname = data.get("cname")
        message_content = data.get("content")
        Chat_obj = Content(None, None, message_content, message_pname)
        Controle = content_data_access.send_groupchat(message_cname, Chat_obj)
        if Controle:
            return jsonify({"success": Controle, "message": "message send successful"})
        else:
            return jsonify({"success": Controle, "message": "Failed to send message"})
    else:  # request.method == "GET":
        data = request.args
        message_cname = data.get("cname")
        obj = content_data_access.get_groupchat(message_cname)
        return jsonify(obj)


@app.route("/resources", methods=["POST"])
def get_resources():
    """
    Function to retrieve current amount of resources of a settlement
    :return:

    JSON Input Format
    {
    "id": <INT> | ID of the Settlement
    }
   """
    data = request.json
    id = data.get("id")
    package_data_acces.calc_resources(id, None, datetime.now())
    packageDict = settlement_data_acces.getResources(Settlement(id))
    return jsonify(packageDict)


@app.route("/update", methods=["GET"])
def update():
    """
    Tell the server to re-evaluate its timers

    Also gives back the timers f

    JSON Input Format:
    {
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    List of all timers for a settlement
    }
    """
    timer_data_acces.evaluateTimers(settlement_data_acces)

    data = request.args
    sid = data.get('sid')

    if sid is not None:
        timers = timer_data_acces.retrieveTimers(sid)
        return jsonify(timers)


@app.route("/getGrid", methods=["GET"])
def getGrid():
    """
    API Call to retrieve the grid of a settlement

    JSON Input Format:
    {
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    "grid": <MATRIX> | Matrix representation of the grid
    }
    """
    data = request.args
    grid = settlement_data_acces.getGrid(data.get('sid'))
    return jsonify({"grid": grid})


@app.route("/getBuilingInfo", methods=["GET"])
def getBuildingInfo():
    """
    Retrieve all information for a given building

    PRECONDITION: The building must exists

    JSON Input Format:
    {
    "position": <ARRAY INT> | [gridX, gridY]
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    "success": <BOOL> | State of action
    <Building info in dict style>
    }
    """
    try:
        data = request.json
        building = building_data_acces.retrieve(data.get('position')[0], data.get('position')[1],
                                                data.get('sid'))  # Reform data
        dct = building.to_dct()
        dct['success'] = True
        return jsonify(dct)
    except:
        dct = dict(success=False)
        return jsonify(dct)


@app.route("/moveBuilding", methods=["POST"])
def moveBuiling():
    """
    API Call to update the location of a building

    JSON Input Format:
    {
    "oldPosition": <ARRAY INT> | [gridX, gridY]
    "newPosition": <ARRAY INT> | [gridX, gridY] New position on the grid
    "occupiedCells": <INT[][]> | All the cells a building takes in on the grid
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    "success": <BOOL> | State of action
    }
    """
    data = request.json
    building = building_data_acces.retrieve(data.get('oldPosition')[0], data.get('oldPosition')[1],
                                            data.get('sid'))  # Reform data
    building.occupiedCells = data.get('occupiedCells')
    building.gridX = data.get('newPosition')[0]
    building.gridY = data.get('newPosition')[1]
    success = building_data_acces.moveBuilding(building)  # Execute functionality
    return jsonify(dict(success=success))


@app.route("/placeBuilding", methods=["POST"])
def placeBuilding():
    """
    API Call to place a new building (adds a timer, makes a resource deficit)

    JSON Input Format:
    {
    "name": <STRING> | Unique name of the Buildable
    "position": <INT[]> | [gridX, gridY] X,Y coordinate on the grid
    "occupiedCells": <INT[][]> | All the cells a building takes in on the grid
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    "success": <BOOL> | State of action
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json

    building = building_data_acces.instantiate(data.get('name'), data.get('sid'), data.get('position')[0],
                                               data.get('position')[1], data.get('occupiedCells'))  # Reform data
    success, error = settlement_data_acces.placeBuilding(building, package_data_acces)  # Execute functionality
    dct = dict(success=success)
    if not success:
        dct["error"] = str(error)
    return jsonify(dct)


@app.route("/upgradeBuilding", methods=["POST"])
def upgradeBuilding():
    """
    API Call to upgrade an existing building

    JSON Input Format:
    {
    "position": <INT[]> | [gridX, gridY] X,Y coordinate on the grid
    "sid": <INT> | Identifier of the settlement
    }

    JSON Output Format:
    {
    "success": <BOOL> | State of action
    "duration": <INT> | Time in seconds
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json

    building = building_data_acces.retrieve(data.get('position')[0], data.get('position')[1],
                                            data.get('sid'))  # Reform data
    success, timer = settlement_data_acces.upgradeBuilding(building, package_data_acces, timer_data_acces,
                                                           building_data_acces)  # Execute actual functionality

    if success:
        dct = timer.to_dct()
        dct["success"] = success
    else:
        dct = dict(success=success)
        dct["error"] = str(timer)  # In this case, timer is an error message
    return jsonify(dct)


@app.route("/unlockedTroops", methods=["GET"])
def unlockedTroops():
    """
    Retrieve all soldiers and their unlocked status

    JSON Input Format
    {
    "sid": <INT> | Identifier of the settlement you are training troops for
    }

    JSON Output Format:
    {
    List of soldier names with a bool specifying their unlocked status
    }
    """
    data = request.json
    data = soldier_data_acces.getUnlockedSoldiers(data.get("sid"))
    return jsonify(data)


@app.route("/getTroops", methods=["GET"])
def getTroops():
    """
    Retrieve the soldiers connected to a Settlement, Package or Transfer (depending on the specified type)

    JSON Input Format
    {
    "id": <INT> | Identifier of the type referring to
    "type": <STRING> | can be: 'package', 'settlement' or 'transfer'
    }

    JSON Output Format:
    {
    List of soldier names with their respective amount
    }
    """
    data = request.json
    return jsonify(soldier_data_acces.getTroops(data.get("id"), data.get("type")))


@app.route("/trainTroop", methods=["POST"])
def trainTroop():
    """
    API Endpoint to create a new Clan

    JSON Input Format
    {
    "sid": <INT> | Identifier of the settlement you are training troops for
    "sname": <STRING> | Name of soldier
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json

    success, timer = settlement_data_acces.trainTroop(data.get('sid'), data.get('sname'), soldier_data_acces,
                                                      package_data_acces,
                                                      timer_data_acces)  # Execute actual functionality
    if success:
        dct = timer.to_dct()
        dct["success"] = success
    else:
        dct = dict(success=success)
        dct["error"] = str(timer)  # In this case, timer is an error message
    return jsonify(dct)


@app.route("/getFunction", methods=["GET"])
def getFunction():
    """
    VERIFY ADMIN STATUS
    :return:
    """
    pass


@app.route("/setFunction", methods=["POST"])
def setFunction():
    """
    VERIFY ADMIN STATUS
    :return:
    """
    pass

@app.route("/map", methods=["GET"])
def getMap():
    """Retrieve all settlements on the map
    """
    pass

@app.route("/getVisibleTransfer", methods=["GET"])
def getVisibleTransfer():
    """
    Retrieve all transfers and info visible for a player
    :return:
    """
    pass


@app.route("/attack", methods=["POST"])
def attack():
    """
    Endpoint to start an attack towards another settlement or transfer

    JSON Input Format
    {
    "sidTo": <INT> | Identifier of the object going to ('defendant')
    "sidFrom": <INT> | Identifier of the object going from ('attacker')
    "soldiers": <LIST> : [ (sname <STRING> , amount <INT>) , ... ] : List of : soldier names and the amount of soldiers for that type
    "intercept": <BOOL>: Bool specifying if this transfer will attack/intercept another transfer (True) or a settlement (False)
    "tid": <INT> | Optional transfer id which we want to intercept
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json
    success = TransferDataAccess.createAttack()


@app.route("/espionage", methods=["POST"])
def espionage():
    """
    Endpoint to start an espionage towards another settlement or transfer

    JSON Input Format
    {
    "idTo": <INT> | Identifier of the object going to ('defendant')
    "sidFrom": <INT> | Identifier of the object going from ('attacker')
    "type": <STRING> | type = 'settlement' or 'transfer'
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    }
    """
    data = request.json
    TransferDataAccess.createEspionage(data.get('idTo'), )

    pass

@app.route("/transfer", methods=["POST"])
def transfer():
    """
    Endpoint to start a transfer towards another settlement

    JSON Input Format
    {
    "sidTo": <INT> | Identifier of the object going to ('receiver')
    "sidFrom": <INT> | Identifier of the object going from ('sender')
    "soldiers": <LIST> : [ (sname <STRING> , amount <INT>, transferable <BOOL> ) , ... ] : List of : soldier names and the amount of soldiers for that type and if these soldiers may be transferred or not
    "resources": <LIST>: [ (resourceType <INT> , amount <INT>) , ... ]: Similar as soldiers, but now with resource ID's: 1: Stone, 2: Wood, 3: Steel, 4: Food, 12: Stone & Wood
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """

    pass

@app.route("/createOutpost", methods=["POST"])
def createOutpost():
    """

    :return:
    """
    pass


@app.route("/createClan", methods=["POST"])
def createClan():
    """
    API Endpoint to create a new Clan

    JSON Input Format
    {
    "name": <string> | The name of the clan
    "pname": <string> | Clan Leader name (Player Entity)
    "description": <string> | Info about the clan
    "status": <string> | Current Clan status - Oneliner
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    }
    """
    data = request.json
    success = clan_data_acces.add_clan(
        Clan(data.get("name"), data.get("pname"), data.get("description"), data.get("status")))
    return jsonify({"success": success})

@app.route("/joinClan", methods=["POST"])
def joinClan():
    """
    Make a request to join the Clan; sends a message to the Clan Leader too

    JSON Input Format:
    {
    "cname": <string> | Name of the clan
    "sender": <string> | Person who wishes to join the clan
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    "message": <string> | Standard reply
    }
    """
    data = request.json

    rhequest = Request(None, None, "Dear High Magistrate of this clan, may I join your alliance?", data.get("sender"),
                       None)
    cname = data.get("cname")  # Name of the clan
    success = clan_data_acces.sendRequest(rhequest, cname)

    if success:
        message = "Your request has been send. Please await further correspondence!"
    else:
        message = "You can't join a clan if you're already in one!"

    return jsonify({"success": success, "message": message})


@app.route("/searchClan", methods=["POST"])
def searchClan():
    """
    Search for a particular clan and retrieve its information

    JSON Input Format
    {
    "name": <string> | Clan name
    }

    JSON Output Format
    {
    "success": <bool> | Status
    "name": <string> | Clan Name
    "pname": <string> | Clan Leader name (Player Entity)
    "description": <string> | Info about the clan
    "status": <string> | Current Clan status - Oneliner
    }
    """
    data = request.json
    clan = clan_data_acces.get_clan(Clan(data.get("name"), None, None, None))
    dct = clan.to_dct()

    if clan.status == "Clan doesn't exists":
        dct["success"] = False
    else:
        dct["success"] = True
    return jsonify(dct)


@app.route("/searchPerson", methods=["POST"])
def search_player():
    """
    API request to search a player that plays the game

    JSON Input Format:
    {
    "pname": <string>
    }

    JSON Output Format:
    {
    "success": <bool> | State of Search of the player
    "message": <string> | Standard reply
    }
    """
    data = request.json
    name = data.get("pname")
    Cotrole = False
    Controle = player_data_access.search_player(name)  # Execute functionality
    if Controle:
        return jsonify({"success": Controle, "message": "Player exists"})
    else:
        return jsonify({"success": Controle, "message": "Player doesn't exists"})


@app.route("/sendfriendrequest", methods=["POST"])
def send_friend_request():
    """
    POST: API request to send a friend request to another player

    JSON Input Format:
    {
    "content": <string> | Actual text
    "pname": <string> | Receiver
    "sname": <string> | Sender
    }

    JSON Output Format:
    {
    "success": <bool> | State of Send of the friend request
    "message": <string> | Standard reply
    }
    """
    data = request.json
    Friend_request = Content(None, None, data.get("content"), data.get("sname"))
    Controle = friend_data_access.send_Friendrequest(Friend_request, data.get("pname"))
    if Controle:
        return jsonify({"success": Controle, "message": "Friend request is send"})
    else:
        return jsonify({"success": Controle, "message": "Friend request isn't send"})


@app.route("/getgeneralrequests", methods=["POST"])
def get_general_requests():
    """
    API request to get requests to a player

    JSON Input Format:
    {
    "pname": <string> | Name of the player to which the request are send
    }

    JSON Output Format
    List with requests returned in json format
    """
    data = request.json
    pname = data.get("pname")
    Friendrequests = friend_data_access.get_Friendrequest(pname)  # Execute functionality
    Clanrequests = clan_data_acces.get_clanrequest(pname)
    Generalrequest = Friendrequests + Clanrequests

    # Sort merged list based on the moment
    Generalrequest = sorted(Generalrequest, key=lambda x: x["moment"])
    return jsonify(Generalrequest)


@app.route("/acceptgeneralrequests", methods=["POST"])
def accept_general_requests():
    """
    POST: API request to accept or decline a friend request of another player

    JSON Input Format:
    {
    "id": <INT> | ID of the request
    "state": <string> | True = Accepted the request
    "pname": <string> | Receiver of the request; thus the person deciding about the request
    "sname": <string> | Request sender
    }

    JSON Output Format:
    {
    "success": <bool> | State of Accepting
    "message": <string> | Standard reply
    }
    """
    data = request.json
    pname = data.get("pname")
    sname = data.get("sname")
    state = data.get("state")
    id = data.get("id")

    if content_data_access.isFriendRequest(id):  # Depending on the type of request
        Controle = friend_data_access.accept_Friendrequest(state, id, pname, sname)  # Execute functionality

    elif content_data_access.isClanRequest(id):
        Controle = clan_data_acces.accept_clanrequest(state, id, pname, sname)  # Execute functionality

    # Send a message back to the user from the admin account
    if state:
        message1 = Content(None, None, "Your request is accepted by " + pname, "admin")
        Controle = content_data_access.add_message(message1, sname)
        return jsonify({"success": Controle, "message": "accepted"})
    else:
        message1 = Content(None, None, "Your request is denied by " + pname, "admin")
        Controle = content_data_access.add_message(message1, sname)
        return jsonify({"success": Controle, "message": "rejected"})


@app.route("/unfriend", methods=["POST"])
def removeFriend():
    """
    POST: API request to remove someone as friend

    JSON Input Format:
    {
    "pname": <string> | Person who you're friend with
    "sname": <string> | Person who gives the command to remove friend
    }

    JSON Output Format:
    {
    "success": <BOOL> | Request status
    }
    """
    data = request.json
    status = friend_data_access.removeFriend(data.get("pname"), data.get("sname"))
    return jsonify({"success": status})


@app.route("/getChats", methods=["GET"])
def getChats():
    """
    POST: API request get al friends from someone

    JSON Input Format:
    {
    "name": <string> | Person from who we will retrieve all friends
    }

    JSON Output Format:
    List of friends
    """
    data = request.args
    pname = data.get("pname")
    dct = {}
    status = friend_data_access.get_friend(pname)  # Execute functionality
    clan = player_data_access.retrieveClan(pname)

    for friend in status:
        dct[friend.get("pname")] = "person"
    if clan is not None:
        dct[clan[0]] = "clan"

    return jsonify(dct)


@app.route("/leaveClan", methods=["POST"])
def leaveClan():
    """
    POST: API request to leave the Clan

    JSON Input Format:
    {
    "name": <string> | Person who leaves the clan
    }

    JSON Output Format:
    {
    "success": <BOOL> | Request status
    }
    """
    data = request.json
    success = clan_data_acces.leaveClan(data.get('name'))  # Execute functionality
    return jsonify({"success": success})


@app.route("/deleteClan", methods=["POST"])
def deleteClan():
    """
    POST: API request to delete a Clan and all associated data

    JSON Input Format:
    {
    "pname": <string> | Clan leader
    "cname": <string> | Clan name
    }

    JSON Output Format:
    {
    "success": <BOOL> | Request status
    }
    """
    data = request.json
    success = clan_data_acces.deleteClan(data.get('cname'), data.get('pname'))  # Execute functionality
    return jsonify({"success": success})


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    """
    Standard catch_all to serve each file
    """
    return render_template("index.html")


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
