import { useEffect } from "react"
import { G } from "react-native-svg"
import { Point } from "victory-native"
import { ChartTapEventType, ChartTapObservable } from "./LineGraphChart"
import { LineChartData } from "./types"

interface HighlightIconContainerProps {
  icon: JSX.Element
  onHighlightPressed: (datum: any) => void
  chartHeight: number
}

/** HighlightIconContainer helps format the custom highlights icon so they display properly on the chart
 * VictoryChart will injects its props into this Component including whatever extra props we provide.
 * It will also trigger the onHighlightPressed callback with the datum if pressed.
 */
export const HighlightIconContainer: React.FC<HighlightIconContainerProps> = (props) => {
  const { chartHeight, icon, onHighlightPressed, ...injectedProps } = props
  const { x, y, datum } = injectedProps as any

  // TODO: x and y seems to have been displaced by 10. Investigate why.
  const DISPLACEMENT_FACTOR = 10

  const isWithinItemRange = (locationX: number, locationY: number) => {
    if (
      Math.abs(x - locationX) <= DISPLACEMENT_FACTOR &&
      Math.abs(y - locationY) <= DISPLACEMENT_FACTOR
    ) {
      return true
    }
    return false
  }

  const checkTappedXDataRegion = (event: ChartTapEventType) => {
    if (
      // @ts-ignore Event might be a scrollview touch or tap gesture handler event
      isWithinItemRange(
        event.locationX ?? event.absoluteY ?? 0,
        event.locationY ?? event.absoluteY ?? 0
      )
    ) {
      onHighlightPressed?.(datum)
    }
  }

  const observer = {
    next: checkTappedXDataRegion,
  }

  useEffect(() => {
    const observable = ChartTapObservable.subscribe(observer)
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
  /** the area along the x-axis that when touched, a point can claim */
  pointXRadiusOfTouch: number
  onDataPointPressed?: (datum: LineChartData["data"][0]) => void
}

export const ScatterDataPointContainer: React.FC<ScatterDataPointContainerProps> = (props) => {
  const { onDataPointPressed, pointXRadiusOfTouch, updateLastPressedDatum, ...injectedProps } =
    props
  const { x, datum } = injectedProps as any

  const isWithinItemRange = (locationX: number) => {
    if (Math.abs(x - locationX) <= pointXRadiusOfTouch) {
      return true
    }
    return false
  }

  const checkTappedXDataRegion = (event: ChartTapEventType) => {
    // @ts-ignore Event might be a scrollview touch or tap gesture handler event
    if (isWithinItemRange(event.pageX ?? event.absoluteX ?? 0)) {
      updateLastPressedDatum?.({ ...datum, left: x - 10 })
    }
  }

  const observer = {
    next: checkTappedXDataRegion,
  }

  useEffect(() => {
    const observable = ChartTapObservable.subscribe(observer)
    return () => observable.unsubscribe()
  }, [])

  return <Point {...props} />
}
