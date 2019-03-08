import { Box, Message, Separator, Theme } from "@artsy/palette"
import { ShowItemRow } from "lib/Components/Lists/ShowItemRow"
import React from "react"
import { FlatList } from "react-native"
import { RelayProp } from "react-relay"
import { TabFairItemRow } from "./TabFairItemRow"

interface Props {
  bucket: any[]
  type: string
  cityName: string
  relay: RelayProp
}

export class CityTab extends React.Component<Props> {
  renderItem = item => {
    const { type } = this.props
    if (type === "Fairs") {
      return <TabFairItemRow item={item} />
    } else {
      return <ShowItemRow show={item.node} relay={this.props.relay} />
    }
  }

  hasEventsComponent = () => {
    const { bucket } = this.props
    return (
      <FlatList
        data={bucket}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={item => item.node.id}
        renderItem={({ item }) => this.renderItem(item)}
        scrollEnabled={false}
      />
    )
  }

  hasNoEventsComponent = () => {
    const { type, cityName } = this.props
    switch (type) {
      case "Saved":
        return (
          <Box py={2}>
            <Message textSize="3t">{`You haven’t saved any shows in ${cityName}. When you save shows, they will show up here.`}</Message>
          </Box>
        )
      case "Fairs":
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
    return (
      <Theme>
        <Box px={2}>{hasEvents ? this.hasEventsComponent() : this.hasNoEventsComponent()}</Box>
      </Theme>
    )
  }
}
