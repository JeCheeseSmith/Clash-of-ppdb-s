from flask import Flask
from flask import request, jsonify
from src.dataAcces.player import *
from src.dataAcces.message import *
from flask.templating import render_template
from database import *
from src.dataAcces.package import *

# INITIALIZE SINGLETON SERVICES
app = Flask('Travisia',static_folder='frontend/dist/static',template_folder='frontend/dist')
connection = DBConnection()
DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"

player_data_access = PlayerDataAccess(connection) # Run on the same connection to minimise usage / # of connections
message_data_access = MessageDataAccess(connection)
package_data_acces = PackageDataAccess(connection)


@app.route('/Signin', methods=['POST'])
def add_player():
    data = request.json
    player_name = data.get('name')
    player_password = data.get('password')
    controle = False
    playerobj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,logout=None)
    controle = player_data_access.add_user(playerobj)
    if controle:
        return jsonify(playerobj.to_dct())
    else:
        return "Failed signup"


@app.route('/login', methods=['GET'])
def get_login():
    data = request.json
    player_name = data.get('name')
    player_password = data.get('password')
    playerobj = Player(name=player_name, password=player_password, avatar=None, gems=None, xp=None, level=None,logout=None)
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
        chatobj = Message(message_id, message_moment, message_content, message_pname)
        Rchatobj = Retrieve(message_id,message_sname)
        controle = message_data_access.add_message(chatobj)
        if controle == True:
            controle = message_data_access.add_message2(Rchatobj)
            return jsonify(chatobj.to_dct(),Rchatobj.to_dct())
        else:
            return "Message failed to store"

    elif request.method=='GET':
        obj=message_data_access.get_chatbox(message_pname)
        #return jsonify(for test in obj)

@app.route('/resources/<int:id>', methods=['GET'])
def get_resources():
    """
    Function to retrieve current amount of resources of a settlement
    :return:
    """
    # User -> Settlement -> Package
    #package
    package_data_acces.get_resources(id)


    pass

@app.route('/grid', methods=['GET'])
def get_grid():
    pass

@app.route('/buildings', methods=['GET'])
def get_buildings():
    pass

# -login
# messages laatste tien en update naar mate aantal
# clanrequest
# clan aanmaken

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
