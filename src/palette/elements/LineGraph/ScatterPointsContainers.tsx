import { useEffect, useRef } from "react"
import { G } from "react-native-svg"
import { Point } from "victory-native"
import { ChartGestureEventType, ChartGestureObservable } from "./LineGraphChart"

interface HighlightIconContainerProps {
  dataTag?: string
  icon: JSX.Element
  onHighlightPressed: (datum: any) => void
}

/** HighlightIconContainer helps format the custom highlights icon so they display properly on the chart
 * VictoryChart will injects its props into this Component including whatever extra props we provide.
 * It will also trigger the onHighlightPressed callback with the datum if pressed.
 */
export const HighlightIconContainer: React.FC<HighlightIconContainerProps> = (props) => {
  const { dataTag, icon, onHighlightPressed, ...injectedProps } = props
  const { x, y, datum } = injectedProps as any

  // this ref and effect is needed because x begins at a fixed point
  // and over time transitions to a final point. Due to stale closures
  // the initial captured x may be the initial x. Ref + useEffect to correct that.
  const xRef = useRef(x)
  useEffect(() => {
    xRef.current = x
  }, [x])

  const datumRef = useRef(datum)
  useEffect(() => {
    datumRef.current = datum
  }, [JSON.stringify(datum)])

  // TODO: x and y seems to have been displaced by 10. Investigate why.
  const DISPLACEMENT_FACTOR = 10

  const isWithinItemRange = (locationX: number, locationY: number) => {
    if (
      Math.abs(xRef.current - locationX) <= DISPLACEMENT_FACTOR &&
      Math.abs(y - locationY) <= DISPLACEMENT_FACTOR
    ) {
      return true
    }
    return false
  }

  const checkTappedXDataRegion = (event: ChartGestureEventType) => {
    if (isWithinItemRange(event.x, event.y)) {
      onHighlightPressed?.({ ...datumRef.current, dataTag })
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
  /** the area along the x-axis that when touched, a point can claim */
  pointXRadiusOfTouch: number
}

export const ScatterDataPointContainer: React.FC<ScatterDataPointContainerProps> = (props) => {
  const { dataTag, pointXRadiusOfTouch, updateLastPressedDatum, ...injectedProps } = props
  const { x, datum } = injectedProps as any

  const isWithinItemRange = (locationX: number) => {
    if (Math.abs(x - locationX) <= pointXRadiusOfTouch) {
      return true
    }
    return false
  }

  const checkTappedXDataRegion = (event: ChartGestureEventType) => {
    if (isWithinItemRange(event.x)) {
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
