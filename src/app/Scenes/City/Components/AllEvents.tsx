import { Box, Separator, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { EventSection } from "app/Scenes/City/Components/EventSection/EventSection"
import { BucketResults } from "app/utils/cityGuide/bucketCityResults"
import { isEqual } from "lodash"
import { Fragment, memo, useCallback, useMemo } from "react"
import { ListRenderItem, Platform, ViewProps } from "react-native"
import { FairEventSection } from "./FairEventSection/FairEventSection"
import { SavedEventSection } from "./SavedEventSection/SavedEventSection"

interface Props extends ViewProps {
  buckets: BucketResults
  cityName: string
  citySlug: string
}

type Section =
  | { type: "header"; data: string }
  | { type: "saved"; data: BucketResults["saved"] }
  | { type: "fairs"; data: BucketResults["fairs"] }
  | { type: "galleries"; data: BucketResults["galleries"] }
  | { type: "museums"; data: BucketResults["museums"] }
  | { type: "closing"; data: BucketResults["closing"] }
  | { type: "opening"; data: BucketResults["opening"] }

const KEYS_AFFECTING_RENDER: Array<Exclude<keyof BucketResults, "fairs">> = [
  "saved",
  "closing",
  "museums",
  "opening",
  "galleries",
]

const arePropsEqual = (prevProps: Props, nextProps: Props) =>
  KEYS_AFFECTING_RENDER.every((key) =>
    isEqual(
      prevProps.buckets[key].map((show) => show.is_followed),
      nextProps.buckets[key].map((show) => show.is_followed)
    )
  )

export const AllEvents: React.FC<Props> = memo(({ buckets, cityName, citySlug }) => {
  const sections = useMemo<Section[]>(() => {
    const result: Section[] = [{ type: "header", data: `${cityName} City Guide` }]

    if (buckets.saved) {
      result.push({ type: "saved", data: buckets.saved })
    }
    if (buckets.fairs?.length) {
      result.push({ type: "fairs", data: buckets.fairs })
    }
    if (buckets.galleries?.length) {
      result.push({ type: "galleries", data: buckets.galleries })
    }
    if (buckets.museums?.length) {
      result.push({ type: "museums", data: buckets.museums })
    }
    if (buckets.closing?.length) {
      result.push({ type: "closing", data: buckets.closing })
    }
    if (buckets.opening?.length) {
      result.push({ type: "opening", data: buckets.opening })
    }

    return result
  }, [buckets, cityName])

  const renderItemSeparator = useCallback(({ leadingItem }: { leadingItem: Section }) => {
    if (!["fairs", "saved", "header"].includes(leadingItem.type)) {
      return (
        <Box py={1}>
          <Separator />
        </Box>
      )
    }
    return null
  }, [])

  const renderItem: ListRenderItem<Section> = useCallback(
    ({ item }) => {
      switch (item.type) {
        case "fairs":
          return <FairEventSection citySlug={citySlug} data={item.data} />
        case "galleries":
          return (
            <EventSection
              title="Gallery shows"
              data={item.data}
              section="galleries"
              citySlug={citySlug}
            />
          )
        case "museums":
          return (
            <EventSection
              title="Museum shows"
              data={item.data}
              section="museums"
              citySlug={citySlug}
            />
          )
        case "opening":
          return (
            <EventSection
              title="Opening soon"
              data={item.data}
              section="opening"
              citySlug={citySlug}
            />
          )
        case "closing":
          return (
            <EventSection
              title="Closing soon"
              data={item.data}
              section="closing"
              citySlug={citySlug}
            />
          )
        case "saved":
          return <SavedEventSection data={item.data} citySlug={citySlug} />
        case "header":
          return <Box pt={4}>{!!item.data && <Text variant="lg-display">{item.data}</Text>}</Box>
        default:
          return null
      }
    },
    [citySlug]
  )

  const keyExtractor = useCallback((item: Section) => item.type, [])

  const renderFooter = useCallback(() => <Spacer y={4} />, [])

  // We need to wrap the flatlist with a BottomSheetScrollView on Android to allow scrolling
  // On iOS it's not required because the bottom sheet is scrollable by default
  const Wrapper = Platform.OS === "android" ? BottomSheetScrollView : Fragment

  // Kept on Tabs.FlatList (rather than Tabs.FlashList) because this list is nested inside an
  // unbounded BottomSheetScrollView on Android, which FlashList can't measure/virtualize against.
  return (
    <Wrapper>
      <Tabs.FlatList
        data={sections}
        ItemSeparatorComponent={renderItemSeparator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
    </Wrapper>
  )
}, arePropsEqual)
