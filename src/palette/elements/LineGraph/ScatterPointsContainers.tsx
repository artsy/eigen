import { useEffect } from "react"
import { Circle, G } from "react-native-svg"
import { Point } from "victory-native"
import { ChartTapEventType, ChartTapObservable } from "./LineGraphChart"
import { LineChartData } from "./types"

interface BaseContainerProps {
  lastPressedLocation: { locationX: number; locationY: number } | null
  clearLastPressedLocation: () => void
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
  const {
    icon,
    lastPressedLocation,
    clearLastPressedLocation,
    onHighlightPressed,
    ...injectedProps
  } = props
  const { x, y, datum } = injectedProps as any

  // TODO: x and y seems to have been displaced by 10. Investigate why.
  const DISPLACEMENT_FACTOR = 10

  useEffect(() => {
    if (!!lastPressedLocation) {
      fireItemPressed(lastPressedLocation.locationX, lastPressedLocation.locationY)
      clearLastPressedLocation()
    }
  }, [lastPressedLocation])

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
  onDataPointPressed?: (datum: LineChartData["data"][0]) => void
}

export const ScatterDataPointContainer: React.FC<ScatterDataPointContainerProps> = (props) => {
  const {
    onDataPointPressed,
    pointXRadiusOfTouch,
    setLastPressedDatum,
    lastPressedLocation,
    clearLastPressedLocation,
    ...injectedProps
  } = props
  const { x, datum } = injectedProps as any

  const isWithinItemRange = (locationX: number) => {
    if (Math.abs(x - locationX) <= pointXRadiusOfTouch) {
      return true
    }
    return false
  }

  const checkPannedOverXDataRegion = (event: ChartGestureEventType) => {
    if (isWithinItemRange(event.x)) {
      setLastPressedDatum?.({ ...datum, left: x - 10 })
      onDataPointPressed?.(datum)
    }
  }

  const observer = {
    next: checkPannedOverXDataRegion,
  }

  useEffect(() => {
    const observable = ChartGestureObservable.subscribe(observer)
    return () => observable.unsubscribe()
  }, [])

  return <Point {...props} />
}

export interface ScatterChartPointProps {
  color: string
  onDataPointAreaTapped: (point: ScatterChartPointProps["point"]) => void
  point: { x: number; y: number; datum: LineChartData["data"][0] }
  /** the area along the x-axis that when touched, a point can claim */
  pointXRadiusOfTouch: number
  size?: number
}
export const ScatterChartPoint: React.FC<ScatterChartPointProps> = ({
  color,
  point,
  onDataPointAreaTapped,
  pointXRadiusOfTouch,
  size = 6,
}) => {
  const isWithinItemRange = (locationX: number) => {
    if (Math.abs(point.x - locationX) <= pointXRadiusOfTouch) {
      return true
    }
    return false
  }

  const checkTappedOverXDataRegion = (event: ChartTapEventType) => {
    if (isWithinItemRange(event.x)) {
      onDataPointAreaTapped(point)
    }
  }

  const observer = {
    next: checkTappedOverXDataRegion,
  }

  useEffect(() => {
    const observable = ChartTapObservable.subscribe(observer)
    return () => observable.unsubscribe()
  }, [])
  return (
    <Circle r={size / 2} cx={point.x} cy={point.y} stroke={color} strokeWidth="2.5" fill={color} />
  )
}
