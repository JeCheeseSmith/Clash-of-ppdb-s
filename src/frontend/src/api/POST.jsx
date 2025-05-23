import apiURL from "./URL.jsx";

/**
 * Sends data to a specified endpoint using a POST request and Receiving back data.
 *
 * @param {Object} data - The data to be sent.
 * @param {string} endpoint - The endpoint to which the data is sent.
 * @returns {Promise<void>} - A Promise that resolves when the data is sent.
 */

const POST = async (data, endpoint) =>
{
    let returnData;
    await fetch(apiURL + endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            returnData = data;
        })
        .catch(error =>
        {
            console.error('Error:', error);
        });
    return returnData
};

export default POST;