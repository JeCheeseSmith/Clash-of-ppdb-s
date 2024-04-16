#UpgradeBuilding

The 'UpgradeBuilding' function, defined in 'upgradeBuilding.jsx', is the component responsible for rendering the upgrade button.

This function has five parameters: 'selectedBuilding', 'updateResources', 'updateTimers', 'getTimer', 'oldPosition'. UpgradeBuilding is called in mainpage.jsx.

There are five states: 'click', 'errormessage', 'popup', 'currentTimeValue' and 'currentTotalDuration'. The settlement id (sid) and username are also taken from the mainpage.jsx.

Initially, the value of 'click' is set to false. When you click on the upgrade button, the event handler 'handleUpgradeClick' is called. This handler updates the resources and check if 'click' hasn't been set to true.
If 'click' is false, (abu vul dit verder aan).
....
If 'data' is true (there are enough resources to upgrade the building), (abu vul dit verder aan).... and 'click' will be set to true. If there aren't enough resources, then there will be a popup containing an errormessage.

If 'click' is set to true, then the upgrade button will be replaced by the progressbar. 'currentTimeValue', 'currentTotalDuration' and 'setClick' (this changes the value of 'click') will be given to the
'TimerProgressBar' function as arguments. 
