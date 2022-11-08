import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { Schema } from "app/utils/track"
import { Flex, Text } from "palette"
import { useState } from "react"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
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

  if (!href) {
    return <Text variant="lg-display">{artistName}</Text>
  }

  return (
    <TouchableWithoutFeedback
      accessibilityRole="link"
      accessibilityHint="Go to artist page"
      onPress={() => handleArtistTap(href)}
    >
      <Text variant="lg-display">{artistName}</Text>
    </TouchableWithoutFeedback>
  )
}

interface ArtworkMultipleMakersProps {
  artists: ArtworkTombstone_artwork$data["artists"]
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
  artists: ArtworkTombstone_artwork$data["artists"]
  culturalMaker: ArtworkTombstone_artwork$data["culturalMaker"]
}

export const ArtworkMakerTitle: React.FC<ComponentProps> = ({ artists, culturalMaker }) => {
  if (artists?.length === 1) {
    return <ArtworkMaker artistName={artists[0]!.name!} href={artists[0]!.href!} />
  }

  if (!!artists && artists?.length > 1) {
    return <ArtworkMultipleMakers artists={artists} />
  }

  if (artists?.length === 0 && !!culturalMaker) {
    return <ArtworkMaker artistName={culturalMaker} />
  }

  return null
}
