from dataAcces.friend import *
from dataAcces.clan import *
from database import *
from dataAcces.player import *
from dataAcces.content import *
from dataAcces.achievement import *
from dataAcces.building import *
from dataAcces.package import *
from dataAcces.settlement import *
from dataAcces.soldier import *
from dataAcces.transfer import *
from dataAcces.clan import *
from database import *
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask.templating import render_template

# INITIALIZE SINGLETON SERVICES
app = Flask('Travisia', static_folder='frontend/dist/static', template_folder='frontend/dist')
connection = DBConnection()
DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"
CORS(app)

player_data_access = PlayerDataAccess(connection)  # Run on the same connection to minimise usage / # of connections
content_data_access = ContentDataAccess(connection)
clan_data_acces = ClanDataAccess(connection)
friend_data_access = FriendDataAccess(connection)
# package_data_acces =

@app.route('/signin', methods=['POST'])
def add_player():
    data = request.json
    controle = False
    playerobj = Player(name=data.get('name'), password=data.get('password'), avatar=None, gems=0, xp=0, level=0,
                       logout=None)
    controle = player_data_access.add_user(playerobj)
    if controle:
        return jsonify(playerobj.to_dct())
    else:
        return jsonify("Failed signup")


@app.route('/login', methods=['GET'])
def get_login():
    data = request.json
    player_name = data.get('name')
    player_password = data.get('password')
    playerobj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,
                       logout=None)
    controle = False
    controle = player_data_access.get_login(playerobj)

    if controle:
        return "Login successful"
    else:
        return "Login Failed"


@app.route('/chat', methods=['POST', 'GET'])
def update_chatbox():
    data = request.json
    message_id = data.get('id')
    message_moment = data.get('moment')
    message_content = data.get('content')
    message_pname = data.get('pname')
    message_sname = data.get('sname')
    if request.method == 'POST':
         controle = False
         chatobj = Content(message_id, message_moment, message_content, message_pname)
         Rchatobj = Retrieve(message_id, message_sname)
         controle = content_data_access.add_message(chatobj)
         if controle == True:
             controle = content_data_access.add_message2(Rchatobj)
             return jsonify(chatobj.to_dct(), Rchatobj.to_dct())
         else:
             return "Message failed to store"

    elif request.method == 'GET':
        obj = content_data_access.get_chatbox(message_pname)
        return jsonify(obj)



@app.route('/resources', methods=['GET'])
def get_resources():
    """
    Function to retrieve current amount of resources of a settlement
    :return:
    """
    # User -> Settlement -> Package
    # package

    pass


@app.route('/grid', methods=['GET'])
def get_grid():
    pass


@app.route('/buildings', methods=['GET'])
def get_buildings():
    pass


@app.route('/createClan', methods=['POST'])
def createClan():
    """
    API Endpoint to create a new Clan

    JSON Input Format
    {
    'name': <string> | The name of th e clan
    'pname': <string> | Clan Leader name (Player Entity)
    'description': <string> | Info about the clan
    'status': <string> | Current Clan status - Oneliner
    }

    JSON Output Format:
    {
    'succes': <bool> | State of request
    }
    """
    data = request.json
    succes = clan_data_acces.add_clan(
    Clan(data.get("name"), data.get("pname"), data.get("description"), data.get("status")))

    return jsonify({'succes': succes})

@app.route('/searchClan', methods=['POST'])
def searchClan():
    """
    Search for a particular clan and retrieve its information

    JSON Input Format
    {
    'name': <string> | Clan name
    }

    JSON Output Format
    {
    'succes': <bool> | Status
    'name': <string> | Clan Name
    'pname': <string> | Clan Leader name (Player Entity)
    'description': <string> | Info about the clan
    'status': <string> | Current Clan status - Oneliner
    }
    """

    data = request.json
    clan = clan_data_acces.get_clan(Clan(data.get('name'), None, None, None))
    dct = clan.to_dct()

    if clan.status == "Clan doesn't exists":
        dct["succes"] = False
    else:
        dct["succes"] = True

    return jsonify(dct)

@app.route('/joinClan', methods=['POST'])
def joinClan():
    """
    Make a request to join the Clan; sends a message to the Clan Leader too

    JSON Input Format:

    {
    'cname': <string>,
    'sender': <string>
    }

    JSON Output Format:

    {
    'succes': <bool> | State of request
    'message': <string> | Standard reply
    }
    """
    data = request.json

    crequest = RequestTravisia(None, None, "Dear High Magistrate of this clan, may I join your alliance?", data.get("sender"), None)
    cname = data.get('cname')  # Name of the clan
    succes = clan_data_acces.sendRequest(crequest, cname)

    return jsonify({'succes': succes, 'message': "Your request has been send. Please await further correspondence!"})

@app.route('/getclanrequest', methods=['POST'])
def getclanrequest():
    return jsonify({'succes': True, # found something: succes = True
                    'sendername': "abu",
                    'content': "Dear High Magistrate of 'Clan Name', may I join your alliance?"})


@app.route('/searchPerson', methods=['POST'])
def searchPlayer():
    data = request.json
    name = data.get('name')
    controle = player_data_access.search_player(name)
    return jsonify({'SearchPerson': controle})

@app.route('/sendfriendrequest', methods=['POST'])
def sendfriendrequest():
    data = request.json
    message_content = data.get('content')
    message_pname = data.get('pname')
    message_sname = data.get('sname')
    print(message_sname)

    message = RequestTravisia(None, None, message_content, message_pname, False)

    controle=False
    controle=friend_data_access.send_Friendrequest(message,message_sname)

    if controle==True:
        return jsonify({'FriendRequest':controle})
    else:
        return jsonify({'FriendRequest':controle})

@app.route('/getfriendrequest', methods=['GET'])
def getfriendrequest():
    data = request.json
    name = data.get('name')
    obj = friend_data_access.get_Friendrequest(name)
    return jsonify(obj)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """
    Standard catch_all to serve each file
    :param path:
    :return:
    """
    return render_template("index.html")


# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
