import { Box, Sans, Serif } from "@artsy/palette"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
  data: []
}

const renderEvents = events => {
  return events.map((event, i) => {
    if (i < 2) {
      return <Event key={event.name} event={event} />
    }
  })
}

export const EventSection: React.SFC<Props> = (props: Props) => {
  const { data } = props
  return (
    <>
      <Box mt={4} mb={2} px={4}>
        <Serif size="8">{props.title}</Serif>
      </Box>
      {renderEvents(data)}
      <Box mt={2} mb={4} px={4}>
        <Sans weight="medium" size="3">
          View all {data.length} {props.title.toLowerCase()}
        </Sans>
      </Box>
    </>
  )
}
