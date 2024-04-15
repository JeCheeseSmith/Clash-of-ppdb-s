# Buildings
> This part of the documentation explains some functionality related to the buildings

#### placeBuilding():

This function is used to build a new building in a settlement. First, it initialises a new Building Object and then call the desired functionality. 

1. Checks are made to see if this settlement did not reach the max number of buildings for this type.
2. Then, the costs are calculated for building this type. An error will be send back if the settlement doesn't have enough materials to perform this action. Otherwise, a deficit is made.
3. As last step, if all goes to plan, the actual building is placed in the database

Needed info or errors is sent back to the frontend. 

#### upgradeBuilding():

By calling this function, a certain building can be upgraded.

It uses similar function call as placeBuilding(), e.g. the cost calculation, since the exact same thing needs to be done.

When all checks are passed, a timer is inserted in the database. The building time is specified as a function, with the level of the building as input, for each building in the database. Info about this timer is returned to the frontend too, so they can update simultaneously.

When the timer stops, the level of the building will be adjusted. The higher a building level, the more resources can be produced. 
The Castle & Barracks unlock new features, so they have their own function which will be called to adjust this. (upgradeBarracks() & upgradeCastle())

#### moveBuilding():

This function moves a building towards a new location and saves it in the database. It simply updated the coordinates of a building in the database.

#### getBuildingInfo():

This API function retrieves all info from a building (incl. buildable) in a settlement. 

Buildings in the frontend are specified by their unique coordinates on the grid, while the database uses numerical identifiers. A translation is made and the data can be easily retrieved from the database using the retrieved() function in BuildingDataAccess.

