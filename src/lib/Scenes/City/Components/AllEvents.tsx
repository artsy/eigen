import { Box, Separator, Serif } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import { BucketKey, BucketResults } from "lib/Scenes/Map/Bucket"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { BMWEventSection } from "./BMWEventSection"
import { FairEventSection } from "./FairEventSection"
import { SavedEventSection } from "./SavedEventSection"

interface Props extends ViewProperties {
  currentBucket: BucketKey
  buckets: BucketResults
  cityName: string
  sponsoredContent: { introText: string; artGuideUrl: string }
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
    const { buckets, cityName } = this.props
    const sections = []

    sections.push({
      type: "header",
      data: `${cityName} City Guide`,
    })

    if (buckets.saved) {
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

    if (buckets.museums && buckets.museums.length) {
      sections.push({
        type: "bmw",
        data: buckets.museums,
      })
    }

    if (buckets.closing && buckets.closing.length) {
      sections.push({
        type: "closing",
        data: buckets.closing,
      })
    }

    if (buckets.opening && buckets.opening.length) {
      sections.push({
        type: "opening",
        data: buckets.opening,
      })
    }

    this.setState({ sections })
  }

  renderItemSeparator = ({ leadingItem }) => {
    if (["fairs", "saved", "header"].indexOf(leadingItem.type) === -1) {
      return (
        <Box py={1} px={2}>
          <Separator />
        </Box>
      )
    } else {
      return null
    }
  }

  renderItem = ({ item: { data, type } }) => {
    const { cityName, sponsoredContent } = this.props
    switch (type) {
      case "fairs":
        return <FairEventSection data={data} />
      case "galleries":
        return <EventSection title="Gallery shows" data={data} />
      case "museums":
        return <EventSection title="Museum shows" data={data} />
      case "opening":
        return <EventSection title="Opening shows" data={data} />
      case "closing":
        return <EventSection title="Closing shows" data={data} />
      case "bmw":
        return <BMWEventSection title="BMW Art Guide" sponsoredContent={sponsoredContent} data={data} />
      case "saved":
        return <SavedEventSection data={data} />
      case "header":
        return (
          <Box px={2} pt={4}>
            {data && <Serif size="8">{data}</Serif>}
          </Box>
        )
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
        scrollEnabled={false}
      />
    )
  }
}
