import {
  MedianSalePriceAtAuctionQuery,
  MedianSalePriceAtAuctionQuery$data,
} from "__generated__/MedianSalePriceAtAuctionQuery.graphql"
import {
  MedianSalePriceChartDataContextProvider_query$data,
  MedianSalePriceChartDataContextProvider_query$key,
} from "__generated__/MedianSalePriceChartDataContextProvider_query.graphql"
import { computeCategoriesForChart } from "app/utils/marketPriceInsightHelpers"
import { compact, noop } from "lodash"
import { DateTime } from "luxon"
import { LineChartData } from "palette/elements/LineGraph/types"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { graphql, useRefetchableFragment } from "react-relay"

export enum MedianSalePriceChartDuration {
  "3 yrs" = "3 yrs",
  "8 yrs" = "8 yrs",
}

interface MedianSalePriceChartDataContextProviderProps {
  artistId: string
  initialCategory: string
  queryData: MedianSalePriceAtAuctionQuery$data
}

interface MedianSalePriceChartDataContextValueType {
  bands: Array<{ name: MedianSalePriceChartDuration }>
  categories: Array<{ name: string; color: string }>
  threeYearLineChartData: LineChartData
  eightYearLineChartData: LineChartData
  onBandSelected: (durationName: string) => void
  onCategorySelected: (category: string) => void
  onDataPointPressed: (datum: LineChartData["data"][0] | null) => void
  onXAxisHighlightPressed: (datum: LineChartData["data"][0] | null) => void
  selectedCategory: NonNullable<string>
  selectedDuration: MedianSalePriceChartDuration
  selectedXAxisHighlight: number | null
}

const bands: Array<{ name: MedianSalePriceChartDuration }> = [
  { name: MedianSalePriceChartDuration["3 yrs"] },
  { name: MedianSalePriceChartDuration["8 yrs"] },
]

export const initialValues: MedianSalePriceChartDataContextValueType = {
  categories: [],
  threeYearLineChartData: { data: [], dataMeta: {} },
  eightYearLineChartData: { data: [], dataMeta: {} },
  bands,
  onBandSelected: noop,
  onDataPointPressed: noop,
  selectedDuration: MedianSalePriceChartDuration["3 yrs"],
  onCategorySelected: noop,
  onXAxisHighlightPressed: noop,
  selectedCategory: "",
  selectedXAxisHighlight: null,
}

export const MedianSalePriceChartDataContext =
  createContext<MedianSalePriceChartDataContextValueType>(initialValues)

export const MedianSalePriceChartDataContextProvider: React.FC<
  MedianSalePriceChartDataContextProviderProps
