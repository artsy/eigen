import { StarCircleIcon } from "@artsy/icons/native"
import { Flex, useColor, Text, Color } from "@artsy/palette-mobile"
import { compact, noop } from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"
import { Dimensions } from "react-native"
import { Defs, G, LinearGradient, Stop } from "react-native-svg"
import { Subject } from "rxjs"
import { AnimatePropTypeInterface, InterpolationPropType } from "victory-core"
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryCursorContainer,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
} from "victory-native"
import { HighlightIconContainer, ScatterDataPointContainer } from "./ScatterPointsContainers"
import { AxisDisplayType, shadeColor, tickFormat } from "./helpers"
import { LineChartData } from "./types"

export type ChartGestureEventType = { x: number; y: number } | null

// using Subject because this observable should multicast to many datapoints
export const ChartGestureObservable = new Subject<ChartGestureEventType>()

interface LineGraphChartProps extends LineChartData {
  chartHeight?: number
  chartWidth?: number
  chartInterpolation?: InterpolationPropType
  dataTag?: string // optional tag to attach to data or events sent from this chart
  dataTagToSubscribeTo?: string
  highlightIconColor?: string
  onDataPointPressed?: (datum: LineChartData["data"][0] | null) => void
  onXHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  onYHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  shouldAnimate?: boolean
  showHighlights?: boolean
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
  dataTag,
  dataTagToSubscribeTo,
  highlightIconColor,
  onDataPointPressed = noop,
  onXHighlightPressed = noop,
  shouldAnimate = true,
  showHighlights = false,
  tintColorShadeFactor = 0.8,
  xAxisTickFormatter,
  yAxisTickFormatter,
  xAxisDisplayType,
  yAxisDisplayType,
}) => {
  const color = useColor()

  // MARK:- REFS
  const dataTagSubscribedNameRef = useRef(dataTagToSubscribeTo)

  // MARK:- STATES

  const [lastPressedDatum, setLastPressedDatum] = useState<
    ((typeof data)[0] & { left?: number; dataTag?: string }) | null
  >(null)

  const shadedTintColor = shadeColor(tintColor, tintColorShadeFactor)

  // MARK:- DATA PREPARATION

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

  // MARK: INTERACTIONS
  const updateLastPressedDatum = (value: typeof lastPressedDatum) => {
    if (dataTagSubscribedNameRef.current && value && !value.dataTag && __DEV__) {
      console.warn(
        "You have specified a `dataTagToSubscribeTo` but you have not specified any `dataTag`. \n" +
          "If you are expecting events from multiple LineChartGraph at the same time, pass a dataTag to each and optionally choose which to subscribe to"
      )
      return
    }
    if (
      dataTagSubscribedNameRef.current &&
      value &&
      dataTagSubscribedNameRef.current !== value.dataTag
    ) {
      return
    }

    if (
      dataTagSubscribedNameRef.current &&
      value &&
      dataTagSubscribedNameRef.current === value.dataTag
    ) {
      setLastPressedDatum(value)
      onDataPointPressed?.(value)
      return
    }
    // Always set null and also untagged value if dataTagToSubscribeTo is not passed
    setLastPressedDatum(value)
    onDataPointPressed?.(value)
  }

  const onHighlightOnXAxisPressed = (value: typeof lastPressedDatum) => {
    if (!value) {
      return
    }
    if (dataTagSubscribedNameRef.current && value && !value.dataTag && __DEV__) {
      console.warn(
        "A highlight was pressed but no event was bubbled. \n" +
          "This is because you have specified a `dataTagToSubscribeTo` but you have not specified any `dataTag`. \n" +
          "If you are expecting events from multiple LineChartGraph at the same time, pass a dataTag to each and optionally choose which to subscribe to"
      )
      return
    }
    if (!dataTagSubscribedNameRef.current) {
      onXHighlightPressed?.(value)
    } else if (dataTagSubscribedNameRef.current === value.dataTag) {
      onXHighlightPressed?.(value)
    }
  }

  useEffect(() => {
    dataTagSubscribedNameRef.current = dataTagToSubscribeTo
    // when using multiple charts at the same time on the same page
    // an event might be propagated by multiple points that share positions
    // this reverts that when data changes
    setTimeout(() => {
      updateLastPressedDatum(null)
    }, 100)
  }, [JSON.stringify(data), dataTagToSubscribeTo])

  const broadcastGestureEventXToDataPoints = (event: ChartGestureEventType) => {
    ChartGestureObservable.next(event)
  }

  const ANIMATION_CONFIG: AnimatePropTypeInterface = {
    duration: 750,
    onExit: {
      duration: 750,
      before: (datum) => ({
        ...datum,
        _y: 0,
        _x: minMaxDomainX.max,
      }),
    },
    onEnter: {
      duration: 750,
      before: (datum) => ({
        ...datum,
        _y: 0,
        _x: minMaxDomainX.max,
      }),
    },
    onLoad: {
      duration: 750,
      before: (datum) => ({
        ...datum,
      }),
    },
    easing: "linear",
  }

  const renderDefs = useCallback(
    () => (
      <Defs>
        <LinearGradient id="gradientStroke" gradientTransform="rotate(90)">
          <Stop offset="0%" stopColor={shadedTintColor} stopOpacity="20%" />
          <Stop offset="100%" stopColor={color("mono0")} />
        </LinearGradient>
      </Defs>
    ),
    [tintColor]
  )

  const onCursorChange = (cursor: ChartGestureEventType) => {
    if (cursor) {
      broadcastGestureEventXToDataPoints({ x: Math.round(cursor.x), y: cursor.y })
      return
    }
    updateLastPressedDatum(cursor)
  }

  return (
    <>
      <Flex style={{ paddingLeft: 5 }}>
        <VictoryChart
          theme={VictoryTheme.material}
          // mapping domain from 0 to 1 because data is normalized by the factor of max Y value.
          domain={{ y: [0, 1] }}
          domainPadding={{ y: [0, yDomainPadding] }}
          backgroundComponent={<Background />}
          containerComponent={
            <VictoryCursorContainer
              onCursorChange={(cursor) => onCursorChange(cursor as ChartGestureEventType)}
              cursorComponent={<Flex />}
            />
          }
          style={{
            background: { fill: color("mono0") },
          }}
          padding={{ left: 40, right: 40, bottom: 20, top: 40 }}
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
              animate={shouldAnimate ? ANIMATION_CONFIG : undefined}
              interpolation={chartInterpolation}
              // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
              y={(datum: any) => datum.y / maxima}
            />
          )}

          {data.length > 1 && (
            /** Draws the Line Above the Area
             * Will crash on android if you pass data with less than 2 points
             */
            // @ts-ignore // AnimatePropTypeInterface has not been typed into VictoryLine yet
            <VictoryLine
              animate={shouldAnimate ? ANIMATION_CONFIG : undefined}
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
              axis: { stroke: color("mono15"), strokeDasharray: 2 },
              ticks: { size: 0 },
              grid: {
                stroke: ({ tick }: { tick?: number }) =>
                  tick && Number(tick * maxima) === minMaxDomainY.max
                    ? color("mono15")
                    : "transparent",
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
              axis: { stroke: color("mono30"), strokeDasharray: 2 },
              ticks: { size: 0 },
              grid: {
                stroke: ({ tick }: { tick?: number }) => {
                  if (!tick) return "transparent"
                  if (tick === lastPressedDatum?.x) {
                    return color("mono100")
                  }
                  if (xValues.length > 1) {
                    return xAxisTickMap[tick] ? color("mono15") : "transparent"
                  }
                  return color("mono15")
                },
                strokeDasharray: 3,
              },
            }}
            tickValues={xValues}
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
          {/** @ts-ignore */}
          <VictoryScatter
            style={{
              data: {
                stroke: tintColor,
                fill: (args) => {
                  const { datum } = args
                  return datum && (datum.x === lastPressedDatum?.x || data.length === 1)
                    ? tintColor
                    : "transparent"
                },
              },
            }}
            data={data}
            domain={{ y: [0, 1] }}
            y={(datum: any) => datum.y / maxima}
            dataComponent={
              <ScatterDataPointContainer
                size={4}
                updateLastPressedDatum={updateLastPressedDatum}
                dataTag={dataTag}
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
              size={5}
              dataComponent={
                <HighlightIconContainer
                  dataTag={dataTag}
                  icon={
                    xHighlightIcon ?? (
                      <StarCircleIcon
                        fill={(highlightIconColor || tintColor) as Color}
                        height={20}
                        width={20}
                      />
                    )
                  }
                  onHighlightPressed={onHighlightOnXAxisPressed}
                />
              }
            />
          )}
        </VictoryChart>
      </Flex>
      {!!lastPressedDatum && (
        <Flex position="absolute" top={70} left={lastPressedDatum.left}>
          <Text color="mono60" variant="xs">
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
