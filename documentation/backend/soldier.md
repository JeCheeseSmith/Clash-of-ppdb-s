# Soldier
> Soldiers are trained in barracks and consume food.  They each have unique abilities as listed in [statsMilitary](../statsMilitary.md)

#### trainTroop()

This API trains one or multiple troops. The functionality is executed by the function trainTroop() from the settlement_data_acces. 

Similar to buildings, first is checked if the settlements meets all the requirements. Such that Barracks are build, the soldier is unlocked and enough resources are present.

If everything is good to go, a soldier timer will be made and sent back. When the timer ran out, the soldier(s) are successfully trained and are added to the settlement.

### getBarrackLevelSum()

This is a helper function to retrieve the sum of all the levels of the barracks in a settlement. It is used for the max amount of troops that may be trained in parallel (of the same type)

#### getConsumption()

API call to retrieve the current consumption of all troops in the settlement to visualise for the user in the frontend.

Under the hood it calls the PackageDataAccess function: calc_consumption()

#### getTroops()

API function to retrieve all troops currently stationed in a settlement. 

#### unlockedTroops()

API to give a status for each soldier if they're unlocked or not. This is needed to execute some frontend functionality.
