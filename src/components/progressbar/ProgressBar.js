import { blue } from '@material-ui/core/colors';
import React, { useState, useEffect } from 'react';

const ProgressBar = (props) => {
    // const { bgcolor, completed } = props;
    const bgcolor = props.bgcolor
    const completed = props.completed

    const containerStyles = {
        height: 10,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 10,
        marginTop: 1,
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    const loadingbar = {
        background: '#B35CC3',
        // background: 'blue',
        borderRadius: '5px',
        width: `${completed}%`,
        height: '10px'
    }

    return (
        <div style={containerStyles}>
            <div style={loadingbar}></div>
            {/* <div style={fillerStyles}> */}
            {/* <span style={labelStyles}></span> */}
            {/* <div style={loadingbar}></div> */}
            {/* </div> */}
        </div>
    );
};

export default ProgressBar;