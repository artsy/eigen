import { Sans, Serif, Spacer } from "@artsy/palette"
import { EventSection_event } from "__generated__/EventSection_event.graphql"
import { dateRange } from "lib/utils/dateFormatter"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  event: EventSection_event
}

const EventSection: React.SFC<Props> = ({ event: { event_type, description, start_at, end_at } }) => (
  <>
    <Sans size="3t" weight="medium" mb={2}>
      {event_type}
    </Sans>
    <Sans size="3t">{dateRange(start_at, end_at)}</Sans>
    {description && (
      <>
        <Spacer m={1} />
        <Serif size="3t">{description}</Serif>
      </>
    )}
  </>
)

export const EventSectionContainer = createFragmentContainer(
  EventSection,
  graphql`
    fragment EventSection_event on PartnerShowEventType {
      event_type
      description
      start_at
      end_at
    }
  `
)
