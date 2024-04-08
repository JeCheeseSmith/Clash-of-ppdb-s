# Database
> A textual description of the database implementation, referring to game mechanics. Make sure to refer to the other database documentation too!

### General

The general idea is that the user own and manages a settlement. They create resources and upgrades/builds their own buildings to increase their level.
A player can train different types of soldiers and attack other players or NPCs. The main gameplay centers around sending "packages/transfers" around the world. 
A transfer can be an attack to another settlement or another transfer that currently travels around the map.
You can capture and recapture transfers as long they move around the globe. Stealing each others transfer is an essential game mechanic!
Multiple enhancements are added to improve the user experience; social menu's, quests, levels & guilds. 


### Player
Players are uniquely identified by their username. The login is only password protected and optionally the (relative) path of an avatar can be set to display a users profile.
Each player has an amount of gems, a level and associated XP. The last logout timestamp is kept to recalculate the resources for a user on login. 

It is possible to achieve Achievements which are uniquely identified by a name. A task is given. Each Quest is also an Achievement, since it's the same data that needs to be stored. However, they have a deadline (Timestamp) specified to be completed before.

Each Achievement contains a Package, which is the reward for fulfilling a noble task. (See Package)

Optionally, a user can interact with a Wheel of Fortune to get a bonus package. 

Players own one or more Settlements. 

There is one special user; the admin. (Game Administrator)

Players can friend each other. 

### Settlement

A settlement is uniquely owned by a player. It is identified by an ID (serial) and can be given a name to ease communication for the user.
The location on the map is stored in the settlement. 

Settlements contain buildings and can unlock them. A settlement can also unlock soldier-types. A certain level is required for each entity.

A settlement has a finite amount of resources. It can produce more overtime by using the correct buildings.

### Soldier

Different types of soldiers with strengths towards other types exists. For example: An archer will have a damage advantage over infantry types but infantry could bring more resource with them.

Soldiers have an amount of health and damage they do. Also, they consume food at a time function. When food runs out in the settlement, the soldiers will die or desert.

Some soldiers might move faster than others. Plan your transfer strategically!

A soldier has a cost & time to train, which is specified per type. 

### Building

You can place multiple buildings of the same type. The types are referred to as "Buildables" and have a unique name. They perform an action specified in a category (type). Farmers may produce food, woodcutters produce wood for upgrading buildings. Some buildings store amounts of resource and others allow for bonus effects such as increasing the health of a soldier type.
Refer to the other documentation for specific amounts & functions. 

A building costs resources to build, which are specified in the upgradeFunction. The time needed to build the building is specified in a timeFunction. We use a more technical representation of these functions to evaluate them with ease.

### Package

A package is an entity to store resources. It is purely for technical convenience and hasn't anything to do for the user.
Uniquely identified with an id. All other parts are optional and are amounts. e.g. Stone is the amount of stone in the package.

Soldiers are linked to the package via the Troops relation in the database. An amount is specified, as well as a boolean: Discovered & Transferable.
Users can specify if they want to transfer the troops attached to a package or transfer or let them return home. The discovered boolean is used to determine if the soldier is spotted/spied on by a rivaling player.

### Transfer

Transfer, uniquely identified by their ID (Serial) have a base speed. In the backend, the speed is evaluated with the speed of each soldier in mind too.

The discovered bool is used for the same purpose.

Transfer move from a settlement/transfer towards another settlement/transfer. Transfers can be captured/intercepted by other transfers. 

As should be clear, a transfer also contains a package. A transfer is owned by a player.

### Clan

A clan is uniquely identified by their name. They have a status, like an oneliner/headline and a more formal description, specified by the clan Leader: a player.
Players can optionally join a guild. 

Allied players can transfer goods to support each other and bring peace to their alliance: they can't attack each-other.

### Content

A content can be a message or a request. The send time & content (actual message, e.g. "Hi friends!") is saved. Content is identified by a serial; id.

Contents/Messages are send from one player to another, to perform direct messaging. The shared relation is used to make a group chat for a clan. 

A request is a specialization of content and has a status; True = Accepted, False = Rejected. It is used to store Clan Invitations, Friend Request (Inherited specializations).

### Timer

A building, soldier or transfer might take time until it arrives. In the database we keep track of the current actions that are running. The server regularly checks if there are timers that need to be resolved.