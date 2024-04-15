# Resources 
> In this part, we will explain the working of the package class and the way resources are calculated. 

#### Package Classes:

In [package.py](../../src/dataAcces/package.py) we specified multiple classes. 

Package is a simple class containing the database fields. It again has a to_dct() function. It contains overloaded functions for + and -, so we can do arithmetic with these classes. It contains helperfunction, such as a deficitString() which can create an error message. As well as a function to check if it any value is below zero. 

The same functionality is present in the PackageWithSoldier class. The difference is that this class can execute this functionality with soldiers taken into account. ('The troops relation from the database is added')

The dataAcces component contains methods to instantiate package Objects, manipulate them and update the database accordingly. 

It has a helper function to evaluate a polynomial (evaluate()), this is frequently accessed. 

To insert package data into the database: update_resources() or add_resources() can be used. Both function take a Package(WithSoldiers) instance to update data or insert new data in the database.

calc_consumption() is a function to calculate the food consumed for all soldiers linked to a package, linked to a settlement.

#### get_resources():

This API is rather important in our game. It re-evaluated the resources for a settlement and returns the new data to the frontend. In the meantime, it checks if soldiers might have starved to death by a lake of food in the settlement.

The function updates the resources within a specified time interval.

It works in the following order:

1. Retrieve all buildings of type storage: calculate total max storage amount 
1. Retrieve all production buildings and their (production) function 
2. Retrieve all soldiers in the settlement and calculate their consumptions
4. Retrieve the package of the settlement of use 
5. Calculate all resources production and update it for a given time interval (e.g. evaluate is used)
6. Calculate all food production and update it for a given time interval
7. After calculation, it is possible that food is negative, so troops are decremented until a positive food balance has been reached.
