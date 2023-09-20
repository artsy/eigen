import { Spacer, Flex, Box, Text, Join, Button } from "@artsy/palette-mobile"
import { AboutArtist_artwork$data } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { truncatedTextLimit } from "app/utils/hardware"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutArtistProps {
  artwork: AboutArtist_artwork$data
}

export const AboutArtist: React.FC<AboutArtistProps> = ({ artwork }) => {
  const artists = artwork.artists || []

  const hasSingleArtist = artists && artists.length === 1

  const text =
    hasSingleArtist && artists[0]?.biographyBlurb?.text ? artists[0]?.biographyBlurb?.text : null
  const textLimit = truncatedTextLimit()

  const shouldShowNewArtistBio = useFeatureFlag("AREnableNewArtistBio")

  return (
    <>
      <Flex alignItems="flex-start">
        <Text variant="md" mb={2}>
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
                />
              )
          )}
        </Join>
      </Flex>
      {!!hasSingleArtist &&
        !!text &&
        (shouldShowNewArtistBio ? (
          <Box mt={2}>
            <Button
              block
              onPress={() => {
                const artist = artists[0]
                if (artist?.slug) {
                  navigate("/artist/" + artist.slug + "/bio")
                }
              }}
            >
              Artist Bio
            </Button>
          </Box>
        ) : (
          <Box mt={2}>
            <ReadMore
              content={text}
              contextModule={Schema.ContextModules.ArtistBiography}
              maxChars={textLimit}
              textStyle="new"
              trackingFlow={Schema.Flow.AboutTheArtist}
              textVariant="sm"
              linkTextVariant="sm-display"
            />
          </Box>
        ))}
    </>
  )
}

export const AboutArtistFragmentContainer = createFragmentContainer(AboutArtist, {
  artwork: graphql`
    fragment AboutArtist_artwork on Artwork {
      artists {
        id
        slug
        biographyBlurb {
          text
        }
        ...ArtistListItem_artist
      }
    }
  `,
})
