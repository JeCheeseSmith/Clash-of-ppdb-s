/**
 * Styles object for customizing the appearance of a loader component.
 *
 * @typedef {Object} LoaderStyles
 * @property {Object} containerStyles - Styles for the container element.
 * @property {Object} innerStyles - Styles for the inner container element.
 * @property {Object} barStyles - Styles for the loading bar element.
 * @property {Object} dataStyles - Styles for the data display element.
 * @property {function} dataInterpolation - A function to interpolate and format loading progress data.
 * @property {function} initialState - A function to set the initial state of the loader.
 */
export const loaderStyles =
{
    containerStyles: {
        // Styles for the container element
        // For example:
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#001711',
    },
    innerStyles: {
        width: '500px',
        height: '100px',
        backgroundColor: '#ccc',
        borderRadius: '5px',
    },
    barStyles: {
        backgroundColor: 'green',
        width: '500px',
        height: '100px',
    },
    dataStyles: {
        color: '#555',
    },
    dataInterpolation: (progress) => `${progress.toFixed(1)}% loaded`,
    initialState: (active) => active,
};