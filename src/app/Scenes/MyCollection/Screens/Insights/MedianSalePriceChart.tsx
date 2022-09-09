import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { Flex, LineGraph, Text, useColor } from "palette"
import { useScreenDimensions } from "shared/hooks"
import {
  MedianSalePriceChartDuration,
  useMedianSalePriceChartDataContext,
} from "./providers/MedianSalePriceChartDataContext"

export const MedianSalePriceChart: React.FC = () => {
  const color = useColor()
  const dataContext = useMedianSalePriceChartDataContext()
  if (!dataContext) {
    return null
  }

  const {
    categories,
    threeYearLineChartData,
    eightYearLineChartData,
    bands,
    onBandSelected,
    onDataPointPressed,
    selectedDuration,
    onCategorySelected,
    onXAxisHighlightPressed,
    selectedCategory,
  } = dataContext

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const CHART_HEIGHT = screenHeight / 2.25
  const CHART_WIDTH = screenWidth

  const dataTagToSubscribeTo = selectedDuration

  const yAxisValueFormatter = (val: number) => {
    const formatted = formatLargeNumber(val, 1)
    if (formatted.length > 4) {
      return formatLargeNumber(val, 0)
    }
    return formatted
  }

  const hasInsights = !!categories.length

  return (
    <Flex paddingBottom={100}>
      {selectedDuration === MedianSalePriceChartDuration["3 yrs"] && (
        <Flex>
          <LineGraph
            dataTag="3 yrs"
            dataTagToSubscribeTo={dataTagToSubscribeTo}
            chartHeight={CHART_HEIGHT}
            chartWidth={CHART_WIDTH}
            chartInterpolation="monotoneX"
            showHighlights
            highlightIconColor={color("yellow100")}
            data={threeYearLineChartData}
            bands={bands}
            onBandSelected={onBandSelected}
            onDataPointPressed={onDataPointPressed}
            selectedBand={selectedDuration}
            categories={categories}
            onCategorySelected={onCategorySelected}
            onXHighlightPressed={onXAxisHighlightPressed}
            selectedCategory={selectedCategory}
            yAxisTickFormatter={
              hasInsights ? (val: number) => yAxisValueFormatter(val) : () => "----"
            }
            // hide the year on xAxis
            xAxisTickFormatter={() => ""}
          />
          {!hasInsights && (
            <Flex
              position="absolute"
              justifyContent="center"
              alignItems="center"
              top={CHART_HEIGHT / 2}
              width={CHART_WIDTH}
            >
              <Flex alignItems="center">
                <Text variant="sm" color="black60">
                  No data currently available
                </Text>

                <Text variant="sm" color="black60">
                  Try a different timeframe or artist
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}

      {selectedDuration === MedianSalePriceChartDuration["8 yrs"] && (
        <Flex>
          <LineGraph
            dataTag="8 yrs"
            dataTagToSubscribeTo={dataTagToSubscribeTo}
            chartHeight={CHART_HEIGHT}
            chartWidth={CHART_WIDTH}
            chartInterpolation="monotoneX"
            showHighlights
            highlightIconColor={color("yellow100")}
            data={eightYearLineChartData}
            bands={bands}
            onBandSelected={onBandSelected}
            onDataPointPressed={onDataPointPressed}
            selectedBand={selectedDuration}
            categories={categories}
            onCategorySelected={onCategorySelected}
            onXHighlightPressed={onXAxisHighlightPressed}
            selectedCategory={selectedCategory}
            yAxisTickFormatter={
              hasInsights ? (val: number) => yAxisValueFormatter(val) : () => "----"
            }
            // hide the year on xAxis
            xAxisTickFormatter={() => ""}
          />
          {!hasInsights && (
            <Flex
              position="absolute"
              justifyContent="center"
              alignItems="center"
              top={CHART_HEIGHT / 2}
              width={CHART_WIDTH}
            >
              <Flex alignItems="center">
                <Text variant="sm" color="black60">
                  No data currently available
                </Text>

                <Text variant="sm" color="black60">
                  Try a different timeframe or artist
                </Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  )
}
