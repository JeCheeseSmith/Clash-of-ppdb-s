
# Technical Report


This document will explain how our game works. New players are encouraged to read through this if they are not familiar with the genre of game or if they have question about certain game mechanics.
This explanation is divided into 4 parts: Account management & logging in, Social systems, City management and attack/defending.  

## Making an account | Logging in

#### Signup

When hitting signup on the frontend, a POST Request is send to "/signin" on which an API function is called in app.py:  `def add_player()`  
  
This function extracts the data from the provided JSON into a Player Object. Using the player_data_acces, the functionality towards the backend is called: `def add_user(self, obj)`  
  
This function creates a user and inserts it into the database. Then it setups the initial settlement by inserting a package with basic resources and settlement into the database.  
Also, a welcome message is generated.

#### Login

When hitting login on the frontend, a GET Request is send to "/login" on which an API function is called in app.py:  `def get_login()`  
  
This function extracts the data from the provided JSON into a Player Object. Using the player_data_acces, the functionality towards the backend is called: `def get_login(self, obj)`  

This function checks if the provided name and password matches an account.
If it finds an account it returns true.

## Social systems

#### Friends

##### Sending friend requests

When sending a friend request on the frontend, a POST request is send to '/sendfriendrequest' on which an API function in app.py: `def sendfriendrequest()` is called

This function extracts the data from the provided JSON into a message object. Using the friend_data_access, a backend function `Friendrequest(self, request, sname)` is called using this message object and sname from the JSON file.

This function inserts a friendrequest into the database.

#### Clans

###### Creating a clan

When making a clan on the frontend, a POST request is send to '/createClan' on which an API function in app.py: `def createClan()` is called

This function extracts the data from the provided JSON into a Clan object. This data is immediately inserted into a backend function `add_clan(self, object)` using the clan_data_access.

This function inserts a clan into the database with the given information.

##### Joining a clan

When you want to join a clan, a POST request is send to '/joinClan' on which an API function in app.py: `def joinClan` is called

This function extracts data from the JSON (clan name and sender) and creates a message for the clan leader. A backend function `sendRequest(self, request)` is also called using clan_data_access.
Finally a last message is returned to the sender of the request to let them know that their request has been successfully send.

In the backend function `sendRequest` the request is inserted into the database and then the clan leader is send the request.

#### Chat


## City management

#### Resources

As resources are a vital part of this game managing them will be your top priority, you can see your current amount of resources in a bar in top of the screen.
There four different kinds of resources: wood, stone, iron and food. Wood and stone are predominantly used for constructing buildings and upgrading them while iron is mainly used to recruit your troops, food is used to maintain your current amount of troops. If there is not enough food available your troops will starve and die.

#### Your city

You are able to view your city in the middle of your screen. Buildings are placed on a grid and can always be moved around later.
You are able to rotate and zoom in and out on your city by scrolling with the mouse (zooming in/out) or clicking and dragging (rotating).

On the bottom of the screen there is a build menu, clicking it opens up a larger menu where you can see all kinds of buildings sorted into different tabs. 
## Attacking | Defending





