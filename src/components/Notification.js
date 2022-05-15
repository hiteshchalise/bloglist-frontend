import React from 'react'
import PropTypes from 'prop-types'


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

  if (message === '') return null
  return (
    <div className='notification' style={error ? errorStyle : notificationStyle}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired
}

export default Notification