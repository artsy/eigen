import { omit } from "lodash"
import React, { Component } from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

import {
  Dimensions,
  Image,
  ImageURISource,
  LayoutAnimation,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewProperties,
  ViewStyle,
} from "react-native"

import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import Separator from "lib/Components/Separator"
import Spinner from "lib/Components/Spinner"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import ArtworkCarouselHeader from "./ArtworkCarouselHeader"

import { ArtworkCarousel_rail } from "__generated__/ArtworkCarousel_rail.graphql"

// tslint:disable-next-line:no-var-requires
const chevron: ImageURISource = require("../../../../../../../images/chevron.png")

const isPad = Dimensions.get("window").width > 700

const additionalContentRails = [
  "followed_artists",
  "saved_works",
  "live_auctions",
  "current_fairs",
  "genes",
  "generic_gene",
  "followed_artist",
]

export const minRailHeight = 400

interface Props extends ViewProperties {
  rail: ArtworkCarousel_rail
  relay: RelayProp
}

interface State {
  expanded: boolean
  gridHeight: number
}

export class ArtworkCarousel extends Component<Props, State> {
  state = {
    expanded: false,
    gridHeight: 0,
  }

  expand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ expanded: true })
  }

  hasAdditionalContent() {
    return additionalContentRails.indexOf(this.props.rail.key) > -1
  }

  handleViewAll = () => {
    const context = this.props.rail.context
    const key = this.props.rail.key

    let url = null
    switch (key) {
      case "followed_artists":
        url = "/works-for-you"
        break
      case "followed_artist":
      case "related_artists":
        url = context && context.artist.href
        break
      case "saved_works":
        url = "/favorites"
        break
      case "generic_gene":
        url = this.geneQueryLink(this.props.rail)
        break
      case "genes":
      case "current_fairs":
      case "live_auctions":
        url = context && context.href
        break
      default:
        url = null
        break
    }

    if (url) {
      SwitchBoard.presentNavigationViewController(this, url)
    }
  }

  geneQueryLink(rail) {
    if (!rail.context) {
      return ""
    }
    // Pull out any params, removing the first removing data ID
    // and any null values, turn that into a query string
    const relatedKeys = Object.keys(omit(rail.params, ["__dataID__"]))

    return (
      rail.context &&
      rail.context.href +
        "?" +
        relatedKeys
          .map(key => rail.params[key] && encodeURIComponent(key) + "=" + encodeURIComponent(rail.params[key]))
          .join("&")
    )
  }

  onGridLayout(event) {
    const { height } = event.nativeEvent.layout
    // Non-expandable rails require a non-zero height for an initial render pass,
    // So that we can rely on their subsequent, accurate calls to this function.
    this.setState({ gridHeight: height > 0 ? height : 1 })
  }

  expandable() {
    return this.props.rail.results.length > (isPad ? 3 : 6)
  }

  mainContainerHeight() {
    // includes height of View All button (if present), the separator, and a 30px margin
    const supplementaryHeight = this.hasAdditionalContent() ? 101 : 30

    if (this.expandable()) {
      const initialRailHeight = isPad ? 410 : 510
      return this.state.expanded ? this.state.gridHeight + supplementaryHeight : initialRailHeight
    } else {
      return this.state.gridHeight + supplementaryHeight
    }
  }

  gridContainerHeight() {
    if (this.expandable()) {
      const initialInternalViewHeight = isPad ? 400 : 500
      return this.state.expanded ? this.state.gridHeight : initialInternalViewHeight
    } else {
      return this.state.gridHeight
    }
  }

  renderGrid() {
    return (
      <View style={[styles.gridContainer, { height: this.gridContainerHeight() }]}>
        <View onLayout={this.onGridLayout.bind(this)}>
          <GenericGrid artworks={this.props.rail.results as any} />
        </View>
      </View>
    )
  }

  renderViewAllButton() {
    if (this.expandable() && !this.state.expanded) {
      return
    }

    if (this.hasAdditionalContent()) {
      return (
        <TouchableHighlight style={styles.viewAllButton} onPress={this.handleViewAll} underlayColor={"gray"}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableHighlight>
      )
    }

    // otherwise, use a spacer view
    return <View style={{ height: 30 }} />
  }

  renderExpansionButton() {
    if (this.expandable() && !this.state.expanded) {
      return (
        <TouchableHighlight style={styles.expansionButton} onPress={this.expand} underlayColor={"white"}>
          <Image style={{ height: 8, width: 15, alignSelf: "center", resizeMode: "center" }} source={chevron} />
        </TouchableHighlight>
      )
    }
  }

  renderModuleResults() {
    if (this.props.rail.results && this.props.rail.results.length) {
      return (
        <View style={[styles.container, { height: this.mainContainerHeight() }]}>
          {this.renderGrid()}
          {this.renderViewAllButton()}
          <Separator />
          {this.renderExpansionButton()}
        </View>
      )
    } else {
      return <Spinner style={{ flex: 1 }} />
    }
  }

  railStyle() {
    const style: any = { marginLeft: 20, marginRight: 20 }
    return style
  }

  render() {
    const hasArtworks = this.props.rail.results && this.props.rail.results.length
    if (!hasArtworks) {
      return null
    }

    return (
      <View accessibilityLabel="Artwork Rail" style={{ paddingBottom: this.state.expanded ? 0 : 12 }}>
        <ArtworkCarouselHeader rail={this.props.rail as any} handleViewAll={this.handleViewAll} />
        <View style={this.railStyle()}>{this.renderModuleResults()}</View>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
  gridContainer: ViewStyle
  expansionButton: ViewStyle
  viewAllButton: ViewStyle
  viewAllText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    backgroundColor: "white",
  },
  gridContainer: {
    overflow: "hidden",
  },
  expansionButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderColor: colors["gray-regular"],
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: "center",
    top: -20,
    justifyContent: "center",
  },
  viewAllButton: {
    width: 240,
    height: 40,
    backgroundColor: "black",
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  viewAllText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontFamily: fonts["avant-garde-regular"],
  },
})

export default createFragmentContainer(ArtworkCarousel, {
  rail: graphql`
    fragment ArtworkCarousel_rail on HomePageArtworkModule {
      ...ArtworkCarouselHeader_rail
      id
      key
      params {
        medium
        price_range
      }
      context {
        ... on HomePageModuleContextFollowedArtist {
          artist {
            href
          }
        }
        ... on HomePageModuleContextRelatedArtist {
          artist {
            href
          }
        }
        ... on HomePageModuleContextFair {
          href
        }
        ... on HomePageModuleContextGene {
          href
        }
        ... on HomePageModuleContextSale {
          href
        }
      }
      results {
        ...GenericGrid_artworks
      }
    }
  `,
})
