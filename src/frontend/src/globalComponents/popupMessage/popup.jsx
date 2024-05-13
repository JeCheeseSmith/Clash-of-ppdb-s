import React from "react";
import './popup.css'
import close from '../../assets/closePopUp.png'

/**
 * Component for displaying a popup message.
 * @param {object} props - The props object.
 * @param {string} props.message - The message to be displayed.
 * @param {function} props.setPopup - Function to set the popup state.
 * @returns {JSX.Element} - The JSX for displaying the popup message.
 */
function PopUp({ message, setPopup })
{
    const closeButton = () =>
    {
        setPopup(false)
    }
    return (
        <div className="popup-message">
            <div className="message-string">{message}</div>
            <img src={close} alt={"close"} className={"close-button"} onClick={closeButton}/>
        </div>
    );
}

export default PopUp;
