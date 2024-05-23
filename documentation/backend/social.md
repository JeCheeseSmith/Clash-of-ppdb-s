# Social
> This parts explains the working of the social backend in our game: Managing clans, friends & chats.

#### add_player()

This API is made to sign up a new player. 

For this function we use another function from the class PlayerDataAccess called

add_user(). It inserts and initialises the new player data in the correct way in the database.

In this function we also use another function from the class FriendDataAccess called

add_admin. It is a function that makes you and the admin automatically friends.

#### get_login()

This function is made to log in a player. So the frontend can do a post to check if the player really exists in the backend.

For this function we use another function from the class PlayerDataAccess called

get_login. It checks if the player really exists.

#### logout()

Function to register to logout time of a player. The logout time can be used to compute the new resources after login in again that are generated over time.


**update_chat():**

This function is made to control the chat of a player. So the frontend can do a post to

send a message to another player and also a get to get all messages of the player.

For this function we use another function from the class ContentDataAccess called

add\_message. It inserts a message in the correct way in the database. We also use

another function called get\_chatbox. It returns the chat between two players.

*-API methods=POST AND GET*



**update_groupchat():**

This function is made to control the chat of a clan. So the frontend can do a post to

send a message to the group and also a get to get all messages of the group.

For this function we use another function from the class ContentDataAccess called

send\_groupchat. It inserts a message in the groupchat in the correct way in the

database. We also use another function called get\_groupchat. It returns the group

chat of a clan.

*API methods=POST AND GET*


**createClan():**

This function is made to create a new clan with a unique name and a clan leader. So

the frontend can do a post to create a clan.

For this function we use another function from the class ClanDataAccess called

add\_clan. It inserts a new clan in the correct way in the database.

*API method=POST*



**joinClan()**

This function is made to join a clan as a player. So the frontend can do a post to send

a request to join a clan.

For this function we use another function from the class ClanDataAccess called

sendRequest. It sends a request to the clan leader of that clan as a message.

*API method=POST*



**searchClan():**

This function is made to find a clan with a unique name. So the frontend can do a

post to search a clan out of the database.

For this function we use another function from the class ClanDataAccess called

get\_clan. It returns the right clan with a unique name.

*API method=POST*


**search_player():**

This function is made to find a player with a unique name. So the frontend can do a

post to search a player out of the database.

For this function we use another function from the class PlayerDataAccess called

search\_player. It returns the right player with a unique name.

*API method=POST*

**send_friend_request():**

This function is made to send another player a friend request. So the frontend can do

a post to send another player a request.

For this function we use another function from the class FriendDataAccess called

send\_Friendrequest. It inserts the request correctly into the database.

*API method=POST*

**get_general_requests():**

This function is made to get all your requests like friend or clan requests. So the

frontend can do a post to search the requests out of the database.

For this function we use another function from the class FriendDataAccess called

get\_Friendrequest. It gets all the friend requests out of the database.

For this function we use another function from the class ClanDataAccess called

get\_clanrequest. It gets all the clan requests out of the database.

*API method=POST*




**accept_general_requests():**

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



**removeFriend()**

This function is made to remove a friend. So the frontend can do a post to remove a

friend of the player and set back the database correctly.

For this function we use another function from the class FriendDataAccess called

removeFriend. It removes a friend of the player and sets back the database correctly.

*API method=POST*



**getChats()**

This function is made to retrieve all friends of a player and a clan if the player is a

member of a clan. So the frontend can get all his friends and possibly a clan out of

the database.

For this function we use another function from the class FriendDataAccess called

get\_friend. It returns all the player his friends.

For this function we use another function from the class PlayerDataAccess called

retrieveClan. It checks if the player is a member and returns the clan name.

*API method=GET*



**leaveClan()**

This function is made to leave a clan. So the frontend can do a post to remove a

player out of a clan and set back the database correctly.

For this function we use another function from the class ClanDataAccess called

leaveClan. It removes a player out of a clan and sets back the database correctly.

*API method=POST*


**deleteClan()**

This function is made to delete a clan. So the frontend can do a post to delete a clan

and set back the database correctly.

For this function we use another function from the class ClanDataAccess called

deleteClan. It deletes a clan and sets back the database correctly.

*API method=POST*