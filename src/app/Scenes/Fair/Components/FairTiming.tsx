import { FairTiming_fair$data } from "__generated__/FairTiming_fair.graphql"
import { EventTiming } from "app/Components/EventTiming"
import { WithCurrentTime } from "app/Components/WithCurrentTime"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface FairTimingProps {
  fair: FairTiming_fair$data
}

export const FairTiming: React.FC<FairTimingProps> = ({
  fair: { exhibitionPeriod, startAt, endAt },
}) => {
  return (
    <Box py={1}>
      <Text variant="sm" color="black100">
        {exhibitionPeriod}
      </Text>
      <Text variant="sm" color="black60">
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

export const FairTimingFragmentContainer = createFragmentContainer(FairTiming, {
  fair: graphql`
    fragment FairTiming_fair on Fair {
      exhibitionPeriod(format: SHORT)
      startAt
      endAt
    }
  `,
})
