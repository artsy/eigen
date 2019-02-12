import { Box, Separator } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import React from "react"

import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { FlatList } from "react-native"

interface Props {
  // TODO: Use this to render the UI.
  city: GlobalMap_viewer
}

interface State {
  sections: Array<{
    title: string
    id: number
  }>
  extraData?: { animatedValue: { height: number } }
}

export class AllEvents extends React.Component<Props, State> {
  state: State = {
    sections: [
      {
        title: "Gallery shows",
        id: 1,
      },
      {
        title: "Museum shows",
        id: 2,
      },
      {
        title: "BMW Art Guide",
        id: 3,
      },
    ],
  }

  renderItemSeparator = () => {
    return (
      <Box py={2} px={4}>
        <Separator />
      </Box>
    )
  }

  renderItem = ({ item: { title } }) => {
    return <EventSection title={title} />
  }

  render() {
    const { sections } = this.state
    return (
      <FlatList
        data={sections}
        ItemSeparatorComponent={this.renderItemSeparator}
        keyExtractor={item => item.id}
        renderItem={item => this.renderItem(item)}
      />
    )
  }
}
