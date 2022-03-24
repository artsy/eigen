import { Box, Flex } from "palette"
import React from "react"

const BAR_WIDTH = 2
const BAR_ROUNDNESS = 10

type Range = [number, number]

export interface HistogramBarEntity {
  count: number
  value: number
}

interface HistogramProps {
  selectedRange: Range
  bars: HistogramBarEntity[]
}

const isSelected = (value: number, min: number, max: number) => {
  return value >= min && value <= max
}

const getPercentByEntity = (maxValue: number, entityCount: number) => {
  if (maxValue === 0) {
    return 100
  }

  return (100 / maxValue) * entityCount
}

export const Histogram: React.FC<HistogramProps> = ({ bars, selectedRange }) => {
  const maxValue = Math.max(...bars.map((bar) => bar.count))
  const [min, max] = selectedRange

  return (
    <Flex height={110} flexDirection="row" justifyContent="space-between" alignItems="flex-end">
      {bars.map((entity, index) => {
        const percent = getPercentByEntity(maxValue, entity.count)
        const selected = isSelected(entity.value, min, max)

        return (
          <Box
            key={`bar-${index}`}
            height={`${percent}%`}
            bg={selected ? "blue100" : "black15"}
            width={BAR_WIDTH}
            borderTopLeftRadius={BAR_ROUNDNESS}
            borderTopRightRadius={BAR_ROUNDNESS}
          />
        )
      })}
    </Flex>
  )
}
