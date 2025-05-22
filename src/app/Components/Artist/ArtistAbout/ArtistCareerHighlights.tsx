import { Flex, Text } from "@artsy/palette-mobile"
import { ArtistCareerHighlights_artist$key } from "__generated__/ArtistCareerHighlights_artist.graphql"
import { Expandable } from "app/Components/Expandable"
import React from "react"
import { graphql, useFragment } from "react-relay"

interface ArtistCareerHighlightsProps {
  artist: ArtistCareerHighlights_artist$key
}

export const ArtistCareerHighlights: React.FC<ArtistCareerHighlightsProps> = ({ artist }) => {
  const data = useFragment(fragment, artist)

  if (!data || data.insights.length === 0) {
    return null
  }

  const insights =
    data.insights.length > 4
      ? data.insights.slice(data.insights.length / 2, data.insights.length)
      : data.insights

  return (
    <Flex px={2}>
      <Text color="mono60" pb={1}>
        Highlights and Achievements
      </Text>
      {insights.map(({ description, entities, label }, index) => {
        return (
          <Expandable label={label} key={`expandable-highlight-${index}`}>
            <Text color="mono60" my={1}>
              {entities.length > 0
                ? entities.join(", ").replace(/,\s([^,]+)$/, ", and $1")
                : description}
            </Text>
          </Expandable>
        )
      })}
    </Flex>
  )
}

const fragment = graphql`
  fragment ArtistCareerHighlights_artist on Artist {
    insights {
      entities
      description
      label
      kind
    }
  }
`
