# TUTORIAL Len Feremans, Sandy Moens and Joey De Pauw
# see tutor https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-python-flask-and-mysql--cms-22972
from flask import Flask
from flask.templating import render_template
from flask import request, session, jsonify

from config import config_data
from player import *

# INITIALIZE SINGLETON SERVICES
app = Flask('Tutorial ')
app.secret_key = '*^*(*&)(*)(*afafafaSDD47j\3yX R~X@H!jmM]Lwf/,?KT'
app_data = dict()
app_data['app_name'] = config_data['app_name']
connection = DBConnection(dbname=config_data['dbname'], dbuser=config_data['dbuser'],password='password')
player_data_access = PlayerDataAccess(connection)

DEBUG = False
HOST = "127.0.0.1" if DEBUG else "0.0.0.0"



@app.route('/Signin', methods=['POST'])
def add_player():
    data=request.json
    player_name=data.get('name')
    player_password=data.get('password')
    test=Player(name=player_name,password=player_password,avatar=None,gems=None,xp=None,level=None,logout=None)
    test=player_data_access.add_user(test)
    return jsonify(test.to_dct())

@app.route('/login', methods=['GET'])
def get_login():
    objects = player_data_access.get_quotes()
    # Translate to json
    return jsonify([obj.to_dct() for obj in objects])

#@app.route('/quotes', methods=['POST'])
#def add_quote():
    # Text value of <input type="text" id="text"> was posted by form.submit
#    quote_text = request.form.get('text')
#    quote_author = request.form.get('author')
    # Insert this value into table Quote(ID,TEXT)
#    quote_obj = User(iden=None, text=quote_text, author=quote_author)
#    print('Adding {}'.format(quote_obj.to_dct()))
#    quote_obj = quote_data_access.add_quote(quote_obj)
#    return jsonify(quote_obj.to_dct())


# VIEW
#@app.route("/")
#def main():
#    return render_template('index.html', app_data=app_data)


# Route for seeing a data
@app.route('/data')
def get_time():
    # Returning an api for showing in  reactjs
    return {
        'Name': "geek",
        "Age": "22",
        "programming": "python"
    }

# RUN DEV SERVER
if __name__ == "__main__":
    app.run(HOST, debug=DEBUG)
