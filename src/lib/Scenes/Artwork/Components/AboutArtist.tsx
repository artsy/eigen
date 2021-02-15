import { AboutArtist_artwork } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { Box, Flex, Join, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutArtistProps {
  artwork: AboutArtist_artwork
}

export class AboutArtist extends React.Component<AboutArtistProps> {
  render() {
    const {
      artwork: { artists },
    } = this.props
    const hasSingleArtist = artists && artists.length === 1
    const text =
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      hasSingleArtist && artists[0].biography_blurb && artists[0].biography_blurb.text
        ? artists! /* STRICTNESS_MIGRATION */[0]! /* STRICTNESS_MIGRATION */.biography_blurb.text
        : null
    const textLimit = truncatedTextLimit()

    return (
      <>
        <Flex alignItems="flex-start">
          <Sans size="4t" mb="2">
            {hasSingleArtist ? "About the artist" : "About the artists"}
          </Sans>
          <Join separator={<Spacer my="1" />}>
            {artists! /* STRICTNESS_MIGRATION */
              .map((artist) => (
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                <ArtistListItem key={artist.id} artist={artist} contextModule={Schema.ContextModules.AboutTheArtist} />
              ))}
          </Join>
        </Flex>
        {hasSingleArtist && text && (
          <Box mt="2">
            <ReadMore
              content={text}
              contextModule={Schema.ContextModules.ArtistBiography}
              maxChars={textLimit}
              textStyle="sans"
              trackingFlow={Schema.Flow.AboutTheArtist}
            />
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
        biography_blurb: biographyBlurb {
          text
        }
        ...ArtistListItem_artist
      }
    }
  `,
})
