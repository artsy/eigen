import { ChevronIcon, Collapse, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ArtistCareerHighlights_artist$key } from "__generated__/ArtistCareerHighlights_artist.graphql"
import { MAX_WIDTH } from "app/Components/Artist/Biography"
import { MotiView } from "moti"
import React, { useState } from "react"
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
    <>
      <Text color="black60" pb={1}>
        Highlights and Achievements
      </Text>
      {insights.map(({ description, entities, label }, index) => {
        return (
          <Expandable label={label} key={`expandable-highlight-${index}`}>
            <Text color="black60" my={1}>
              {entities.length > 0
                ? entities.join(", ").replace(/,\s([^,]+)$/, ", and $1")
                : description}
            </Text>
          </Expandable>
        )
      })}
    </>
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

interface ExpandableProps {
  label?: string
  expanded?: boolean
  children: React.ReactNode
}

const Expandable: React.FC<ExpandableProps> = ({ children, expanded: propExpanded, label }) => {
  const [expanded, setExpanded] = useState(propExpanded)

  const handleToggle = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <Flex borderTopWidth={1} py={1} accessibilityHint="Toggles the accordion" maxWidth={MAX_WIDTH}>
      <Touchable
        onPress={handleToggle}
        accessibilityRole="togglebutton"
        accessibilityLabel={label}
        accessibilityState={{ expanded }}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="sm">{label}</Text>

          <MotiView
            animate={{ transform: [{ rotate: !!expanded ? "-90deg" : "90deg" }] }}
            style={{ transform: [{ rotate: !!expanded ? "-90deg" : "90deg" }] }}
            transition={{ type: "timing" }}
          >
            <ChevronIcon />
          </MotiView>
        </Flex>
      </Touchable>

      <Collapse opened={!!expanded}>{children}</Collapse>
    </Flex>
  )
}
