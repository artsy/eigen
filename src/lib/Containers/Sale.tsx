import { Button, Theme } from "@artsy/palette"
import { Sale_sale } from "__generated__/Sale_sale.graphql"
import SaleArtworksGrid from "lib/Components/ArtworkGrids/RelayConnections/SaleArtworksGrid"
import Header from "lib/Components/Sale/Header"
import Separator from "lib/Components/Separator"
import SerifText from "lib/Components/Text/Serif"
import colors from "lib/data/colors"
import React from "react"
import { Dimensions, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
import ParallaxScrollView from "react-native-parallax-scroll-view"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

const isPad = Dimensions.get("window").width > 700
const HeaderHeight = 64

interface Props extends ViewProperties {
  sale: Sale_sale
  relay: RelayRefetchProp
}

interface State {
  showingStickyHeader: boolean
}

export class Sale extends React.Component<Props, State> {
  bannerHeight: number = 200

  constructor(props: Props) {
    super(props)
    this.state = {
      showingStickyHeader: true,
    }
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
        <Header sale={this.props.sale} showImage={this.state.showingStickyHeader} />
      </View>
    )
  }

  renderStickyRefineSection = () => {
    const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight
    const separatorColor = colors["gray-regular"]

    const refineButtonWidth = 80
    const maxLabelWidth = Dimensions.get("window").width - this.commonPadding * 2 - refineButtonWidth - 10

    return (
      <Theme>
        <View style={{ backgroundColor: "white" }}>
          <Separator style={{ marginTop: topMargin, backgroundColor: separatorColor }} />
          <View style={[styles.refineContainer, { paddingLeft: this.commonPadding, paddingRight: this.commonPadding }]}>
            <SerifText style={{ fontStyle: "italic", marginTop: 2, maxWidth: maxLabelWidth }}>
              Hey replace me!
            </SerifText>
            <Button variant="secondaryOutline" onPress={() => this.refineTapped} size="small">
              Refine
            </Button>
          </View>
          <Separator style={{ backgroundColor: separatorColor }} />
        </View>
      </Theme>
    )
  }

  renderStickyHeader = () => {
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: "white" }}>
        <Header sale={this.props.sale} showImage={false} />
      </View>
    )
  }

  renderUserSpecificContent = () => {
    // TODO: Add lot standings.
    return (
      <SaleArtworksGrid
        sale={this.props.sale}
        mapPropsToArtworksConnection={props => props.sale.saleArtworks}
        mapConnectionNodeToArtwork={node => node.artwork}
      />
    )
  }

  /** Callback from the parallax that we have transitioned into the small title mode */
  onChangeHeaderVisibility = (sticky: boolean) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  refineTapped = _button => {
    // Aww yeah
  }

  get commonPadding(): number {
    return isPad ? 40 : 20
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
        stickyHeaderHeight={HeaderHeight}
        renderStickyHeader={this.renderStickyHeader}
        onChangeHeaderVisibility={this.onChangeHeaderVisibility}
        stickyHeaderIndices={[1]}
        renderBodyComponentHeader={this.renderStickyRefineSection}
        parallaxHeaderHeight={this.bannerHeight}
        parallaxHeaderContainerStyles={{ marginBottom: stickyTopMargin }}
      >
        <View style={{ marginTop: 20, paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
          {this.renderUserSpecificContent()}
        </View>
      </ParallaxScrollView>
    )
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
  Sale,
  {
    sale: graphql`
      fragment Sale_sale on Sale {
        slug
        name
        ...Header_sale
        ...SaleArtworksGrid_sale
      }
    `,
  },
  graphql`
    query SaleRefetchQuery($saleID: String!) {
      sale(id: $saleID) {
        ...Sale_sale
      }
    }
  `
)
