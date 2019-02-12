import { Box, Sans, Serif } from "@artsy/palette"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
}

const eventsData = [
  {
    title: "Stillness",
    partnerName: "Novalis Contemporary Art",
    dates: "Mar 18 - Apr 12",
  },
  {
    title: "Stillness",
    partnerName: "Novalis Contemporary Art",
    dates: "Mar 18 - Apr 12",
  },
  {
    title: "Stillness",
    partnerName: "Novalis Contemporary Art",
    dates: "Mar 18 - Apr 12",
  },
  {
    title: "Stillness",
    partnerName: "Novalis Contemporary Art",
    dates: "Mar 18 - Apr 12",
  },
  {
    title: "Stillness",
    partnerName: "Novalis Contemporary Art",
    dates: "Mar 18 - Apr 12",
  },
]

const renderEvents = events => {
  return events.map((event, i) => {
    if (i < 2) {
      return <Event key={i + event.title} event={event} />
    }
  })
}

export const EventSection: React.SFC<Props> = (props: Props) => {
  return (
    <>
      <Box mt={4} mb={2} px={4}>
        <Serif size="8">{props.title}</Serif>
      </Box>
      {renderEvents(eventsData)}
      <Box mt={2} mb={4} px={4}>
        <Sans weight="medium" size="3">
          View all {eventsData.length} {props.title.toLowerCase()}
        </Sans>
      </Box>
    </>
  )
}
