import * as _ from "lodash"
import React from "react"
import ParallaxScrollView from "react-native-parallax-scroll-view"
import { createRefetchContainer, graphql } from "react-relay"
import { RelayRefetchProp } from "react-relay"

import { Dimensions, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"

import { Schema, Track, track as _track } from "lib/utils/track"

import { GhostButton } from "../Components/Buttons"
import Separator from "../Components/Separator"
import SerifText from "../Components/Text/Serif"

import About from "../Components/Gene/About"
import Header from "../Components/Gene/Header"

import GeneArtworksGrid from "../Components/ArtworkGrids/RelayConnections/GeneArtworksGrid"

import SwitchView, { SwitchEvent } from "../Components/SwitchView"

import colors from "lib/data/colors"
import Refine from "../NativeModules/triggerRefine"

const isPad = Dimensions.get("window").width > 700

const TABS = {
  WORKS: "WORKS",
  ABOUT: "ABOUT",
}

/** The title of the gene when scrolled, with margins */
const HeaderHeight = 64

interface Props extends ViewProperties {
  medium: string
  price_range: string
  gene: any
  relay?: RelayRefetchProp
}

interface State {
  selectedTabIndex: number
  showingStickyHeader?: boolean
  sort?: string
  selectedMedium?: string
  selectedPriceRange?: string
}
const track: Track<Props, State> = _track

/**
 *  There are 3 different major views inside this componentDidUpdate
 *
 *   - Foreground [title, follow, switch]
 *   - Sticky Refine [work counter, refine]
 *   - Section inside tab [artworks || about + related artists]
 *
 *   Nuance:
 *
 *   - The foreground switches between the "foreground" and "sticky header"
 *     the foreground being the title, buttons and switch, the header being
 *     just the title. It only does this for Artworks, not about.
 *
 *   - The sticky refine, when scrolled up _gains_ a 64px margin
 *     this is so it can reach all the way of the screen, and fit
 *     the sticky header's mini title inside it.
 *
 *   - We use a fork of react-native-parallax-scroll-view which has access
 *     to change the style component of the header, as well as a well-ordered
 *     API for inserting a component into the tree. This is used so that the
 *     sticky refine section will _always_ be at a specific index, making sure
 *     the `stickyHeaderIndices` is always at the right index.
 *
 */
@track()
export class Gene extends React.Component<Props, State> {
  foregroundHeight: number = 200

  constructor(props: Props) {
    super(props)
    this.state = {
      selectedTabIndex: 0,
      showingStickyHeader: true,

      // Use the metaphysics defaults for refine settings
      sort: "-partner_updated_at",
      selectedMedium: this.props.medium || "*",
      selectedPriceRange: this.props.price_range || "*-*",
    }
  }

  @track((props, state) => ({
    action_name: state.selectedTabIndex ? Schema.ActionNames.GeneWorks : Schema.ActionNames.GeneAbout,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene._id,
    owner_slug: props.gene.id,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  switchSelectionDidChange(event: SwitchEvent) {
    this.setState({ selectedTabIndex: event.nativeEvent.selectedIndex })
  }

  availableTabs = () => {
    return [TABS.WORKS, TABS.ABOUT]
  }

  selectedTabTitle = () => {
    return this.availableTabs()[this.state.selectedTabIndex]
  }

  renderSectionForTab = () => {
    switch (this.selectedTabTitle()) {
      case TABS.ABOUT:
        return <About gene={this.props.gene} />
      case TABS.WORKS:
        return (
          <GeneArtworksGrid
            filtered_artworks={this.props.gene.filtered_artworks}
            medium={this.state.selectedMedium}
            priceRange={this.state.selectedPriceRange}
            sort={this.state.sort}
            mapPropsToArtworksConnection={props => props.filtered_artworks.artworks}
          />
        )
    }
  }

  get commonPadding(): number {
    return isPad ? 40 : 20
  }

  get showingArtworksSection(): boolean {
    return this.selectedTabTitle() === TABS.WORKS
  }

  /** Top of the Component */
  renderForeground = () => {
    const containerStyle = {
      backgroundColor: "white",
      paddingLeft: this.commonPadding,
      paddingRight: this.commonPadding,
    }
    return (
      <View style={[containerStyle, styles.header]}>
        <Header gene={this.props.gene} shortForm={false} />
        <SwitchView
          style={{ marginTop: 30 }}
          titles={this.availableTabs()}
          selectedIndex={this.state.selectedTabIndex}
          onSelectionChange={this.switchSelectionDidChange.bind(this)}
        />
      </View>
    )
  }

  /** Callback from the parallax that we have transistioned into the small title mode */
  onChangeHeaderVisibility = (sticky: boolean) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  /**  No sticky header if you're in the about section */
  stickyHeaderHeight(): number | null {
    if (!this.showingArtworksSection) {
      return null
    }
    return HeaderHeight
  }

  @track(props => ({
    action_name: Schema.ActionNames.Refine,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.gene._id,
    owner_slug: props.gene.id,
    owner_type: Schema.OwnerEntityTypes.Gene,
  }))
  refineTapped(_button) {
    const initialSettings = {
      sort: "-partner_updated_at",
      selectedMedium: this.props.medium || "*",
      selectedPrice: this.props.price_range || "*-*",
      aggregations: this.props.gene.filtered_artworks.aggregations,
    }

    const currentSettings = {
      sort: this.state.sort,
      selectedMedium: this.state.selectedMedium,
      selectedPrice: this.state.selectedPriceRange,
      aggregations: this.props.gene.filtered_artworks.aggregations,
    }

    // We're returning the promise so that it's easier
    // to write tests with the resolved state
    return Refine.triggerRefine(this, initialSettings, currentSettings).then(newSettings => {
      if (newSettings) {
        this.setState({
          selectedMedium: newSettings.medium,
          selectedPriceRange: newSettings.selectedPrice,
          sort: newSettings.sort,
        })

        this.props.relay.refetch({
          medium: newSettings.medium,
          price_range: newSettings.selectedPrice,
          sort: newSettings.sort,
        })
      }
    })
  }

  /** Title of the Gene */
  renderStickyHeader = () => {
    if (!this.showingArtworksSection) {
      return null
    }
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: "white" }}>
        <Header gene={this.props.gene} shortForm={true} />
      </View>
    )
  }

  /**  Count of the works, and the refine button - sticks to the top of screen when scrolling */
  renderStickyRefineSection = () => {
    if (!this.showingArtworksSection) {
      return null
    }
    const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight
    const separatorColor = this.state.showingStickyHeader ? "white" : colors["gray-regular"]

    const refineButtonWidth = 80
    const maxLabelWidth = Dimensions.get("window").width - this.commonPadding * 2 - refineButtonWidth - 10

    return (
      <View style={{ backgroundColor: "white" }}>
        <Separator style={{ marginTop: topMargin, backgroundColor: separatorColor }} />
        <View style={[styles.refineContainer, { paddingLeft: this.commonPadding, paddingRight: this.commonPadding }]}>
          <SerifText style={{ fontStyle: "italic", marginTop: 2, maxWidth: maxLabelWidth }}>
            {this.artworkQuerySummaryString()}
          </SerifText>
          <GhostButton
            text="REFINE"
            style={{ height: 26, width: refineButtonWidth }}
            onPress={this.refineTapped.bind(this)}
          />
        </View>
        <Separator style={{ backgroundColor: separatorColor }} />
      </View>
    )
  }

  render() {
    const stickyTopMargin = this.state.showingStickyHeader ? 0 : -HeaderHeight

    return (
      <ParallaxScrollView
        scrollsToTop={true}
        fadeOutForeground={false}
        backgroundScrollSpeed={1}
        backgroundColor="white"
        contentBackgroundColor="white"
        renderForeground={this.renderForeground}
        stickyHeaderHeight={this.stickyHeaderHeight()}
        renderStickyHeader={this.renderStickyHeader}
        onChangeHeaderVisibility={this.onChangeHeaderVisibility}
        stickyHeaderIndices={[1]}
        renderBodyComponentHeader={this.renderStickyRefineSection}
        parallaxHeaderHeight={this.foregroundHeight}
        parallaxHeaderContainerStyles={{ marginBottom: stickyTopMargin }}
      >
        <View style={{ marginTop: 20, paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
          {this.renderSectionForTab()}
        </View>
      </ParallaxScrollView>
    )
  }

  /** The summary string of the current refine settings */
  artworkQuerySummaryString = () => {
    const items: string[] = []
    const works = this.props.gene.filtered_artworks.total.toLocaleString()
    items.push(`${works} works`)

    if (this.state.selectedMedium !== "*") {
      items.push(_.startCase(this.state.selectedMedium))
    }
    if (this.state.selectedPriceRange !== "*-*") {
      items.push(this.priceRangeToHumanReadableString(this.state.selectedPriceRange))
    }
    return items.join(" ・ ")
  }

  /** Converts a price string like 30.00-5000.00 to $30 - $5,000 */
  priceRangeToHumanReadableString = (range: string) => {
    const dollars = (value: string) => {
      return parseInt(value, 10).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      })
    }

    if (range === "*-*") {
      return ""
    }
    if (range.includes("-*")) {
      const below = dollars(range.split("-*")[0])
      return `Above ${below}`
    }
    if (range.includes("*-")) {
      const below = dollars(range.split("*-").pop())
      return `Below ${below}`
    }
    const [first, second] = range.split("-")
    return `${dollars(first)} - ${dollars(second)}`
  }
}

interface Styles {
  header: ViewStyle
  stickyHeader: ViewStyle
  refineContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  header: {
    width: isPad ? 330 : null,
    alignSelf: isPad ? "center" : null,
  },
  stickyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 26,
    marginTop: 12,
    marginBottom: 12,
    paddingLeft: isPad ? 40 : 20,
    paddingRight: isPad ? 40 : 20,
  },
  refineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 26,
    marginTop: 12,
    marginBottom: 12,
  },
})

export default createRefetchContainer(
  Gene,
  {
    gene: graphql`
      fragment Gene_gene on Gene
        @argumentDefinitions(
          sort: { type: "String", defaultValue: "-partner_updated_at" }
          medium: { type: "String", defaultValue: "*" }
          price_range: { type: "String", defaultValue: "*-*" }
        ) {
        ...Header_gene
        ...About_gene

        filtered_artworks(
          size: 0
          medium: $medium
          price_range: $price_range
          sort: $sort
          aggregations: [MEDIUM, PRICE_RANGE, TOTAL]
          for_sale: true
        ) {
          total
          aggregations {
            slice
            counts {
              gravityID
              name
              count
            }
          }
          ...GeneArtworksGrid_filtered_artworks @arguments(sort: $sort)
        }
      }
    `,
  },
  graphql`
    query GeneRefetchQuery($geneID: String!, $sort: String, $medium: String, $price_range: String) {
      gene(id: $geneID) {
        ...Gene_gene @arguments(sort: $sort, medium: $medium, price_range: $price_range)
      }
    }
  `
)
