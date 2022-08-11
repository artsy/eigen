import { useEffect } from "react"
import { NativeTouchEvent } from "react-native"
import { G } from "react-native-svg"
import { Point } from "victory-native"

interface BaseContainerProps {
  lastPressedEvent: NativeTouchEvent | null
  clearLastPressedEvent: () => void
}

interface HighlightIconContainerProps extends BaseContainerProps {
  icon: JSX.Element
  onHighlightPressed: (datum: any) => void
}

/** HighlightIconContainer helps format the custom highlights icon so they display properly on the chart
 * VictoryChart will injects its props into this Component including whatever extra props we provide.
 * It will also trigger the onHighlightPressed callback with the datum if pressed.
 */
export const HighlightIconContainer: React.FC<HighlightIconContainerProps> = (props) => {
  const { icon, lastPressedEvent, clearLastPressedEvent, onHighlightPressed, ...injectedProps } =
    props
  const { x, y, datum } = injectedProps as any

  // TODO: x and y seems to have been displaced by 10. Investigate why.
  const DISPLACEMENT_FACTOR = 10

  useEffect(() => {
    if (!!lastPressedEvent) {
      fireItemPressed(lastPressedEvent.locationX, lastPressedEvent.locationY)
      clearLastPressedEvent()
    }
  }, [lastPressedEvent])

  const isWithinItemRange = (locationX: number, locationY: number) => {
    if (
      Math.abs(x - locationX) <= DISPLACEMENT_FACTOR &&
      Math.abs(y - locationY) <= DISPLACEMENT_FACTOR
    ) {
      return true
    }
    return false
  }

  const fireItemPressed = (locationX: number, locationY: number) => {
    if (isWithinItemRange(locationX, locationY)) {
      onHighlightPressed?.(datum)
    }
  }

  return (
    <G x={x - DISPLACEMENT_FACTOR} y={y - DISPLACEMENT_FACTOR}>
      {icon}
    </G>
  )
}

interface ScatterDataPointContainerProps extends BaseContainerProps {
  setLastPressedDatum: (datum: any) => void
  size: number
  /** the area along the x-axis that when touched, a point can claim */
  pointXRadiusOfTouch: number
}

export const ScatterDataPointContainer: React.FC<ScatterDataPointContainerProps> = (props) => {
  const {
    lastPressedEvent,
    clearLastPressedEvent,
    pointXRadiusOfTouch,
    setLastPressedDatum,
    ...injectedProps
  } = props
  const { x, datum } = injectedProps as any

  useEffect(() => {
    if (!!lastPressedEvent) {
      fireItemPressed(lastPressedEvent.locationX)
      clearLastPressedEvent()
    }
  }, [lastPressedEvent])

  const isWithinItemRange = (locationX: number) => {
    if (Math.abs(x - locationX) <= pointXRadiusOfTouch) {
      return true
    }
    return false
  }

  const fireItemPressed = (locationX: number) => {
    if (isWithinItemRange(locationX)) {
      setLastPressedDatum?.({ ...datum, left: x - 10 })
    }
  }

  return <Point {...props} />
}
