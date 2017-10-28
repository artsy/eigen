import * as React from "react"
import { Dimensions, StyleSheet, View, ViewProperties, ViewStyle } from "react-native"
import ParallaxScrollView from "react-native-parallax-scroll-view"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import { GhostButton } from "../Components/Buttons"
import Header from "../Components/Sale/Header"
import SaleArtworksGrid from "../Components/ArtworkGrids/RelayConnections/SaleArtworksGrid"
import Separator from "../Components/Separator"
import SerifText from "../Components/Text/Serif"

const isPad = Dimensions.get("window").width > 700
const HeaderHeight = 64

interface Props extends ViewProperties {
  sale: any
}

interface State {
  showingStickyHeader: boolean
}

export class Sale extends React.Component<Props, State> {
  foregroundHeight: number = 200

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
        <Header sale={this.props.sale} />
      </View>
    )
  }

  renderStickyRefineSection() {
    return <View />
    // console.log(this.state)
    // const topMargin = this.state.showingStickyHeader ? 0 : HeaderHeight
    // const separatorColor = this.state.showingStickyHeader ? "white" : colors["gray-regular"]

    // const refineButtonWidth = 80
    // const maxLabelWidth = Dimensions.get("window").width - this.commonPadding * 2 - refineButtonWidth - 10

    // return (
    //   <View style={{ backgroundColor: "white" }}>
    //     <Separator style={{ marginTop: topMargin, backgroundColor: separatorColor }} />
    //     <View style={[styles.refineContainer, { paddingLeft: this.commonPadding, paddingRight: this.commonPadding }]}>
    //       <SerifText style={{ fontStyle: "italic", marginTop: 2, maxWidth: maxLabelWidth }}>Hey replace me!</SerifText>
    //       <GhostButton text="REFINE" style={{ height: 26, width: refineButtonWidth }} onPress={this.refineTapped} />
    //     </View>
    //     <Separator style={{ backgroundColor: separatorColor }} />
    //   </View>
    // )
  }

  renderStickyHeader = () => {
    const commonPadding = this.commonPadding
    return (
      <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding, backgroundColor: "white" }}>
        <Header sale={this.props.sale} />
      </View>
    )
  }

  /** Callback from the parallax that we have transitioned into the small title mode */
  onChangeHeaderVisibility = (sticky: boolean) => {
    if (this.state.showingStickyHeader !== sticky) {
      // Set the state so we can change the margins on the refine section
      this.setState({ showingStickyHeader: sticky })
    }
  }

  refineTapped = button => {
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
        parallaxHeaderHeight={this.foregroundHeight}
        parallaxHeaderContainerStyles={{ marginBottom: stickyTopMargin }}
      >
        <View style={{ marginTop: 20, paddingLeft: this.commonPadding, paddingRight: this.commonPadding }}>
          <SaleArtworksGrid sale={this.props.sale} queryKey="gene.artworks" />
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
  graphql.experimental`
    fragment Sale_sale on Sale {
      id
      name
      ...Header_sale
      ...SaleArtworksGrid_saleArtworks
    }
  `,
  graphql.experimental`
    query SaleRefetchQuery($saleID: String!) {
      sale(id: $saleID) {
        ...Sale_sale
      }
    }
  `
)
