# wheel of fortune

WheelOfFortune is a component that uses state variables to control the visibility of the wheel and also of the popup. It renders a button to toggle the wheel menu, a spinning button to spin the wheel, the wheel with colored segments representing different prizes, and a popup displaying the won prize. When the spinning button is clicked, the wheel rotates, and after a delay, the prize popup is shown with the won prize. 


The styles of both the wheel-button, spin-button, segments of the wheel and the popup-prize are present in the wheel.css file.

Now the backend is connected to the frontend. There are two api calls one to get a boolean if it is possible to spin the wheel. The other api call is a post to the backend to store the prize in the backend and update the prize for every player.