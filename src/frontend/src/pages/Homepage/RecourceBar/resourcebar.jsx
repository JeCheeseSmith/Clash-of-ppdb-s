import React, { useState, useEffect } from 'react';
import './resourcebar.css'
import woodLog from '../../../assets/wood.png';
import stone from '../../../assets/stone.png';
import metal from '../../../assets/metal.png';
import food from '../../../assets/food.png';
import POST from "../../../api/POST.jsx";


// Code for resource-bar
function ResourceBar() {

    // Default values for state
    const [resources, setResources] = useState({
        wood: 0,
        stone: 0,
        steel: 0,
        food: 0
    });

    // Function that sends a request for the resources by calling the API
    const GetResources = async () => {
        const sid = localStorage.getItem('sid');
        console.log(sid);
        const data = await POST({ id: sid }, '/resources');
        setResources({
          wood: data.wood,
          stone: data.stone,
          steel: data.steel,
          food: data.food
      });
    }

    // Calls the GetResources function so that the values can be changed
    useEffect(() => {
        GetResources();
    }, []);

    return (
        // Resource-bar section
        <div className="resourceBar">
            {/* Each resource has a symbol and a count */}
            <div className="resourceSection">
                <img src={woodLog} alt="Wood" className="resourceIcon"/>
                <span className="resourceCount">{resources.wood}</span>
            </div>
            <div className="resourceSection">
                <img src={stone} alt="Stone" className="resourceIcon"/>
                <span className="resourceCount">{resources.stone}</span>
            </div>
            <div className="resourceSection">
                <img src={metal} alt="Metal" className="resourceIcon"/>
                <span className="resourceCount">{resources.steel}</span>
            </div>
            <div className="resourceSection">
                <img src={food} alt="Food" className="resourceIcon"/>
                <span className="resourceCount">{resources.food}</span>
            </div>
        </div>
    );
}

export default ResourceBar;