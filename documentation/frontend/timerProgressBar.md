# TimerProgressBar

The 'TimerProgressBar' function, defined in 'TimerProgressBar.jsx', is the component responsible for rendering the progressbar.

This function has three parameters: 'timeValue', 'totalTimeValue', and 'finished'. TimerProgressBar is called in 'upgradeBuilding.jsx'.

There are two states: 'seconds' and 'percentage'. 

The useEffect hook is executed whenever the 'seconds' and 'percentage' states are updated. It checks if seconds is greater than zero. 
If it is, an interval is set up to change the values of 'seconds' and 'percentage'. 
'seconds is decreased by one, and the new percentage will be calculated using the values of 'seconds' and 'totalTimeValue'.

The 'getProgressBarClass' function changes the color of the progressbar based on the percentage.    

When the timer is done (seconds is equal to zero), it will be replaced by the upgrade button.