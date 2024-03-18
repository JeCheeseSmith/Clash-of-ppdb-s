from dataAcces.player import *
from dataAcces.content import *
from dataAcces.achievement import *
from dataAcces.building import *
from dataAcces.package import *
from dataAcces.settlement import *
from dataAcces.soldier import *
from dataAcces.transfer import *
from dataAcces.friend import *
from dataAcces.clan import *
from database import *
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
    Controle = player_data_access.add_user(Player_obj, settlement_data_acces,content_data_access)
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
    Controle = False
    Controle = player_data_access.get_login(Player_obj)
    if Controle:
        return jsonify({"success": Controle[0], "message": "Login successful", "sid": Controle[1]})
    else:
        return jsonify({"success": Controle[0], "message": "Login failed", "sid": Controle[1]})


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
        Controle = False
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
    # data = request.json
    # message_pname = data.get("pname")
    # message_cname = data.get("cname")

    if request.method == "POST":
        data = request.json
        message_pname = data.get("pname")
        message_cname = data.get("cname")
        message_content = data.get("content")
        Controle = False
        Chat_obj = Content(None, None, message_content, message_pname)
        Controle = content_data_access.send_groupchat(message_pname,message_cname,Chat_obj)
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
    packageDict = settlement_data_acces.getResources(Settlement(id))
    return jsonify(packageDict)

@app.route("/grid", methods=["GET"])
def get_grid():
    pass


@app.route("/buildings", methods=["GET"])
def get_buildings():
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
    "succes": <bool> | State of request
    }
    """
    data = request.json
    succes = clan_data_acces.add_clan(
        Clan(data.get("name"), data.get("pname"), data.get("description"), data.get("status")))
    return jsonify({"succes": succes})


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
    "succes": <bool> | State of request
    "message": <string> | Standard reply
    }
    """
    data = request.json

    rhequest = Request(None, None, "Dear High Magistrate of this clan, may I join your alliance?", data.get("sender"),None)
    cname = data.get("cname")  # Name of the clan
    succes = clan_data_acces.sendRequest(rhequest, cname)

    if succes:
        message = "Your request has been send. Please await further correspondence!"
    else:
        message = "You can't join a clan if you're already in one!"

    return jsonify({"succes": succes, "message": message})


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
    "succes": <bool> | Status
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
        dct["succes"] = False
    else:
        dct["succes"] = True
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
    Controle = player_data_access.search_player(name)
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
    Friendrequests = friend_data_access.get_Friendrequest(pname)
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

    if content_data_access.isFriendRequest(id):
        Controle = friend_data_access.accept_Friendrequest(state, id, pname, sname)

        if state:
            message1 = Content(None, None, "Your request is accepted by " + pname, "admin")
            Controle = content_data_access.add_message(message1, sname)
            return jsonify({"success": Controle, "message": "accepted"})
        else:
            message1 = Content(None, None, "Your request is denied by " + pname, "admin")
            Controle = content_data_access.add_message(message1, sname)
            return jsonify({"success": Controle, "message": "rejected"})

    elif content_data_access.isClanRequest(id):
        Controle = clan_data_acces.accept_clanrequest(state,id,pname,sname)

        if state:
            message1 = Content(None, None, "Your request is accepted by " + pname, "admin")
            Controle = content_data_access.add_message(message1, sname)
            return jsonify({"success": Controle, "message": "accepted"})
        else:
            message1 = Content(None, None, "Your request is denied by " + pname, "admin")
            Controle = content_data_access.add_message(message1, sname)
            return jsonify({"success": Controle, "message": "not accepted"})

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
    "succes": <BOOL> | Request status
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
    status = friend_data_access.get_friend(pname)
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
    "succes": <BOOL> | Request status
    }
    """
    data = request.json
    succes = clan_data_acces.leaveClan(data.get('name'))
    return jsonify({"succes": succes})

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
    "succes": <BOOL> | Request status
    }
    """
    data = request.json
    succes = clan_data_acces.deleteClan(data.get('cname'), data.get('pname'))
    return jsonify({"succes": succes})

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
