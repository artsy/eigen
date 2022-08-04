import { compact, noop } from "lodash"
import { Flex } from "palette"
import { useColor, useSpace } from "palette/hooks"
import { StarCircleIcon } from "palette/svgs/StarCircleIcon"
import { useCallback, useEffect, useState } from "react"
import { Dimensions, NativeTouchEvent, TouchableOpacity, View } from "react-native"
import Svg, { Defs, LinearGradient, Stop } from "react-native-svg"
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native"
import { Text } from "../Text"
import { shadeColor, tickFormat, TickFormatType } from "./helpers"
import { LineChartData } from "./types"

const ANIMATION_CONFIG = {
  duration: 2000,
  onLoad: { duration: 1000 },
}

interface LineGraphChartProps extends LineChartData {
  showHighlights?: boolean
  chartHeight?: number
  chartWidth?: number
  onXHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  onYHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  /** Specifies by what factor between -0 to +1 to shade the graph area. Positive values lightens, negative darkens */
  tintColorShadeFactor?: number
  xAxisTickFormatter?: (val: any) => string
  yAxisTickFormatter?: (val: any) => string
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window")

export const LineGraphChart: React.FC<LineGraphChartProps> = ({
  data,
  dataMeta: { tintColor = "#707070", xHighlightIcon, yHighlightIcon },
  chartHeight,
  chartWidth,
  onXHighlightPressed = noop,
  onYHighlightPressed = noop,
  showHighlights = false,
  tintColorShadeFactor = 0.8,
  xAxisTickFormatter,
  yAxisTickFormatter,
}) => {
  const color = useColor()

  const shadedTintColor = shadeColor(tintColor, tintColorShadeFactor)

  const xHighlights = compact(
    data.map((datum) => (datum.xHighlight ? { y: 0, x: datum.xHighlight } : null))
  )
  const yHighlights = compact(
    data.map((datum) => (datum.yHighlight ? { x: 0, y: datum.yHighlight } : null))
  )

  const yValues = data.map((datum) => datum.y)
  const xValues = data.map((datum) => datum.x)

  const minMaxDomainY = { min: 0, max: Math.max(...yValues) }
  const minMaxDomainX = { min: 0, max: Math.max(...xValues) }

  const maxima = minMaxDomainY.max // because the y axis is the dependent axis

  useEffect(() => {
    validateHighlights()
  }, [xHighlights, yHighlights])

  const validateHighlights = () => {
    if (__DEV__) {
      const maxYHighlight = Math.max(...yHighlights.map((d) => d.y))
      const maxXHighlight = Math.max(...xHighlights.map((d) => d.x))

      const minYHighlight = Math.min(...yHighlights.map((d) => d.y))
      const minXHighlight = Math.min(...xHighlights.map((d) => d.x))

      const areValidHighlights =
        maxXHighlight <= minMaxDomainX.max &&
        maxYHighlight <= minMaxDomainY.max &&
        minXHighlight >= minMaxDomainX.min &&
        minYHighlight >= minMaxDomainY.min

      if (areValidHighlights) {
        return
      }
      console.error(
        "Error: Invalid Highlights passed to the Graph data. xHighlight must be within the range of the minimum and maximum values provided for the x axis. Likewise yHighlight for y-axis. Invalid highlights may not show on the chart."
      )
    }
  }

  const renderDefs = useCallback(
    () => (
      <Defs>
        <LinearGradient id="gradientStroke" gradientTransform="rotate(90)">
          <Stop offset="0%" stopColor={shadedTintColor} stopOpacity="20%" />
          <Stop offset="100%" stopColor="white" />
        </LinearGradient>
      </Defs>
    ),
    [tintColor]
  )

  const space = useSpace()

  const [lastPressedEvent, setLastPressedEvent] = useState<NativeTouchEvent | null>(null)

  return (
    /*
    Wrapping Chart with Touchable because events are broken in Victory native.
    In order to detect when a highlight is pressed, we pass the press event to
    the HighlightContainer which then checks if it was its item that was pressed
    and then fires the onHighlightPressed callback for that item.
    This is not very performant as there might be highlights.length number of rerenders.
    TODO: Investigate event issues on victory native
    */
    <TouchableOpacity
      activeOpacity={1}
      onPress={({ nativeEvent }) => setLastPressedEvent(nativeEvent)}
    >
      <VictoryChart
        theme={VictoryTheme.material}
        // mapping domain from 0 to 1 because data is normalized by the factor of max Y value.
        domain={{ y: [0, 1] }}
        backgroundComponent={<Background />}
        containerComponent={<Svg />}
        style={{
          background: { fill: "white" },
        }}
        padding={{ left: space(2), right: space(2), bottom: 30, top: 30 }}
        // space(2) * 2 for both sides of the screen
        width={chartWidth ?? deviceWidth - space(2) * 2}
        height={chartHeight ?? deviceHeight / 3}
      >
        {renderDefs()}

        {/** Draws the Area beneath the line */}
        <VictoryArea
          style={{
            data: { fill: "url(#gradientStroke)" },
          }}
          data={data}
          animate={ANIMATION_CONFIG}
          interpolation="natural"
          // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
          y={(datum) => datum.y / maxima}
        />

        {/** Draws the Line Above the Area */}
        <VictoryLine
          animate={ANIMATION_CONFIG}
          style={{
            data: { stroke: tintColor },
            // parent: { border: "transparent" },
            // labels: { fontFamily: bodyFont, stroke: 'transparent' },
            border: { stroke: "transparent" },
          }}
          data={data}
          domain={{ y: [0, 1] }}
          interpolation="natural"
          // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
          y={(datum) => datum.y / maxima}
        />

        {/** Y-Axis */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: color("black30"), strokeDasharray: 2 },
            ticks: { size: 0 },
            grid: {
              stroke: ({ tick }) =>
                Number(tick * maxima) === minMaxDomainY.max ? color("black30") : "transparent",
              strokeDasharray: 3,
            },
          }}
          axisLabelComponent={<Text />}
          maxDomain={minMaxDomainY.max}
          minDomain={minMaxDomainY.min}
          tickFormat={(tick) =>
            tickFormat(
              tick * maxima, // Because we did y={(datum) => datum.y / maxima} in VictoryArea to normalise Y values
              minMaxDomainY.max,
              yAxisTickFormatter, // falls back to use the defaultFormatter
              TickFormatType.OnlyShowMinAndMaxDomain
            )
          }
        />

