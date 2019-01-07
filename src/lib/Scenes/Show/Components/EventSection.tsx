import { Sans, Serif, Spacer } from "@artsy/palette"
import { EventSection_event } from "__generated__/EventSection_event.graphql"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  event: EventSection_event
}

export const formatDuration = (startAt, endAt) => {
  const momentStartAt = moment(startAt)
  const momentEndAt = moment(endAt)
  if (momentStartAt.dayOfYear() === momentEndAt.dayOfYear() && momentStartAt.year() === momentEndAt.year()) {
    // duration is a time range within a single day
    return `${momentStartAt.format("dddd, MMMM D")}\n` + `${momentStartAt.format("ha")}-${momentEndAt.format("ha")}`
  } else {
    // duration spans more than one day
    return `${momentStartAt.format("dddd, MMMM D ha")} -\n` + momentEndAt.format("dddd, MMMM D ha")
  }
}

const EventSection: React.SFC<Props> = ({ event: { event_type, description, start_at, end_at } }) => (
  <>
    <Sans size="3t" weight="medium" mb={2}>
      {event_type}
    </Sans>
    <Sans size="3t">{formatDuration(start_at, end_at)}</Sans>
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
