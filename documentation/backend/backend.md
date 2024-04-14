# Backend

The backend consists of app.py & wsgi.py. WSGI is the production server.

In app.py we created a list of API function the frontend is able to call and retrieve its data from.

Also, a lot of data_accesses are setup as Singleton Services



>We made some classes that are imported in the api file(app.py).


| Classes        |
|----------------|
| player.py      |
| content.py     |
 | achievement.py |
| building.py    |
| package.py     |
 | settlement.py  |
 | soldier.py     |
| transfer.py    |
| friend.py      |
 

### Description

>We have made some api functions:


**-def add\_player()**

This function is made to sign up a new player. So the frontend can do a post to store

a new player in the backend.


For this function we use another function from the class PlayerDataAccess called

add\_user. It inserts the new player in the correct way in the database.

For this function we use another function from the class FriendDataAccess called

add\_admin. It is a function that makes you and the admin automatically friends.

*API method=POST*



**-def get\_login():**

This function is made to log in a player. So the frontend can do a post to check if the

player really exists in the backend.



For this function we use another function from the class PlayerDataAccess called

get\_login. It checks if the player really exists.

*API method=POST*



**-def update\_chat():**

This function is made to control the chat of a player. So the frontend can do a post to

send a message to another player and also a get to get all messages of the player.

For this function we use another function from the class ContentDataAccess called

add\_message. It inserts a message in the correct way in the database. We also use

another function called get\_chatbox. It returns the chat between two players.

*-API methods=POST AND GET*



**-def update\_groupchat():**

This function is made to control the chat of a clan. So the frontend can do a post to

send a message to the group and also a get to get all messages of the group.

For this function we use another function from the class ContentDataAccess called

send\_groupchat. It inserts a message in the groupchat in the correct way in the

database. We also use another function called get\_groupchat. It returns the group

chat of a clan.

*API methods=POST AND GET*



**-def get\_resources():**

This function is made to get the resources of a player. So the frontend can do a post

to check the resources of a player.

For this function we use another function from the class SettlementDataAcces called

getResources. It returns all resources of a player.

*API method=POST*



**-def createClan():**

This function is made to create a new clan with a unique name and a clan leader. So

the frontend can do a post to create a clan.

For this function we use another function from the class ClanDataAccess called

add\_clan. It inserts a new clan in the correct way in the database.

*API method=POST*





**-def joinClan():**

This function is made to join a clan as a player. So the frontend can do a post to send

a request to join a clan.

For this function we use another function from the class ClanDataAccess called

sendRequest. It sends a request to the clan leader of that clan as a message.

*API method=POST*



**-def searchClan():**

This function is made to find a clan with a unique name. So the frontend can do a

post to search a clan out of the database.

For this function we use another function from the class ClanDataAccess called

get\_clan. It returns the right clan with a unique name.

*API method=POST*


**-def search\_player():**

This function is made to find a player with a unique name. So the frontend can do a

post to search a player out of the database.

For this function we use another function from the class PlayerDataAccess called

search\_player. It returns the right player with a unique name.

*API method=POST*

**-def send\_friend\_request():**

This function is made to send another player a friend request. So the frontend can do

a post to send another player a request.

For this function we use another function from the class FriendDataAccess called

send\_Friendrequest. It inserts the request correctly into the database.

*API method=POST*

**-def get\_general\_requests():**

This function is made to get all your requests like friend or clan requests. So the

frontend can do a post to search the requests out of the database.

For this function we use another function from the class FriendDataAccess called

get\_Friendrequest. It gets all the friend requests out of the database.

For this function we use another function from the class ClanDataAccess called

get\_clanrequest. It gets all the clan requests out of the database.

*API method=POST*




**-def accept\_general\_requests():**

This function is made to accept all your requests like friend or clan requests. So the

frontend can do a post to accept the requests.

First of all it checks if the request is a friend or clan request with the functions

isFriendRequest and isClanRequest out of the class ContentDataAccess.

For this function we use another function from the class FriendDataAccess called

accept\_Friendrequest. It accepts the request and inserts the player as his/her friend.

For this function we use another function from the class ClanDataAccess called

accept\_clanrequest. It accepts the request and inserts the player into a clan.

Also does the player get a message from the system(admin) about the state of the

request.

*API method=POST*



**-def removeFriend():**

This function is made to remove a friend. So the frontend can do a post to remove a

friend of the player and set back the database correctly.

For this function we use another function from the class FriendDataAccess called

removeFriend. It removes a friend of the player and sets back the database correctly.

*API method=POST*



**-def getChats():**

This function is made to retrieve all friends of a player and a clan if the player is a

member of a clan. So the frontend can get all his friends and possibly a clan out of

the database.

For this function we use another function from the class FriendDataAccess called

get\_friend. It returns all the player his friends.

For this function we use another function from the class PlayerDataAccess called

retrieveClan. It checks if the player is a member and returns the clan name.

*API method=GET*



**-def leaveClan():**

This function is made to leave a clan. So the frontend can do a post to remove a

player out of a clan and set back the database correctly.

For this function we use another function from the class ClanDataAccess called

leaveClan. It removes a player out of a clan and sets back the database correctly.

*API method=POST*


**-def deleteClan():**

This function is made to delete a clan. So the frontend can do a post to delete a clan

and set back the database correctly.

For this function we use another function from the class ClanDataAccess called

deleteClan. It deletes a clan and sets back the database correctly.

*API method=POST*

