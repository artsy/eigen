import { RelatedArtist_artist } from "__generated__/RelatedArtist_artist.graphql"
import { navigate } from "app/navigation/navigate"
import { ClassTheme, Sans, Spacer } from "palette"
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    navigate(this.props.artist.href)
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ width: this.props.imageSize.width }}>
          <ImageView
            style={[this.props.imageSize, { overflow: "hidden", borderRadius: 2 }]}
            imageURL={imageURL}
          />
          <Spacer mb={1} />
          <Sans size="3t" weight="medium">
            {artist.name}
          </Sans>
          <ClassTheme>
            {({ color }) => (
              <Sans size="3t" color={color("black60")}>
                {this.artworksString(artist.counts)}
              </Sans>
            )}
          </ClassTheme>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts: RelatedArtist_artist["counts"]) {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const totalWorks = counts.artworks
      ? // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        counts.artworks + (counts.artworks > 1 ? " works" : " work")
      : null
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    if (totalWorks && counts.forSaleArtworks === counts.artworks) {
      return totalWorks + " for sale"
    }

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
