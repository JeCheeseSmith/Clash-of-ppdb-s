# Database
> This documentation explains the database and it's structure
> > Make sure to open ER-Diagram.pptx too!

We would like to store the majority of our information in the database. This allows us to shut down the activity of a specific user totally when the user is not playing. 

1. Each Clan Request is a message and has a status. It is created by a NonMember and SendTo the ClanLeader and so on shared with the Guild.
2. Transfer Request is created by a friended Member (incl. Guild), send to another person.
3. An Update/Report should be created by the system/admin user.
4. A package consists of resources and troops. The troops themselves can be transferable or not. All troops are used to defend the package.
5. A transfer has a relation from and a relation to, to a settlement. This way a transfer can be easily changed to be captured by another nation.

A SQL setup file is provided [here](../../sql/schema.sql). This drops the whole current database and creates a new one.

## Table Explanation

### Entity Tables
> These tables are mostly used to store factual data about an Entity in the game. 

| Table               | Function                                                                       |
|---------------------|--------------------------------------------------------------------------------|
| [soldier](#soldier) | Stores all the different soldier types possible                                |
| package             | Contains the different packages; resources & soldiers linked to another entity |
| player              | Contains the data of all users                                                 |
| content             | Base class to store message related data                                       |
| message             | Specialisation Class to store messages between users                           |
| request             | Specialisation Base Class to store requests and their status                   |
| transferRequest     | Specialization on request type                                                 |
| clanRequest         | Specialization on request type                                                 |
| friendRequest       | Specialization on request type                                                 |
| settlement          | Store and link all data from a settlement                                      |
| achievement         | Stores the different achievements                                              |
| quest               | Specialization upon achievements, favoring a deadline                          |
| transfer            | Keeps all the active transfers between settlements                             |
| buildable           | All possible buildings to build                                                |
| building            | Actual buildable placed into a settlement                                      |

### Relational Tables
> These tables are used to implemented relations between entities from the table.

| Table                    | Function                                                                     |
|--------------------------|------------------------------------------------------------------------------|
| [friend](#soldier-table) | Stores the friended relation between users                                   |
| member                   | Stores the members of a clan                                                 |
| retrieved                | Keeps track of the messages delivered to a receiving user                    |
| shared                   | Messages displayed in a groupschat from a clan                               |
| intercept                | Contains the transfers that intercept each other                             |
| troops                   | Relation to stores troops connected to a package                             |
| unlockedBuildable        | Relation to express if a building is unlocked                                |
| unlockedsoldier          | Relation to express if a soldier is unlocked                                 |
| wheelofFortune           | Interactive relation for the spin on the Wheel of Fortune, storing packagaes |
| achieved                 | Stores the achievements a player made                                        |

### Soldier

Name | Price | # In stock
---|---|---
Juicy Apples | 1.99 | 739
Bananas | 1.89 | 6

CREATE TABLE IF NOT EXISTS soldier(
    name VARCHAR PRIMARY KEY,
    type VARCHAR,
    health INT,
    damage INT,
    capacity INT,
    consumption INT,
    speed FLOAT4,
    stealth FLOAT4
);

### soldier
### package
### player
### content
### message
### request
### transferRequest
### clanRequest
### friendRequest
### achievement
### quest
### transfer
### buildable
### building

### friend
### member
### retrieved
### shared
### intercept
### troops
### unlockedBuildable
### unlockedsoldier
### wheelofFortune
### achieved









