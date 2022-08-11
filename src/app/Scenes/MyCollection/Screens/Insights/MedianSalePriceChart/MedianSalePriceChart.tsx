import {
  AverageSalePriceAtAuctionQuery,
  AverageSalePriceAtAuctionQuery$data,
} from "__generated__/AverageSalePriceAtAuctionQuery.graphql"
import {
  MedianSalePriceChart_query$data,
  MedianSalePriceChart_query$key,
} from "__generated__/MedianSalePriceChart_query.graphql"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { computeCategoriesForChart } from "app/utils/marketPriceInsightHelpers"
import { DateTime } from "luxon"
import { Flex, LineGraph, Text } from "palette"
import { LineChartData } from "palette/elements/LineGraph/types"
import { useEffect, useRef, useState } from "react"
import { graphql, useRefetchableFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export enum MedianSalePriceChartDuration {
  "3 yrs" = "3 yrs",
  "8 yrs" = "8 yrs",
}

interface MedianSalePriceChartProps {
  artistId: string
  initialCategory: string
  queryData: AverageSalePriceAtAuctionQuery$data
}

export const MedianSalePriceChart: React.FC<MedianSalePriceChartProps> = ({
  artistId,
  initialCategory,
  queryData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedDuration, setSelectedDuration] = useState<MedianSalePriceChartDuration>(
    MedianSalePriceChartDuration["3 yrs"]
  )
  const [pressedDataPoint, setPressedDataPoint] = useState<LineChartData["data"][0] | null>(null)

  const getStartAndEndYear = (
    durationBand: MedianSalePriceChartDuration | undefined = selectedDuration
  ) => {
    const end = new Date().getFullYear()
    const currentMonth = DateTime.local().monthShort
    const startYear = (
      durationBand === MedianSalePriceChartDuration["3 yrs"] ? end - 3 : end - 8
    ).toString()
    const endYear = end.toString()
    return { startYear, endYear, currentMonth }
  }

  const [data, refetch] = useRefetchableFragment<
    AverageSalePriceAtAuctionQuery,
    MedianSalePriceChart_query$key
  >(medianSalePriceChartFragment, queryData)

  if (!data) {
    return null
  }

  const deriveAvailableCategories = () =>
    data.analyticsCalendarYearPriceInsights?.map((p) => p.medium)

  const initialCategories = computeCategoriesForChart(initialCategory, deriveAvailableCategories())
  const [categories, setCategories] =
    useState<Array<{ name: string; color: string }>>(initialCategories)

  const reloadData = () => {
    const { endYear, startYear } = getStartAndEndYear()
    const category = selectedCategory === "Other" ? "Unknown" : selectedCategory
    refetch({ artistId, medium: category, endYear, startYear })
  }

  useEffect(() => {
    reloadData()
    setPressedDataPoint(null)
  }, [artistId, selectedDuration])

  useEffect(() => {
    if (selectedDuration === MedianSalePriceChartDuration["8 yrs"]) {
      reloadData()
    }
    setPressedDataPoint(null)
  }, [selectedCategory])

  useEffect(() => {
    const newCategories = deriveAvailableCategories()
    if (JSON.stringify(categories.map((c) => c.name)) !== JSON.stringify(newCategories)) {
      // artist with a different set of mediums has been selected
      const newSelectedCategory = newCategories?.includes(selectedCategory)
        ? selectedCategory
        : newCategories?.[0] ?? selectedCategory
      setCategories(computeCategoriesForChart(newSelectedCategory, newCategories))
      setSelectedCategory(newSelectedCategory)
    }
    // data.analyticsCalendarYearPriceInsights is expected to stay the same for the same artist
    // since all data is loaded at once. If this changes then obviously a new artist with different
    // available mediums/category has been loaded
  }, [JSON.stringify(data.analyticsCalendarYearPriceInsights)])

  const bands: Array<{ name: MedianSalePriceChartDuration }> = [
    { name: MedianSalePriceChartDuration["3 yrs"] },
    { name: MedianSalePriceChartDuration["8 yrs"] },
  ]

  // MARK: Band/Year Duration logic
  const onBandSelected = (durationName: string) =>
    setSelectedDuration(durationName as MedianSalePriceChartDuration)

  // MARK: Category Logic
  const onCategorySelected = (category: string) => {
    setSelectedCategory(category)
  }

  // MARK: ChartData logic
  const threeYearChartDataSource: Record<
    string,
    NonNullable<MedianSalePriceChart_query$data["analyticsCalendarYearMarketPriceInsights"]>
  > = data.analyticsCalendarYearPriceInsights
    ? Object.assign(
        {},
        ...data.analyticsCalendarYearPriceInsights.map((d) => ({
          [d.medium]: d.calendarYearMarketPriceInsights,
        }))
      )
    : {}

  const chartDataArraySource =
    selectedDuration === MedianSalePriceChartDuration["3 yrs"]
      ? threeYearChartDataSource[selectedCategory === "Other" ? "Unknown" : selectedCategory]
      : data.analyticsCalendarYearMarketPriceInsights

  const chartDataArray: LineChartData["data"] =
    chartDataArraySource?.map((p) => ({
      x: parseInt(p.year, 10),
      y: parseInt(p.averageSalePrice, 10),
    })) ?? []

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const dataTintColor = categories.find((c) => c.name === selectedCategory)?.color

  const dataTitle = () => {
    if (!chartDataArray.length) {
      return "-"
    }
    if (pressedDataPoint) {
      return "USD $" + formatLargeNumber(pressedDataPoint.y)
    }
    return "USD $" + formatLargeNumber(calculateMedian(chartDataArray.map((d) => d.y)))
  }

  const totalLotsSold = chartDataArraySource?.reduce(
    (p, c) => ({
      ...c,
      lotsSold: parseInt(p.lotsSold, 10) + parseInt(c.lotsSold, 10),
    }),
    { lotsSold: "0", averageSalePrice: "0", medium: null, year: "" }
  ).lotsSold

  const dataText = () => {
    if (!chartDataArray?.length) {
      return "-"
    }
    if (pressedDataPoint) {
      const datapoint = chartDataArraySource?.find(
        (d) => parseInt(d.year, 10) === pressedDataPoint.x
      )
      if (datapoint) {
        return `${datapoint.lotsSold} ${datapoint.lotsSold > 1 ? "lots" : "lot"} in ${
          datapoint.year
        }`
      }
    }
    const { endYear, startYear, currentMonth } = getStartAndEndYear()
    return (
      totalLotsSold +
      ` ${totalLotsSold > 1 ? "lots" : "lot"} in the last ${
        selectedDuration === MedianSalePriceChartDuration["3 yrs"] ? "3 years" : "8 years"
      } (${currentMonth} ${startYear} - ${currentMonth} ${endYear})`
    )
  }

  const onDataPointPressed = (datum: typeof chartDataArray[0]) => {
    setPressedDataPoint(datum)
  }

  const lineChartData: LineChartData = {
    data: chartDataArray,
    dataMeta: {
      title: dataTitle(),
      description: selectedCategory,
      text: dataText(),
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
        onDataPointPressed={onDataPointPressed}
        selectedBand={selectedDuration}
        categories={categories}
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

const medianSalePriceChartFragment = graphql`
  fragment MedianSalePriceChart_query on Query
  @refetchable(queryName: "MedianSalePriceChartRefetchQuery")
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
    analyticsCalendarYearPriceInsights(
      artistId: $artistId
      endYear: $endYear
      startYear: $startYear
    ) {
      medium
      calendarYearMarketPriceInsights {
        averageSalePrice
        year
        lotsSold
      }
    }
  }
`

const calculateMedian = (arr: number[]): number => {
  if (arr.length === 0) {
    throw new Error("No values supplied to calculateMedian function")
  }
  const sorted = arr.sort((a, b) => a - b)
  const midpoint = Math.floor(sorted.length / 2)
  if (arr.length % 2) {
    return sorted[midpoint]
  }
  return (sorted[midpoint - 1] + sorted[midpoint]) / 2
}
