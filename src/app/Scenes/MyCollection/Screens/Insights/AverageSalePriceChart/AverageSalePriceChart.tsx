import { AverageSalePriceChartQuery } from "__generated__/AverageSalePriceChartQuery.graphql"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { computeCategoriesForChart } from "app/utils/marketPriceInsightHelpers"
import { Flex, LineGraph, Text } from "palette"
import { LineChartData } from "palette/elements/LineGraph/types"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export enum AverageSalePriceChartDuration {
  "3 yrs" = "3 yrs",
  "8 yrs" = "8 yrs",
}

interface AverageSalePriceChartProps {
  artistId: string
  initialCategory: string
}

export const AverageSalePriceChart: React.FC<AverageSalePriceChartProps> = ({
  artistId,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedDuration, setSelectedDuration] = useState<AverageSalePriceChartDuration>(
    AverageSalePriceChartDuration["3 yrs"]
  )

  const end = new Date().getFullYear()
  const startYear = (
    selectedDuration === AverageSalePriceChartDuration["3 yrs"] ? end - 3 : end - 8
  ).toString()
  const endYear = end.toString()

  const yearlyMarketPriceInsights = useLazyLoadQuery<AverageSalePriceChartQuery>(
    averageSalePriceChartQuery,
    {
      artistId,
      medium: selectedCategory,
      endYear,
      startYear,
    }
  )

  const bands: Array<{ name: AverageSalePriceChartDuration }> = [
    { name: AverageSalePriceChartDuration["3 yrs"] },
    { name: AverageSalePriceChartDuration["8 yrs"] },
  ]

  const onBandSelected = (durationName: string) =>
    setSelectedDuration(durationName as AverageSalePriceChartDuration)

  const categories = computeCategoriesForChart(initialCategory)

  const onCategorySelected = (category: string) => setSelectedCategory(category)

  const chartDataArray = yearlyMarketPriceInsights.analyticsCalendarYearMarketPriceInsights?.map(
    (p) => ({
      x: parseInt(p.year, 10),
      y: parseInt(p.averageSalePrice, 10),
    })
  )

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const dataTintColor = categories.find((c) => c.name === selectedCategory)?.color

  if (!chartDataArray || chartDataArray.length === 0) {
    return (
      <Flex>
        <LineGraph
          showHighlights
          data={{
            data: [],
            dataMeta: {
              title: "-",
              description: selectedCategory,
              text: "-",
              tintColor: dataTintColor,
            },
          }}
          bands={bands}
          onBandSelected={onBandSelected}
          selectedBand={selectedDuration}
          categories={categories}
          onCategorySelected={onCategorySelected}
          selectedCategory={selectedCategory}
          yAxisTickFormatter={() => ""}
        />
        <Flex
          position="absolute"
          top={screenHeight / 6.5} // the default chartHeight = screenHeight/3
          left={screenWidth / 4}
          alignItems="center"
          justifyContent="center"
          maxWidth={screenWidth / 2}
        >
          <Text textAlign="center" variant="sm" color="black60">
            No Data available for the selected category
          </Text>
        </Flex>
      </Flex>
    )
  }

  const dataTitle =
    "$" +
    formatLargeNumber(
      chartDataArray.reduce((prev, curr, index) => ({ ...curr, y: (prev.y + curr.y) / index })).y
    )

  const dataText =
    yearlyMarketPriceInsights.analyticsCalendarYearMarketPriceInsights?.reduce((p, c) => ({
      ...c,
      lotsSold: parseInt(p.lotsSold, 10) + parseInt(c.lotsSold, 10),
    })).lotsSold +
    ` lots in the last ${
      selectedDuration === AverageSalePriceChartDuration["3 yrs"] ? "3 years" : "8 years"
    }`

  const lineChartData: LineChartData = {
    data: chartDataArray,
    dataMeta: {
      title: dataTitle,
      description: selectedCategory,
      text: dataText,
      tintColor: dataTintColor,
    },
  }

  return (
    <LineGraph
      showHighlights
      data={lineChartData}
      bands={bands}
      onBandSelected={onBandSelected}
      selectedBand={selectedDuration}
      categories={categories}
      onCategorySelected={onCategorySelected}
      selectedCategory={selectedCategory}
      yAxisTickFormatter={(val: number) => formatLargeNumber(val)}
    />
  )
}

const averageSalePriceChartQuery = graphql`
  query AverageSalePriceChartQuery(
    $artistId: ID!
    $endYear: String
    $startYear: String
    $medium: String!
  ) {
    analyticsCalendarYearMarketPriceInsights(
      artistId: $artistId
      endYear: $endYear
      medium: $medium
      startYear: $startYear
    ) {
      averageSalePrice
      year
      lotsSold
      medium
    }
  }
`
