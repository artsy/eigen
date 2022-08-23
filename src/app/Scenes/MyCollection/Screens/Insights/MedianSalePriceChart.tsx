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
import { useEffect, useRef, useState } from "react"
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
  // accompany category with a ref to mitigate stale closure issues.
  const selectedCategoryRef = useRef(initialCategory)

  const [selectedDuration, setSelectedDuration] = useState<MedianSalePriceChartDuration>(
    MedianSalePriceChartDuration["3 yrs"]
  )
  // accompany duration with a ref to mitigate stale closure issues.
  const selectedDurationRef = useRef(selectedDuration)

  const [tappedDataPoint, setTappedDataPoint] = useState<{
    [key in MedianSalePriceChartDuration]: LineChartData["data"][0] | null
  }>({
    [MedianSalePriceChartDuration["3 yrs"]]: null,
    [MedianSalePriceChartDuration["8 yrs"]]: null,
  })

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

  const eightYearHeaderDataSource = (): Record<
    string,
    {
      lotsSold?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["lotsSoldLast96Months"]
      medianSalePrice?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["medianSalePriceLast96Months"]
    }
  > =>
    data.priceInsights?.nodes
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

  const eightYearHeaderDataSourceRef = useRef(eightYearHeaderDataSource())

  const threeYearHeaderDataSource = (): Record<
    string,
    {
      lotsSold?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["lotsSoldLast36Months"]
      medianSalePrice?: NonNullable<
        NonNullable<NonNullable<MedianSalePriceChart_query$data["priceInsights"]>["nodes"]>[0]
      >["medianSalePriceLast36Months"]
    }
  > =>
    data.priceInsights?.nodes
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

  const threeYearHeaderDataSourceRef = useRef(threeYearHeaderDataSource())

  const eightYearChartDataSource = (): Record<
    string,
    NonNullable<
      MedianSalePriceChart_query$data["analyticsCalendarYearPriceInsights"]
    >[0]["calendarYearMarketPriceInsights"]
  > =>
    data.analyticsCalendarYearPriceInsights
      ? Object.assign(
          {},
          ...data.analyticsCalendarYearPriceInsights.map((d) => ({
            [d.medium]: d.calendarYearMarketPriceInsights,
          }))
        )
      : {}
  const eightYearChartDataSourceRef = useRef(eightYearChartDataSource())
  const threeYearChartDataSource = (): Record<
    string,
    NonNullable<
      MedianSalePriceChart_query$data["analyticsCalendarYearPriceInsights"]
    >[0]["calendarYearMarketPriceInsights"]
  > =>
    data.analyticsCalendarYearPriceInsights
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
  const threeYearChartDataSourceRef = useRef(threeYearChartDataSource())
  const chartDataSourceForBand = () =>
    selectedDurationRef.current === MedianSalePriceChartDuration["3 yrs"]
      ? threeYearChartDataSourceRef.current
      : eightYearChartDataSourceRef.current

  const deriveAvailableCategories = () =>
    Object.keys(chartDataSourceForBand())?.map((medium) => medium)

  const initialCategories = computeCategoriesForChart(deriveAvailableCategories())
  const [categories, setCategories] =
    useState<Array<{ name: string; color: string }>>(initialCategories)

  useEffect(() => {
    setPressedDataPoint(null)
    refreshTitleAndText()
  }, [artistId, selectedDuration, selectedCategory])

  useEffect(() => {
    refreshRefs()
    const newCategories = computeCategoriesForChart(deriveAvailableCategories()).map((c) => c.name)
    if (JSON.stringify(categories.map((c) => c.name)) !== JSON.stringify(newCategories)) {
      // duration or artist with a different set of mediums has been selected
      const newSelectedCategory = newCategories?.includes(selectedCategory)
        ? selectedCategory
        : newCategories?.[0]
      setCategories(computeCategoriesForChart(newCategories))
      selectedCategoryRef.current = newSelectedCategory
      setSelectedCategory(newSelectedCategory)
    }
  }, [JSON.stringify(data), artistId, selectedDuration])

  useEffect(() => {
    refreshRefs()
    refreshTitleAndText()
  }, [JSON.stringify(data)])

  const refreshRefs = () => {
    threeYearHeaderDataSourceRef.current = threeYearHeaderDataSource()
    eightYearHeaderDataSourceRef.current = eightYearHeaderDataSource()
    threeYearChartDataSourceRef.current = threeYearChartDataSource()
    eightYearChartDataSourceRef.current = eightYearChartDataSource()
  }

  const refreshTitleAndText = () => {
    setThreeYearTitle(getTitle(MedianSalePriceChartDuration["3 yrs"]))
    setEightYearTitle(getTitle(MedianSalePriceChartDuration["8 yrs"]))
    setThreeYearText(getText(MedianSalePriceChartDuration["3 yrs"]))
    setEightYearText(getText(MedianSalePriceChartDuration["8 yrs"]))
  }

  const setPressedDataPoint = (datum: (LineChartData["data"][0] & { dataTag?: string }) | null) => {
    if (datum?.dataTag && datum?.dataTag !== selectedDurationRef.current) {
      return
    }
    if (!datum && !tappedDataPoint["3 yrs"] && !tappedDataPoint["8 yrs"]) {
      return
    }
    if (
      datum?.dataTag &&
      tappedDataPoint[datum.dataTag as MedianSalePriceChartDuration]?.x === datum.x
    ) {
      return
    }
    const newTapped = Object.keys(tappedDataPoint).reduce((accumulator, key) => {
      accumulator[key as MedianSalePriceChartDuration] =
        key === selectedDurationRef.current ? datum : null
      return accumulator
    }, tappedDataPoint)
    setTappedDataPoint(newTapped)
    refreshTitleAndText()
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
    selectedDurationRef.current = durationName as MedianSalePriceChartDuration
    setSelectedDuration(durationName as MedianSalePriceChartDuration)
    translateValue.value =
      durationName === MedianSalePriceChartDuration["3 yrs"] ? 0 : -layoutWidth.value
  }

  // MARK: Category Logic
  const onCategorySelected = (category: string) => {
    selectedCategoryRef.current = category
    setSelectedCategory(category)
  }

  // MARK: ChartData logic
  const buildChartDataFromDataSources = (duration: MedianSalePriceChartDuration) => {
    const chartDataSource =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearChartDataSourceRef.current
        : eightYearChartDataSourceRef.current
    const neededYears = computeRequiredYears(duration)

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
    return chartDataArray
  }

  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

  const dataTintColor = categories.find((c) => c.name === selectedCategory)?.color

  const threeYearChartDataArray = buildChartDataFromDataSources(
    MedianSalePriceChartDuration["3 yrs"]
  )

  const eightYearChartDataArray = buildChartDataFromDataSources(
    MedianSalePriceChartDuration["8 yrs"]
  )

  const getTitle = (duration: MedianSalePriceChartDuration) => {
    const pressedDataPoint = tappedDataPoint[duration]
    const chartDataArray =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearChartDataArray
        : eightYearChartDataArray
    const chartDataArraySource =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearChartDataSourceRef.current
        : eightYearChartDataSourceRef.current
    const chartHeaderDataSource =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearHeaderDataSourceRef.current
        : eightYearHeaderDataSourceRef.current
    if (!chartDataArray.length) {
      return "-"
    }
    if (pressedDataPoint) {
      const datapoint = chartDataArraySource[
        selectedCategoryRef.current === "Other" ? "Unknown" : selectedCategoryRef.current
      ]?.find((d) => parseInt(d.year, 10) === pressedDataPoint.x)

      if (datapoint) {
        return parseInt(datapoint.medianSalePrice, 10)
          ? formatMedianPrice(parseInt(datapoint.medianSalePrice, 10))
          : "0 Auction Results"
      }
      return "0 Auction Results"
    }
    const medianPrice =
      chartHeaderDataSource[
        selectedCategoryRef.current === "Other" ? "Unknown" : selectedCategoryRef.current
      ]?.medianSalePrice
    return formatMedianPrice(parseInt(medianPrice, 10))
  }

  const getText = (duration: MedianSalePriceChartDuration) => {
    const pressedDataPoint = tappedDataPoint[duration]
    const chartDataArray =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearChartDataArray
        : eightYearChartDataArray

    const chartDataArraySource =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearChartDataSourceRef.current
        : eightYearChartDataSourceRef.current

    const chartHeaderDataSource =
      duration === MedianSalePriceChartDuration["3 yrs"]
        ? threeYearHeaderDataSourceRef.current
        : eightYearHeaderDataSourceRef.current

    if (!chartDataArray?.length) {
      return "-"
    }
    if (pressedDataPoint) {
      const datapoint = chartDataArraySource[
        selectedCategoryRef.current === "Other" ? "Unknown" : selectedCategoryRef.current
      ]?.find((d) => parseInt(d.year, 10) === pressedDataPoint.x)
      if (datapoint) {
        return `${datapoint.lotsSold} ${datapoint.lotsSold > 1 ? "lots" : "lot"} in ${
          datapoint.year
        }`
      }
      return " "
    }
    const totalLotsSold =
      chartHeaderDataSource[
        selectedCategoryRef.current === "Other" ? "Unknown" : selectedCategoryRef.current
      ]?.lotsSold
    if (!totalLotsSold) {
      return " "
    }
    const { endYear, startYear, currentMonth } = getStartAndEndYear(duration)
    const years = duration === MedianSalePriceChartDuration["3 yrs"] ? 3 : 8
    return (
      totalLotsSold +
      ` ${
        totalLotsSold > 1 ? "lots" : "lot"
      } in the last ${years} years (${currentMonth} ${startYear} - ${currentMonth} ${endYear})`
    )
  }

  const [threeYearTitle, setThreeYearTitle] = useState(
    getTitle(MedianSalePriceChartDuration["3 yrs"])
  )

  const [eightYearTitle, setEightYearTitle] = useState(
    getTitle(MedianSalePriceChartDuration["8 yrs"])
  )

  const [threeYearText, setThreeYearText] = useState(getText(MedianSalePriceChartDuration["3 yrs"]))

  const [eightYearText, setEightYearText] = useState(getText(MedianSalePriceChartDuration["8 yrs"]))

  const threeYearlineChartData: LineChartData = {
    data: buildChartDataFromDataSources(MedianSalePriceChartDuration["3 yrs"]),
    dataMeta: {
      title: threeYearTitle,
      description: selectedCategory ?? " ",
      text: threeYearText,
      tintColor: dataTintColor,
    },
  }

  const eightYearlineChartData: LineChartData = {
    data: buildChartDataFromDataSources(MedianSalePriceChartDuration["8 yrs"]),
    dataMeta: {
      title: eightYearTitle,
      description: selectedCategory ?? " ",
      text: eightYearText,
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

  const layoutWidth = useSharedValue(screenWidth)

  const CHART_HEIGHT = screenHeight / 2.25
  const CHART_WIDTH = screenWidth

  const dataTagToSubscribeTo = selectedDurationRef.current

  const yAxisValueFormatter = (val: number) => {
    const formatted = formatLargeNumber(val, 1)
    if (formatted.length > 4) {
      return formatLargeNumber(val, 0)
    }
    return formatted
  }

  return (
    <Animated.View style={[{ flex: 1, flexDirection: "row" }, containerStyle]}>
      <Flex
        onLayout={({ nativeEvent }) => {
          layoutWidth.value = nativeEvent.layout.width
        }}
      >
        <LineGraph
          dataTag="3 yrs"
          dataTagToSubscribeTo={dataTagToSubscribeTo}
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
              : (val: number) => yAxisValueFormatter(val)
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
          dataTag="8 yrs"
          dataTagToSubscribeTo={dataTagToSubscribeTo}
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
              : (val: number) => yAxisValueFormatter(val)
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

const getStartAndEndYear = (durationBand: MedianSalePriceChartDuration) => {
  const end = new Date().getFullYear()
  const currentMonth = DateTime.local().monthShort
  const startYear = (
    durationBand === MedianSalePriceChartDuration["3 yrs"] ? end - 3 : end - 8
  ).toString()
  const endYear = end.toString()
  return { startYear, endYear, currentMonth }
}

const computeRequiredYears = (durationBand: MedianSalePriceChartDuration) => {
  const { startYear } = getStartAndEndYear(durationBand)
  const start = parseInt(startYear, 10)
  const length = durationBand === MedianSalePriceChartDuration["3 yrs"] ? 4 : 9
  return Array.from({ length }).map((_a, i) => start + i)
}

const formatMedianPrice = (priceCents: number, unit: number = 100): string => {
  const amount = Math.round(priceCents / unit)
  if (isNaN(amount)) {
    return "0 Auction Results"
  }
  return "US $" + amount.toLocaleString("en-US")
}
