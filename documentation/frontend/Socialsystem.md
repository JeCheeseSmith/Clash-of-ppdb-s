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