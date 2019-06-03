import { Flex, Sans } from "@artsy/palette"
import { AboutArtist_artwork } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutArtistProps {
  artwork: AboutArtist_artwork
}

export class AboutArtist extends React.Component<AboutArtistProps> {
  render() {
    return (
      <Flex alignItems="flex-start" mt={2}>
        <Sans size="4t" weight="medium" mb={2}>
          About the artist
        </Sans>
        <ArtistListItem artist={this.props.artwork.artist} />
      </Flex>
    )
  }
}

export const AboutArtistFragmentContainer = createFragmentContainer(AboutArtist, {
  artwork: graphql`
    fragment AboutArtist_artwork on Artwork {
      artist {
        ...ArtistListItem_artist
      }
    }
  `,
})
