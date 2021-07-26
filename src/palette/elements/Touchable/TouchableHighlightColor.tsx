import { Color } from "palette/Theme"
import React, { useState } from "react"
import { Touchable, TouchableProps } from "./Touchable"

interface TouchableHighlightState {
  color: Color
  highlighted: boolean
}

interface TouchableHighlightColorProps extends TouchableProps {
  activeColor?: Color
  normalColor?: Color
  render: (state: TouchableHighlightState) => React.ReactNode
}

export const TouchableHighlightColor: React.FC<TouchableHighlightColorProps> = (props) => {
  const {
    activeOpacity = 1,
    activeColor = "blue100",
    normalColor = "black100",
    onPressIn,
    onPressOut,
    render,
    ...other
  } = props
  const [highlighted, setHighlighted] = useState(false)
  const color = highlighted ? activeColor : normalColor

  return (
    <Touchable
      noFeedback
      activeOpacity={activeOpacity}
      onPressIn={(event) => {
        setHighlighted(true)
        onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setHighlighted(false)
        onPressOut?.(event)
      }}
      {...other}
    >
      {render({ color, highlighted })}
    </Touchable>
  )
}
