import { Image, Spacer, Text } from "@artsy/palette-mobile"
import { RelatedArtist_artist$data } from "__generated__/RelatedArtist_artist.graphql"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { navigate } from "app/system/navigation/navigate"
import { Component } from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artist: RelatedArtist_artist$data
  imageSize: {
    height: number
    width: number
  }
}

class RelatedArtist extends Component<Props> {
  handleTap() {
    if (this.props.artist.href) {
      navigate(this.props.artist.href)
    }
  }

  render() {
    const artist = this.props.artist

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ width: this.props.imageSize.width }}>
          {!!artist.coverArtwork?.image?.url && (
            <Image
              height={this.props.imageSize.height}
              width={this.props.imageSize.width}
              style={[{ overflow: "hidden", borderRadius: 2 }]}
              src={artist.coverArtwork?.image?.url}
            />
          )}
          <Spacer y={1} />
          <Text variant="sm" weight="medium">
            {artist.name}
          </Text>
          <ThemeAwareClassTheme>
            {({ color }) => (
              <Text variant="sm" color={color("mono60")}>
                {this.artworksString(artist.counts)}
              </Text>
            )}
          </ThemeAwareClassTheme>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts: RelatedArtist_artist$data["counts"]) {
    const totalWorks = counts?.artworks
      ? counts.artworks + (counts.artworks > 1 ? " works" : " work")
      : null
    if (totalWorks && counts?.forSaleArtworks === counts?.artworks) {
      return totalWorks + " for sale"
    }

    const forSale = counts?.forSaleArtworks ? counts.forSaleArtworks + " for sale" : null
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
      coverArtwork {
        image {
          url(version: "large")
        }
      }
    }
  `,
})
