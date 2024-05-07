# Timers
> In our game backend, no busy loops or classical timer mechanisms are implemented, since we build our game upon user-interaction. 
> Here we explain how we implemented our time management.

### Workflow

When an action with time is made, e.g. upgrading your Castle, it takes time to complete, as we made an idle game.
However, we obviously can't check every minute if the Castle is done building, and we neither wanted to use time mechanics from the server.

Thus, what happens?

When hitting the upgrade button in the frontend, a timer is created and inserted in the database. Thus timer is actually not the perfect word for this. We simply store the start and end time, and some simplistic additional info.
The info about the timer is also send back to the frontend.

The frontend keeps track upon the timer, thus offloading some tasks to the client. When the timer ran out (the frontend kept track!), the update() API is called in the backend.

When this function is called, all timers passed their due date will be executed. All new timers, in one way or another linked to the player, are send back and the frontend again keeps track of those. Update() is also called upon user login and is refreshed every quarter. This to make sure the user gets accurate info about the multiplayer part of the game (since everything else happening in the settlement can be updated on user interactions)

It is important to notice that the user might have timers that are not directly related towards his own settlement, but the game needs them to be update or executed. These timers can be from transfers or allied players.

### update()

This function call functionality to execute all timers passed their due date.

To start this process, the TimerDataAccess is used to call the evaluateTimers() functions.

First, it executes a query to retrieve all timers that are passed. Some timers might be from different players.
Depending on the timer type, the operation function is execute. E.g. for upgrading a Castle, the simulateUpgrade() is called. 

There exists these types and called functions:

| Timer Type | Function Executed       | Small Note                                             |
|------------|-------------------------|--------------------------------------------------------|
| building   | simulateUpgrade()       | Upgrade a building                                     |
| soldier    | simulateTroopTraining() | Add a newly trained troop                              |
| transfer   | simulateTransfer()      | Simulate a transfer arriving                           |
| espionage  | simulateEspionage()     | Execute an espionage and notify the user with a report |
| attack     | simulateAttack()        | Simulate the results of an attack                      |
| outpost    | simulateOutpost()       | Create a new outpost                                   |

The first step in executing this functionality always is recomposing the data from the database into usable Python Objects.

#### simulateUpgrade()

The level of the building is incremented. If the castle or barracks are upgraded, extra functionality is called to set new unlocked soldiers or newly unlocked buildings.

The player is notified when their building is upgraded.

#### simulateTroopTraining()

The trained troop is added to the troops of the settlement.

#### simulateTransfer()  

The resources and troops from the packages are added to the arriving settlement.

Both users are notified using the admin account that the transfer succeeded.

The transfer and now associated old package are removed from the database.

#### simulateEspionage()

Espionage fails at random. You can spy on transfers or settlements. 

Upon success, info about the settlement is set to discovered, just like all transfers currently departing from that settlement.
When successfully spied on a transfer, the troops of the transfer will be visible.

If an espionage failed, the user spied on is also notified.

In both cases, the player who send the spy is notified about the status, messages are sent from the admin account to the player(s).

The Discovered bool is used for enemies to determine the visibility of certain info. This is adjusted upon a successful espionage.

#### simulateAttack() 

An attack might fail at random. 

In every case, both users are notified of the actions.

When an attack fails towards a settlement. The loser simply looses all his troops.
If they win; the capacity of all the soldiers is calculated and this amount will be stolen from the defending settlement. A transfer back home will be made.

When a transfer was tried to attack, and the attacker succeeds. The kill all soldiers from the defendant and steal all resources. A transfer with the new resources is made back home.
The defendants transfer data is deleted, and any transfers towards this transfer are send back.

When the attacker fails, they simply loose all their troops used for the attack.

#### simulateOutpost() 

When this transfer timer ran out, a new settlement will be created and initialised on the map. Actually, the settlement was already created but will be initialised to the user. (Before this, the user owned the settlement)

The last step of these functionality is always deleting the old timers from the database.

### retrieveTimers()

This function is called to retrieve all active timers associated to a player, this included all timers interacting with a settlement of this user, as well as all timers interacting with settlements of allies.

We use a "monster query", as we would like to call it, to retrieve it all at once from the database.

Depending on the timer type, additional data might be added.

Explanation of the so called, "monster" query:

```sql
-- Subquery to get all players friendly associated with player 'a'
SELECT pname2 AS pname FROM friend WHERE pname1 = 'a' UNION SELECT pname1 AS pname FROM friend WHERE pname2 = 'a' -- All friends
UNION
-- All clan members
SELECT pname FROM member WHERE cname IN (SELECT cname FROM member WHERE pname='a' )
UNION
-- Player its self
SELECT 'a'
-- Except the admin (since everyone is a friend with admin)
EXCEPT
SELECT 'admin'
```

```sql
--- Monster Query
SELECT * FROM timer WHERE sid IN -- Get all timers for my settlements
(SELECT id FROM settlement WHERE pname='a') -- All my settlements
UNION
-- Timers interacting with friendly
SELECT * FROM timer WHERE type='transfer' OR type='espionage' OR type='attack' OR type = 'outpost' AND oid IN
( -- Transfer interacting with friendly
SELECT id FROM transfer WHERE pname IN('a') -- Transfer owned by friendly
UNION
-- Someone's Transfers interacting with friendly transfers
SELECT id FROM transfer WHERE totype=True and idto IN (SELECT id FROM transfer WHERE pname IN('a'))
UNION
-- Someone's Transfers going to friendly settlements
SELECT id FROM transfer WHERE totype=False and idto IN (SELECT id FROM settlement WHERE pname IN ('a'))
-- And add all other visible transfers too
UNION
SELECT id FROM transfer WHERE discovered=True
);
```
