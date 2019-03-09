import { Box, Separator, Serif } from "@artsy/palette"
import { EventSection } from "lib/Scenes/City/Components/EventSection"
import { BucketKey, BucketResults } from "lib/Scenes/Map/Bucket"
import { isEqual } from "lodash"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { RelayProp } from "react-relay"
import { BMWEventSection } from "./BMWEventSection"
import { FairEventSection } from "./FairEventSection"
import { SavedEventSection } from "./SavedEventSection"

interface Props extends ViewProperties {
  currentBucket: BucketKey
  buckets: BucketResults
  cityName: string
  citySlug: string
  sponsoredContent: { introText: string; artGuideUrl: string }
  relay: RelayProp
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
    this.updateSections(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const shouldUpdate = ["saved", "closing", "museums", "opening", "closing"]
      .map(key => {
        return !isEqual(
          this.props.buckets[key].map(g => g.node.is_followed),
          nextProps.buckets[key].map(g => g.is_followed)
        )
      })
      .some(a => a)

    if (shouldUpdate) {
      this.updateSections(nextProps)
    }
  }

  updateSections = props => {
    const { buckets, cityName } = props
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
    const { sponsoredContent, citySlug } = this.props
    switch (type) {
      case "fairs":
        return <FairEventSection citySlug={citySlug} data={data} />
      case "galleries":
        return (
          <EventSection
            title="Gallery shows"
            data={data}
            section="galleries"
            citySlug={citySlug}
            relay={this.props.relay}
          />
        )
      case "museums":
        return (
          <EventSection
            title="Museum shows"
            data={data}
            section="museums"
            citySlug={citySlug}
            relay={this.props.relay}
          />
        )
      case "opening":
        return (
          <EventSection
            title="Opening shows"
            data={data}
            section="opening"
            citySlug={citySlug}
            relay={this.props.relay}
          />
        )
      case "closing":
        return (
          <EventSection
            title="Closing shows"
            data={data}
            section="closing"
            citySlug={citySlug}
            relay={this.props.relay}
          />
        )
      case "bmw":
        return (
          <BMWEventSection
            title="BMW Art Guide"
            sponsoredContent={sponsoredContent}
            data={data}
            citySlug={citySlug}
            relay={this.props.relay}
          />
        )
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
