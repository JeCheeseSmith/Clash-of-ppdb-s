/**
 * Represents the URL used for API calls.
 * @type {string}
 */
let apiURL;

/**
 * The local URL for development environment.
 * @constant {string}
 */
const local = "http://127.0.0.1:5000";

/**
 * The remote URL for production environment.
 * @constant {string}
 */
const remote = "https://team8.ua-ppdb.me/";

// Set the initial value of apiURL to the wanted URL
apiURL = remote;
export default apiURL;
