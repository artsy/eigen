import {
  AverageSalePriceAtAuctionQuery,
  AverageSalePriceAtAuctionQuery$data,
} from "__generated__/AverageSalePriceAtAuctionQuery.graphql"
import { AverageSalePriceChart_query$key } from "__generated__/AverageSalePriceChart_query.graphql"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { computeCategoriesForChart } from "app/utils/marketPriceInsightHelpers"
import { Flex, LineGraph, Text } from "palette"
import { LineChartData } from "palette/elements/LineGraph/types"
import { useEffect, useRef, useState } from "react"
import { graphql, useRefetchableFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export enum AverageSalePriceChartDuration {
  "3 yrs" = "3 yrs",
  "8 yrs" = "8 yrs",
}

interface AverageSalePriceChartProps {
  artistId: string
  initialCategory: string
  queryData: AverageSalePriceAtAuctionQuery$data
}

export const AverageSalePriceChart: React.FC<AverageSalePriceChartProps> = ({
  artistId,
  initialCategory,
  queryData,
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

  const [data, refetch] = useRefetchableFragment<
    AverageSalePriceAtAuctionQuery,
    AverageSalePriceChart_query$key
  >(averageSalePriceChartFragment, queryData)

  if (!data) {
    return null
  }

  useEffect(() => {
    refetch({ artistId, medium: selectedCategory, endYear, startYear })
  }, [artistId, selectedCategory, selectedDuration])

  const bands: Array<{ name: AverageSalePriceChartDuration }> = [
    { name: AverageSalePriceChartDuration["3 yrs"] },
    { name: AverageSalePriceChartDuration["8 yrs"] },
  ]

  const onBandSelected = (durationName: string) =>
    setSelectedDuration(durationName as AverageSalePriceChartDuration)

  const categories = useRef<Array<{ name: string; color: string }>>(
    computeCategoriesForChart(initialCategory)
  )

  const onCategorySelected = (category: string) => setSelectedCategory(category)

  const chartDataArray: LineChartData["data"] =
    data.analyticsCalendarYearMarketPriceInsights?.map((p) => ({
      x: parseInt(p.year, 10),
      y: parseInt(p.averageSalePrice, 10),
      highlight: { x: true },
    })) ?? []

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const dataTintColor = categories.current.find((c) => c.name === selectedCategory)?.color

  const dataTitle = !chartDataArray.length
    ? "-"
    : "USD $" +
      formatLargeNumber(
        chartDataArray.reduce(
          (prev, curr, index) => ({
            ...curr,
            y: (prev.y + curr.y) / (index + 1),
          }),
          { x: 0, y: 0 }
        ).y
      )

  const totalLotsSold = data.analyticsCalendarYearMarketPriceInsights?.reduce(
    (p, c) => ({
      ...c,
      lotsSold: parseInt(p.lotsSold, 10) + parseInt(c.lotsSold, 10),
    }),
    { lotsSold: "0", averageSalePrice: "0", medium: null, year: "" }
  ).lotsSold

  const dataText = !chartDataArray?.length
    ? "-"
    : totalLotsSold +
      ` ${totalLotsSold > 1 ? "lots" : "lot"} in the last ${
        selectedDuration === AverageSalePriceChartDuration["3 yrs"] ? "3 years" : "8 years"
      } (${startYear} - ${endYear})`

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
    <Flex>
      <LineGraph
        chartInterpolation="monotoneX"
        showHighlights
        data={lineChartData}
        bands={bands}
        onBandSelected={onBandSelected}
        selectedBand={selectedDuration}
        categories={categories.current}
        onCategorySelected={onCategorySelected}
        selectedCategory={selectedCategory}
        yAxisTickFormatter={
          chartDataArray.length ? (val: number) => formatLargeNumber(val) : () => ""
        }
        // hide the year on xAxis
        xAxisTickFormatter={() => ""}
      />
      {!chartDataArray.length && (
        <Flex
          position="absolute"
          top={screenHeight / 6.5} // the default chartHeight = screenHeight/3
          left={screenWidth / 4}
          alignItems="center"
          justifyContent="center"
          maxWidth={screenWidth / 2}
        >
          <Text textAlign="center" variant="sm" color="black60">
            No Data available for the selected medium
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
const averageSalePriceChartFragment = graphql`
  fragment AverageSalePriceChart_query on Query
  @refetchable(queryName: "AverageSalePriceChartRefetchQuery")
  @argumentDefinitions(
    artistId: { type: "ID!" }
    endYear: { type: "String" }
    medium: { type: "String!" }
    startYear: { type: "String" }
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
