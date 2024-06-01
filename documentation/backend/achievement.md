# Achievements
> Achievements or quests contain actions that needs to be done. When achieved, a xp bonus is set. XP can also be achieved by playing the game upon different actions.

Upon a timer's ending (actions that are made), the quests status is verified and the xp amount is incremented.

### [evaluateQuests()](../../src/dataAcces/timer.py)

This function is given a timer object and verifies the quest actions. E.g. if the task is to build 3 Woodcutters, it is checked if the timer type is a building.
Then we check if a woodcutter was build. If so, the task amount in the database will be decremented, telling us fewer actions need to be done.

If the amount is 0, a predefined xpBonus will be added to the player's level. If the amount is negative, nothing will be done. 

Code exists for each achievement and can be extended. 

### [evaluateXP()](../../src/dataAcces/timer.py)

This function takes in parameters such as a timer, 'transfer_data_access', and 'player_data_access'. It checks if the timer is for a soldier, a building,
a transfer, an attack or an outpost. Depending on the timer type, the function then calls 'updateXPandlevel' (defined in player.py) and provides it with the player's name and a certain amount of XP. 
The 'updateXPandlevel' function increases your current XP by the given amount. If the XP reaches or surpasses 1000, your level is incremented by one, and the XP is reduced by 1000.

### [getAchieved()](../../src/dataAcces/player.py)

A simple function which executes a query to retrieve the completed achievements a player made. Reformats it in a list of maps.

### [getLeaderboard()](../../src/app.py) & [getPlayers()](../../src/dataAcces/player.py)

getLeaderboard is the function executed upon an API call to retrieve the top 5 players (sorted upon the highest level). It calls getPlayers() to return the result in a map.
