import { interpolateArray } from "d3-interpolate"
import { line as d3Line } from "d3-shape"
import { maxBy } from "lodash"
import React from "react"
import { Spring } from "react-spring/renderprops.cjs"
import styled from "styled-components"
import { color } from "../../helpers"
import { PointDescriptor } from "../DataVis/utils/SharedTypes"
import { Line } from "./Line"
import { Point } from "./Point"

interface LineChartSVGProps {
  width: number
  height: number
  margin: number
  points: PointDescriptor[]
  hoverIndex: number
  hasEnteredViewport: boolean
}

/**
 * Component rendering the SVG part of the line chart (e.g line and points)
 */
export const LineChartSVG: React.FC<LineChartSVGProps> = ({
  width,
  height,
  margin,
  points,
  hoverIndex,
  hasEnteredViewport,
}: LineChartSVGProps) => {
  const values = points.map(d => d.value)
  const maxValue: number = maxBy(points, item => item.value).value

  const zeros = values.map(() => 0)
  const valuesInterpolator = interpolateArray(zeros, values)

  const w = width - 2 * margin
  const h = height - 2 * margin

  // maps value to x/y position
  const displayYPosition = d => (maxValue ? h - (d * h) / maxValue : h)
  const displayXPosition = (_d, i) => (i / (points.length - 1)) * w

  const line = d3Line()
    .x(displayXPosition)
    .y(displayYPosition)
  return (
    <Svg width={width} height={height}>
      <g transform={`translate(0, ${margin})`}>
        <line stroke={color("black10")} x1="0" x2={width} y1={h} y2={h} />
        <g transform={`translate(${margin}, 0)`}>
          <Spring
            from={{ num: 0 }}
            to={hasEnteredViewport ? { num: 1 } : { num: 0 }}
            delay={500}
          >
            {({ num }) => {
              const interpolatedValues: any = valuesInterpolator(num)
              return (
                <>
                  <Line path={line(interpolatedValues as any)} />
                  {interpolatedValues.map((value, index) => {
                    return (
                      <Point
                        hovered={hoverIndex === index}
                        key={index}
                        opacity={num}
                        cx={displayXPosition(value, index)}
                        cy={displayYPosition(value)}
                      />
                    )
                  })}
                </>
              )
            }}
          </Spring>
        </g>
      </g>
    </Svg>
  )
}

const Svg = styled.svg`
  position: absolute;
`
