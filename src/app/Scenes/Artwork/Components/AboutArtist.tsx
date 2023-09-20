import { Spacer, Flex, Box, Text, Join, Button } from "@artsy/palette-mobile"
import { AboutArtist_artwork$data } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { navigate } from "app/system/navigation/navigate"
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
      {!!hasSingleArtist && !!text && (
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
            See Artist Bio
          </Button>
        </Box>
      )}
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
