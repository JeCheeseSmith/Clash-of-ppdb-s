# Quest
The QuestButton function, defined in Quest.jsx, is responsible for rendering the quest-button and the quest log.

This function has a variable "click" that shows whether the quest-button has been clicked or not. It is initially set to false.
This component returns a JSX that contains the design of the quest-button. 
When you click on the quest-button, the event handler "HandleQuestClick" is called, which sets the value of "click" to true.
When "click" becomes true, the QuestLog function is called which is responsible for rendering the quest log. This function is also defined in Quest.jsx.

When loading the log, an API call is made to retrieve the current achievements of the user. These are then viewed as text to the user.
To avoid constantly resending the API calls, an extra variable loaded is set true/false to only execute the action once after opening the menu.

The styles of both the quest-button and the quest-log are present in the quest.css file.