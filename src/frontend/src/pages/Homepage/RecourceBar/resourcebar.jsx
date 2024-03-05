import React from 'react'; // Importing React library
import './resourcebar.css'
import woodLog from '/home/raadin/Documents/Clash-of-ppdb-s/src/frontend/src/assets/wood.png';
import stone from '/home/raadin/Documents/Clash-of-ppdb-s/src/frontend/src/assets/stone.png';
import metal from '/home/raadin/Documents/Clash-of-ppdb-s/src/frontend/src/assets/metal.png';
import food from '/home/raadin/Documents/Clash-of-ppdb-s/src/frontend/src/assets/food.png';

// Code for resource-bar
function ResourceBar() {

    return (
        // Resource-bar section
        <div className="resourceBar">
            {/* Each resource has a symbol and a count */}
            <div className="resourceSection">
                <img src={woodLog} alt="Wood" className="resourceIcon"/>
                <span className="resourceCount">5000</span>
            </div>
            <div className="resourceSection">
                <img src={stone} alt="Stone" className="resourceIcon"/>
                <span className="resourceCount">5000</span>
            </div>
            <div className="resourceSection">
                <img src={metal} alt="Metal" className="resourceIcon"/>
                <span className="resourceCount">5000</span>
            </div>
            <div className="resourceSection">
                <img src={food} alt="Food" className="resourceIcon"/>
                <span className="resourceCount">5000</span>
            </div>
        </div>
    );
}

export default ResourceBar;