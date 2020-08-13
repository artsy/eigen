import { interpolate } from "d3-interpolate"
import { arc as d3_arc, pie as d3_pie } from "d3-shape"
import React, { useRef, useState } from "react"
import { Spring } from "react-spring/renderprops.cjs"
import styled from "styled-components"
import { color, space } from "../../helpers"
import { Color } from "../../Theme"
import { Box } from "../Box"
import { ChartHoverTooltip } from "../DataVis/ChartHoverTooltip"
import {
  coerceTooltip,
  coerceTooltipWithoutPadding,
} from "../DataVis/ChartTooltip"
import { ProvideMousePosition } from "../DataVis/MousePositionContext"
import { ChartProps } from "../DataVis/utils/SharedTypes"
import { useHasEnteredViewport } from "../DataVis/utils/useHasEnteredViewPort"
import { useWrapperWidth } from "../DataVis/utils/useWrapperWidth"
import { Sans } from "../Typography"

const colors: Color[] = ["black10", "black30", "black60"]
const MIN_CHART_SIZE = 30

export interface DonutChartProps extends ChartProps {
  margin?: number
}

/**
 * DonutChart is a component that displays data points with donut shaped arcs.
 * Good for illustrating numerical proportions.
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  points,
  margin = space(3),
}) => {
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [labelFadeIn, setLabelFadeIn] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasEnteredViewport = useHasEnteredViewport(wrapperRef)

  const width = Math.max(useWrapperWidth(wrapperRef), MIN_CHART_SIZE)

  // width of the arc is %12 of chart width
  const donutWidth = width * 0.12

  // margin between chart and labels step down to 10px when chart is smaller than 230px
  const donutLabelMargin = width > 230 ? space(2) : space(1)

  // 2px in radians
  const padAngel = Math.atan(2 / width)

  const centerX = width / 2 + margin
  const centerY = width / 2 + margin

  const values = points.map(d => d.value)
  const angelInterpolator = interpolate(0, 2 * Math.PI)

  const arc = d3_arc()
    .innerRadius(width / 2 - margin - donutWidth)
    .outerRadius(width / 2 - margin)
    .padAngle(padAngel)

  // virtual donut to use its arc centroids to calculate label position
  const labelArc = d3_arc()
    .innerRadius(width / 2 - margin + donutLabelMargin)
    .outerRadius(width / 2 - margin + donutLabelMargin)

  const pie = d3_pie().value((d: any) => d.value)

  const tooltip = points.map((point, index) => {
    const hover = hoverIndex === index
    return hover ? (
      <ChartHoverTooltip key={`${index}-hover`}>
        {coerceTooltip(point.tooltip)}
      </ChartHoverTooltip>
    ) : null
  })

  const labels = pie(points as any).map((slice, index) => {
    const [x, y] = labelArc.centroid(slice as any)
    const axisLabelX = points[index].axisLabelX
    return (
      axisLabelX && (
        <DonutLabelContainer
          key={index}
          opacity={labelFadeIn ? 1 : 0}
          x={x + centerX}
          y={y + centerY}
          center={centerX}
        >
          <Sans color="black60" size="2">
            {coerceTooltipWithoutPadding(axisLabelX)}
          </Sans>
        </DonutLabelContainer>
      )
    )
  })

  const zeroStateArc = pie([{ value: 1 }] as any).map(zeroState => (
    <path
      key="zero-state"
      stroke="none"
      fill={color("black5")}
      d={arc(zeroState as any)}
    />
  ))

  const animateProps = e => ({
    num: e ? 0 : 1,
  })

  const svg = (
    <svg key={"svg"} width={width + margin} height={width + margin}>
      <g transform={`translate(${centerX}, ${centerY})`}>
        {zeroStateArc}
        <Spring from={{ num: -0.1 }} to={animateProps(!hasEnteredViewport)}>
          {({ num }) => {
            if (!labelFadeIn && num > 0.7) {
              setLabelFadeIn(true)
            }
            const angle = angelInterpolator(num)
            pie.endAngle(angle)
            const slices = pie(points as any).map((datum: any, index) => {
              // d3 by default sorts slices by values. for color assignment we
              // need sorted index but for hover we need original order in points
              // to match with correct tooltip
              const sortedIndex = datum.index
              let arcColor: string = color(colors[sortedIndex % colors.length])
              // avoid the first and last arc ending up the same color
              if (
                sortedIndex === values.length - 1 &&
                sortedIndex % colors.length === 0
              ) {
                arcColor = color(colors[1])
              }
              return (
                <path
                  key={index}
                  fill={arcColor}
                  d={arc(datum)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(-1)}
                />
              )
            })
            return <g>{slices}</g>
          }}
        </Spring>
      </g>
    </svg>
  )

  return (
    <ProvideMousePosition>
      <Box ref={wrapperRef as any} position="relative">
        <>
          {tooltip}
          {width !== MIN_CHART_SIZE && labels}
          {svg}
        </>
      </Box>
    </ProvideMousePosition>
  )
}

interface DonutLabelContainerProps {
  x: number
  y: number
  center?: number
  opacity: number
}

// to create a float:right effect for labels that are on left side (also top)
const computeLabelTranslate = (dim: number, center: number): string => {
  const diffPercent = (dim - center) / center
  if (diffPercent < -0.25) {
    return "-100%"
  } else if (diffPercent < -0 && diffPercent > -0.25) {
    return "-50%"
  } else {
    return "0"
  }
}

const DonutLabelContainer = styled.div<DonutLabelContainerProps>`
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  position: absolute;
  text-align: center;
  transform: translate(
    ${({ x, center }) => computeLabelTranslate(x, center)},
    ${({ y, center }) => computeLabelTranslate(y, center)}
  );
  white-space: nowrap;
  transition: opacity 0.4s ease-in;
  opacity: ${({ opacity }) => opacity};
`
