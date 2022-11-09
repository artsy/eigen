import { ArtworkMakerTitle_artwork$data } from "__generated__/ArtworkMakerTitle_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Schema } from "app/utils/track"
import { Flex, Text } from "palette"
import { useState } from "react"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworkMakerProps {
  artistName: string
  href?: string | null
}

const ArtworkMaker: React.FC<ArtworkMakerProps> = ({ artistName, href }) => {
  const { trackEvent } = useTracking()

  const handleArtistTap = (artistHref: string) => {
    if (!artistHref) {
      return
    }

    trackEvent({
      action_name: Schema.ActionNames.ArtistName,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkTombstone,
    })

    navigate(artistHref)
  }

  return (
    <TouchableWithoutFeedback
      accessibilityRole="link"
      accessibilityHint="Go to artist page"
      disabled={!href}
      onPress={() => handleArtistTap(href!)}
    >
      <Text variant="lg-display">{artistName}</Text>
    </TouchableWithoutFeedback>
  )
}

interface ArtworkMultipleMakersProps {
  artists: ArtworkMakerTitle_artwork$data["artists"]
}

const ArtworkMultipleMakers: React.FC<ArtworkMultipleMakersProps> = ({ artists }) => {
  const [showMoreArtists, setShowMoreArtists] = useState(false)

  const toggleShowMoreArtists = () => {
    setShowMoreArtists((current) => !current)
  }

  const truncatedArtists = !showMoreArtists ? artists?.slice(0, 3) : artists

  const artistNames = truncatedArtists?.map((artist, index) => {
    const artistNameWithComma = index !== artists!.length - 1 ? artist!.name + ", " : artist!.name!

    return <ArtworkMaker key={artist!.href} artistName={artistNameWithComma} href={artist!.href} />
  })

  return (
    <Flex flexDirection="row" flexWrap="wrap">
      <Text variant="lg-display">
        {artistNames}
        {!showMoreArtists && artists!.length > 3 && (
          <TouchableWithoutFeedback
            accessibilityRole="togglebutton"
            accessibilityHint={!showMoreArtists ? "Show more artists" : "Show less artists"}
            onPress={toggleShowMoreArtists}
          >
            <Text variant="lg-display">{artists!.length - 3} more</Text>
          </TouchableWithoutFeedback>
        )}
      </Text>
    </Flex>
  )
}

interface ComponentProps {
  artwork: ArtworkMakerTitle_artwork$data
}

export const ArtworkMakerTitle: React.FC<ComponentProps> = ({ artwork }) => {
  const { artists, culturalMaker } = artwork

  if (artists?.length === 0 && !!culturalMaker) {
    return <ArtworkMaker artistName={culturalMaker} />
  }

  if (artists?.length === 1) {
    return <ArtworkMaker artistName={artists[0]!.name!} href={artists[0]!.href!} />
  }

  if (!!artists && artists?.length > 1) {
    return <ArtworkMultipleMakers artists={artists} />
  }

  return null
}

const artworkMakerTitleFragment = graphql`
  fragment ArtworkMakerTitle_artwork on Artwork {
    culturalMaker
    artists {
      name
      href
    }
  }
`

export const ArtworkMakerTitleFragmentContainer = createFragmentContainer(ArtworkMakerTitle, {
  artwork: artworkMakerTitleFragment,
})
