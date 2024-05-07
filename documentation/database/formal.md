# Database
> This documentation explains the database and it's structure
> > Make sure to open ER-Diagram.pptx too!

We would like to store the majority of our information in the database. This allows us to shut down the activity of a specific user totally when the user is not playing. 

1. Each Clan Request is a message and has a status. It is created by a NonMember and SendTo the ClanLeader and so on shared with the Guild.
2. Transfer Request is created by a friended Member (incl. Guild)| send to another person.
3. An Update/Report should be created by the system/admin user.
4. A package consists of resources and troops. All troops are used to defend the package.
5. A transfer has a relation from and a relation to| to a settlement. This way a transfer can be easily changed to be captured by another nation.
6. The format we use for polynomial functions is e.g.: [50,5,10] which translates to f(x)=50x^2 + 5x + 10. The array length is undefined, however it may not start with a **0**!
7. The format we use for exponential function is e.g.: [0,50,1] which translates to: 50* **2^x** + 1. This form can only be expressed in an array of length 2.

A SQL setup file is provided [here](../../sql/schema.sql). This drops the whole current database and creates a new one.

## Table Explanation
> List of tables with the explanation of each table and field per table

### Entity Tables
> These tables are mostly used to store factual data about an Entity in the game. 

| Table                               | Function                                                                       |
|-------------------------------------|--------------------------------------------------------------------------------|
| [soldier](#soldier)                 | Stores all the different soldier types possible                                |
| [package](#package)                 | Contains the different packages; resources & soldiers linked to another entity |
| [player](#player)                   | Contains the data of all users                                                 |
| [content](#content)                 | Base class to store message related data                                       |
| [message](#message)                 | Specialisation Class to store messages between users                           |
| [request](#request)                 | Specialisation Base Class to store requests and their status                   |
| [clanRequest](#clanRequest)         | Specialization on request type                                                 |
| [friendRequest](#friendRequest)     | Specialization on request type                                                 |
| [settlement](#settlement)           | Store and link all data from a settlement                                      |
| [admin](#admin)                     | Contains the users who are also admins                                         |
| [clan](#clan)                       | Contains all current clans and their info                                      |
| [achievement](#achievement)         | Stores the different achievements                                              |
| [transfer](#transfer)               | Keeps all the active transfers between settlements                             |
| [buildable](#buildable)             | All possible buildings to build                                                |
| [building](#building)               | Actual buildable placed into a settlement                                      |
| [timer](#timer)                     | Keep track of the currently ongoing time process                               |

### Relational Tables
> These tables are used to implemented relations between entities from the table.

| Table                             | Function                                                  |
|-----------------------------------|-----------------------------------------------------------|
| [friend](#friend)                 | Stores the friended relation between users                |
| [member](#member)                 | Stores the members of a clan                              |
| [retrieved](#retrieved)           | Keeps track of the messages delivered to a receiving user |
| [shared](#shared)                 | Messages displayed in a groups chat from a clan           |
| [troops](#troops)                 | Relation to stores troops connected to a package          |
| [unlocked](#unlocked)             | Relation to express if a building or soldier is unlocked  |
| [wheelofFortune](#wheelofFortune) | Interactive relation for the spin on the Wheel of Fortune |
| [achieved](#achieved)             | Stores the achievements a player made                     |

### soldier

| Name         | Type    | Explanation                                                                        |
|--------------|---------|------------------------------------------------------------------------------------|
| name         | VARCHAR | PRIMARY KEY                                                                        | Unique identifier & name                                             |
| type         | VARCHAR | The soldiers specialization                                                        |
| health       | INT     | Amount of health a soldier has                                                     |
| damage       | INT     | Amount of damage a soldier does towards others                                     |
| capacity     | INT     | Amount of resources a soldier can take with                                        |
| consumption  | INT     | Amount of food a soldier consumes per time unity                                   |
| speed        | FLOAT4  | Travel speed of the soldier                                                        |
| stealth      | FLOAT4  | Numerical value used to calculate how fast a soldier is discovered by another user |
| cost         | INT     | Numerical value which describes steel costs to train the unit                      |
| trainingTime | INT     | Numerical value which describe the time needed to train the unit                   |

### package

| Name  | Type   | Explanation          |
|-------|--------|----------------------|
| id    | INT    | PRIMARY KEY          |
| stone | BIGINT | Amount of resource   |
| wood  | BIGINT | Amount of resource   |
| steel | BIGINT | Amount of resource   |
| food  | BIGINT | Amount of resource   |
| gems  | BIGINT | Amount of resource   |
| xp    | BIGINT | Amount of experience |

### player

| Name     | Type      | Explanation                                               |
|----------|-----------|-----------------------------------------------------------|
| name     | VARCHAR   | PRIMARY KEY                                               |
| password | VARCHAR   | Authentication                                            |
| avatar   | VARCHAR   | String to the avatar path                                 |
| gems     | BIGINT    | Amount of gems, a special resource to fasten the game     |
| xp       | BIGINT    | Amount of current experience, used to calculate the level |
| level    | INT       | Level                                                     |
| logout   | TIMESTAMP | Last time a player logged out at this time                |

### content

| Name    | Type      | Explanation                         |
|---------|-----------|-------------------------------------|
| 
| id      | INT       | PRIMARY KEY                         |
| moment  | TIMESTAMP | Moment of generation of the content |
| content | TEXT      | The actual text                     |
| pname   | VARCHAR   | Implementation of the Send Relation |

### message

| Name | Type | Explanation   |
|------|------|---------------|
| id   | INT  | ID of Content |

### request

| Name   | Type | Explanation                   |
|--------|------|-------------------------------|
| id     | INT  | ID of Message; specialization |
| accept | BOOL | Status of the request         |

### clanRequest

| Name | Type | Explanation                   |
|------|------|-------------------------------|
| id   | INT  | ID of Request; specialization |

### friendRequest

| Name | Type | Explanation                   |
|------|------|-------------------------------|
| id   | INT  | ID of Request; specialization |

### admin

| Name | Type | Explanation                  |
|------|------|------------------------------|
| id   | INT  | ID of Player; specialization |

### clan

| Name        | Type    | Explanation                          |
|-------------|---------|--------------------------------------|
| name        | VARCHAR | PRIMARY KEY                          |
| pname       | VARCHAR | Leader Relation                      |
| status      | VARCHAR | Oneliner expressing the clan         |
| description | TEXT    | Detailed description of the alliance |

### settlement

| Name  | Type    | Explanation                                         |
|-------|---------|-----------------------------------------------------|
| id    | INT     | PRIMARY KEY                                         |
| name  | VARCHAR | Unique name of the settlement                       |
| mapX  | INT     | X Coordinate on the map                             |
| mapY  | INT     | Y Coordinate on the map                             |
| pid   | INT     | Has Relation: Resources currently in the settlement |
| pname | VARCHAR | Owns Relation: Player owning the settlement         |

### achievement

| Name | Type    | Explanation                        |
|------|---------|------------------------------------|
| name | VARCHAR | PRIMARY KEY,                       |
| task | TEXT    | Description of the tasks to do     |
| pid  | INT     | Contains Relation (See ER-Diagram) |

### transfer

| Name       | Type    | Explanation                                                                  |
|------------|---------|------------------------------------------------------------------------------|
| id         | INT     | PRIMARY KEY                                                                  |
| idTo       | INT     | settlement ID where the transfer goes to: To Relation                        |
| toType     | BOOL    | False: Going to a Settlement, True: Going to a Transfer                      |
| discovered | BOOL    | Saying if the transfer has been spotted by others                            |
| idFrom     | INT     | settlement ID where the transfer comes from: From Relation                   |
| fromType   | BOOL    | Specifies the type we're going from, similar as toType                       |
| pid        | INT     | Referring a Package ID; Contains Relation (The associated package/resources) |
| pname      | VARCHAR | Player who owns the package                                                  |  

### buildable

| Name            | Type     | Explanation                                                                                         |
|-----------------|----------|-----------------------------------------------------------------------------------------------------|
| name            | VARCHAR  | PRIMARY KEY                                                                                         |
| type            | VARCHAR  | The type of the building; Political,  Decoration, Resources, ...                                    |
| function        | TEXT     | The mathematical function to evaluate the resource function with                                    |
| upgradeFunction | TEXT     | Mathematical formula that takes the level as input to calculate upgrade resource                    |
| upgradeResource | SMALLINT | Defines which resources are needed to build: 1: Stone, 2: Wood, 3: Steel, 4: Food, 12: Stone & Wood |
| timeFunction    | TEXT     | Mathematical formula that describes the building time needed                                        |

### building

| Name          | Type    | Explanation                                                              |
|---------------|---------|--------------------------------------------------------------------------|
| id            | INT     | Unique Identifier (Multiple same buildables can be placed)               |
| name          | VARCHAR | Name of the buildable                                                    |
| level         | INT     | Level of the building                                                    |
| gridX         | INT     | X Coordinate on the settlement grid  (Upper Left corner of the building) |
| gridY         | INT     | Y Coordinate on the settlement grid  (Upper Left corner of the building) |
| sid           | INT     | Contains Relation; Expressing which buildings are in which settlement    |
| occupiedCells | INT[][] | Contains the cells a Building occupies on the grid                       |

### timer
| Name     | Type      | Explanation                                                            |
|----------|-----------|------------------------------------------------------------------------|
| id       | INT       | PRIMARY KEY                                                            |
| oid      | INT       | Unique Identifier of the Object we are referring to (e.g. building ID) |
| name     | TEXT      | Type of the object the id is referring to (e.g. building.name)         |
| start    | TIMESTAMP | Start of the timer                                                     |
| done     | TIMESTAMP | End of the timer                                                       |
| duration | BIGINT    | Duration in seconds (done-start)                                       |
| sid      | INT       | Identifier of the settlement the timer belongs to                      |

### friend

| Name   | Type    | Explanation        |
|--------|---------|--------------------|
| pname1 | VARCHAR | Friend with pname2 |
| pname2 | VARCHAR | Friend with pname1 |

### member

| Name  | Type    | Explanation              |
|-------|---------|--------------------------|
| pname | VARCHAR | Player which is in cname |
| cname | VARCHAR | Name of the clan         |

### retrieved

| Name  | Type    | Explanation                  |
|-------|---------|------------------------------|
| mid   | INT     | Content ID                   |
| pname | VARCHAR | Player receiving the content |

### shared

| Name  | Type    | Explanation                                   |
|-------|---------|-----------------------------------------------|
| mid   | INT     | Content ID                                    |
| cname | VARCHAR | Name of the clan the messages are shared with |

### troops

| Name         | Type    | Explanation                                                                            |
|--------------|---------|----------------------------------------------------------------------------------------|
| pid          | INT     | Package ID the soldier belongs to                                                      |
| sname        | VARCHAR | Identifier for the soldier                                                             |
| amount       | INT     | Number of soldiers of type sname                                                       |
| discovered   | BOOL    | Indicating if soldiers are spotted by another settlement                               |

### unlocked

| Name      | Type    | Explanation                                                                |
|-----------|---------|----------------------------------------------------------------------------|
| bname     | VARCHAR | Name of the soldier or buildable                                           |
| sid       | INT     | Buildable or soldier which is unlocked by the settlement, specified by sid |
| maxNumber | INT     | Maximum number of entries a settlement may have of this type               |

### wheelofFortune

| Name  | Type      | Explanation                           |
|-------|-----------|---------------------------------------|
| pname | VARCHAR   | Name of the player spinning the wheel |
| sid   | INT       | Sid of the player main settlement     |
| last_timespin | TIMESTAMP | Stored time of the last spin          |


### achieved

| Name   | Type    | Explanation                                                                                                                 |
|--------|---------|-----------------------------------------------------------------------------------------------------------------------------|
| pname  | VARCHAR | Player who achieved the achievement                                                                                         |
| aname  | VARCHAR | Name of the achievement which is achieved                                                                                   |
| amount | INT     | Number of times the action need to be done. Decremented upon doing 1 action. A negative amount means the task is completed. |
