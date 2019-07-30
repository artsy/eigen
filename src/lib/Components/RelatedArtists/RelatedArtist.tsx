import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View } from "react-native"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import ImageView from "../OpaqueImageView/OpaqueImageView"

import { RelatedArtist_artist } from "__generated__/RelatedArtist_artist.graphql"

interface Props {
  artist: RelatedArtist_artist
  imageSize: {
    width: number
  }
}

class RelatedArtist extends Component<Props> {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href)
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ margin: 5, paddingBottom: 20, width: this.props.imageSize.width }}>
          <ImageView style={this.props.imageSize} imageURL={imageURL} />
          <Text style={styles.sansSerifText}>{artist.name.toUpperCase()}</Text>
          <Text style={styles.serifText}>{this.artworksString(artist.counts)}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts) {
    if (counts.totalWorks <= 0) {
      return ""
    }

    const totalWorks = counts.artworks ? counts.artworks + (counts.artworks > 1 ? " works" : " work") : null
    if (totalWorks && counts.for_sale_artworks === counts.artworks) {
      return totalWorks + " for sale"
    }

    const forSale = counts.for_sale_artworks ? counts.for_sale_artworks + " for sale" : null
    if (forSale && totalWorks) {
      return totalWorks + ", " + forSale
    }
    return forSale ? forSale : totalWorks
  }
}

interface Styles {
  sansSerifText: TextStyle
  serifText: TextStyle
}

const styles = StyleSheet.create<Styles>({
  sansSerifText: {
    fontSize: 12,
    textAlign: "left",
    marginTop: 10,
    fontFamily: fonts["avant-garde-regular"],
  },
  serifText: {
    fontFamily: "AGaramondPro-Regular",
    fontSize: 16,
    marginTop: 5,
    color: colors["gray-semibold"],
  },
})

export default createFragmentContainer(RelatedArtist, {
  artist: graphql`
    fragment RelatedArtist_artist on Artist {
      href
      name
      counts {
        for_sale_artworks
        artworks
      }
      image {
        url(version: "large")
      }
    }
  `,
})
