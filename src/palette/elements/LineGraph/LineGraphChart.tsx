import { compact, noop } from "lodash"
import { Flex } from "palette"
import { useColor, useSpace } from "palette/hooks"
import { StarCircleIcon } from "palette/svgs/StarCircleIcon"
import { Color } from "palette/Theme"
import { useCallback, useEffect, useState } from "react"
import { Dimensions, NativeTouchEvent, Platform, TouchableOpacity } from "react-native"
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
import { HighlightIconContainer, ScatterDataPointContainer } from "./ScatterPointsContainers"
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
  onDataPointPressed?: (datum: LineChartData["data"][0]) => void
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
  dataMeta: { tintColor = "#707070", xHighlightIcon },
  chartHeight = deviceHeight / 3,
  chartWidth = deviceWidth - 20 * 2,
  chartInterpolation = "natural",
  onDataPointPressed = noop,
  onXHighlightPressed = noop,
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

  useEffect(() => {
    if (yHighlights.length && showHighlights) {
      console.error("Plotting highlights on dependent axis Y is not yet supported")
    }
  }, [yHighlights])

  const yValues = data.map((datum) => datum.y)
  const xValues = data.map((datum) => datum.x)

  const minMaxDomainY = { min: Math.min(...yValues), max: Math.max(...yValues) }
  const minMaxDomainX = { min: Math.min(...xValues), max: Math.max(...xValues) }

  const maxima = minMaxDomainY.max // because the y axis is the dependent axis

  // If you using the chart interpolation to natural, you need
  // the right domainPadding so that the parabolic curve at the
  // top is not cut off
  const yDomainPadding =
    chartInterpolation === "natural" ? calculateDomainPadding(yValues, maxima) : 0

  const xAxisTickMap: Record<number, boolean> = Object.assign(
    {},
    ...xValues.map((xtick) => ({ [xtick]: true }))
  )

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

  const [lastPressedDatum, setLastPressedDatum] = useState<
    (typeof data[0] & { left: number }) | null
  >(null)

  useEffect(() => {
    setLastPressedDatum(null)
  }, [JSON.stringify(data)])

  return (
    /*
    Wrapping Chart with Touchable because events are broken in Victory native.
    In order to detect when a highlight is pressed, we pass the press event to
    the HighlightContainer which then checks if it was its item that was pressed
    and then fires the onHighlightPressed callback for that item.
    This is not very performant as there might be highlights.length number of rerenders.
    TODO: Investigate event issues on victory native
    */
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={({ nativeEvent }) => setLastPressedEvent(nativeEvent)}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          // mapping domain from 0 to 1 because data is normalized by the factor of max Y value.
          domain={{ y: [0, 1] }}
          domainPadding={{ y: [40, yDomainPadding] }}
          backgroundComponent={<Background />}
          containerComponent={<Svg />}
          style={{
            background: { fill: "white" },
          }}
          padding={{ left: space(3), right: space(2), bottom: space(3), top: space(3) }}
          width={chartWidth}
          height={chartHeight}
        >
          {renderDefs()}

          {data.length > 1 && (
            /** Draws the Area beneath the line.
             * Will crash on android if you pass data with less than 2 points
             */
            <VictoryArea
              style={{
                data: { fill: "url(#gradientStroke)" },
              }}
              data={data}
              animate={ANIMATION_CONFIG}
              interpolation={chartInterpolation}
              // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
              y={(datum: any) => datum.y / maxima}
            />
          )}

          {data.length > 1 && (
            /** Draws the Line Above the Area
             * Will crash on android if you pass data with less than 2 points
             */
            <VictoryLine
              animate
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
              y={(datum: any) => datum.y / maxima}
            />
          )}

          {/** Y-Axis */}
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: color("black30"), strokeDasharray: 2 },
              ticks: { size: 0 },
              grid: {
                stroke: ({ tick }: { tick: number }) =>
                  Number(tick * maxima) === minMaxDomainY.max ? color("black30") : "transparent",
                strokeDasharray: 3,
              },
            }}
            axisLabelComponent={<Text />}
            maxDomain={minMaxDomainY.max}
            minDomain={minMaxDomainY.min}
            tickFormat={(tick: number) =>
              tickFormat(
                tick * maxima, // Because we did y={(datum) => datum.y / maxima} in VictoryArea to normalise Y values
                minMaxDomainY.min,
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
              grid: {
                stroke: ({ tick }: { tick: number }) => {
                  if (tick === lastPressedDatum?.x) {
                    return color("black100")
                  }
                  if (xValues.length > 1) {
                    return xAxisTickMap[tick] ? color("black30") : "transparent"
                  }
                  return color("black30")
                },
                strokeDasharray: 3,
              },
            }}
            axisLabelComponent={<Text />}
            maxDomain={minMaxDomainX.max}
            minDomain={minMaxDomainX.min}
            tickFormat={(tick: number) =>
              tickFormat(
                tick,
                minMaxDomainX.min,
                minMaxDomainX.max,
                xAxisTickFormatter ?? ((val) => val), // don't format x ticks by default
                xAxisDisplayType ?? AxisDisplayType.OnlyShowMinAndMaxDomain
              )
            }
          />

          {/** If only a single data is given, plot a point */}
          <VictoryScatter
            style={{
              data: {
                stroke: tintColor,
                fill: ({ datum }: { datum: any }) =>
                  datum.x === lastPressedDatum?.x || data.length === 1 ? tintColor : "transparent",
              },
            }}
            data={data}
            domain={{ y: [0, 1] }}
            y={(datum: any) => datum.y / maxima}
            dataComponent={
              <ScatterDataPointContainer
                // touch along the x axis within this point, this data point can claim it
                pointXRadiusOfTouch={data.length ? chartWidth / data.length / 2 : 0}
                size={data.length > 1 ? 4 : 7}
                setLastPressedDatum={setLastPressedDatum}
                lastPressedEvent={lastPressedEvent}
                clearLastPressedEvent={() => setLastPressedEvent(null)}
                onDataPointPressed={onDataPointPressed}
              />
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
              size={Platform.OS === "android" ? 7 : 5}
              dataComponent={
                <HighlightIconContainer
                  icon={
                    xHighlightIcon ?? (
                      <StarCircleIcon fill={tintColor as Color} height={20} width={20} />
                    )
                  }
                  onHighlightPressed={onXHighlightPressed}
                  lastPressedEvent={lastPressedEvent}
                  clearLastPressedEvent={() => setLastPressedEvent(null)}
                />
              }
            />
          )}
        </VictoryChart>
      </TouchableOpacity>

      {lastPressedDatum && (
        <Flex position="absolute" top={70} left={lastPressedDatum?.left}>
          <Text textAlign="center" variant="xs" color="black60">
            {lastPressedDatum.x}
          </Text>
        </Flex>
      )}
    </>
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
