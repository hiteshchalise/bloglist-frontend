import React from "react";

const Notification = ({ message, error }) => {
    const notificationStyle = {
        backgroundColor: '#D3D3D3',
        border: '4px solid green',
        color: 'green',
        padding: '1em 1em',
        margin: '1em 0',
        borderRadius: '4px'
    }

    const errorStyle = { ...notificationStyle, border: '4px solid red', color: 'red' }

    if (message === '') return null;
    return (
        <div style={error ? errorStyle : notificationStyle}>
            {message}
        </div>
    )
}

export default Notification;