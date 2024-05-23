# Settlement
> A settlement is mostly used as base class and contains a lot of helper functions. It is a central starting point to identify activities of the user.

A lot of functionality is made in [settlement.py](../../src/dataAcces/settlement.py), 

These 2 APIs are linked to the settlement dataAcces and are important:

#### getGrid()

This API call retrieves all buildings in a settlement and gives a format the frontend can use to load the building onto the visual grid.

#### getMap()

API Call to retrieve all settlements and their coordinates to visualise on the map in the frontend.

#### Explanation of helper functions
> These helper functions are relatively short but used to keep things clean.

##### getResources()
Simple function to return a Package object from the database, connected to the settlement. (Uses the settlement id instead of the package id)

##### getLevel()
Simple function to retrieve the level of the Castle/level from the Settlement.

##### getOwner()
Simple helper function to retrieve the owner (player) of a settlement

#### initialise()
Helper function to preset data for a new player's settlement. Called upon user register.

#### isOutPost()
Helper function which checks if a given settlement is an outpost or the main settlement.

#### calculateDistance()
Calculates the distance between 2 settlements or transfers (coordinates)

#### getNewCoordinate()
Helper function to generate new unique coordinates for new settlements on the map
