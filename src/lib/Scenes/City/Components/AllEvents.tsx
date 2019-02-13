import { Box, Separator, Theme } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import React from "react"
import { FlatList } from "react-native"

interface Props {
  buckets: any
  currentBucket: string
}

interface State {
  sections: Array<{
    title: string
    id: number
  }>
}

export class AllEvents extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    this.updateSections()
  }

  updateSections = () => {
    const { buckets } = this.props
    const sections = []

    if (buckets.saved && buckets.saved.length) {
      sections.push({
        type: "saved",
        data: buckets.saved,
      })
    }

    if (buckets.fairs && buckets.fairs.length) {
      sections.push({
        type: "fairs",
        data: buckets.fairs,
      })
    }

    if (buckets.galleries && buckets.galleries.length) {
      sections.push({
        type: "galleries",
        data: buckets.galleries,
      })
    }

    if (buckets.museums && buckets.museums.length) {
      sections.push({
        type: "museums",
        data: buckets.museums,
      })
    }

    this.setState({ sections })
  }

  renderItemSeparator = () => {
    return (
      <Box py={2} px={2}>
        <Separator />
      </Box>
    )
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "fairs":
        return null
      case "galleries":
        return <EventSection title="Gallery shows" data={data} />
      case "museums":
        return <EventSection title="Museum shows" data={data} />
      case "saved":
        return <EventSection title="Saved events" data={data} />
      default:
        return null
    }
  }

  render() {
    const { sections } = this.state
    return (
      <Theme>
        <FlatList
          data={sections}
          ItemSeparatorComponent={this.renderItemSeparator}
          keyExtractor={item => item.id}
          renderItem={item => this.renderItem(item)}
        />
      </Theme>
    )
  }
}
