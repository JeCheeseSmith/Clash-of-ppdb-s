import React, { useState } from 'react'; // Importing React library
import './adminpage.css';
import POST from "../../api/POST.jsx";
import GET from "../../api/GET.jsx";
import { AiOutlineExclamationCircle } from 'react-icons/ai';



// Code for login page
function AdminPage() {

    // States for username, password & error
    const [building, setBuilding] = useState('');
    const [buildingfunction, setBuildingFunction] = useState('');
    const [functionValue, setFunctionValue] = useState("");
    const [errormessage, setErrorMessage] = useState('');

    // Handler for username change
    function handleBuildingChange(event) {
        setBuilding(event.target.value);
    }

    // Handler for password change
    function handleBuildingFunctionChange(event) {
        setBuildingFunction(event.target.value);
    }

    const handleSubmitClick = async () => {
        let buildingFunctionString = buildingfunction;
        let buildingFunctionArray = JSON.parse(buildingFunctionString);
        const data = await POST({bname: building, function: buildingFunctionArray}, "/setFunction");
        console.log(data)
        if (!data.success) {
            setErrorMessage("Operation Failed");
        }
    }

    const handleRetrieveClick = async () => {
        const data = await GET({bname: building}, "/getFunction");
        console.log(data);
        setBuildingFunction(`[${data.join(", ")}]`);
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
          </div>
      </div>
  );
}

export default AdminPage;