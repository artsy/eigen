import { scaleLinear } from "d3-scale"
import { Circle, G } from "react-native-svg"
import { ScatterChartPoint, ScatterChartPointProps } from "./ScatterPointsContainers"
import { LineChartData } from "./types"

interface ScatterChartProps {
  chartHeight: number
  chartWidth: number
  tintColor: string
  data: LineChartData["data"]
  onDataPointAreaTapped: ScatterChartPointProps["onDataPointAreaTapped"]
  size?: number
  selectedDataPoint?: LineChartData["data"][0]
  showOnlyActiveDataPoint?: boolean
  xDomain: [number, number]
  yDomain: [number, number]
}

export const ScatterChart: React.FC<ScatterChartProps> = ({
  chartHeight,
  chartWidth,
  data,
  onDataPointAreaTapped,
  selectedDataPoint,
  showOnlyActiveDataPoint = false,
  size = 6,
  tintColor,
  xDomain,
  yDomain,
}) => {
  const scaleX = scaleLinear().domain(xDomain).range([0, chartWidth])

  const scaleY = scaleLinear().domain(yDomain).range([chartHeight, 0])

  return (
    <G>
      {data.map((datum) => {
        const x = scaleX(datum.x)
        const y = scaleY(datum.y)
        const point = { x, y, datum }
        const isActive =
          !!selectedDataPoint && JSON.stringify(selectedDataPoint) === JSON.stringify(datum)

        const color = showOnlyActiveDataPoint && !isActive ? "transparent" : tintColor
        const pointXRadiusOfTouch = chartWidth / (data.length - 1) / 2
        return (
          <ScatterChartPoint
            key={"circle" + x + y}
            point={point}
            onDataPointAreaTapped={onDataPointAreaTapped}
            pointXRadiusOfTouch={pointXRadiusOfTouch}
            size={size}
            color={color}
          />
        )
      })}
    </G>
  )
}
