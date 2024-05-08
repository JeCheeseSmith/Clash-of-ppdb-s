# Level

The LevelBar function, defined in Level.jsx, is responsible for rendering the level and the xp-bar.
This function takes parameters: 'username1', 'vlag' and 'changeVlag'. Within this function, two states are initialized: 'level' and 'xp'. 
'level' represents the player's current level.

The useEffect inside this function fetches the level and xp by calling the 'requestLevel' and 'requestXP' functions, both of which require the player's username as a parameter. 
Both these functions call the 'getXPandLevel' API, which returns the level and xp from the database. This useEffect will be executed every time the value of 'vlag' is set to 'true'. 

The 'xpPercentage' variable takes the 'xp' state and divides it by ten. This variable reflects the amount of xp you have acquired.

In the 'MainPage()' function, a state called 'flag' is initialized and assigned the value 'true'. 
The player's username, along with 'flag' (a boolean), and 'setFlag' (the function to modify the value of 'flag'), are passed as arguments to the 'LevelBar' component.
Once the level and XP are fetched in the useEffect, the 'changeVlag' function will set the value of 'vlag' to 'false'. 
This updates the 'flag' value as well, which is defined within the 'MainPage()' function.

Each time the timers are updated within the 'updateTimers' function in 'MainPage()', the 'setFlag' function is utilized to set the value of 'flag' to 'true'. 
This triggers the useEffect, leading to the update of the level and XP.


