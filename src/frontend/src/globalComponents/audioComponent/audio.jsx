import notEnough from "./assets/notEnough.mp3";
import error from "./assets/buildingPlacementError.mp3";
import buttonSocial from "./assets/Menu Selection Sound Effect.mp3";
import buttonOption from "./assets/socialOptionSound.mp3";
import upgraded from "./assets/Upgraded.mp3"
import newMessage from "./assets/NewMessage.mp3"
import report from "./assets/Report.mp3"
import click from "./assets/Click.mp3"

/**
 * Plays a specified sound based on the provided type.
 *
 * @async
 * @param {string} typeSound - The type of sound to play.
 * @param {number} [volume=null] - Optional volume level for the sound (0.0 to 1.0).
 * @returns {Promise<void>} A Promise that resolves when the sound has finished playing.
 *
 * @example
 * // Play a click sound
 * await PlaySound("Click");
 *
 * // Play a social button sound with custom volume
 * await PlaySound("SocialButton", 0.7);
 */

async function PlaySound(typeSound, volume=null)
{
    let sound;
    if (typeSound === "Click")
    {
        sound = new Audio(click)
        sound.currentTime = 0.46;
        if (volume) {sound.volume = volume}
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