import React, { useRef, useState } from "react"
import styled from "styled-components"
import { media, space } from "../../helpers"
import { ChartHoverTooltip } from "../DataVis/ChartHoverTooltip"
import { coerceTooltip } from "../DataVis/ChartTooltip"
import { ProvideMousePosition } from "../DataVis/MousePositionContext"
import { ChartProps } from "../DataVis/utils/SharedTypes"
import { useHasEnteredViewport } from "../DataVis/utils/useHasEnteredViewPort"
import { useWrapperWidth } from "../DataVis/utils/useWrapperWidth"
import { Flex } from "../Flex"
import { Sans } from "../Typography"
import { LineChartSVG } from "./LineChartSVG"

const margin = space(2)
const DEFAULT_HEIGHT = 87

export interface LineChartProps extends ChartProps {
  height?: number
}

/**
 * LineChart is a component that displays some data points connected by lines.
 * Useful for visualizing a time series, etc.
 */
export const LineChart: React.FC<LineChartProps> = ({
  points,
  height = DEFAULT_HEIGHT,
}: LineChartProps) => {
  const [hoverIndex, setHoverIndex] = useState(-1)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasEnteredViewport = useHasEnteredViewport(wrapperRef)

  const width = useWrapperWidth(wrapperRef)

  return (
    <ProvideMousePosition>
      <Flex flexDirection="column" ref={wrapperRef as any} width="100%">
        {width && (
          <>
            <Flex height={height}>
              {points.map((point, i) => (
                <HoverHandler
                  key={i}
                  index={i}
                  hoverIndex={hoverIndex}
                  setHoverIndex={setHoverIndex}
                >
                  {coerceTooltip(point.tooltip)}
                </HoverHandler>
              ))}
            </Flex>
            <LineChartSVG
              width={width}
              height={height}
              margin={margin}
              points={points}
              hoverIndex={hoverIndex}
              hasEnteredViewport={hasEnteredViewport}
            />
            {points.filter(bar => bar.axisLabelX).length > 0 && (
              <Flex px="2" width={width}>
                {points.map(({ axisLabelX }, i) => (
                  <BarAxisLabelContainer
                    key={i}
                    first={i === 0}
                    last={i === points.length - 1}
                  >
                    <AxisLabelX color="black60" size="2">
                      {axisLabelX}
                    </AxisLabelX>
                  </BarAxisLabelContainer>
                ))}
              </Flex>
            )}
          </>
        )}
      </Flex>
    </ProvideMousePosition>
  )
}

interface HoverHandlerProps {
  children: React.ReactNode
  index: number
  hoverIndex: number
  setHoverIndex: React.Dispatch<React.SetStateAction<number>>
}

const HoverHandler: React.FC<HoverHandlerProps> = ({
  children,
  index,
  hoverIndex,
  setHoverIndex,
}: HoverHandlerProps) => {
  const hover = hoverIndex === index
  return (
    <PointHoverArea
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(-1)}
      style={{ opacity: hover ? 1 : 0 }}
    >
      {hover && <ChartHoverTooltip>{children}</ChartHoverTooltip>}
    </PointHoverArea>
  )
}

/**
 * The rectangle area around Dots which triggers mouseover for tooltip
 */
export const PointHoverArea = styled.div`
  flex: 1;
  z-index: 1;
  margin: 0 1%; /* gap between area enabling tooptips */
  opacity: 0;
  transition: opacity 0.4s ease-in;
`

interface AxisContainerProps {
  first: boolean
  last: boolean
}

const BarAxisLabelContainer = styled.div<AxisContainerProps>`
  flex: ${({ last }) => (last ? 0 : 1)};
  min-height: ${space(2)}px;
  position: relative;
  ${media.xs`
    display: ${({ first, last }) => (first || last ? "auto" : "none")};;
  `};
`

const AxisLabelX = styled(Sans)`
  position: absolute;
  text-align: center;
  white-space: nowrap;
  transform: translateX(-33%);
`
