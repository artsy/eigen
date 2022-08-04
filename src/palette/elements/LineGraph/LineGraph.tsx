import { Flex, Spacer } from "palette"
import React from "react"
import { LineGraphBandProps, LineGraphBands } from "./LineGraphBands"
import { LineGraphCategoryPicker } from "./LineGraphCategoryPicker"
import { LineGraphChart } from "./LineGraphChart"
import { LineGraphHeader } from "./LineGraphHeader"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"
import { LineChartData } from "./types"

interface Props {
  // Chart
  data: LineChartData
  showHighlights?: boolean
  chartHeight?: number
  chartWidth?: number
  onXHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  onYHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  tintColorShadeFactor?: number
  xAxisTickFormatter?: (val: any) => string
  yAxisTickFormatter?: (val: any) => string

  // bands
  bands: LineGraphBandProps["bands"]
  selectedBand?: string
  onBandSelected: LineGraphBandProps["onBandSelected"]

  // categories
  categories?: Array<{ name: string; color: string }>
  onCategorySelected?: (category: string) => void
  selectedCategory?: string
}

export const LineGraph: React.FC<Props> = ({
  bands,
  categories,
  chartHeight,
  chartWidth,
  data,
  onBandSelected,
  onCategorySelected,
  onXHighlightPressed,
  onYHighlightPressed,
  selectedBand,
  selectedCategory,
  showHighlights,
  tintColorShadeFactor,
  xAxisTickFormatter,
  yAxisTickFormatter,
}) => {
  return (
    <Flex mt={5}>
      <LineGraphHeader {...data.dataMeta} />

      <LineGraphChart
        data={data.data}
        dataMeta={data.dataMeta}
        showHighlights={showHighlights}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        onXHighlightPressed={onXHighlightPressed}
        onYHighlightPressed={onYHighlightPressed}
        tintColorShadeFactor={tintColorShadeFactor}
        xAxisTickFormatter={xAxisTickFormatter}
        yAxisTickFormatter={yAxisTickFormatter}
      />

      <LineGraphBands bands={bands} selectedBand={selectedBand} onBandSelected={onBandSelected} />
      <Spacer mb={0.5} />
      {!!categories && !!onCategorySelected && !!selectedCategory && (
        <LineGraphCategoryPicker
          categories={categories}
          onCategorySelected={onCategorySelected}
          selectedCategory={selectedCategory}
        />
      )}
    </Flex>
  )
}
