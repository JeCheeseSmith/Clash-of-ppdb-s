from src.dataAcces.player import *
from src.dataAcces.content import *
from src.dataAcces.achievement import *
from src.dataAcces.building import *
from src.dataAcces.package import *
from src.dataAcces.settlement import *
from src.dataAcces.soldier import *
from src.dataAcces.transfer import *
from src.dataAcces.friend import *
from src.dataAcces.clan import *
from src.database import *
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
    """
        API request to sign in as a new player with a unique name and password

        JSON Input Format:

        {
        'name': <string>,
        'password': <string>
        }

        JSON Output Format:

        {
        'success': <bool> | State of Signrequest
        'message': <string> | Standard reply
        }
        """
    data = request.json
    name = data.get('name')
    password = data.get('password')
    Controle = False
    Player_obj = Player(name=name, password=password, avatar=None, gems=0, xp=0, level=0,logout=None)
    Controle = player_data_access.add_user(Player_obj)
    if Controle:
        return jsonify({'success':Controle, 'message': "Signed in successful"})
    else:
        return jsonify({'success':Controle, 'message': "Signed in failed"})


@app.route('/login', methods=['GET'])
def get_login():
    """
            API request to log in as a player with a unique name and password

            JSON Input Format:

            {
            'name': <string>,
            'password': <string>
            }

            JSON Output Format:

            {
            'success': <bool> | State of Loginrequest
            'message': <string> | Standard reply
            }
            """
    data = request.json
    player_name = data.get('name')
    player_password = data.get('password')
    Player_obj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,logout=None)
    Controle = False
    Controle = player_data_access.get_login(Player_obj)
    if Controle:
        return jsonify({'success':Controle, 'message':"Login successful"})
    else:
        return jsonify({'success':Controle, 'message':"Login failed"})


@app.route('/chat', methods=['POST', 'GET'])
def update_chat():
    """
           POST: API request to send a message to another player
           GET: API request to get messages from the player

           JSON Input Format(POST):

           {
           'id': <int>,
           'momemt': <string>
           'content': <string>
           'pname': <string>
           'sname': <string>
           }

           JSON Input Format(GET):

           {
           'pname': <string>
           }

           JSON Output Format(POST):

           {
           'success': <bool> | State of Send of the message
           'message': <string> | Standard reply
           }

           Output Format(GET): List with messages returned in json format

           """
    data = request.json
    message_id = data.get('id')
    message_moment = data.get('moment')
    message_content = data.get('content')
    message_pname = data.get('pname')
    message_sname = data.get('sname')
    if request.method == 'POST':
         Controle = False
         Chat_obj = Content(message_id, message_moment, message_content, message_pname)
         Rchat_obj = Retrieve(message_id, message_sname)
         Controle = content_data_access.add_message(Chat_obj)
         if Controle:
             Controle = content_data_access.add_message2(Rchat_obj)
             return jsonify({'success': Controle, 'message': "message send successful"})
         else:
             return jsonify({'success': Controle, 'message': "Failed to send message"})


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

    rhequest = Request(None, None, "Dear High Magistrate of this clan, may I join your alliance?", data.get("sender"),None)
    cname = data.get("cname") # Name of the clan
    succes = clan_data_acces.sendRequest(rhequest, cname)

    return jsonify({'succes': succes, 'message': "Your request has been send. Please await further correspondence!"})


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


@app.route('/friendRequests', methods=['GET'])
def friendRequests():
    return jsonify({'FriendRequests': True})


@app.route('/searchPerson', methods=['POST'])
def search_player():
    """
            API request to search a player that plays the game

            JSON Input Format:

            {
            'pname': <string>
            }

            JSON Output Format:

            {
            'success': <bool> | State of Search of the player
            'message': <string> | Standard reply
            }
            """
    data = request.json
    name = data.get('pname')
    Cotrole=False
    Controle=player_data_access.search_player(name)
    if Controle:
        return jsonify({'success': Controle, 'message': "Player exists"})
    else:
        return jsonify({'success': Controle, 'message': "Player doesn't exists"})

@app.route('/sendfriendrequest', methods=['POST'])
def send_friend_request():
    """
               POST: API request to send a friend request to another player

               JSON Input Format:

               {
               'id': <int>,
               'momemt': <string>
               'content': <string>
               'pname': <string>
               'sname': <string>
               }

               JSON Output Format:

               {
               'success': <bool> | State of Send of the friend request
               'message': <string> | Standard reply
               }

               """
    data = request.json
    message_id = data.get('id')
    message_moment = data.get('moment')
    message_content = data.get('content')
    message_pname = data.get('pname')
    message_sname = data.get('sname')
    Friend_request = Content(message_id, message_moment, message_content, message_pname)
    Controle=False
    Controle=friend_data_access.send_Friendrequest(Friend_request,message_sname)
    if Controle:
        return jsonify({'success': Controle, 'message': "Friend request is send"})
    else:
        return jsonify({'success': Controle, 'message': "Friend request isn't send"})

@app.route('/getgeneralrequests', methods=['POST'])
def get_general_requests():
    """
             API request to get friend requests from the player


               JSON Input Format:

               {
               'pname': <string>
               }

               Output Format: List with friend requests returned in json format

               """
    data = request.json
    pname = data.get('pname')
    Friendrequests= friend_data_access.get_Friendrequest(pname)
    Clanrequests= clan_data_acces.get_Friendrequest(pname)
    Generalrequest= Friendrequests + Clanrequests

    # Sort merged list based on the moment
    Generalrequest = sorted(Generalrequest, key=lambda x: x['moment'])
    return jsonify(Generalrequest)

#combine friend and clan reequest
#


@app.route('/accept_requests', methods=['POST'])
def accept_friend_requests():
    """
                   POST: API request to accept or decline a friend request of another player

                   JSON Input Format:

                   {
                   'state': <string>
                   'pname': <string>
                   'sname': <string>
                   }

                   JSON Output Format:

                   {
                   'success': <bool> | State of Accepting
                   'message': <string> | Standard reply
                   }

                   """
    data = request.json
    pname = data.get('pname')
    sname = data.get('sname')
    state = data.get('state')
    Controle = False
    Controle = friend_data_access.accept_Friendrequest(state,pname,sname)
    if Controle:
        #De andere player moet ook een melding krijgen!!!
        return jsonify({'success': Controle, 'message': "accepted"})
    else:
        #De andere player moet ook een melding krijgen!!!
        return jsonify({'success': Controle, 'message': "not accepted"})








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
