import { ChartTooltipProps } from "../ChartTooltip"

export interface PointDescriptor {
  value: number
  axisLabelX?: React.ReactNode | ChartTooltipProps
  tooltip?: React.ReactNode | ChartTooltipProps
}

export interface ChartProps {
  points: PointDescriptor[]
}
