import { Show2LocationHours_location } from "__generated__/Show2LocationHours_location.graphql"
import { Markdown } from "lib/Components/Markdown"
import { defaultRules } from "lib/utils/renderMarkdown"
import { Box, BoxProps, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

const MARKDOWN_RULES = defaultRules({ useNewTextStyles: true })

interface Show2LocationHours extends BoxProps {
  location: Show2LocationHours_location
}

const Show2LocationHours: React.FC<Show2LocationHours> = ({ location: { openingHours }, ...rest }) => {
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
            <Text variant="text">{[schedule.days, schedule.hours].filter(Boolean).join(", ")}</Text>
          </Box>
        )
      })}
    </Box>
  )
}

export const Show2LocationHoursFragmentContainer = createFragmentContainer(Show2LocationHours, {
  location: graphql`
    fragment Show2LocationHours_location on Location {
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
