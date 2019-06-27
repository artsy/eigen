import { Box, Serif } from "@artsy/palette"
import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork
}

export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  renderConsignmentsLine(artistsCount) {
    return (
      <Serif size="3t" color="black60">
        Want to sell a work by {artistsCount === 1 ? "this artist" : "these artists"}?{" "}
        <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleTap("/consign/info")}>
          Consign with Artsy.
        </Text>
      </Serif>
    )
  }

  render() {
    const { artwork } = this.props
    const consignableArtistsCount = artwork.artists.filter(artist => artist.is_consignable).length

    return <Box mt={1}>{!!consignableArtistsCount && this.renderConsignmentsLine(consignableArtistsCount)}</Box>
  }
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      artists {
        is_consignable
      }
    }
  `,
})
