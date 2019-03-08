import { Sans, Serif, Spacer } from "@artsy/palette"
import { EventSection_event } from "__generated__/EventSection_event.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  event: EventSection_event
}

const EventSection: React.SFC<Props> = ({ event: { exhibitionPeriod, event_type, description } }) => (
  <>
    <Sans size="3t" weight="medium" mb={2}>
      {event_type}
    </Sans>
    {exhibitionPeriod && <Sans size="3t">{exhibitionPeriod}</Sans>}
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
      exhibitionPeriod
    }
  `
)
