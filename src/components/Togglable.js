import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [activated, setActivated] = useState(false)

  const hideWhenActive = { display: activated ? 'none' : '' }
  const hideWhenInactive = { display: activated ? '' : 'none' }

  const toggleVisibility = () => setActivated(!activated)


  useImperativeHandle(ref, () => { return { toggleVisibility } })

  return (
    <div>
      <button onClick={toggleVisibility} style={hideWhenActive}>{props.toggleName}</button>
      <div style={hideWhenInactive} >
        {props.children}
        <button onClick={toggleVisibility} >cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable