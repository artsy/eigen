import { Spacer, Flex, Box, Text, Join, Screen } from "@artsy/palette-mobile"
import { AboutArtist_artwork$data } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutArtistProps {
  artwork: AboutArtist_artwork$data
}

export const AboutArtist: React.FC<AboutArtistProps> = ({ artwork }) => {
  const artists = artwork.artists || []

  const hasSingleArtist = artists && artists.length === 1

  const biographyBlurb =
    hasSingleArtist && artists[0]?.biographyBlurb?.text ? artists[0]?.biographyBlurb?.text : null

  const text = biographyBlurb

  const textLimit = truncatedTextLimit()

  if (!artists.length) {
    return null
  }

  const backgroundColor = artwork.isUnlisted ? "black100" : "white100"
  const textColor = artwork.isUnlisted ? "white100" : "black100"

  return (
    <Screen.FullWidthItem p={2} backgroundColor={backgroundColor}>
      <Flex alignItems="flex-start">
        <Text variant="md" mb={2} color={textColor}>
          {hasSingleArtist ? "About the artist" : "About the artists"}
        </Text>
        <Join separator={<Spacer y={1} />}>
          {artists.map(
            (artist) =>
              !!artist && (
                <ArtistListItem
                  key={artist.id}
                  artist={artist}
                  contextModule={Schema.ContextModules.AboutTheArtist}
                  theme={artwork.isUnlisted ? "dark" : "light"}
                />
              )
          )}
        </Join>
      </Flex>
      {!!hasSingleArtist && !!text && !!artwork.displayArtistBio && (
        <Box mt={2} mb={artwork.isUnlisted ? 1 : 0}>
          <ReadMore
            content={text}
            contextModule={Schema.ContextModules.ArtistBiography}
            maxChars={textLimit}
            textStyle="new"
            trackingFlow={Schema.Flow.AboutTheArtist}
            textVariant="sm"
            linkTextVariant="sm-display"
            color={textColor}
          />
        </Box>
      )}
    </Screen.FullWidthItem>
  )
}

export const AboutArtistFragmentContainer = createFragmentContainer(AboutArtist, {
  artwork: graphql`
    fragment AboutArtist_artwork on Artwork {
      displayArtistBio
      artists(shallow: true) {
        id
        biographyBlurb {
          text
        }

        ...ArtistListItem_artist
      }
      artist(shallow: true) {
        partnerBiographyBlurb {
          text
        }
      }
      isUnlisted
    }
  `,
})
