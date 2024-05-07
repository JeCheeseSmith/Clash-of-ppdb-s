# Achievements
> Achievements or quests contain actions that needs to be done. When achieved, an xp bonus is set. XP can also be achieved by playing the game upon different actions.

Upon a timer's ending (actions that are made), the quests status is verified and the xp amount is incremented.

### evaluateQuests()

This function is given a timer and verifies the quest actions. E.g. if the task is to build 3 Woodcutters, it is checked if the timer type is a building.
Then we check if a woodcutter was build. If so, the task amount in the database will be decremented, telling us less actions need to be done.

If the amount is negative, a predefined xpBonus will be added to the player' level. 

Code exists for each achievement. 

### evualateXP()

This function takes in parameters such as a timer, 'transfer_data_access', and 'player_data_access'. It checks if the timer is for a soldier, a building,
a transfer, an attack or an outpost. Depending on the timer type, the function then calls 'updateXPandlevel' (defined in player.py) and provides it with the player's name and a certain amount of XP. 
The 'updateXPandlevel' function increases your current XP by the given amount. If the XP reaches or surpasses 1000, your level is incremented by one, and the XP is reduced by 1000.