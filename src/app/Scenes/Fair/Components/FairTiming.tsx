import { Flex, Text } from "@artsy/palette-mobile"
import { FairTiming_fair$data } from "__generated__/FairTiming_fair.graphql"
import { EventTiming } from "app/Components/EventTiming"
import { WithCurrentTime } from "app/Components/WithCurrentTime"
import { createFragmentContainer, graphql } from "react-relay"

interface FairTimingProps {
  fair: FairTiming_fair$data
}

export const FairTiming: React.FC<FairTimingProps> = ({
  fair: { exhibitionPeriod, startAt, endAt },
}) => {
  return (
    <Flex>
      <Text variant="sm" color="mono100">
        {exhibitionPeriod}
      </Text>
      <Text variant="sm" color="mono60">
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
    </Flex>
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
