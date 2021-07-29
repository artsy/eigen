import { Color, Touchable, TouchableProps } from "palette"
import React, { useState } from "react"

interface TouchableHighlightState {
  color: Color
  highlighted: boolean
}

interface TouchableHighlightColorProps extends TouchableProps {
  activeColor?: Color
  normalColor?: Color
  render: (state: TouchableHighlightState) => React.ReactNode;
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
