import React from 'react';
import './resourcebar.css'
import woodLog from '../../../assets/wood.png';
import stone from '../../../assets/stone.png';
import metal from '../../../assets/metal.png';
import food from '../../../assets/food.png';
import gem from '../../../assets/gem.png';
import refresh from '../../../assets/refresh.png'


// Code for resource bar
function ResourceBar({resources, setCallForUpdate}) {
    return (
        <div className={"resourceSection-Container"}>
            {/*Resource-bar section*/}
            <div className="resourceBar">
                {/* Each resource has a symbol and a count */}
                <div className="resourceSection">
                    <img src={gem} alt="Gem" className="resourceIcon" onClick={() => setCallForUpdate(true)}/>
                    <span className="resourceCount">{resources.gems}</span>
                </div>
                <div className="resourceSection">
                    <img src={woodLog} alt="Wood" className="resourceIcon" onClick={() => setCallForUpdate(true)}/>
                    <span className="resourceCount">{resources.wood}</span>
                </div>
                <div className="resourceSection">
                    <img src={stone} alt="Stone" className="resourceIcon" onClick={() => setCallForUpdate(true)}/>
                    <span className="resourceCount">{resources.stone}</span>
                </div>
                <div className="resourceSection">
                    <img src={metal} alt="Metal" className="resourceIcon" onClick={() => setCallForUpdate(true)}/>
                    <span className="resourceCount">{resources.steel}</span>
                </div>
                <div className="resourceSection">
                    <img src={food} alt="Food" className="resourceIcon" onClick={() => setCallForUpdate(true)}/>
                    <span className="resourceCount">{resources.food}</span>
                </div>
            </div>
            <img src={refresh} alt={"refresh-icon"} className={"updateResources-button"} onClick={() => setCallForUpdate(true)}/>
        </div>
    );
}

export default ResourceBar;