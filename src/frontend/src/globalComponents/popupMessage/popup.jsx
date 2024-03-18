import React from "react";
import './popup.css'
import close from '../../assets/closePopUp.png'

function RequestMassagePopUp({ message, setPopup })
{
    const closeButton = () =>
    {
        setPopup(false)
    }
    return (
        <div className="popup-message">
            <div className="message">{message}</div>
            <img src={close} alt={"close"} className={"close-button"} onClick={closeButton}/>
        </div>
    );
}

export default RequestMassagePopUp;
