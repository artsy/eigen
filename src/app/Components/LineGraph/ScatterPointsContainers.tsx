import { useEffect } from "react"
import { G } from "react-native-svg"
import { Point } from "victory-native"
import { ChartGestureEventType, ChartGestureObservable } from "./LineGraphChart"

interface HighlightIconContainerProps {
  dataTag?: string
  icon: React.JSX.Element
  onHighlightPressed: (datum: any) => void
}

/** HighlightIconContainer helps format the custom highlights icon so they display properly on the chart
 * VictoryChart will injects its props into this Component including whatever extra props we provide.
 * It will also trigger the onHighlightPressed callback with the datum if pressed.
 */
export const HighlightIconContainer: React.FC<HighlightIconContainerProps> = (props) => {
  const { dataTag, icon, onHighlightPressed, ...injectedProps } = props
  const { x, y, datum } = injectedProps as any

  // TODO: x and y seems to have been displaced by 10. Investigate why.
  const DISPLACEMENT_FACTOR = 10

  const isWithinItemRange = (cursorX: number, cursorY: number) => {
    // y would always be 0 or close to 0 for highlights
    // we are using 0.06 here. Change this value to adjust the hitslop vertically
    if (cursorX === datum.x && cursorY <= 0.06) {
      return true
    }
    return false
  }

  const checkTappedXDataRegion = (cursor: ChartGestureEventType) => {
    if (cursor && isWithinItemRange(cursor.x, cursor.y)) {
      onHighlightPressed?.({ ...datum, dataTag })
    }
  }

  const observer = {
    next: checkTappedXDataRegion,
  }

  useEffect(() => {
    const observable = ChartGestureObservable.subscribe(observer)
    return () => observable.unsubscribe()
  }, [])

  return (
    <G x={x - DISPLACEMENT_FACTOR} y={y - DISPLACEMENT_FACTOR}>
      {icon}
    </G>
  )
}

interface ScatterDataPointContainerProps {
  updateLastPressedDatum: (datum: any) => void
  size: number
  dataTag?: string
}

export const ScatterDataPointContainer: React.FC<ScatterDataPointContainerProps> = (props) => {
  const { dataTag, updateLastPressedDatum, ...injectedProps } = props
  const { x, datum } = injectedProps as any

  const checkTappedXDataRegion = (cursor: ChartGestureEventType) => {
    if (cursor && cursor.x === datum.x) {
      updateLastPressedDatum?.({ ...datum, left: x - 10, dataTag })
    }
  }

  const observer = {
    next: checkTappedXDataRegion,
  }

  useEffect(() => {
    const observable = ChartGestureObservable.subscribe(observer)
    return () => observable.unsubscribe()
  }, [])

  return <Point {...props} />
}
