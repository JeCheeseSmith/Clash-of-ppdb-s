# Soldier
> Soldiers are trained in barracks and consume food.  They each have unique abilities as listed in [statsMilitary](../statsMilitary.md)

#### trainTroop()

This API trains one or multiple troops. The functionality is executed by the function trainTroop() from the settlement_data_acces. 

Similar to buildings, first is checked if the settlements meets all the requirements. Such that Barracks are build, the soldier is unlocked and enough resources are present.

If everything is good to go, a soldier timer will be made and sent back. When the timer ran out, the soldier(s) are successfully trained and are added to the settlement.

#### getConsumption()

API call to retrieve the current consumption of all troops in the settlement to visualise for the user in the frontend.

Under the hood it calls the PackageDataAccess function: [calc_consumption()](resources.md)

#### getTroops()

API function to retrieve all troops currently stationed in a settlement. 

#### unlockedTroops()

API to give a status for each soldier if they're unlocked or not. This is needed to execute some frontend functionality.

### Helper Functions

#### getCapacity()

Helper function to calculate the total capacity soldiers can take with for a given package ID. (The soldier info will be retrieved from the database)

#### calculateTrainTime()

Helper function to retrieve the start,stop and duration for a timer to train a soldier.

As TroopTraining may not run in parallel, the latest soldier training is taken into account.

#### unlocked()

Helper function: Gives True if a settlement unlocked this type of soldier