# Soldier Training Menu
> This documentation explains the working of Soldier Training Menu component.

Clicking on the icon in the bottom right of the screen will open up a menu which contains a navigator page, an amount selector page and a troop overview page.
The Navigator page can be used to travel between the troop overview page and the training overview by clicking on the respective names in the bar.
The amount selector page is used to designate the amount of soldiers each button click will affect.
On the troop overview page a number of icons of soldiers are present, each divided into a column going from least to most advanced soldier.
Each column denotes a different soldier type (horseman, archers, ...), clicking on an icon of a soldier that you have unlocked will send an API call to
begin training an amount of soldiers. Next to the icon of a soldier is the amount of soldiers you have corresponding to that icon.
The numbers are automatically updated using API calls. Finally, the total food consumption of your army is also retrieved using API calls and displayed at the top.

The second main menu called the troop training page is a page where you can view the current soldier type in training and the amount. Clicking on the icon
will cancel the the training of x amount of troops (Decided by the amount selected in amount selector page). Retrieval and cancelling is done via API calls.