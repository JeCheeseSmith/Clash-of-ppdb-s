from dataAcces.player import *
from dataAcces.content import *
from dataAcces.building import *
from dataAcces.package import *
from dataAcces.settlement import *
from dataAcces.soldier import *
from dataAcces.transfer import *
from dataAcces.timer import *
from dataAcces.friend import *
from dataAcces.clan import *
from querry import query
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
transfer_data_acces = TransferDataAccess(connection)


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
    control = player_data_access.add_user(Player_obj, settlement_data_acces, content_data_access, package_data_acces)
    if control[0]:
        friend_data_access.add_admin(name)
        return jsonify({"success": control[0], "message": "Signed in successful", "sid": control[1]})
    else:
        return jsonify({"success": control[0], "message": "Signed in failed", "sid": control[1]})


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
    "success": <bool> | State of Login Request
    "message": <string> | Standard reply
    "sid": <INT> | ID of the home settlement
    }
    """
    data = request.json
    player_name = data.get("name")
    player_password = data.get("password")
    Player_obj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,
                        logout=None, pid=None)
    control = player_data_access.get_login(Player_obj)
    if control:
        return jsonify({"success": control[0], "message": "Login successful", "sid": control[1]})
    else:
        return jsonify({"success": control[0], "message": "Login failed", "sid": control[1]})


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
    "pname": <string> | Player name of current logged-in user
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
        control = content_data_access.add_message(Chat_obj, message_pname)
        if control:
            return jsonify({"success": control, "message": "message send successful"})
        else:
            return jsonify({"success": control, "message": "Failed to send message"})
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
    "pname": <string> | Player name of current logged-in user
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
        control = content_data_access.send_groupchat(message_cname, Chat_obj)
        if control:
            return jsonify({"success": control, "message": "message send successful"})
        else:
            return jsonify({"success": control, "message": "Failed to send message"})
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
    "pname": <STRING> | Player name
    }

    JSON Output Format:
    {
    List of all timers for a settlement
    Timer objects related to transfer have the following extra info: {"from": <ARRAY INT[2]> , "to": <ARRAY INT[2]>, "discovered": <BOOL> }
    }
    """
    timer_data_acces.evaluateTimers(settlement_data_acces, transfer_data_acces, package_data_acces, content_data_access,
                                    soldier_data_acces, timer_data_acces)
    data = request.args
    pname = data.get('pname')

    if pname is not None:
        timers = timer_data_acces.retrieveTimers(pname, transfer_data_acces)
        return jsonify(timers)

    # timers = timer_data_acces.retrieveTimers('a', transfer_data_acces) # This is for debug only
    # print(timers)
    return jsonify('')


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


@app.route("/getBuildingInfo", methods=["GET"])
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
def moveBuilding():
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
    print(data.get('name'))
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
    data = request.args
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
    data = request.args
    soldiers = soldier_data_acces.getTroops(data.get("id"), data.get("type"))  # Exec functionality
    soldiers = transfer_data_acces.extent(soldiers, True)
    return jsonify(soldiers)


@app.route("/getConsumption", methods=["GET"])
def getConsumption():
    """
    Retrieve the food consumption per time unit for a settlement

    JSON Input Format
    {
    "id": <INT> | Identifier of the settlement referring to
    }

    JSON Output Format:
    {
    <INT> | consumption
    }
    """
    data = request.args
    amount = package_data_acces.calc_consumption(data.get('id'))
    return jsonify(amount)


@app.route("/getBarrackLevelSum", methods=["POST"])
def getBarrackLevelSum():
    """
    Retrieve the food consumption per time unit for a settlement

    JSON Input Format
    {
    "id": <INT> | Identifier of the settlement referring to
    }

    JSON Output Format:
    {
    <INT> | sum of level of each barrack
    }
    """
    data = request.json
    amount = soldier_data_acces.getBarrackLevelSum(data.get('id'))
    return jsonify({"amount": amount})


