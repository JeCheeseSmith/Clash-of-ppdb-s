import React from 'react';
import './Information.css'

function Information()
{
    // Automatically updating last update if we have a public repo

    /*const [commits, setCommits] = useState([]);
    // Replace 'YOUR_ACCESS_TOKEN' with our GitHub access token
    const accessToken = 'YOUR_ACCESS_TOKEN';
    useEffect(() => {
        fetch("https://api.github.com/repos/JeCheeseSmith/Clash-of-ppdb-s/commits", {
            headers: {
                Authorization: `token ${accessToken}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setCommits(data);
            console.log(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);*/
    return (
        <>
            <div className={"feedback"}>
                This Game is still in development, so if you encounter any problems or
                difficulties, we would be grateful for your feedback.
            </div>
            <div className={"last-update"}>
                Last Update: 17/05/2024 at 17:03
            </div>
        </>
    );
}

export default Information;