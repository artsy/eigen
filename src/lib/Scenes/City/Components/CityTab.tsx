import { Box, Separator, Theme } from "@artsy/palette"
import { SavedShowItemRow } from "lib/Components/Lists/SavedShowItemRow"
import React from "react"
import { FlatList } from "react-native"
import { RelayProp } from "react-relay"
import { TabFairItemRow } from "./TabFairItemRow"

interface Props {
  bucket: any[]
  type: string
  relay: RelayProp
}

export class CityTab extends React.Component<Props> {
  renderItem = item => {
    const { type } = this.props
    if (type === "Fairs") {
      return <TabFairItemRow item={item} />
    } else {
      return <SavedShowItemRow show={item.node} relay={this.props.relay} />
    }
  }

  render() {
    const { bucket } = this.props
    return (
      <Theme>
        <Box px={2}>
          <FlatList
            data={bucket}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={item => item.node.id}
            renderItem={({ item }) => this.renderItem(item)}
            scrollEnabled={false}
          />
        </Box>
      </Theme>
    )
  }
}
