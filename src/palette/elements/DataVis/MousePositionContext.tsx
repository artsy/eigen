import React, { useEffect, useState } from "react"

// tslint:disable-next-line:completed-docs
export const MousePositionContext = React.createContext({ x: 0, y: 0 })

// tslint:disable-next-line:completed-docs
export const ProvideMousePosition: React.SFC = ({ children }) => {
  const [state, setState] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setMousePosition = (ev: MouseEvent) => {
      setState({
        x: ev.clientX,
        y: ev.clientY,
      })
    }
    window.addEventListener("mousemove", setMousePosition)
    return () => {
      window.removeEventListener("mousemove", setMousePosition)
    }
  }, [false])

  return (
    <MousePositionContext.Provider value={state}>
      {children}
    </MousePositionContext.Provider>
  )
}
