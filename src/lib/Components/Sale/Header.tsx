import * as React from "react"
import { Dimensions, NativeModules, StyleSheet, Text, TextStyle, View, ViewProperties, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import OpaqueImageView from "../OpaqueImageView"
import Headline from "../Text/Headline"

class Header extends React.Component<RelayProps, {}> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { width, height } = Dimensions.get("window")
    const sale = this.props.sale
    return (
      <View>
        <View style={styles.header}>
          {this.props.showImage
            ? <OpaqueImageView
                // TODO: un-hardcode this (metaphysics isn't resolving sales' cover_image field property.)
                imageURL="https://d32dm0rphc51dk.cloudfront.net/3YueUJ2y1Vwx-YQJ82lG_w/wide.jpg"
                style={{ position: "absolute", top: 0, width, height }}
              />
            : null}
          <Headline style={styles.headline} numberOfLines={2}>
            {sale.name}
          </Headline>
        </View>
      </View>
    )
  }
}

export default createFragmentContainer(
  Header,
  graphql`
    fragment Header_sale on Sale {
      cover_image {
        href
      }
    }
  `
)

const isPad = Dimensions.get("window").width > 700

interface Styles {
  header: TextStyle
  headline: TextStyle
}

const styles = StyleSheet.create<Styles>({
  header: {
    marginTop: 15,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40,
  },
  headline: {
    textAlign: "center",
    fontSize: isPad ? 20 : 14,
  },
})

interface RelayProps {
  sale: {
    _id: string
    id: string
    name: string | null
  }
  showImage: boolean
}
