import { Box, Separator, SimpleMessage, Tabs, Text } from "@artsy/palette-mobile"
import { FlashList, FlashListProps, ListRenderItem } from "@shopify/flash-list"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import Spinner from "app/Components/Spinner"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { Fair, MapTab, Show } from "app/utils/cityGuide/types"
import { Fragment, memo, useCallback } from "react"
import { TabFairItemRow } from "./TabFairItemRow/TabFairItemRow"

const RowHeight = 104
const MaxRowCount = 25

type EventItem = Show | Fair

interface Props {
  /** `Show`s for every tab except "fairs", which renders `Fair`s. */
  bucket: EventItem[]
  type: MapTab["id"]
  citySlug?: string
  cityName: string
  header?: string
  onScroll?: FlashListProps<EventItem>["onScroll"]
  fetchingNextPage?: boolean
  renderedInTab?: boolean
}

const EmptyState: React.FC<{ type: MapTab["id"]; cityName: string; renderedInTab?: boolean }> = ({
  type,
  cityName,
  renderedInTab,
}) => {
  const EmptyStateContainer = renderedInTab ? Tabs.ScrollView : Fragment

  switch (type) {
    case "saved":
      return (
        <EmptyStateContainer>
          <Box py={2}>
            <SimpleMessage>{`You haven’t saved any shows in ${cityName}. When you save shows, they will show up here.`}</SimpleMessage>
          </Box>
        </EmptyStateContainer>
      )
    case "fairs":
      return (
        <EmptyStateContainer>
          <Box py={2}>
            <SimpleMessage>{`There are currently no active fairs. Check back later to view fairs in ${cityName}.`}</SimpleMessage>
          </Box>
        </EmptyStateContainer>
      )
    default:
      return (
        <EmptyStateContainer>
          <Box py={2}>
            <SimpleMessage>{`There are currently no active ${type.toLowerCase()} shows. Check back later to view shows in ${cityName}.`}</SimpleMessage>
          </Box>
        </EmptyStateContainer>
      )
  }
}

// Mirrors the props that actually affect what's rendered (ignores e.g. `onScroll`, which is
// commonly passed as a fresh inline function on every parent render).
const arePropsEqual = (prevProps: Props, nextProps: Props) =>
  prevProps.fetchingNextPage === nextProps.fetchingNextPage &&
  prevProps.type === nextProps.type &&
  prevProps.bucket.length === nextProps.bucket.length &&
  prevProps.bucket.every(
    (item, index) =>
      (item as Show).is_followed === (nextProps.bucket[index] as Show | undefined)?.is_followed
  )

// @TODO: Implement test for the EventList component https://artsyproduct.atlassian.net/browse/LD-562
export const EventList: React.FC<Props> = memo((props) => {
  const { bucket, type, citySlug, cityName, header, onScroll, fetchingNextPage, renderedInTab } =
    props

  const viewAllPressed = useCallback(() => {
    navigate(`/city/${citySlug}/${type}`)
  }, [citySlug, type])

  const renderItem: ListRenderItem<EventItem> = useCallback(
    ({ item }) => (
      <Box height={RowHeight} py={2}>
        {type === "fairs" ? (
          <TabFairItemRow item={item as Fair} />
        ) : (
          <ShowItemRow show={item as Show} />
        )}
      </Box>
    ),
    [type]
  )

  const keyExtractor = useCallback((item: EventItem) => item.id, [])

  const renderListHeader = useCallback(() => {
    if (!header) {
      return null
    }
    return (
      <Box mb={2}>
        <Text variant="lg-display">{header}</Text>
      </Box>
    )
  }, [header])

  const renderListFooter = useCallback(() => {
    if (fetchingNextPage) {
      return <Spinner style={{ marginTop: 20, marginBottom: 20 }} />
    }

    if (renderedInTab && bucket.length > MaxRowCount) {
      return (
        <>
          <Separator />
          <Box mt={2} mb={4}>
            <CaretButton onPress={viewAllPressed} text={`View all ${bucket.length} shows`} />
          </Box>
        </>
      )
    }

    return null
  }, [fetchingNextPage, renderedInTab, bucket.length, viewAllPressed])

  if (bucket.length === 0) {
    return <EmptyState type={type} cityName={cityName} renderedInTab={renderedInTab} />
  }

  const EventFlashList = renderedInTab ? Tabs.FlashList : FlashList

  return (
    <EventFlashList
      data={renderedInTab ? bucket.slice(0, MaxRowCount) : bucket}
      ListHeaderComponent={renderListHeader}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={renderListFooter}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onScroll={onScroll}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
    />
  )
}, arePropsEqual)
