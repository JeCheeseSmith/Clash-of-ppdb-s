# Leaderboard
The Leaderboard function, defined in leaderboard.jsx, is responsible for rendering the leaderboard-button and the leaderboard-menu.

This function has a variable "click" that shows whether the leaderboard-button has been clicked or not. It is initially set to false.
This component returns a JSX that contains the design of the leaderboard-button. 
When you click on the leaderboard-button, the event handler "toggleMenu" is called, which sets the value of "click" to true.
When "click" becomes true, the leaderboard-menu opens.


The styles of both the leaderboard-button and the leaderboard-menu are present in the leaderboard.css file.