        {/** X-Axis */}
        <VictoryAxis
          crossAxis
          style={{
            axis: { stroke: color("black30"), strokeDasharray: 2 },
            ticks: { size: 0 },
            grid: { stroke: color("black30"), strokeDasharray: 3 },
          }}
          axisLabelComponent={<Text />}
          maxDomain={minMaxDomainX.max}
          minDomain={minMaxDomainX.min}
          tickFormat={(tick) =>
            tickFormat(
              tick,
              minMaxDomainX.max,
              xAxisTickFormatter ?? ((val) => val), // don't format x ticks by default
              TickFormatType.OnlyShowMinAndMaxDomain
            )
          }
        />

        {/*
         * If you include xHighlight values in your data, the
         * values will be plotted along the x-axis as highlights
         */}
        {!!showHighlights && !!xHighlights.length && (
          <VictoryScatter
            name="xHighlightsChart"
            animate={ANIMATION_CONFIG}
            style={{
              data: { stroke: tintColor, fill: tintColor },
              parent: { border: "transparent" },
            }}
            data={xHighlights}
            size={5}
            dataComponent={
              <HighlightIconContainer
                // @ts-ignore
                icon={xHighlightIcon ?? <StarCircleIcon fill={tintColor} height={20} width={20} />}
                onHighlightPressed={onXHighlightPressed}
                lastPressedEvent={lastPressedEvent}
                clearLastPressedEvent={() => setLastPressedEvent(null)}
              />
            }
          />
        )}

        {/*
         * If you include yHighlight values in your data, the
         * values will be plotted along the y-axis as highlights
         */}
        {!!showHighlights && !!yHighlights.length && (
          <VictoryScatter
            name="yHighlightsChart"
            animate={ANIMATION_CONFIG}
            style={{
              data: { stroke: tintColor, fill: tintColor },
              parent: { border: "transparent" },
            }}
            data={yHighlights}
            size={5}
            dataComponent={
              <HighlightIconContainer
                // @ts-ignore
                icon={yHighlightIcon ?? <StarCircleIcon fill={tintColor} height={20} width={20} />}
                onHighlightPressed={onYHighlightPressed}
                lastPressedEvent={lastPressedEvent}
                clearLastPressedEvent={() => setLastPressedEvent(null)}
              />
            }
          />
        )}
      </VictoryChart>
    </TouchableOpacity>
  )
}

const Background = (props: any) => (
  <Flex
    position="absolute"
    width={props.width}
    height={props.height}
    left={props.x}
    top={props.y}
  />
)

/** HighlightIconContainer helps format the custom highlights icon so they display properly on the chart
 * VictoryChart will injects its props into this Component including whatever extra props we provide.
 * It will also trigger the onHighlightPressed callback with the datum if pressed.
 */
const HighlightIconContainer = (props: any) => {
  const { x, y, datum, icon, lastPressedEvent, clearLastPressedEvent, onHighlightPressed } = props

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
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        left: x - DISPLACEMENT_FACTOR,
        top: y - DISPLACEMENT_FACTOR,
      }}
    >
      {icon}
    </View>
  )
}
