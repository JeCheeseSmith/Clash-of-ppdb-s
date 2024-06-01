# Level

The 'LevelBar' function, defined in 'Level.jsx', is responsible for rendering the level and the xp-bar. They are located in the top left corner.
This function takes two parameters: 'vlag' and 'changeVlag'. Within this function, two states are initialized: 'level' and 'xp'. The player's username is also retrieved from the login page/sign-up page. 
'level' represents the player's current level.

The useEffect inside this function fetches the current level and XP by calling the 'requestLevel' and 'requestXP' functions, both of which require the player's username as an argument. 
Both these functions call the 'getXPandLevel' API, which returns the level and xp from the database. The value of 'level' is set to the current level and the value of 'xp' is set to the current XP.
This useEffect will be executed every time the value of 'vlag' is set to 'true'. 

The 'xpPercentage' variable takes 'xp' and divides it by ten. This variable reflects the amount of xp you have acquired.

In the 'MainPage()' function, a state called 'flag' is initialized and assigned the value 'true'. 
'flag' (a boolean), and 'setFlag' (the function to modify the value of 'flag'), are passed as arguments to the 'LevelBar' component.
Once the level and XP are fetched in the useEffect, the 'changeVlag' function will set the value of 'vlag' to 'false'. 
This updates the 'flag' value as well, which is defined within the 'MainPage()' function.

The 'setFlag' function is utilized in both 'LocalTimers' (in 'localTimers.jsx') and 'WheelOfFortune' (in 'wheel.jsx'). 
In 'LocalTimers', when a timer for a building has ended, 'setFlag' will set the value of 'flag' to 'true'. 
In 'WheelOfFortune', after you receive the pop-up, 'setFlag' also sets the value of 'flag' to 'true'.
When 'flag' is set to 'true', the 'useEffect' hook will be executed again, resulting in an update of the level and XP. 

This means that the level and XP are immediately updated when:

- a building upgrade is completed
- you receive XP from the wheel of fortune
- when the wheel of fortune allows you to level up


