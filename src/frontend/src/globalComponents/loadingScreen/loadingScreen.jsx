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