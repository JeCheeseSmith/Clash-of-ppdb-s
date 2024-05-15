# Admin
> Our projects allow the game administrator to manipulate certain values about to game. This makes it e.g. possible to introduces seasons in the game.

In the backend the following API functions are made:

#### getFunction():

This API call receives a buildable name and returns the current (production) function from the database.

The database Connection from ```building_data_acces``` is used to call getFunction() to execute the actual functionality.

#### setFunction():

This API call sets a new (production) function for a certain buildable in the database. 

The database Connection from ```building_data_acces``` is used to call setFunction() to execute the actual functionality.

Make sure to comply with the format of each function, they need to be polynmials expressed in an array. e.g. [5,2] is 5x + 2

#### preset():

This function executes the [preset.py](../../src/preset.py) script upon called. It includes the query from [schema.sql](../../sql/schema.sql) as string.
For debug purposes, it will return any data send so you can verify it executed correctly.

Since it may be used for debug purposes only, a 'raw' connection is used instead of a dataAcces Component.
