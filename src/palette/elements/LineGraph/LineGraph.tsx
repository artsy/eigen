import { Flex, Spacer } from "palette"
import React from "react"
import { InterpolationPropType } from "victory-core"
import { AxisDisplayType } from "./helpers"
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
  /** By default we use natural for chartInterpolation. Consider monotoneX for lines
   * that are more faithful to your data, but less curvy than natural.
   */
  chartInterpolation?: InterpolationPropType
  onXHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  onYHighlightPressed?: (datum: { _x: number; _y: number; x: number; y: number }) => void
  tintColorShadeFactor?: number
  xAxisTickFormatter?: (val: any) => string
  yAxisTickFormatter?: (val: any) => string
  xAxisDisplayType?: AxisDisplayType
  yAxisDisplayType?: AxisDisplayType

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
  chartInterpolation,
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
  xAxisDisplayType,
  yAxisDisplayType,
}) => {
  return (
    <Flex>
      <LineGraphHeader {...data.dataMeta} />

      <LineGraphChart
        data={data.data}
        dataMeta={data.dataMeta}
        showHighlights={showHighlights}
        chartHeight={chartHeight}
        chartWidth={chartWidth}
        chartInterpolation={chartInterpolation}
        onXHighlightPressed={onXHighlightPressed}
        onYHighlightPressed={onYHighlightPressed}
        tintColorShadeFactor={tintColorShadeFactor}
        xAxisTickFormatter={xAxisTickFormatter}
        yAxisTickFormatter={yAxisTickFormatter}
        xAxisDisplayType={xAxisDisplayType}
        yAxisDisplayType={yAxisDisplayType}
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
