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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#070017',
    },
    innerStyles: {
        width: '500px',
        height: '10px',
        backgroundColor: '#ccc',
        borderRadius: '5px',
    },
    barStyles: {
        backgroundColor: '#d35400',
        width: '500px',
        height: '10px',
        borderRadius: '5px',
    },
    dataStyles: {
        color: 'rgba(204,3,3,0.64)',
        fontSize: '18px',
        fontWeight: '500',
    },
    dataInterpolation: (progress) =>
    {
        let message = '';
        if (progress < 25)
        {
            message = 'The village is waking up! Get ready for battle!';
        }
        else if (progress < 50)
        {
            message = 'Troops are training, defenses are building!';
        }
        else if (progress < 75)
        {
            message = 'Your army is almost ready, prepare for victory!';
        }
        else if (progress < 98)
        {
            message = 'Final touches are being made!';
        }
        else
        {
            message = 'All set! Time to conquer and defend your village!';
        }
        return `${message}`;
    },
    initialState: (active) => active,
};