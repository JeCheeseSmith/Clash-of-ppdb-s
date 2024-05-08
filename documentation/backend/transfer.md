# Transfers
> A core functionality of our game is the ability to send and receive transfer. These transfer can be attacked. In fact, an attack itself is also a transfer.

This component heavily relies on all previous explained components. (package, settlement, soldier, ...)

#### espionage()

This API creates an espionage and returns a timer.

It makes use of the TransferDataAccess class and the function createEspionage().

A transfer object will be created with the necessary info in the database. Then, the distance will be calculated to determine the time needed to complete the action.

Then, the actual timer data will be inserted in the database and be send back to the frontend.

After 1 spy succeeds, it becomes public to all players.

#### transfer()

This API, depending on the data supplied, will create a resource transfer or an attack transfer. 

First, it checks if the operation is allowed (e.g. allies can't attack each other). It also checks if the amount of troops and resources send with is present in the settlement.

Then a deficit will be made. The transfer data is inserted into the database. As follows up, the distance towards the location is determined, as well as the speed. (Based upon resource amount and soldier speed). 

With this info, a timer is created and inserted into the database. Timer info will be sent back to the frontend.

#### createOutpost()

Creating an outpost performs the same steps as a resource transfer. But now basic settlement data will be created too. The admin will get temporary ownership of the new settlement until the transfer is completed.

#### getInfo()

This API is used to retrieve the info for a settlement or transfer visible on the map.

Depending on the allied status of the owners, more or less info may be shown. This is determined using the discovered bool.