import { Spacer, Flex, Box, Text, LinkText, Join, Screen } from "@artsy/palette-mobile"
import { AboutArtist_artwork$data } from "__generated__/AboutArtist_artwork.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { HTML } from "app/Components/HTML"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { truncateHtml } from "app/utils/truncateHtml"
import { useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface AboutArtistProps {
  artwork: AboutArtist_artwork$data
}

export const AboutArtist: React.FC<AboutArtistProps> = ({ artwork }) => {
  const tracking = useTracking()
  const [expanded, setExpanded] = useState(false)

  const artists = artwork.artists || []

  const hasSingleArtist = artists && artists.length === 1

  const biographyBlurb =
    hasSingleArtist && artists[0]?.biographyBlurb?.text ? artists[0]?.biographyBlurb?.text : null

  const text = biographyBlurb

  const textLimit = truncatedTextLimit()

  if (!artists.length) {
    return null
  }

  const backgroundColor = artwork.isUnlisted ? "mono100" : "mono0"
  const textColor = artwork.isUnlisted ? "mono0" : "mono100"

  const { text: truncatedText, wasTruncated: canExpand } = text
    ? truncateHtml(text, textLimit)
    : { text: undefined, wasTruncated: false }

  const handleExpandPress = () => {
    if (!expanded) {
      tracking.trackEvent({
        action_name: Schema.ActionNames.ReadMore,
        action_type: Schema.ActionTypes.Tap,
        context_module: Schema.ContextModules.ArtistBiography,
        flow: Schema.Flow.AboutTheArtist,
      })
    }
    setExpanded((prev) => !prev)
  }

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
          <HTML
            html={expanded ? text : `${truncatedText}${canExpand ? "... " : ""}`}
            color={textColor}
            variant="sm"
          />
          {!!canExpand && (
            <LinkText
              variant="sm-display"
              color={textColor}
              accessibilityRole="button"
              onPress={handleExpandPress}
            >
              {expanded ? "Read Less" : "Read More"}
            </LinkText>
          )}
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
        biographyBlurb(format: HTML, partnerBio: false) {
          text
        }

        ...ArtistListItem_artist
      }
      isUnlisted
    }
  `,
})
