import { Box, Message, Separator, Serif } from "@artsy/palette"
import { ShowItemRow } from "lib/Components/Lists/ShowItemRow"
import Spinner from "lib/Components/Spinner"
import { MapTab, Show } from "lib/Scenes/Map/types"
import React from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RelayProp } from "react-relay"
import { TabFairItemRow } from "./TabFairItemRow"

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
    if (type === "fairs") {
      return <TabFairItemRow item={item} />
    } else {
      return <ShowItemRow show={item} relay={this.props.relay} />
    }
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
      />
    )
  }

  hasNoEventsComponent = () => {
    const { type, cityName } = this.props
    switch (type) {
      case "saved":
        return (
          <Box py={2}>
            <Message textSize="3t">{`You haven’t saved any shows in ${cityName}. When you save shows, they will show up here.`}</Message>
          </Box>
        )
      case "fairs":
        return (
          <Box py={2}>
            <Message textSize="3t">{`There are currently no active fairs. Check back later to view fairs in ${cityName}.`}</Message>
          </Box>
        )
      default:
        return (
          <Box py={2}>
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
