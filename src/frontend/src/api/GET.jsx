import apiURL from './URL.jsx'

/**
 * Sends data to a specified endpoint using a GET request and Receiving back data.
 *
 * @param {Object} data - The data to be sent.
 * @param {string} endpoint - The endpoint to which the data is sent.
 * @returns {Promise<void>} - A Promise that resolves when the data is sent.
 */

const GET = async (data, endpoint) =>
{
    try
    {
        const url = new URL(apiURL + endpoint);
        if (data)
        {
            Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    }
    catch (error)
    {
        console.error('Error:', error);
        throw error;
    }
};

export default GET;
