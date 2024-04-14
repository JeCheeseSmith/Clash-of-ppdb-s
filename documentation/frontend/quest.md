# Quest
The QuestButton function, defined in Quest.jsx, is responsible for rendering the quest-button and the quest log.

This function has a variable "click" that shows wether the quest-button has been clicked or not. It is initially set to false.
This component returns a JSX that contains the design of the quest-button. 
When you click on the quest-button, the event handler "HandleQuestClick" is called, which sets the value of "click" to true.
When "click" becomes true, the QuestLog function is called which is responsible for rendering the quest log. This function is also defined in Quest.jsx.

The styles of both the quest-button and the quest-log are present in the quest.css file.