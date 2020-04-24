import { color, Sans, Serif, Spacer } from "@artsy/palette"
import { RelatedArtist_artist } from "__generated__/RelatedArtist_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import ImageView from "../OpaqueImageView/OpaqueImageView"

interface Props {
  artist: RelatedArtist_artist
  imageSize: {
    width: number
  }
}

class RelatedArtist extends Component<Props> {
  handleTap() {
    // @ts-ignore STRICTNESS_MIGRATION
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href)
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ margin: 5, paddingBottom: 20, width: this.props.imageSize.width }}>
          <ImageView
            style={this.props.imageSize}
            // @ts-ignore STRICTNESS_MIGRATION
            imageURL={imageURL}
          />
          <Spacer mb={0.5} />
          <Sans size="2">{artist.name}</Sans>
          <Serif size="2" color={color("black60")}>
            {this.artworksString(artist.counts)}
          </Serif>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts: RelatedArtist_artist["counts"]) {
    // @ts-ignore STRICTNESS_MIGRATION
    const totalWorks = counts.artworks ? counts.artworks + (counts.artworks > 1 ? " works" : " work") : null
    // @ts-ignore STRICTNESS_MIGRATION
    if (totalWorks && counts.forSaleArtworks === counts.artworks) {
      return totalWorks + " for sale"
    }

    // @ts-ignore STRICTNESS_MIGRATION
    const forSale = counts.forSaleArtworks ? counts.forSaleArtworks + " for sale" : null
    if (forSale && totalWorks) {
      return totalWorks + ", " + forSale
    }
    return forSale ? forSale : totalWorks
  }
}

export default createFragmentContainer(RelatedArtist, {
  artist: graphql`
    fragment RelatedArtist_artist on Artist {
      href
      name
      counts {
        forSaleArtworks
        artworks
      }
      image {
        url(version: "large")
      }
    }
  `,
})
