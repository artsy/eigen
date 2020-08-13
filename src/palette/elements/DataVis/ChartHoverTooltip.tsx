import React, { useContext, useRef } from "react"
import styled from "styled-components"
import { color } from "../../helpers/color"
import { media } from "../../helpers/media"
import { Flex } from "../Flex"
import { MousePositionContext } from "./MousePositionContext"

const LABEL_OFFSET = 10

/**
 * Tooltip for bar and line charts
 */
export const ChartHoverTooltip = ({ children }) => {
  const ref = useRef(null)
  const { x, y } = useContext(MousePositionContext)
  if (ref.current) {
    // position outside of the render loop to avoid GC churn
    ref.current.style.top = y - LABEL_OFFSET - ref.current.offsetHeight + "px"
    ref.current.style.left = x + "px"
  }
  return <HoverTooltipPositioner ref={ref}>{children}</HoverTooltipPositioner>
}

/**
 * Base component for positioning tooltips
 */
export const BaseTooltipPositioner = styled(Flex)`
  transform: translateX(-50%);
  pointer-events: none;
  border-radius: 2px;
`

const HoverTooltipPositioner = styled(BaseTooltipPositioner)`
  ${media.xs`
    display: none;
  `};
  z-index: 2;
  position: fixed;
  background-color: ${color("white100")};
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
`
