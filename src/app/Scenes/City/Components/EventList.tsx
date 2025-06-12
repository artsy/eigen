import { Box, Separator, SimpleMessage, Tabs, Text } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { ShowItemRow } from "app/Components/Lists/ShowItemRow"
import Spinner from "app/Components/Spinner"
import { MapTab, Show } from "app/Scenes/Map/types"
import { navigate } from "app/system/navigation/navigate"
import { isEqual } from "lodash"
import React from "react"
import { FlatList, FlatListProps } from "react-native"
import { TabFairItemRow } from "./TabFairItemRow/TabFairItemRow"

/**
 * This hard value is needed so we can tell the FlatList upfront what rows will look like and the FlatList can ahead of
 * time calculate the total content size.
 *
 * Currently the fair row renders at 100 height and the show row renders at 103.33. We can’t make this value smaller
 * than either, becuase then the content would keep growing as the actual content gets laid out.
 *
 * FIXME: Should /probably/ be 100, but this needs to be fixed first: https://artsyproduct.atlassian.net/browse/LD-446
 */
const RowHeight = 104
const MaxRowCount = 25

interface Props {
  bucket: Show[]
  type: MapTab["id"]
  citySlug?: string
  cityName: string
  header?: string
  onScroll?: FlatListProps<any>["onScroll"]
  fetchingNextPage?: boolean
  renderedInTab?: boolean
}

// @TODO: Implement test for the EventList component https://artsyproduct.atlassian.net/browse/LD-562
export class EventList extends React.Component<Props> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderItem = (item) => {
    const { type } = this.props
    return (
      <Box height={RowHeight} py={2}>
        {type === "fairs" ? <TabFairItemRow item={item} /> : <ShowItemRow show={item} />}
      </Box>
    )
  }

  renderFooter = () => {
    const { bucket, fetchingNextPage, renderedInTab } = this.props
    if (fetchingNextPage) {
      return <Spinner style={{ marginTop: 20, marginBottom: 20 }} />
    }

    if (renderedInTab && bucket.length > MaxRowCount) {
      return (
        <>
          <Separator />
          <Box mt={2} mb={4}>
            <CaretButton
              onPress={() => this.viewAllPressed()}
              text={`View all ${bucket.length} shows`}
            />
          </Box>
        </>
      )
    }

    return null
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      !isEqual(this.props.fetchingNextPage, nextProps.fetchingNextPage) ||
      !isEqual(this.props.type, nextProps.type) ||
      this.props.bucket.length !== nextProps.bucket.length ||
      !isEqual(
        this.props.bucket.map((g) => g.is_followed),
        nextProps.bucket.map((g) => g.is_followed)
      )
    )
  }

  viewAllPressed() {
    const { citySlug, type } = this.props
    navigate(`/city/${citySlug}/${type}`)
  }

  hasEventsComponent = () => {
    const { bucket, onScroll, header, renderedInTab } = this.props
    const EventFlatList = renderedInTab ? Tabs.FlatList : FlatList
    return (
      <EventFlatList
        ListHeaderComponent={() => {
          if (!!header) {
            return (
              <Box mb={2}>
                <Text variant="lg-display">{header}</Text>
              </Box>
            )
          } else {
            return null
          }
        }}
        data={renderedInTab ? bucket.slice(0, MaxRowCount) : bucket}
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={this.renderFooter()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => this.renderItem(item)}
        onScroll={onScroll}
        windowSize={50}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
        getItemLayout={(_, index) => ({ length: RowHeight, offset: index * RowHeight, index })}
      />
    )
  }

  hasNoEventsComponent = () => {
    const { type, cityName, renderedInTab } = this.props
    const EmptyStateContainer = renderedInTab ? Tabs.ScrollView : React.Fragment

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

  render() {
    const { bucket } = this.props
    const hasEvents = bucket.length > 0
    return hasEvents ? this.hasEventsComponent() : this.hasNoEventsComponent()
  }
}
