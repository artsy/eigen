import { Flex } from "palette"
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory-native"

import { compact } from "lodash"
import { useCallback, useEffect } from "react"
import { Defs, LinearGradient, Stop } from "react-native-svg"
import { tickFormat, TickFormatType } from "./helpers"
import { LineChartData } from "./types"

const ANIMATION_CONFIG = {
  duration: 2000,
  onLoad: { duration: 1000 },
}

interface LineGraphChartProps extends LineChartData {
  showHighlights?: boolean
  xAxisTickFormatter?: (val: any) => string
  yAxisTickFormatter?: (val: any) => string
}

export const LineGraphChart: React.FC<LineGraphChartProps> = ({
  data,
  dataMeta: { tintColor = "#707070", xHighlightIcon, yHighlightIcon },
  showHighlights = false,
  xAxisTickFormatter,
  yAxisTickFormatter,
}) => {
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
        "Error: Invalid Highlights passed to the Graph data. xHighlight must be within the range of the minimum and maximum values provided for the x axis. Likewise yHighlight for y-axis. Invalid highlights may not show on the graph."
      )
    }
  }

  const renderDefs = useCallback(
    () => (
      <Defs>
        <LinearGradient id="gradientStroke" gradientTransform="rotate(90)">
          <Stop
            offset="0%"
            // stopColor={getColorByMedium(selectedMedium) || "#707070 "}
            stopColor={tintColor}
            stopOpacity="20%"
          />
          <Stop offset="100%" stopColor="white" />
        </LinearGradient>
      </Defs>
    ),
    [tintColor]
  )

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      // mapping domain from 0 to 1 because data is normalized by the factor of max Y value.
      domain={{ y: [0, 1] }}
      backgroundComponent={<Background />}
      containerComponent={<VictoryVoronoiContainer labels={({ datum }) => `${datum.y}`} />}
      style={{
        background: { fill: "white" },
      }}
    >
      {renderDefs()}

      <VictoryArea
        style={{
          // data: { fill: "#c43a31" }
          data: { fill: "url(#gradientStroke)" },
        }}
        data={data}
        animate={ANIMATION_CONFIG}
        interpolation="natural"
        // Normalise the dependent axis Y. Else it is not possible to represent data with extreme variance.
        y={(datum) => datum.y / maxima}
      />

      {/** Y-Axis */}
      <VictoryAxis
        dependentAxis
        style={{
          axis: { stroke: "none" },
          ticks: { display: "none" },
          grid: { stroke: "transparent", strokeDasharray: "0" },
        }}
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
          axis: { stroke: "none" },
          ticks: { display: "none" },
          grid: { stroke: "transparent" },
        }}
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
       * yHighlight will be 0
       */}
      {!!showHighlights && !!xHighlights.length && (
        <VictoryScatter
          animate={ANIMATION_CONFIG}
          style={{
            data: { stroke: tintColor, fill: tintColor },
            parent: { border: "transparent" },
            // labels: { fontFamily: bodyFont, stroke: 'transparent' }
          }}
          data={xHighlights}
          size={5}
          dataComponent={xHighlightIcon}
        />
      )}

      {/*
       * If you include yHighlight values in your data, the
       * values will be plotted along the y-axis as highlights
       * corresponding xHighlight will automatically be 0
       */}
      {!!showHighlights && !!yHighlights.length && (
        <VictoryScatter
          animate={ANIMATION_CONFIG}
          style={{
            data: { stroke: tintColor, fill: tintColor },
            parent: { border: "transparent" },
            // labels: { fontFamily: bodyFont, stroke: 'transparent' }
          }}
          data={yHighlights}
          size={5}
          dataComponent={yHighlightIcon}
        />
      )}
    </VictoryChart>
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
