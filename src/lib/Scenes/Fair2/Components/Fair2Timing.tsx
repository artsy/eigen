import { Fair2Timing_fair } from "__generated__/Fair2Timing_fair.graphql"
import { EventTiming } from "lib/Components/EventTiming"
import { WithCurrentTime } from "lib/Components/WithCurrentTime"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Fair2TimingProps {
  fair: Fair2Timing_fair
}

export const Fair2Timing: React.FC<Fair2TimingProps> = ({ fair: { exhibitionPeriod, startAt, endAt } }) => {
  return (
    <Box py={1}>
      <Text variant="mediumText" color="black100">
        {exhibitionPeriod}
      </Text>
      <Text variant="text" color="black60">
        <WithCurrentTime syncWithServer>
          {(currentTime) => {
            const props = {
              currentTime,
              startAt,
              endAt,
            }
            return <EventTiming {...props} />
          }}
        </WithCurrentTime>
      </Text>
    </Box>
  )
}

export const Fair2TimingFragmentContainer = createFragmentContainer(Fair2Timing, {
  fair: graphql`
    fragment Fair2Timing_fair on Fair {
      exhibitionPeriod
      startAt
      endAt
    }
  `,
})
