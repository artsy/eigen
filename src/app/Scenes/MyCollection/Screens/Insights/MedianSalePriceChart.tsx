import {
  MedianSalePriceAtAuctionQuery,
  MedianSalePriceAtAuctionQuery$data,
} from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import {
  MedianSalePriceChart_query$data,
  MedianSalePriceChart_query$key,
} from "__generated__/MedianSalePriceChart_query.graphql"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { computeCategoriesForChart } from "app/utils/marketPriceInsightHelpers"
import { compact } from "lodash"
import { DateTime } from "luxon"
import { Flex, LineGraph, Text } from "palette"
import { LineChartData } from "palette/elements/LineGraph/types"
import { useEffect, useState } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { graphql, useRefetchableFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

export enum MedianSalePriceChartDuration {
  "3 yrs" = "3 yrs",
  "8 yrs" = "8 yrs",
}

interface MedianSalePriceChartProps {
  artistId: string
  initialCategory: string
  queryData: MedianSalePriceAtAuctionQuery$data
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
  const [threeYearPressedDataPoint, setThreeYearPressedDataPoint] = useState<
    LineChartData["data"][0] | null
  >(null)

  const [eightYearPressedDataPoint, setEightYearPressedDataPoint] = useState<
    LineChartData["data"][0] | null
  >(null)

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
    MedianSalePriceAtAuctionQuery,
    MedianSalePriceChart_query$key
  >(medianSalePriceChartFragment, queryData)

  if (!data) {
    return null
  }

  const reloadData = () => {
    refetch({ artistId })
  }

  useEffect(() => {
    reloadData()
    setPressedDataPoint(null)
  }, [artistId])

  const eightYearHeaderDataSource: Record<
    string,
    {
      lotsSold?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["lotsSoldLast96Months"]
      medianSalePrice?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["medianSalePriceLast96Months"]
    }
  > = data.priceInsights?.nodes
    ? Object.assign(
        {},
        ...data.priceInsights.nodes.map((d) => ({
          [d?.medium!]: {
            lotsSold: d?.lotsSoldLast96Months,
            medianSalePrice: d?.medianSalePriceLast96Months,
          },
        }))
      )
    : {}

  const threeYearHeaderDataSource: Record<
    string,
    {
      lotsSold?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["lotsSoldLast36Months"]
      medianSalePrice?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["medianSalePriceLast36Months"]
    }
  > = data.priceInsights?.nodes
    ? Object.assign(
        {},
        ...data.priceInsights.nodes.map((d) => ({
          [d?.medium!]: {
            lotsSold: d?.lotsSoldLast36Months,
            medianSalePrice: d?.medianSalePriceLast36Months,
          },
        }))
      )
    : {}

  const eightYearChartDataSource: Record<
    string,
    NonNullable<
      MedianSalePriceChart_query$data["analyticsCalendarYearPriceInsights"]
    >[0]["calendarYearMarketPriceInsights"]
  > = data.analyticsCalendarYearPriceInsights
    ? Object.assign(
        {},
        ...data.analyticsCalendarYearPriceInsights.map((d) => ({
          [d.medium]: d.calendarYearMarketPriceInsights,
        }))
      )
    : {}

  const threeYearChartDataSource: Record<
    string,
    NonNullable<
      MedianSalePriceChart_query$data["analyticsCalendarYearPriceInsights"]
    >[0]["calendarYearMarketPriceInsights"]
  > = data.analyticsCalendarYearPriceInsights
    ? Object.assign(
        {},
        ...data.analyticsCalendarYearPriceInsights.map((d) => {
          const value = compact(
            d.calendarYearMarketPriceInsights?.map((insight) => {
              const { endYear } = getStartAndEndYear(MedianSalePriceChartDuration["3 yrs"])
              if (parseInt(insight.year, 10) >= parseInt(endYear, 10) - 3) {
                return insight
              }
            })
          )
          if (value && value.length) {
            return { [d.medium]: value }
          }
        })
      )
    : {}

  const chartDataSourceForBand =
    selectedDuration === MedianSalePriceChartDuration["3 yrs"]
      ? threeYearChartDataSource
      : eightYearChartDataSource

  const deriveAvailableCategories = () =>
    Object.keys(chartDataSourceForBand)?.map((medium) => medium)

  const initialCategories = computeCategoriesForChart(deriveAvailableCategories())
  const [categories, setCategories] =
    useState<Array<{ name: string; color: string }>>(initialCategories)

  useEffect(() => {
    setPressedDataPoint(null)
  }, [artistId, selectedDuration, selectedCategory])

  useEffect(() => {
    const newCategories = computeCategoriesForChart(deriveAvailableCategories()).map((c) => c.name)
    if (JSON.stringify(categories.map((c) => c.name)) !== JSON.stringify(newCategories)) {
      // duration or artist with a different set of mediums has been selected
      const newSelectedCategory = newCategories?.includes(selectedCategory)
        ? selectedCategory
        : newCategories?.[0]
      setCategories(computeCategoriesForChart(newCategories))
      setSelectedCategory(newSelectedCategory)
    }
  }, [JSON.stringify(data.analyticsCalendarYearPriceInsights), selectedDuration])

  const setPressedDataPoint = (datum: LineChartData["data"][0] | null) => {
    setEightYearPressedDataPoint(null)
    setThreeYearPressedDataPoint(null)
    if (selectedDuration === MedianSalePriceChartDuration["3 yrs"]) {
      setThreeYearPressedDataPoint(datum)
    } else {
      setEightYearPressedDataPoint(datum)
    }
  }

  const onDataPointPressed = (datum: LineChartData["data"][0] | null) => {
    setPressedDataPoint(datum)
  }

  // MARK: Band/Year Duration logic
  const bands: Array<{ name: MedianSalePriceChartDuration }> = [
    { name: MedianSalePriceChartDuration["3 yrs"] },
    { name: MedianSalePriceChartDuration["8 yrs"] },
  ]
  const onBandSelected = (durationName: string) => {
    setSelectedDuration(durationName as MedianSalePriceChartDuration)
    translateValue.value = durationName === MedianSalePriceChartDuration["3 yrs"] ? 0 : -l
  }

  // MARK: Category Logic
  const onCategorySelected = (category: string) => {
    setSelectedCategory(category)
  }

  // MARK: ChartData logic
  const buildChartDataFromDataSources = (
    chartDataSource: typeof threeYearChartDataSource,
    chartHeaderDataSource: typeof threeYearHeaderDataSource,
    neededYears: number[],
    band: 8 | 3
  ) => {
    const pressedDataPoint = band === 3 ? threeYearPressedDataPoint : eightYearPressedDataPoint

    const chartDataArraySource =
      chartDataSource[selectedCategory === "Other" ? "Unknown" : selectedCategory]

    let chartDataArray: LineChartData["data"] =
      chartDataArraySource?.map((p) => ({
        x: parseInt(p.year, 10),
        y: p.medianSalePrice
          ? parseInt(p.medianSalePrice, 10) / 100
          : // chart will crash if all values are 0
            1,
      })) ?? []

    if (chartDataArray.length !== neededYears.length) {
      const availableYears = chartDataArraySource
        ? Object.assign(
            {},
            ...chartDataArraySource.map((d) => ({
              [d.year]: d,
            }))
          )
        : {}

      chartDataArray = neededYears.map((p) => ({
        x: p,
        y: Number(availableYears[p]?.medianSalePrice)
          ? parseInt(availableYears[p].medianSalePrice, 10) / 100
          : // chart will crash if all values are 0
            1,
      }))
    }

    const title = () => {
      if (!chartDataArray.length) {
        return "-"
      }

      if (pressedDataPoint) {
        const datapoint = chartDataArraySource?.find(
          (d) => parseInt(d.year, 10) === pressedDataPoint.x
        )
        if (datapoint) {
          return parseInt(datapoint.medianSalePrice, 10)
            ? formatMedianPrice(parseInt(datapoint.medianSalePrice, 10))
            : "0 Auction Results"
        }
      }

      const medianPrice =
        chartHeaderDataSource[selectedCategory === "Other" ? "Unknown" : selectedCategory]
          ?.medianSalePrice
      return formatMedianPrice(parseInt(medianPrice, 10))
    }

    const text = () => {
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

      const totalLotsSold =
        chartHeaderDataSource[selectedCategory === "Other" ? "Unknown" : selectedCategory]?.lotsSold
      if (!totalLotsSold) {
        return " "
      }
      const { endYear, startYear, currentMonth } = getStartAndEndYear(
        band === 8 ? MedianSalePriceChartDuration["8 yrs"] : MedianSalePriceChartDuration["3 yrs"]
      )
      return (
        totalLotsSold +
        ` ${
          totalLotsSold > 1 ? "lots" : "lot"
        } in the last ${band} years (${currentMonth} ${startYear} - ${currentMonth} ${endYear})`
      )
    }

    return { title: title(), text: text(), chartDataArray }
  }

  const requiredYears = (durationBand = selectedDuration) => {
    const { startYear } = getStartAndEndYear(durationBand)
    const start = parseInt(startYear, 10)
    const length = durationBand === MedianSalePriceChartDuration["3 yrs"] ? 4 : 9
    return Array.from({ length }).map((_a, i) => start + i)
  }

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const dataTintColor = categories.find((c) => c.name === selectedCategory)?.color

  const CHART_HEIGHT = screenHeight / 2.25
  const CHART_WIDTH = screenWidth

  const requiredYearsFor8 = requiredYears(MedianSalePriceChartDuration["8 yrs"])

  const requiredYearsFor3 = requiredYears(MedianSalePriceChartDuration["3 yrs"])

  const {
    title: titleForThree,
    text: textForThree,
    chartDataArray: chartDataArrayFor3,
  } = buildChartDataFromDataSources(
    threeYearChartDataSource,
    threeYearHeaderDataSource,
    requiredYearsFor3,
    3
  )

  const {
    title: titleForEight,
    text: textForEight,
    chartDataArray: chartDataArrayFor8,
  } = buildChartDataFromDataSources(
    eightYearChartDataSource,
    eightYearHeaderDataSource,
    requiredYearsFor8,
    8
  )

  const threeYearlineChartData: LineChartData = {
    data: chartDataArrayFor3,
    dataMeta: {
      title: titleForThree,
      description: selectedCategory,
      text: textForThree,
      tintColor: dataTintColor,
    },
  }

  const eightYearlineChartData: LineChartData = {
    data: chartDataArrayFor8,
    dataMeta: {
      title: titleForEight,
      description: selectedCategory,
      text: textForEight,
      tintColor: dataTintColor,
    },
  }

  // When all the median price is incomplete we use ones because d3 and Victory will crash
  // when all the values are 0
  const threeYearContainsAllOnes =
    threeYearlineChartData.data.reduce((a, c) => a + c.y, 0) /
      threeYearlineChartData.data.length ===
    1

  const eightYearContainsAllOnes =
    eightYearlineChartData.data.reduce((a, c) => a + c.y, 0) /
      eightYearlineChartData.data.length ===
    1

  const translateValue = useSharedValue(0)

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(translateValue.value, { duration: 200 }) }],
    }
  })

  const [l, setl] = useState(screenWidth)

  return (
    <Animated.View style={[{ flex: 1, flexDirection: "row" }, containerStyle]}>
      <Flex onLayout={({ nativeEvent }) => setl(nativeEvent.layout.width)}>
        <LineGraph
          chartHeight={CHART_HEIGHT}
          chartWidth={CHART_WIDTH}
          chartInterpolation="monotoneX"
          showHighlights
          data={threeYearlineChartData}
          bands={bands}
          onBandSelected={onBandSelected}
          onDataPointPressed={onDataPointPressed}
          selectedBand={selectedDuration}
          categories={categories}
          onCategorySelected={onCategorySelected}
          selectedCategory={selectedCategory}
          yAxisTickFormatter={
            !threeYearlineChartData.data.length || !!threeYearContainsAllOnes
              ? () => "----"
              : (val: number) => formatLargeNumber(val)
          }
          // hide the year on xAxis
          xAxisTickFormatter={() => ""}
        />
        {!threeYearlineChartData.data.length ||
          (!!threeYearContainsAllOnes && (
            <Flex
              position="absolute"
              top={CHART_HEIGHT / 2}
              left={CHART_WIDTH / 3}
              alignItems="center"
              justifyContent="center"
              maxWidth={CHART_WIDTH / 2}
            >
              <Text textAlign="center" variant="sm" color="black60">
                Incomplete Data for the selected medium
              </Text>
            </Flex>
          ))}
      </Flex>

      <Flex>
        <LineGraph
          chartHeight={CHART_HEIGHT}
          chartWidth={CHART_WIDTH}
          chartInterpolation="monotoneX"
          showHighlights
          data={eightYearlineChartData}
          bands={bands}
          onBandSelected={onBandSelected}
          onDataPointPressed={onDataPointPressed}
          selectedBand={selectedDuration}
          categories={categories}
          onCategorySelected={onCategorySelected}
          selectedCategory={selectedCategory}
          yAxisTickFormatter={
            !eightYearlineChartData.data.length || !!eightYearContainsAllOnes
              ? () => "----"
              : (val: number) => formatLargeNumber(val)
          }
          // hide the year on xAxis
          xAxisTickFormatter={() => ""}
        />
        {!eightYearlineChartData.data.length ||
          (!!eightYearContainsAllOnes && (
            <Flex
              position="absolute"
              top={CHART_HEIGHT / 2}
              left={CHART_WIDTH / 3}
              alignItems="center"
              justifyContent="center"
              maxWidth={CHART_WIDTH / 2}
            >
              <Text textAlign="center" variant="sm" color="black60">
                Incomplete Data for the selected medium
              </Text>
            </Flex>
          ))}
      </Flex>
    </Animated.View>
  )
}

const medianSalePriceChartFragment = graphql`
  fragment MedianSalePriceChart_query on Query
  @refetchable(queryName: "MedianSalePriceChartRefetchQuery")
  @argumentDefinitions(
    artistId: { type: "ID!" }
    endYear: { type: "String" }
    startYear: { type: "String" }
  ) {
    analyticsCalendarYearPriceInsights(
      artistId: $artistId
      endYear: $endYear
      startYear: $startYear
    ) {
      medium
      calendarYearMarketPriceInsights {
        medianSalePrice
        year
        lotsSold
      }
    }
    priceInsights(artistId: $artistId) {
      nodes {
        medium
        lotsSoldLast36Months
        lotsSoldLast96Months
        medianSalePriceLast36Months
        medianSalePriceLast96Months
      }
    }
  }
`

export const formatMedianPrice = (priceCents: number, unit: number = 100): string => {
  const amount = Math.round(priceCents / unit)
  if (isNaN(amount)) {
    return "0 Auction Results"
  }
  return "US $" + amount.toLocaleString("en-US")
}
