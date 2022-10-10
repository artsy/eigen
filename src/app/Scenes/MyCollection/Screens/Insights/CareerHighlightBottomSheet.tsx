import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { CareerHighlightBottomSheet_query$key } from "__generated__/CareerHighlightBottomSheet_query.graphql"
import { LegacyBackButtonContext } from "app/navigation/NavStack"
import { delay } from "app/utils/delay"
import { isPad } from "app/utils/hardware"
import { compact } from "lodash"
import { Flex } from "palette"
import { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { StatusBar } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightBottomSheetItem } from "./Components/CareerHighlightBottomSheetItem"
import { useMedianSalePriceChartDataContext } from "./providers/MedianSalePriceChartDataContext"

export type CareerHighlightKindValueType =
  | "Solo Show"
  | "Group Show"
  | "Review"
  | "Biennial Inclusion"

const CareerHighlightKind: { [key: string]: CareerHighlightKindValueType } = {
  "Solo Show": "Solo Show",
  "Group Show": "Group Show",
  "Reviewed Solo Show": "Review",
  "Reviewed Group Show": "Review",
  "Biennial Inclusion": "Biennial Inclusion",
  "National Pavillion": "Biennial Inclusion",
}

interface CareerHighlightBottomSheetProps {
  artistSparklines: CareerHighlightBottomSheet_query$key
}

export const CareerHighlightBottomSheet: React.FC<CareerHighlightBottomSheetProps> = ({
  artistSparklines,
}) => {
  const data = useFragment(careerHighlighsBottomSheetFragment, artistSparklines)

  const backButtonContext = useContext(LegacyBackButtonContext)

  if (!data) {
    return null
  }

  const dataForFlatlist = (): Array<{
    year: number
    index: number
    highlights: Record<CareerHighlightKindValueType, string[]>
  }> => {
    const eventDigest = data.analyticsArtistSparklines?.edges?.find(
      (ev) => !!parseInt(ev?.node?.sparkles ?? "", 10) && ev?.node?.eventDigest
    )?.node?.eventDigest
    if (!eventDigest) {
      return []
    }
    const careerHighlightsMap = makeCareerHighlightMap(eventDigest)
    const years = Object.keys(careerHighlightsMap).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    return years.map((year, index) => ({
      year: parseInt(year, 10),
      index,
      highlights: careerHighlightsMap[parseInt(year, 10)],
    }))
  }

  const dataContext = useMedianSalePriceChartDataContext()
  if (!dataContext) {
    return null
  }

  const flatlistRef = useRef<FlatList>(null)

  const { selectedXAxisHighlight, onXAxisHighlightPressed } = dataContext

  useEffect(() => {
    if (selectedXAxisHighlight !== null) {
      const index = flatListData.find((d) => d.year === selectedXAxisHighlight)?.index
      if (index !== undefined) {
        flatlistRef.current?.scrollToIndex?.({ index, animated: false })
      }
    }
  }, [selectedXAxisHighlight])

  const bottomSheetRef = useRef<BottomSheet>(null)

  const { height } = useScreenDimensions()

  // the height here is divided by constants that seems good on device. Feel free to change them.
  const points = isPad()
    ? [height / 3.5, height / 2.5, height / 1.8]
    : [height / 2.8, height / 2, height / 1.35]

  const snapPoints = useMemo(() => points, [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      backButtonContext.updateShouldHideBackButton(false)
      StatusBar.setHidden(false, "slide")
      onXAxisHighlightPressed(null)
    } else {
      backButtonContext.updateShouldHideBackButton(true)
      StatusBar.setHidden(true, "slide")
    }
  }, [])

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  // using our custom background to ensure backgroundColor is white
  const renderBackground = useCallback(
    (props) => (
      <Flex {...props} backgroundColor="white" borderTopRightRadius={10} borderTopLeftRadius={10} />
    ),
    []
  )

  const flatListData = useMemo(
    () => dataForFlatlist(),
    [JSON.stringify(data.analyticsArtistSparklines)]
  )

  if (!flatListData.length || selectedXAxisHighlight === null) {
    return null
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
    >
      <FlatList // Note that this FlatList is from "react-native-gesture-handler" in order for scrolls to work seamlessly on android. BottomSheetFlatlist shipped with BottomSheet is janky on iOS.
        testID="BottomSheetFlatlist"
        ref={flatlistRef}
        data={flatListData}
        renderItem={({ item }) => (
          <CareerHighlightBottomSheetItem year={item.year} highlights={item.highlights} />
        )}
        keyExtractor={(item) => item.year.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={({ index }) => {
          delay(100).then(() => {
            flatlistRef.current?.scrollToIndex({ index, animated: false })
          })
        }}
      />
    </BottomSheet>
  )
}

const careerHighlighsBottomSheetFragment = graphql`
  fragment CareerHighlightBottomSheet_query on Query
  @refetchable(queryName: "CareerHighlighsBottomSheetRefetchQuery")
  @argumentDefinitions(artistID: { type: "String!" }) {
    analyticsArtistSparklines(artistId: $artistID, last: 9) {
      edges {
        node {
          eventDigest
          sparkles
          year
        }
      }
    }
  }
`

/**
 * Prepares the eventDigest and creates a map of each year to the highlight kind
 * @param eventDigest
 * @returns Record<number, Record<CareerHighlightKindValueType, string[]>>
 * @example
 * {
 *   2014: {
 *     "Solo Show": ["ArtMuseum", "AnotherMuseum"],
 *     "Review": ["The Guardian", "The Sun"]
 *   },
 *   2015: {
 *     "Group Show": ["ArtMuseum", "AnotherMuseum"],
 *     "Biennial": ["Documenta"]
 *   },
 * }
 */
export const makeCareerHighlightMap = (
  eventDigest: string
): Record<number, Record<CareerHighlightKindValueType, string[]>> => {
  const minimumYear = new Date().getFullYear() - 8
  const result: Record<number, Record<CareerHighlightKindValueType, string[]>> = {}
  const arr = eventDigest ? eventDigest.split(";") : []
  if (!arr.length) {
    return result
  }
  for (const digest of arr) {
    // eventDigest may begin with the year, this regex extracts the first occurence
    const yearStr = digest.match(/\b(19|20)\d{2}\b/)?.[0]
    if (yearStr && parseInt(yearStr, 10) >= minimumYear) {
      const year = parseInt(yearStr, 10)
      const titleAndBody = digest.replace(`${year}`, "").trim()
      const [title, body] = titleAndBody?.split("@") ?? []
      const kind = CareerHighlightKind[title.trim()]
      const currentYear = result[year] ?? {}
      const updatedYear = { ...currentYear, [kind]: compact([...currentYear[kind], body.trim()]) }
      result[year] = updatedYear
    }
  }
  return result
}
