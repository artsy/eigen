import { Flex, useColor, Text } from "@artsy/palette-mobile"
import { scaleLinear } from "d3-scale"
import * as shape from "d3-shape"
import { ViewProps, ViewStyle } from "react-native"
import { G, Path } from "react-native-svg"
import { AxisDisplayType, randomSVGId, tickFormat as labelFormat } from "./helpers"

const d3 = { shape }

interface AxisProps {
  xDomain: [number, number]
  yDomain: [number, number]
  xtickValues: number[]
  ytickValues: number[]
  chartWidth: number
  chartHeight: number
  yLabelMaxWidth: number
}

export const Axes: React.FC<AxisProps> = ({
  chartWidth,
  chartHeight,
  xtickValues,
  ytickValues,
  xDomain,
  yDomain,
}) => {
  const color = useColor()

  const xValuesASC = xtickValues.sort((a, b) => a - b)
  const scaleX = scaleLinear().domain(xDomain).range([0, chartWidth])
  const scaleY = scaleLinear().domain(yDomain).range([chartHeight, 0])

  const lineHorizontal =
    d3.shape
      .line()
      .x((d) => scaleX(d[0]))
      .y((d) => d[1])(xtickValues.map((t) => [t, 0])) ?? undefined

  const lineVertical =
    d3.shape
      .line()
      .x((d) => d[0])
      .y((d) => scaleY(d[1]))(ytickValues.map((t) => [0, t])) ?? undefined

  const STROKE_WIDTH = 1
  return (
    <G strokeDasharray={[4, 4]} strokeWidth={STROKE_WIDTH}>
      <Path id={randomSVGId()} d={lineHorizontal} fill="transparent" stroke={color("mono30")} />
      <Path
        id={randomSVGId()}
        translateY={chartHeight}
        d={lineHorizontal}
        fill="transparent"
        stroke={color("mono30")}
      />

      {/** GRIDS */}
      {Array.from({ length: xValuesASC.length }).map((_, index) => {
        const spacer = chartWidth / (xValuesASC.length - 1)
        return (
          <Path
            key={"path" + index}
            id={randomSVGId()}
            x={spacer * index}
            d={lineVertical}
            fill="transparent"
            stroke={color("mono30")}
          />
        )
      })}
    </G>
  )
}

export const YAxisLabels: React.FC<{
  yValues: number[]
  height: number
  formatter?: (val: number) => string
  labelFormatType?: AxisDisplayType
  style?: ViewStyle
  onLayout: ViewProps["onLayout"]
}> = ({
  yValues,
  formatter = (val) => val.toString(),
  height,
  style,
  onLayout,
  labelFormatType = AxisDisplayType.OnlyShowMinAndMaxDomain,
}) => {
  const sorted = yValues.sort((a, b) => b - a)
  return (
    <Flex style={style} onLayout={onLayout} height={height} justifyContent="space-between">
      {sorted.map((value) => {
        const yLabel = labelFormat(
          value,
          sorted[0],
          sorted[sorted.length - 1],
          formatter,
          labelFormatType
        )
        return (
          <Text key={value} variant="xs" textAlign="right" color="mono60">
            {yLabel}
          </Text>
        )
      })}
    </Flex>
  )
}

export const XAxisLabels: React.FC<{
  xValues: number[]
  formatter?: (val: number) => string
  width: number
  style?: ViewStyle
}> = ({ xValues, formatter = (val) => val.toString(), style, width }) => {
  return (
    <Flex style={style} flexDirection="row" justifyContent="space-between" width={width}>
      {xValues.map((value) => (
        <Text key={value} variant="xs" color="mono60">
          {formatter(value)}
        </Text>
      ))}
    </Flex>
  )
}
