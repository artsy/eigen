import React from "react"
import styled from "styled-components"
import { Flex, FlexProps } from "../Flex"
import { Sans } from "../Typography"

const ChartTooltipWrapper = styled(Flex)`
  text-align: center;
  align-items: center;
  flex-direction: column;
  white-space: nowrap;
`

/**
 * Returns tooltip component based on the type of tooltip param passed to it
 * @param tooltip either a component or hash containing `title` and `description`
 */
export const coerceTooltip = (tooltip: React.ReactNode | ChartTooltipProps) =>
  isChartTooltipProps(tooltip) ? <ChartTooltip {...tooltip} /> : tooltip

/**
 * Similart to `coerceTooltip` but without padding
 * @param tooltip
 */
export const coerceTooltipWithoutPadding = (
  tooltip: React.ReactNode | ChartTooltipProps
) =>
  isChartTooltipProps(tooltip) ? (
    <ChartTooltip noPadding {...tooltip} />
  ) : (
    tooltip
  )

export interface ChartTooltipProps extends FlexProps {
  title: React.ReactNode
  description: React.ReactNode
  noPadding: boolean
}

// tslint:disable-next-line:completed-docs
export function isChartTooltipProps(obj: any): obj is ChartTooltipProps {
  const result =
    obj &&
    typeof obj === "object" &&
    obj.hasOwnProperty("title") &&
    obj.hasOwnProperty("description")
  return result
}

/**
 * ChartTooltip is the default content format for a label on a BarChart.
 * @param props
 */
export const ChartTooltip = ({
  title,
  description,
  noPadding,
  ...others
}: ChartTooltipProps) => (
  <ChartTooltipWrapper
    py={noPadding ? 0 : 0.5}
    px={noPadding ? 0 : 1}
    {...others}
  >
    <Sans color={"black100"} weight="medium" size="2">
      {title}
    </Sans>
    <Sans color={"black60"} size="2">
      {description}
    </Sans>
  </ChartTooltipWrapper>
)
