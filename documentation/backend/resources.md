##resources 
So the calc_resources() function is made to update the resources between two timestamps for a given settlement 
* 1. retrieve all buildings of type storage + Castle: calculate total max storage amount
* 2. retrieve all production buildings and there calculating function
* 3. retrieve all soldiers in the settlement and there consumptions
* 4. retrieve the package of the settlement of use 
* 5. calculate all resources production and update it for a given time interval 
* 6. calculate all food production and update it for a given time interval
* 7. After calculation, it is possible that food is negative, so we insert a system for troop starvation

@app.route("/resources", methods=["POST"])
def get_resources():