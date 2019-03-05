import { Box, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
  data: any
}

export class EventSection extends React.Component<Props> {
  viewAllPressed = () => {
    // FIXME: Open city list view
    console.log("All pressed")
  }

  renderEvents = () => {
    const { data } = this.props
    return data.map((event, i) => {
      if (i < 2) {
        return (
          <Box key={event.id}>
            <Event event={event} />
          </Box>
        )
      }
    })
  }

  render() {
    const { data, title } = this.props
    return (
      <>
        <Box my={2} px={2}>
          <Serif size="8">{title}</Serif>
        </Box>
        {this.renderEvents()}
        <Box px={2} mb={2}>
          <CaretButton onPress={() => this.viewAllPressed()} text={`View all ${data.length} shows`} />
        </Box>
      </>
    )
  }
}
