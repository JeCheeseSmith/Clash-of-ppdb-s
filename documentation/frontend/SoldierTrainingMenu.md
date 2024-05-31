# Soldier Training Menu
> This documentation explains the working of Soldier Training Menu component.

Clicking on the icon in the bottom right of the screen will open up a menu which contains a navigator page, the troop overview page will also automatically opened.
The Navigator page can be used to travel between the troop overview page and the training overview by clicking on the respective names in the bar.
On the troop overview page a number of icons of soldiers are present, each divided into a column going from least to most advanced soldier.
Each column denotes a different soldier type (horseman, archers, ...) which has different attribute spreads, clicking on an icon of a soldier that you have unlocked will send an API call to
begin training one soldier. Next to the icon of a soldier is the amount of soldiers you have corresponding to that icon.
Note that if the icon of a soldier is grayed out, it means that that soldier is not unlocked and is thus unable to be trained. Clicking a grayed out soldier button will do nothing.
The troop numbers are automatically updated using API calls. Finally, the total food consumption of your army is also retrieved using API calls and displayed at the top.

The second main menu called the troop training page is a page where you can view your soldiers that are currently in training and the amount.
The retrieval of this is done in almost the same way as in the troop overview page.
We use API calls to get the current running timers and check how many of each type of soldier is currently in training.
