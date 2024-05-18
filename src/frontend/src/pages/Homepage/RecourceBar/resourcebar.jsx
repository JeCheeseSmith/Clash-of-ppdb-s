import React from 'react';
import './resourcebar.css'
import woodLog from '../../../assets/wood.png';
import stone from '../../../assets/stone.png';
import metal from '../../../assets/metal.png';
import food from '../../../assets/food.png';
import gem from '../../../assets/gem.png';
import refreshButton from '../../../assets/refresh.png'


// Code for resource bar
function ResourceBar({resources, refresh, refreshFunction}) {
    return (
        <div className={"resourceSection-Container"}>
            {/*Resource-bar section*/}
            <div className="resourceBar">
                {/* Each resource has a symbol and a count */}
                <div className="resourceSection">
                    <img src={gem} alt="Gem" className="resourceIcon" onClick={refreshFunction}/>
                    <span className="resourceCount">{resources.gems}</span>
                </div>
                <div className="resourceSection">
                    <img src={woodLog} alt="Wood" className="resourceIcon" onClick={refreshFunction}/>
                    <span className="resourceCount">{resources.wood}</span>
                </div>
                <div className="resourceSection">
                    <img src={stone} alt="Stone" className="resourceIcon" onClick={refreshFunction}/>
                    <span className="resourceCount">{resources.stone}</span>
                </div>
                <div className="resourceSection">
                    <img src={metal} alt="Metal" className="resourceIcon" onClick={refreshFunction}/>
                    <span className="resourceCount">{resources.steel}</span>
                </div>
                <div className="resourceSection">
                    <img src={food} alt="Food" className="resourceIcon" onClick={refreshFunction}/>
                    <span className="resourceCount">{resources.food}</span>
                </div>
            </div>
            <img src={refreshButton} alt={"refresh-icon"} className={refresh ? "updateResources-button" : "updateResources-button-timout"} onClick={refreshFunction}/>
        </div>
    );
}

export default ResourceBar;