@app.route("/trainTroop", methods=["POST"])
def trainTroop():
    """
    API Endpoint to train a new troops

    JSON Input Format
    {
    "id": <INT> | Identifier of the settlement you are training troops for
    "sname": <STRING> | Name of soldier
    "amount": <INT> | Amount of troops you want to train in parallel
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json

    success, timers = settlement_data_acces.trainTroop(data.get('id'), data.get('sname'), data.get('amount'),
                                                       soldier_data_acces,
                                                       package_data_acces,
                                                       timer_data_acces)  # Execute actual functionality
    if success:
        dct = dict(success=success, sname=data.get('sname'))
        for timer in timers:
            dct[str(timer.id)] = timer.to_dct()
    else:
        dct = dict(success=success)
        dct["error"] = str(timers)  # In this case, timer is an error message
    return jsonify(dct)


@app.route("/getFunction", methods=["GET"])
def getFunction():
    """
    Retrieves the 'production' functions for all buildings from the database

    JSON Input Format
    {
    "bname": <STRING> | Name of the buildable
    }

    JSON Output Format:
    {
    function array
    }
    """
    data = request.args
    return jsonify(building_data_acces.getFunction(data.get('bname')))


@app.route("/setFunction", methods=["POST"])
def setFunction():
    """
    Set a new production function for a certain building

    JSON Input Format
    {
    "function": ARRAY INT | Polynomial function, e.g. [500,0] = 500x + 0
    "bname": <STRING> | Name of the building to upgrade
    }

    JSON Output Format:
    {
    "success": <BOOL> | State of the action
    }
    """
    data = request.json
    success = building_data_acces.setFunction(data.get('bname'), data.get('function'))
    return jsonify({"success": success})


@app.route("/map", methods=["GET"])
def getMap():
    """
    Retrieve all settlements on the map with basic info

    JSON Input Format
    {
    "sid": <INT> | Identifier of the settlement you are training troops for
    "sname": <STRING> | Name of soldier
    }

    JSON Output Format:
    {
    LIST: [ {"sid": <INT> , "position": ARRAY INT[2], "level": <INT>, "isOutpost": BOOL } , ... ]
    }
    """
    return jsonify(settlement_data_acces.getMap())


@app.route("/espionage", methods=["POST"])
def espionage():
    """
    Endpoint to start an espionage towards another settlement or transfer

    JSON Input Format
    {
    "idTo": <INT> | Identifier of the object going to ('defendant')
    "sidFrom": <INT> | Identifier of the object going from ('attacker')
    "toType": <BOOL> | The type spying on, False = 'settlement' , True =  'transfer'
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    }
    """
    data = request.json
    timer = transfer_data_acces.createEspionage(data.get('idTo'), data.get('sidFrom'), data.get('toType'),
                                                timer_data_acces)
    return jsonify(timer.to_dct())


@app.route("/transfer", methods=["POST"])
def transfer():
    """
    Endpoint to start a transfer towards another settlement

    JSON Input Format
    {
    "idTo": <INT> | Identifier of the settlement going to ('receiver')
    "toType": <BOOL> | Specifies if we're going to a settlement (False) or another transfer (True)
    "idFrom": <INT> | Identifier of the settlement going from ('sender')
    "soldiers": <LIST> : [ (sname <STRING> , amount <INT>) , ... ] : List of : soldier names and the amount of soldiers for that type and if these soldiers may be transferred or not
    "resources": <LIST>: [ amount <INT> , ... ]: Index 0: 0, Index 1: Stone, 2: Wood, 3: Steel, 4: Food, 5: 0, 6:0
    "tType": <STRING> | 'attack' or 'transfer'; specifies the sort of transfer we're doing
    "pname": <STRING> | Player who starts/owns the transfer
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json

    success, timer = transfer_data_acces.createTransfer(data.get('idTo'), data.get('toType'), data.get('idFrom'),
                                                        False, data.get('soldiers'),
                                                        data.get('resources'), data.get('tType'), data.get('pname'),
                                                        timer_data_acces,
                                                        package_data_acces, clan_data_acces,
                                                        friend_data_access, soldier_data_acces)

    if success:
        dct = timer.to_dct()
        dct["success"] = success
    else:
        dct = dict(success=success)
        dct["error"] = str(timer)  # In this case, timer is an error message
    return jsonify(dct)


@app.route("/createOutpost", methods=["POST"])
def createOutpost():
    """
    Endpoint to start the creation of an outpost

    JSON Input Format
    {
    "coordTo": <ARRAY INT[2]> | Coordinate of the place the new outpost needs to be created
    "sidFrom": <INT> | Identifier of the settlement going from ('sender')
    "outpostName": <STRING> | Name of the new outpost
    "soldiers": <LIST> : [ (sname <STRING> , amount <INT>) , ... ] : List of : soldier names and the amount of soldiers for that type and if these soldiers may be transferred or not
    "resources": <LIST>: [ amount <INT> , ... ]: Index 0: 0, Index 1: Stone, 2: Wood, 3: Steel, 4: Food, 5: 0, 6:0
    }

    JSON Output Format:
    {
    "success": <bool> | State of request
    If success = True, the timer object will be sent back as well
    "error": <STRING> | Optional error message if success=False
    }
    """
    data = request.json
    success, timer = transfer_data_acces.createOutpost(data.get('sidFrom'), data.get('coordTo'),
                                                       data.get('outpostName'), data.get('soldiers'),
                                                       data.get('resources'), timer_data_acces,
                                                       package_data_acces, clan_data_acces,
                                                       friend_data_access, soldier_data_acces, settlement_data_acces)

    if success:
        dct = timer.to_dct()
        dct["success"] = success
    else:
        dct = dict(success=success)
        dct["error"] = str(timer)  # In this case, timer is an error message
    return jsonify(dct)


@app.route("/getInfo", methods=["GET"])
def getInfo():
    """
    Endpoint to retrieve visible information for an active transfer or settlement for a specific user

    JSON Input Format
    {
    "oid": <INT> | Identifier of the transfer or settlement
    "pname": <STRING> | Player asking the info
    PRECONDITION: The player requesting info could see the transfer or settlement on the map!
    "type": <BOOL> | True = Transfer, False = Settlement
    }

    JSON Output Format:
    {
    dict containing soldiers and their amount + resources, e.g.:
    dictionary = {ArmoredFootman: 1, Huskarl: 2, OrderKnight: 3, Horseman: 10, Knight: 5, Militia: 18, food: 5, wood: 25, me: False}
    "me" specifies if the settlement or transfer is owned by myself.
    }
    """
    data = request.args

    typee = data.get('type')
    if isinstance(typee, str):
        if typee == 'False' or typee == 'false':
            typee = False
        else:
            typee = True

    if typee:  # Transfer
        transfer = transfer_data_acces.instantiateTransfer(data.get('oid'))
        pid = transfer.pid
        customer = transfer.pname
    else:  # Settlement
        cursor = connection.get_cursor()
        cursor.execute('SELECT pid,pname FROM settlement WHERE id=%s;', (data.get('oid'),))
        info = cursor.fetchone()
        pid = info[0]
        customer = info[1]
        print(info)

    info = TransferDataAccess.getInfo(pid, data.get('pname'), customer, soldier_data_acces, clan_data_acces,
                                      friend_data_access, package_data_acces)
    info["me"] = customer == data.get('pname')

    if not typee: # Settlement
        info["id"] = data.get('oid')  # Set id to sid

    print(info)
    return jsonify(info)


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
    control = player_data_access.search_player(name)  # Execute functionality
    if control:
        return jsonify({"success": control, "message": "Player exists"})
    else:
        return jsonify({"success": control, "message": "Player doesn't exists"})


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
    control = friend_data_access.send_Friendrequest(Friend_request, data.get("pname"))
    if control:
        return jsonify({"success": control, "message": "Friend request is send"})
    else:
        return jsonify({"success": control, "message": "Friend request isn't send"})


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
        friend_data_access.accept_Friendrequest(state, id, pname, sname)  # Execute functionality

    elif content_data_access.isClanRequest(id):
        clan_data_acces.accept_clanrequest(state, id, pname, sname)  # Execute functionality

    # Send a message back to the user from the admin account
    if state:
        message1 = Content(None, None, "Your request is accepted by " + pname, "admin")
        control = content_data_access.add_message(message1, sname)
        return jsonify({"success": control, "message": "accepted"})
    else:
        message1 = Content(None, None, "Your request is denied by " + pname, "admin")
        control = content_data_access.add_message(message1, sname)
        return jsonify({"success": control, "message": "rejected"})


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


@app.route("/preset", methods=["POST"])
def preset():
    data = request.json

    """
    WARNING: DATA WILL BE LOST
    This script will delete all current data and load some preset information into the game, providing a very basic example of the workings of the game. We recommend you to actually try it out, not all features are (fully) used.
    """

    # # Reset database
    cursor = connection.get_cursor()
    cursor.execute(query)
    connection.commit()

    from preset import presets
    presets()

    connection.commit()

    return jsonify('data')


@app.route("/getAchievements", methods=["GET"])
def getAchieved():
    """
    GET API Call to get achieved achievements

    JSON Input Format:
    {
    "pname": <string> | Player name
    }

    JSON Output Format:
    {
    Dict with items:
    "aname": Achievement Name
    "task": Actual action done
    }
    """
    data = request.args
    pname = data.get("pname")
    data = player_data_access.getAchieved(pname)
    return jsonify(data)


@app.route("/getleaderboard", methods=["GET"])
def getLeaderboard():
    """
   API Call to retrieve the leaderboard
   JSON Output Format (GET):
   List with players returned in json format, ordered by level
   """
    return jsonify(player_data_access.getplayers())


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    """
    Standard catch_all to make sure the site doesn't crash when a file isn't found
    """
    return render_template("index.html")


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
