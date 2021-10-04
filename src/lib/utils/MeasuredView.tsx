import { Box } from "palette"
import React, { useCallback } from "react"
import { LayoutChangeEvent } from "react-native"
import { useOffscreenStyle } from "./useOffscreenStyle"

export interface ViewMeasurements {
  width: number
  height: number
}

interface Props {
  setMeasuredState: (measuredState: ViewMeasurements) => void
}

/**
 * A view that renders off-screen, measures the width and height of the view, and reports it back.
 */
export const MeasuredView: React.FC<Props> = ({ children, setMeasuredState }) => {
  const offscreenStyle = useOffscreenStyle()
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setMeasuredState(event.nativeEvent.layout)
  }, [])

  return (
    <Box {...offscreenStyle} backgroundColor="pink" onLayout={onLayout}>
      {children}
    </Box>
  )
}
