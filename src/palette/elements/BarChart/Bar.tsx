import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { color, media, space } from "../../helpers"
import { breakpoints } from "../../Theme"
import { Box } from "../Box"
import {
  BaseTooltipPositioner,
  ChartHoverTooltip,
} from "../DataVis/ChartHoverTooltip"
import { Flex } from "../Flex"

const MAX_BAR_HEIGHT = 80
const MIN_BAR_HEIGHT = 10
const BAR_HEIGHT_RANGE = MAX_BAR_HEIGHT - MIN_BAR_HEIGHT

interface BarBoxProps {
  isHighlighted?: boolean
}

// the actual visible bit of the bar
const BarBox = styled(Box)`
  transition: height 0.8s ease;
  position: relative;
  background: ${(props: BarBoxProps) =>
    props.isHighlighted ? color("black60") : color("black10")};
  margin-right: 2px;
  margin-bottom: -1px;
  :last-child {
    margin-right: 0;
  }
  flex: 1;
  cursor: ${props => (props.onClick ? "pointer" : "default")};
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  @media (min-width: ${breakpoints.sm}) {
    :hover {
      background: ${(props: BarBoxProps) =>
        props.isHighlighted ? color("black60") : color("black30")};
    }
  }
`

const HighlightLabelPositioner = styled(BaseTooltipPositioner)`
  z-index: 1;
  position: absolute;
  left: 50%;
  bottom: 100%;
  transition: opacity 0.8s ease;
  flex-direction: column;
  align-items: center;
`
const HighlightLabelBox = styled(Flex)`
  ${media.xs`
    display: none;
  `};
  position: relative;
  background-color: ${color("white100")};
  border: 1px solid ${color("black10")};
  border-radius: 2px;
  text-align: center;
`

// the little dotted line which connects the label to the bar
const LabelLineSvg = styled.svg`
  ${media.xs`
    display: none;
  `};
`
const LabelLine = () => (
  <LabelLineSvg width="2" height="10" viewBox="0 0 2 10">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 1.11111V0H1.5V1.11111H0.5ZM0.5 4.44444V2.22222H1.5V4.44444H0.5ZM0.5 7.77778V5.55556H1.5V7.77778H0.5ZM0.5 10V8.88889H1.5V10H0.5Z"
      fill={color("black30")}
    />
  </LabelLineSvg>
)

const HighlightLabel = ({
  children,
  onMeasureHighlightLabel,
  opacity,
  innerRef,
}: {
  children: React.ReactNode
  // this label is absolutely positioned and it might obscure content above the
  // bar chart if it gets too tall. So it needs to measure itself to let the
  // parent BarChart set an appropriate min-height.
  onMeasureHighlightLabel: (height: number) => void
  opacity: number
  innerRef: React.RefObject<HTMLDivElement>
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    onMeasureHighlightLabel(ref.current.offsetHeight)
  })
  return (
    <HighlightLabelPositioner ref={ref as any} style={{ opacity }}>
      <HighlightLabelBox ref={innerRef as any}>{children}</HighlightLabelBox>
      <LabelLine />
      <TriangleHighlight />
    </HighlightLabelPositioner>
  )
}

const TRIANGLE_HEIGHT = 4
const TRIANGLE_BOTTOM_PADDING = space(0.5)

// https://css-tricks.com/snippets/css/css-triangle/
const TriangleHighlight = styled.div`
  display: none;
  ${media.xs`
    display: block;
  `};
  width: 0;
  height: 0;
  margin-bottom: ${TRIANGLE_BOTTOM_PADDING};
  border-left: ${TRIANGLE_HEIGHT}px solid transparent;
  border-right: ${TRIANGLE_HEIGHT}px solid transparent;
  border-top: ${TRIANGLE_HEIGHT}px solid ${color("black60")};
`

/**
 * Bar is the main component responsible for rendering an individual bar
 * in a bar chart.
 *
 * It not publically usable
 *
 * It is responsible for rendering a visible bar of a specific height and 0-2 labels.
 *
 * If a 'highlight' label is given, the bar will measure itself to help it's parent
 * container set an appropriate min-height property. This prevents the highlight
 * label from obscuring content above the bar chart.
 */

export const Bar = ({
  heightPercent,
  label,
  highlightLabel,
  hasEnteredViewport,
  onMeasureHeight,
  highlightLabelRef,
  onClick,
  onHover,
}: {
  heightPercent: number
  label: React.ReactNode
  axisLabelX: React.ReactNode
  highlightLabel?: React.ReactNode
  hasEnteredViewport: boolean
  onMeasureHeight?: (height: number) => void
  highlightLabelRef?: React.RefObject<HTMLDivElement>
  onClick?: any
  onHover?: any
}) => {
  const [hover, setHover] = useState(false)
  // Before the bar has entered the view port it will have a height of 0
  // but it still needs to know how big it will eventually be once visible,
  // to allow the parent BarChart container to set an appropriate min-height
  // property
  const finalBarHeight =
    // bar heights start at MIN_BAR_HEIGHT, unless the intended height === 0
    heightPercent === 0 && !highlightLabel
      ? 0
      : MIN_BAR_HEIGHT + (BAR_HEIGHT_RANGE / 100) * heightPercent
  const currentHeight = hasEnteredViewport ? finalBarHeight : 0

  return (
    <BarBox
      style={{ height: currentHeight }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      isHighlighted={Boolean(highlightLabel)}
      onClick={onClick}
      onMouseOver={onHover}
    >
      {highlightLabel && (
        <HighlightLabel
          innerRef={highlightLabelRef}
          opacity={hasEnteredViewport ? 1 : 0}
          onMeasureHighlightLabel={labelHeight =>
            onMeasureHeight(labelHeight + finalBarHeight)
          }
        >
          {highlightLabel}
        </HighlightLabel>
      )}
      {hover && label && <ChartHoverTooltip>{label}</ChartHoverTooltip>}
    </BarBox>
  )
}
