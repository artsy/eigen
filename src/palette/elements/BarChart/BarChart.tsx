import { maxBy } from "lodash"
import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { color, space } from "../../helpers"
import { ChartTooltipProps, coerceTooltip } from "../DataVis/ChartTooltip"
import { ProvideMousePosition } from "../DataVis/MousePositionContext"
import { useHasEnteredViewport } from "../DataVis/utils/useHasEnteredViewPort"
import { Flex } from "../Flex"
import { Sans } from "../Typography"
import { Bar } from "./Bar"

const ChartContainer = styled(Flex)`
  border-bottom: 1px solid ${color("black10")};
`

function useHighlightLabelPositionConstraints(
  wrapperDiv: HTMLDivElement | null,
  labelDiv: HTMLDivElement | null
) {
  // Constrain highlight label to be within the bounds of the graph
  useEffect(() => {
    if (!wrapperDiv || !labelDiv) {
      return
    }
    // reset highlight label position
    labelDiv.style.left = null
    labelDiv.style.right = null
    // force layout to find centered position
    labelDiv.offsetWidth

    const wrapperRect = wrapperDiv.getBoundingClientRect()
    const labelRect = labelDiv.getBoundingClientRect()

    // check for overlap with BarChart left bound
    const labelLeftOffset = wrapperRect.left - labelRect.left
    if (labelLeftOffset > 0) {
      // label is too far to the left, compensate
      labelDiv.style.left = labelLeftOffset + "px"
      return
    }
    // check for overlap with BarChart right bound
    const labelRightOffset = labelRect.right - wrapperRect.right
    if (labelRightOffset > 0) {
      // label is too far to the right, compensate
      labelDiv.style.right = labelRightOffset + "px"
    }
  })
}

export interface BarDescriptor {
  value: number
  label?: React.ReactNode | ChartTooltipProps
  axisLabelX?: React.ReactNode
  highlightLabel?: React.ReactNode | ChartTooltipProps
  onClick?: any
  onHover?: any
}

export interface BarChartProps {
  bars: BarDescriptor[]
  minLabel: React.ReactNode
  maxLabel: React.ReactNode
}
/**
 * BarChart is a component which displays some bars of varying heights in a row.
 * Useful for histograms etc.
 * @param props props
 */
export const BarChart = ({ bars, minLabel, maxLabel }: BarChartProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const highlightLabelRef = useRef<HTMLDivElement>(null)

  useHighlightLabelPositionConstraints(
    wrapperRef.current,
    highlightLabelRef.current
  )

  const hasEnteredViewport = useHasEnteredViewport(wrapperRef)
  const [minHeight, setMinHeight] = useState(0)
  const maxValue: number = maxBy(bars, item => item.value).value
  const allZero = bars.every(item => item.value === 0)
  return (
    <ProvideMousePosition>
      <Flex
        flexDirection="column"
        ref={wrapperRef as any}
        flexGrow={1}
        id="flex-wrapper"
      >
        <ChartContainer
          height="80px"
          alignItems="flex-end"
          mb={0.5}
          style={{ minHeight }}
        >
          {bars.map(
            (
              { value, label, axisLabelX, highlightLabel, onClick, onHover },
              index
            ) => {
              const heightPercent =
                maxValue === 0 ? 100 : (100 / maxValue) * value
              return (
                <Bar
                  key={index}
                  heightPercent={allZero ? 0 : heightPercent}
                  label={coerceTooltip(label)}
                  axisLabelX={axisLabelX}
                  highlightLabelRef={highlightLabelRef}
                  highlightLabel={coerceTooltip(highlightLabel)}
                  hasEnteredViewport={hasEnteredViewport}
                  onMeasureHeight={highlightLabel ? setMinHeight : null}
                  onClick={onClick}
                  onHover={onHover}
                />
              )
            }
          )}
        </ChartContainer>
        <Flex justifyContent="space-between">
          <Sans color="black60" size="2">
            {minLabel}
          </Sans>
          <Sans color="black60" size="2">
            {maxLabel}
          </Sans>
        </Flex>
        {bars.filter(bar => bar.axisLabelX).length > 0 && (
          <Flex>
            {bars.map(({ axisLabelX }, i) => (
              <BarAxisLabelContainer key={i}>
                <AxisLabelX color="black60" size="2">
                  {axisLabelX}
                </AxisLabelX>
              </BarAxisLabelContainer>
            ))}
          </Flex>
        )}
      </Flex>
    </ProvideMousePosition>
  )
}

const BarAxisLabelContainer = styled.div`
  flex: 1;
  min-height: ${space(2)}px;
  position: relative;
`

const AxisLabelX = styled(Sans)`
  position: absolute;
  text-align: center;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
`
