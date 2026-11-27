import { Flex, Text } from "@artsy/palette-mobile"
import { ArtistPullQuote_artist$key } from "__generated__/ArtistPullQuote_artist.graphql"
import React from "react"
import { graphql, useFragment } from "react-relay"

interface ArtistPullQuoteProps {
  artist: ArtistPullQuote_artist$key
}

export const ArtistPullQuote: React.FC<ArtistPullQuoteProps> = ({ artist }) => {
  const data = useFragment(fragment, artist)

  const { text, attribution } = data.featuredStory?.pullQuote ?? {}
  const trimmedText = text?.trim()
  const trimmedAttribution = attribution?.trim()

  if (!trimmedText) {
    return null
  }

  return (
    <Flex mb={2}>
      <Text variant="xl">{`“${trimmedText}”`}</Text>
      {!!trimmedAttribution && (
        <Text variant="xs" color="mono60" mt={1}>
          {trimmedAttribution}
        </Text>
      )}
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtistPullQuote_artist on Artist {
    featuredStory {
      pullQuote {
        text
        attribution
      }
    }
  }
`
