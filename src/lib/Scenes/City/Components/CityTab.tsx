import { Box, Separator, Theme } from "@artsy/palette"
import React from "react"
import { FlatList } from "react-native"
import { TabListItem } from "./TabListItem"

interface Props {
  bucket: any[]
  type: string
}

export class CityTab extends React.Component<Props> {
  render() {
    const { bucket, type } = this.props
    return (
      <Theme>
        <Box px={2}>
          <FlatList
            data={bucket}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={item => (item.node ? item.node.id : item.id)}
            renderItem={({ item }) => <TabListItem item={item} type={type} />}
            scrollEnabled={false}
          />
        </Box>
      </Theme>
    )
  }
}
