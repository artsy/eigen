import { Box, Separator, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { EventSection } from "app/Scenes/City/Components/EventSection/EventSection"
import { BucketResults } from "app/Scenes/Map/bucketCityResults"
import { isEqual } from "lodash"
import React, { Fragment } from "react"
import { Platform, ViewProps } from "react-native"
import { FairEventSection } from "./FairEventSection/FairEventSection"
import { SavedEventSection } from "./SavedEventSection/SavedEventSection"

interface Props extends ViewProps {
  buckets: BucketResults
  cityName: string
  citySlug: string
}

interface State {
  sections: Array<{
    type: string
    data?: any
  }>
}

export class AllEvents extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    this.updateSections(this.props)
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  UNSAFE_componentWillReceiveProps(nextProps) {
    const shouldUpdate = this.shouldUpdate(nextProps)

    if (shouldUpdate) {
      this.updateSections(nextProps)
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.shouldUpdate(nextProps) || this.state.sections.length !== nextState.sections.length
  }

  shouldUpdate(otherProps: Props): boolean {
    const showsUpdated = ["saved", "closing", "museums", "opening", "closing"]
      .map((key) => {
        return !isEqual(
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          this.props.buckets[key].map((g) => g.is_followed),
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          otherProps.buckets[key].map((g) => g.is_followed)
        )
      })
      .some((a) => a)

    return showsUpdated
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  updateSections = (props) => {
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

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderItemSeparator = ({ leadingItem }) => {
    if (["fairs", "saved", "header"].indexOf(leadingItem.type) === -1) {
      return (
        <Box py={1}>
          <Separator />
        </Box>
      )
    } else {
      return null
    }
  }

  renderItem = ({ item: { data, type } }: { item: State["sections"][0] }) => {
    const { citySlug } = this.props
    switch (type) {
      case "fairs":
        return <FairEventSection citySlug={citySlug} data={data} />
      case "galleries":
        return (
          <EventSection title="Gallery shows" data={data} section="galleries" citySlug={citySlug} />
        )
      case "museums":
        return (
          <EventSection title="Museum shows" data={data} section="museums" citySlug={citySlug} />
        )
      case "opening":
        return (
          <EventSection title="Opening soon" data={data} section="opening" citySlug={citySlug} />
        )
      case "closing":
        return (
          <EventSection title="Closing soon" data={data} section="closing" citySlug={citySlug} />
        )
      case "saved":
        return <SavedEventSection data={data} citySlug={citySlug} />
      case "header":
        return <Box pt={4}>{!!data && <Text variant="lg-display">{data}</Text>}</Box>
      default:
        return null
    }
  }

  // @TODO: Implement test for the AllEvents component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const { sections } = this.state

    // We need to wrap the flatlist with a BottomSheetScrollView on Android to allow scrolling
    // On iOS it's not required because the bottom sheet is scrollable by default
    const Wrapper = Platform.OS === "android" ? BottomSheetScrollView : Fragment

    return (
      <Wrapper>
        <Tabs.FlatList
          data={sections}
          ItemSeparatorComponent={this.renderItemSeparator}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          keyExtractor={(item) => item.type}
          renderItem={(item) => this.renderItem(item)}
          ListFooterComponent={() => <Spacer y={4} />}
        />
      </Wrapper>
    )
  }
}
