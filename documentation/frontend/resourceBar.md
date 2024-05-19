# Resource bar
> This documentation explains the working of resource-bar component.

The bar in the top middle part of the screen displays the amount of resources you have with their respective icon.
Hovering over an icon will enlarge it. API calls are made to ensure that the amount displayed matches with the amount of resources your city has.

Five resources are displayed: Gems, wood, stone, steel & food. Wood and stone are predominantly used for constructing buildings and upgrading them while iron is mainly used to recruit your troops, food is used to maintain your current amount of troops. If there is not enough food available your troops will starve and die.
Gems are used to purchase decorations for buildings.

The 'ResourceBar' function, defined in 'resourcebar.jsx', is responsible for rendering the resource bar. It returns a JSX that contains the design of the resource bar. The style is present in 'resourcebar.jsx'.
In the 'MainPage' function, two states are initialized: 'resources' and 'callForUpdate'. 'resources' (initially set to 'false') and 'setCallForUpdate' (the function to modify the value of 'callForUpdate') are passed to 
'ResourceBar' as arguments.

The variable 'resources' is used to display the amount of each resource. When you click on a resource or the refresh button, 'setCallForUpdate' sets the value of 'callForUpdate' to 'true'. This will update the amount of each resource.
But you can only refresh them after each 30 seconds.

