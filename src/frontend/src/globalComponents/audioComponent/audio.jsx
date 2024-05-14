import notEnough from "./assets/notEnough.mp3";
import error from "./assets/buildingPlacementError.mp3";
import buttonSocial from "./assets/Menu Selection Sound Effect.mp3";
import buttonOption from "./assets/socialOptionSound.mp3";
import upgraded from "./assets/Upgraded.mp3"
import newMessage from "./assets/NewMessage.mp3"
import report from "./assets/Report.mp3"
import click from "./assets/Click.mp3"

/*
* Audio component for better and global use
* */

async function PlaySound(typeSound)
{
    let sound;
    if (typeSound === "Click")
    {
        sound = new Audio(click)
        sound.currentTime = 0.46;
    }
    else if (typeSound === "ResourcesError")
    {
        sound = new Audio(notEnough);
    }
    else if (typeSound === "ObjectPlacementError")
    {
        sound = new Audio(error);
    }
    else if (typeSound === "SocialButton")
    {
        sound = new Audio(buttonSocial);
        sound.currentTime = 0.315;
    }
    else if (typeSound === "SocialOptionButton")
    {
        sound = new Audio(buttonOption);
        sound.currentTime = 0.5;
    }
    else if (typeSound === "BuildingUpgraded")
    {
        sound = new Audio(upgraded)
        sound.volume = 0.5
    }
    else if (typeSound === "NewMessage")
    {
        sound = new Audio(newMessage)
    }
    else if (typeSound === "Report")
    {
        sound = new Audio(report)
    }
    await sound.play();
}

export default PlaySound;