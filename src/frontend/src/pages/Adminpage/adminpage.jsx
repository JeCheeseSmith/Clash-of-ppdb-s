import React, { useState } from 'react';
import './adminpage.css';
import POST from "../../api/POST.jsx";
import GET from "../../api/GET.jsx";
import { AiOutlineExclamationCircle } from 'react-icons/ai';


// Code for admin page
function AdminPage() {

    const [building, setBuilding] = useState('');
    const [buildingfunction, setBuildingFunction] = useState('');
    const [errormessage, setErrorMessage] = useState('');

    // Handler for building change
    function handleBuildingChange(event) {
        setBuilding(event.target.value);
    }

    // Handler for buidlingfunction change
    function handleBuildingFunctionChange(event) {
        setBuildingFunction(event.target.value);
    }

    // Handles click on submit button
    const handleSubmitClick = async () => {
        // Convert the string to an array of integers
        let buildingFunctionArray = JSON.parse(buildingfunction);
        // Calls the 'setFunction' API and stores the returned value in data
        const data = await POST({bname: building, function: buildingFunctionArray}, "/setFunction"); // The function of the building will be updated in the database

        if (!data.success) {
            setErrorMessage("Operation Failed");
        }
    }

    // Handles click on retrieve button
    const handleRetrieveClick = async () => {
        // Calls the 'getFunction' API and stores the returned value in data
        const data = await GET({bname: building}, "/getFunction");
        // Add '[' and ']' to string
        setBuildingFunction(`[${data.join(", ")}]`); // The function that is retrieved from the database will now be shown in the inputbox
    }

    // Handles click on preset-button
    const handlePresetClick = async () => {
        // Calls the 'preset' API
        await POST({}, "/preset");
    }

    return (
      <div className="admin-container">
          <h1 className="gametitle">TRAVISIA</h1>
          <h2 className="subtitle">FALLEN EMPIRE</h2>
          <div className="admin-form">
            {errormessage && (
                <div className="error-message">
                <AiOutlineExclamationCircle /> {errormessage}
                </div>
              )}
              <div>
                  {/* <div> groupes the label and input together on one line */}
                  <label htmlFor="building">Building:</label>
                  {/* When you click on the Label "Building", the input box is selected */}
                  <input
                      id="building"
                      type="text"
                      value={building}
                      onChange={handleBuildingChange}
                  />
              </div>
              <div>
                  <label htmlFor="buildingfunction">Function:</label>
                  {/* When you click on the Label "Function", the input box is selected */}
                  <input
                      id="buildingfunction"
                      type="text"
                      value={buildingfunction}
                      onChange={handleBuildingFunctionChange}
                  />
              </div>
              {/* submit-button */}
              <button className="submit-button" onClick={handleSubmitClick}>Submit</button>
              {/* retrieve-button */}
              <button className="retrieve-button" onClick={handleRetrieveClick}>Retrieve</button>
              {/* preset-button */}
              <button className="preset-button" onClick={handlePresetClick}>Preset</button>
          </div>
      </div>
  );
}

export default AdminPage;