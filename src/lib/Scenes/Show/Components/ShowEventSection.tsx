import { Sans, Serif, Spacer } from "@artsy/palette"
import { ShowEventSection_event } from "__generated__/ShowEventSection_event.graphql"
import moment from "moment"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  event: ShowEventSection_event
}

const formatTime = (startAt, endAt) => {
  const startMoment = moment(startAt)
  const endMoment = moment(endAt)
  const dayFormat = "dddd"
  let monthFormat = "MMMM D"

  const startHour = startMoment.format("ha")
  const endHour = endMoment.format("ha")

  if (startMoment.year() !== endMoment.year()) {
    // Adds years if the dates are not the same year
    monthFormat = monthFormat.concat(", YYYY")
  }

  if (startMoment.dayOfYear() === endMoment.dayOfYear() && startMoment.year() === endMoment.year()) {
    // Duration is the same day
    return (
      <>
        <Sans size="3t">{`${endMoment.format(dayFormat)}, ${endMoment.format(monthFormat)}`}</Sans>
        <Sans size="3t">{`${startHour} – ${endHour}`}</Sans>
      </>
    )
  } else {
    // Show date range if not the same day
    return (
      <>
        <Sans size="3t">{`${startMoment.format(dayFormat)}, ${startMoment.format(monthFormat)}, ${startHour} –`}</Sans>
        <Sans size="3t">{`${endMoment.format(dayFormat)}, ${endMoment.format(monthFormat)}, ${endHour}`}</Sans>
      </>
    )
  }
}

const ShowEventSection: React.SFC<Props> = ({ event: { start_at, end_at, event_type, description } }) => (
  <>
    <Sans size="3t" weight="medium" mb={2}>
      {event_type}
    </Sans>
    {start_at && end_at && formatTime(start_at, end_at)}
    {description && (
      <>
        <Spacer m={1} />
        <Serif size="3t">{description}</Serif>
      </>
    )}
  </>
)

export const ShowEventSectionContainer = createFragmentContainer(
  ShowEventSection,
  graphql`
    fragment ShowEventSection_event on PartnerShowEventType {
      event_type
      description
      start_at
      end_at
    }
  `
)
