import { Box, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
  data: any
}

const renderEvents = events => {
  return events.map((event, i) => {
    if (i < 2) {
      return (
        <Box key={i}>
          <Event event={event} />
        </Box>
      )
    }
  })
}

const viewAllPressed = () => {
  // FIXME: Open city list view
  console.log("All pressed")
}

export const EventSection: React.SFC<Props> = (props: Props) => {
  const { data } = props
  return (
    <>
      <Box my={2} px={2}>
        <Serif size="8">{props.title}</Serif>
      </Box>
      {renderEvents(data)}
      <Box px={2} mb={2}>
        <CaretButton onPress={() => viewAllPressed()} text={`View all ${data.length} shows`} />
      </Box>
    </>
  )
}
