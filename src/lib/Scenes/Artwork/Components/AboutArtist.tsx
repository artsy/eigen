import { Box, Flex, Sans } from "@artsy/palette"
import { AboutArtist_artwork } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutArtistProps {
  artwork: AboutArtist_artwork
}

export class AboutArtist extends React.Component<AboutArtistProps> {
  render() {
    const hasSingleArtist = this.props.artwork.artists.length === 1

    return (
      <>
        <Flex alignItems="flex-start">
          <Sans size="3t" weight="medium" mb={2}>
            {hasSingleArtist ? "About the artist" : "About the artists"}
          </Sans>
          {this.props.artwork.artists.map(artist => (
            <ArtistListItem key={artist.id} artist={artist} />
          ))}
        </Flex>
        {hasSingleArtist && (
          <Box mt={2}>
            <ReadMore content={this.props.artwork.artists[0].biography_blurb.text} maxChars={140} />
          </Box>
        )}
      </>
    )
  }
}

export const AboutArtistFragmentContainer = createFragmentContainer(AboutArtist, {
  artwork: graphql`
    fragment AboutArtist_artwork on Artwork {
      artists {
        id
        biography_blurb {
          text
        }
        ...ArtistListItem_artist
      }
    }
  `,
})
