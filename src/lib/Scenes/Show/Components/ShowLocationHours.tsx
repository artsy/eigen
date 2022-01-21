import { ShowLocationHours_location } from "__generated__/ShowLocationHours_location.graphql"
import { Markdown } from "lib/Components/Markdown"
import { defaultRules } from "lib/utils/renderMarkdown"
import { Box, BoxProps, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

const MARKDOWN_RULES = defaultRules({ useNewTextStyles: true })

interface ShowLocationHours extends BoxProps {
  location: ShowLocationHours_location
}

const ShowLocationHours: React.FC<ShowLocationHours> = ({
  location: { openingHours },
  ...rest
}) => {
  if (!openingHours?.text && !openingHours?.schedules) {
    return null
  }

  if (!!openingHours.text) {
    return (
      <Box {...rest}>
        <Markdown rules={MARKDOWN_RULES}>{openingHours.text}</Markdown>
      </Box>
    )
  }

  return (
    <Box {...rest}>
      {(openingHours?.schedules ?? []).map((schedule, i) => {
        if (!schedule) {
          return null
        }

        return (
          <Box key={i}>
            <Text variant="sm">{[schedule.days, schedule.hours].filter(Boolean).join(", ")}</Text>
          </Box>
        )
      })}
    </Box>
  )
}

export const ShowLocationHoursFragmentContainer = createFragmentContainer(ShowLocationHours, {
  location: graphql`
    fragment ShowLocationHours_location on Location {
      openingHours {
        ... on OpeningHoursArray {
          schedules {
            days
            hours
          }
        }
        ... on OpeningHoursText {
          text
        }
      }
    }
  `,
})
