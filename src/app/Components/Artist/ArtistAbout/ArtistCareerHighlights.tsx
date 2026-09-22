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

  const allInsights = (data.insights ?? []).filter(isRenderableArtistInsight)

  if (allInsights.length === 0) {
    return null
  }

  const insights =
    allInsights.length > 4
      ? allInsights.slice(allInsights.length / 2, allInsights.length)
      : allInsights

  return (
    <Flex px={2}>
      <Text color="mono60" pb={1}>
        Highlights and Achievements
      </Text>
      {insights.map(({ description, entities, label }, index) => {
        return (
          <Expandable label={label} key={`expandable-highlight-${index}`}>
            <Text color="mono60" my={1}>
              {entities.length > 0 ? formatList(entities) : description}
            </Text>
          </Expandable>
        )
      })}
    </Flex>
  )
}

const formatList = (entities: readonly string[]) => {
  if (entities.length === 0) return ""
  if (entities.length === 1) return entities[0]
  if (entities.length === 2) return entities.join(" and ")
  return entities.slice(0, -1).join(", ") + ", and " + entities[entities.length - 1]
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

// An insight only renders if it has a description or at least one entity.
// Both the parent and this component must filter on this so as to correctly
// show/hide the entire section, as well as individual insights.
export const isRenderableArtistInsight = (insight: {
  description?: string | null
  entities?: readonly string[] | null
}): boolean => {
  return !!insight.description || (insight.entities?.length ?? 0) > 0
}
