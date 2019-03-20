import { Box, Message, Separator, Serif } from "@artsy/palette"
import { ShowItemRow } from "lib/Components/Lists/ShowItemRow"
import Spinner from "lib/Components/Spinner"
import { MapTab, Show } from "lib/Scenes/Map/types"
import React from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RelayProp } from "react-relay"
import { TabFairItemRow } from "./TabFairItemRow"

/**
 * This hard value is needed so we can tell the FlatList upfront what rows will look like and the FlatList can ahead of
 * time calculate the total content size.
 *
 * Currently the fair row renders at 100 height and the show row renders at 103.33. We can’t make this value smaller
 * than either, becuase then the content would keep growing as the actual content gets laid out.
 *
 * FIXME: Should /probably/ be 100, but this needs to be fixed first: https://artsyproduct.atlassian.net/browse/LD-446
 */
const ROW_HEIGHT = 104

interface Props {
  bucket: Show[]
  type: MapTab["id"]
  cityName: string
  header?: string
  relay: RelayProp
  onScroll?: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void
  fetchingNextPage?: boolean
}

export class EventList extends React.Component<Props> {
  renderItem = item => {
    const { type } = this.props
    return (
      <Box height={ROW_HEIGHT}>
        {type === "fairs" ? (
          <Box py={2}>
            <TabFairItemRow item={item} />
          </Box>
        ) : (
          <Box py={2}>
            <ShowItemRow show={item} relay={this.props.relay} />
          </Box>
        )}
      </Box>
    )
  }

  hasEventsComponent = () => {
    const { bucket, onScroll, fetchingNextPage, header } = this.props
    return (
      <FlatList
        ListHeaderComponent={() => {
          if (!!header) {
            return (
              <Box pt={6} mt={3} mb={2}>
                <Serif size="8">{header}</Serif>
              </Box>
            )
          } else {
            return null
          }
        }}
        data={bucket}
        ItemSeparatorComponent={() => <Separator />}
        ListFooterComponent={fetchingNextPage && <Spinner style={{ marginTop: 20, marginBottom: 20 }} />}
        keyExtractor={item => item.id}
        renderItem={({ item }) => this.renderItem(item)}
        onScroll={onScroll}
        windowSize={50}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
        getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: index * ROW_HEIGHT, index })}
      />
    )
  }

  hasNoEventsComponent = () => {
    const { type, cityName } = this.props
    switch (type) {
      case "saved":
        return (
          <Box py={2} mx={2}>
            <Message textSize="3t">{`You haven’t saved any shows in ${cityName}. When you save shows, they will show up here.`}</Message>
          </Box>
        )
      case "fairs":
        return (
          <Box py={2} mx={2}>
            <Message textSize="3t">{`There are currently no active fairs. Check back later to view fairs in ${cityName}.`}</Message>
          </Box>
        )
      default:
        return (
          <Box py={2} mx={2}>
            <Message textSize="3t">{`There are currently no active ${type.toLowerCase()} shows. Check back later to view shows in ${cityName}.`}</Message>
          </Box>
        )
    }
  }

  render() {
    const { bucket } = this.props
    const hasEvents = bucket.length > 0
    return hasEvents ? this.hasEventsComponent() : this.hasNoEventsComponent()
  }
}
