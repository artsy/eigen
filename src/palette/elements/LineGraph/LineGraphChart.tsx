import { compact, noop } from "lodash"
import { Flex } from "palette"
import { useColor, useSpace } from "palette/hooks"
import { StarCircleIcon } from "palette/svgs/StarCircleIcon"
import { useCallback, useEffect, useState } from "react"
import { Dimensions, NativeTouchEvent, TouchableOpacity, View } from "react-native"
import Svg, { Defs, G, LinearGradient, Stop } from "react-native-svg"
import { InterpolationPropType } from "victory-core"
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native"
import { Text } from "../Text"
import { AxisDisplayType, shadeColor, tickFormat } from "./helpers"
import { LineChartData } from "./types"

const ANIMATION_CONFIG = {
  duration: 2000,
  onLoad: { duration: 1000 },
}

interface LineGraphChartProps extends LineChartData {
  showHighlights?: boolean
  chartHeight?: number
  chartWidth?: number
  chartInterpolation?: InterpolationPropType
  onXHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  onYHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  /** Specifies by what factor between -0 to +1 to shade the graph area. Positive values lightens, negative darkens */
  tintColorShadeFactor?: number
  xAxisTickFormatter?: (val: any) => string
  yAxisTickFormatter?: (val: any) => string
  xAxisDisplayType?: AxisDisplayType
  yAxisDisplayType?: AxisDisplayType
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window")

export const LineGraphChart: React.FC<LineGraphChartProps> = ({
  data,
  dataMeta: { tintColor = "#707070", xHighlightIcon, yHighlightIcon },
  chartHeight,
  chartWidth,
  chartInterpolation = "natural",
  onXHighlightPressed = noop,
  onYHighlightPressed = noop,
  showHighlights = false,
  tintColorShadeFactor = 0.8,
  xAxisTickFormatter,
  yAxisTickFormatter,
  xAxisDisplayType,
  yAxisDisplayType,
}) => {
  const color = useColor()

  const shadedTintColor = shadeColor(tintColor, tintColorShadeFactor)

  const xHighlights = compact(
    data.map((datum) => (datum.highlight?.x ? { y: 0, x: datum.x } : null))
  )
  const yHighlights = compact(
    data.map((datum) => (datum.highlight?.y ? { x: 0, y: datum.y } : null))
  )

  const yValues = data.map((datum) => datum.y)
  const xValues = data.map((datum) => datum.x)

  const minMaxDomainY = { min: 0, max: Math.max(...yValues) }
  const minMaxDomainX = { min: 0, max: Math.max(...xValues) }

  const maxima = minMaxDomainY.max // because the y axis is the dependent axis

  // If you using the chart interpolation to natural, you need
  // the right domainPadding so that the parabolic curve at the
  // top is not cut off
  const yDomainPadding =
    chartInterpolation === "natural" ? calculateDomainPadding(yValues, maxima) : 0

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
        domainPadding={{ y: [40, yDomainPadding] }}
        // singleQuadrantDomainPadding={false}
        backgroundComponent={<Background />}
        containerComponent={<Svg />}
        style={{
          background: { fill: "white" },
        }}
        padding={{ left: space(3), right: space(2), bottom: space(3), top: space(3) }}
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
          interpolation={chartInterpolation}
          // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
          y={(datum) => datum.y / maxima}
        />

        {/** Draws the Line Above the Area */}
        <VictoryLine
          animate={ANIMATION_CONFIG}
          style={{
            data: { stroke: tintColor },
            border: { stroke: "transparent" },
          }}
          data={data}
          domain={{ y: [0, 1] }}
          // groupComponent={<G />} ensures the line is not cut off below when using
          // chartInterpolation = natural. Without this, lines will dip off
          // the chart.
          groupComponent={<G />}
          interpolation={chartInterpolation}
          // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
          y={(datum) => datum.y / maxima}
        />

        {/** If only a single data is given, plot a point */}
        {data.length === 1 && (
          <VictoryScatter
            style={{
              data: { stroke: tintColor, fill: tintColor },
            }}
            data={data}
            domain={{ y: [0, 1] }}
            size={7}
            y={(datum) => datum.y / maxima}
          />
        )}

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
              yAxisDisplayType ?? AxisDisplayType.OnlyShowMinAndMaxDomain
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
              xAxisDisplayType ?? AxisDisplayType.OnlyShowMinAndMaxDomain
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

/** Calculates the appropriate domain padding to apply to the top bound of the y axis.
 * Because we set interpolation natural, the Area or LineChart will have a parabolic curve
 * at the highest point as it connects to the next point if the next point falls within the
 * same plane as the highest point. Without domain padding to the top,the parabolic curve
 * will be cut off from the chart.
 */
const calculateDomainPadding = (values: number[], maxima: number): number => {
  const gridBoxHeight = maxima / 5
  let padding = 0
  const l = values.length
  for (let i = 0; i < l; i++) {
    if (i <= l - 2) {
      const currValue = values[i]
      const nextValue = values[i + 1]
      if (currValue === maxima && currValue - nextValue <= gridBoxHeight) {
        // needs padding
        const f = gridBoxHeight / 5 // because each micro box in a gridbox is 5
        const factor = (maxima + "").length
        padding = (f / Math.pow(10, factor)) * Math.pow(10, 3)
        break
      }
    }
  }
  return padding
}
