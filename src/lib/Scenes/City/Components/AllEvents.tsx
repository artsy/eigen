import { Box, Separator } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import { BucketKey, BucketResults } from "lib/Scenes/Map/Bucket"
import React from "react"
import { FlatList } from "react-native"
import { FairEventSection } from "./FairEventSection"

interface Props {
  currentBucket: BucketKey
  buckets: BucketResults
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

  renderItemSeparator = ({ leadingItem }) => {
    return (
      <Box py={2} px={2}>
        {leadingItem.type !== "fairs" && <Separator />}
      </Box>
    )
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "fairs":
        return <FairEventSection data={data} />
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
      <FlatList
        data={sections}
        ItemSeparatorComponent={this.renderItemSeparator}
        keyExtractor={item => item.type}
        renderItem={item => this.renderItem(item)}
      />
    )
  }
}
