# Admin page 

The 'AdminPage' function, defined in 'adminpage.jsx', is responsible for rendering the admin page interface.

This function has three states: 'buidling', 'buildingfunction' and 'errormessage'. Initially, the value of each state is set to an empty string.

This component returns a JSX that contains the layout of the admin page. The JSX uses styles from 'admin.css'. 
The layout includes input elements for the 'building' and 'function', which are connected to the 'handleBuildingChange' and 'handleBuildingFunctionChange' event handlers, respectively. 
These event handlers update the 'building' and 'buildingfunction' state variables as the user types something in the input-box.

When you click on the submit button, the event handler "handleSubmitClick" is called. This event handler converts the buildingfunction-string to an array of integers. 
After that, the 'setFunction' API is called which updates the function in the database.
When you click on the retrieve button, the event handler "handleRetrieveClick" is called. This event handler retrieves the current function of the building by calling the 'getFunction' API. 
When you click on the preset button, the event handler "handlePresetClick" is called. This event handler calls the 'preset' API. 
