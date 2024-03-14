/**
 * Sends data to a specified endpoint using a GET request and Receiving back data.
 *
 * @param {Object} data - The data to be sent.
 * @param {string} endpoint - The endpoint to which the data is sent.
 * @returns {Promise<void>} - A Promise that resolves when the data is sent.
 */
const local = "http://127.0.0.1:5000"
const remote = "https://team8.ua-ppdb.me/"
const GET = async (data, endpoint) =>
{
    let returnData;
    await fetch(remote+endpoint, {
        method: 'GET',
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

export default GET;