> = ({ artistId, initialCategory, queryData, children }) => {
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

  const [tappedHighlight, setTappedHighlight] = useState<number | null>(null)
  const tappedHighlightRef = useRef(tappedHighlight)

  const [data, refetch] = useRefetchableFragment<
    MedianSalePriceAtAuctionQuery,
    MedianSalePriceChartDataContextProvider_query$key
  >(medianSalePriceChartDataContextProviderFragment, queryData)

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

  const careerHighlightsMap = (): Record<number, boolean> => {
    const result: Record<number, boolean> = {}
    for (const node of data.analyticsArtistSparklines?.edges ?? []) {
      const year = parseInt(node?.node?.year?.split("_")?.[1] ?? "", 10)
      const hasHighlight = !!parseInt(node?.node?.sparkles, 10)
      if (!isNaN(year)) {
        result[year] = hasHighlight
      }
    }
    return result
  }

  const careerHighlightsMapRef = useRef(careerHighlightsMap())

  const eightYearHeaderDataSource = (): Record<
    string,
    {
      lotsSold?: NonNullable<
        NonNullable<
          NonNullable<MedianSalePriceChartDataContextProvider_query$data["priceInsights"]>["nodes"]
        >[0]
      >["lotsSoldLast96Months"]
      medianSalePrice?: NonNullable<
        NonNullable<
          NonNullable<MedianSalePriceChartDataContextProvider_query$data["priceInsights"]>["nodes"]
        >[0]
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
        NonNullable<
          NonNullable<MedianSalePriceChartDataContextProvider_query$data["priceInsights"]>["nodes"]
        >[0]
      >["lotsSoldLast36Months"]
      medianSalePrice?: NonNullable<
        NonNullable<
          NonNullable<MedianSalePriceChartDataContextProvider_query$data["priceInsights"]>["nodes"]
        >[0]
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
      MedianSalePriceChartDataContextProvider_query$data["analyticsCalendarYearPriceInsights"]
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
      MedianSalePriceChartDataContextProvider_query$data["analyticsCalendarYearPriceInsights"]
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

  const deriveAvailableCategories = () => {
    const chartSourceForTimeFrame = chartDataSourceForBand()
    return compact(
      Object.keys(chartSourceForTimeFrame)?.map((medium) => {
        if (chartSourceForTimeFrame[medium]?.some((value) => !!value.medianSalePrice)) {
          return medium
        }
      })
    )
  }

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
    careerHighlightsMapRef.current = careerHighlightsMap()
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

  const setPressedHighlight = (datum: (LineChartData["data"][0] & { dataTag?: string }) | null) => {
    if (datum?.dataTag && datum?.dataTag !== selectedDurationRef.current) {
      return
    }
    if (datum && datum?.x === tappedHighlightRef.current) {
      return
    }
    tappedHighlightRef.current = datum?.x ?? null
    setTappedHighlight(datum?.x ?? null)
  }

  const onDataPointPressed = (datum: LineChartData["data"][0] | null) => {
    setPressedDataPoint(datum)
  }

  const onXAxisHighlightPressed = (datum: LineChartData["data"][0] | null) => {
    setPressedHighlight(datum)
  }

  // MARK: Band/Year Duration logic

  const onBandSelected = (durationName: string) => {
    selectedDurationRef.current = durationName as MedianSalePriceChartDuration
    setSelectedDuration(durationName as MedianSalePriceChartDuration)
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
        highlight: {
          x: !!careerHighlightsMapRef.current[parseInt(p.year, 10)],
        },
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
        highlight: {
          x: !!careerHighlightsMapRef.current[p],
        },
      }))
    }
    return chartDataArray
  }

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
          : "Median Unavailable (Limited Data)"
      }
      return "Median Unavailable (Limited Data)"
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

  const threeYearLineChartData: LineChartData = {
    data: buildChartDataFromDataSources(MedianSalePriceChartDuration["3 yrs"]),
    dataMeta: {
      title: threeYearTitle,
      description: selectedCategory ?? " ",
      text: threeYearText ?? " ",
      tintColor: dataTintColor,
    },
  }

  const eightYearLineChartData: LineChartData = {
    data: buildChartDataFromDataSources(MedianSalePriceChartDuration["8 yrs"]),
    dataMeta: {
      title: eightYearTitle,
      description: selectedCategory ?? " ",
      text: eightYearText ?? " ",
      tintColor: dataTintColor,
    },
  }

  const values = {
    categories,
    threeYearLineChartData,
    eightYearLineChartData,
    bands,
    onBandSelected,
    onDataPointPressed,
    selectedDuration: selectedDurationRef.current,
    onCategorySelected,
    selectedCategory: selectedCategoryRef.current,
    onXAxisHighlightPressed,
    selectedXAxisHighlight: tappedHighlightRef.current,
  }

  return (
    <MedianSalePriceChartDataContext.Provider value={values}>
      {children}
    </MedianSalePriceChartDataContext.Provider>
  )
}

export const useMedianSalePriceChartDataContext = () => {
  const context = useContext<MedianSalePriceChartDataContextValueType>(
    MedianSalePriceChartDataContext
  )
  if (!context) {
    console.error(
      "No MedianSalePriceChartDataContext. Ensure your component is wrapeed by the MedianSalePriceChartDataContextProvider"
    )
    return
  }
  return context
}

const medianSalePriceChartDataContextProviderFragment = graphql`
  fragment MedianSalePriceChartDataContextProvider_query on Query
  @refetchable(queryName: "MedianSalePriceChartDataContextProviderRefetchQuery")
  @argumentDefinitions(
    artistId: { type: "ID!" }
    artistID: { type: "String!" }
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
    analyticsArtistSparklines(artistId: $artistID, last: 9) {
      edges {
        node {
          sparkles
          year
        }
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
    return "Median Unavailable (Limited Data)"
  }
  return "US $" + amount.toLocaleString("en-US")
}
