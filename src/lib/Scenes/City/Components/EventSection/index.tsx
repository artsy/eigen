import { Box, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"
import { RelayProp } from "react-relay"

export interface Props {
  title: string
  relay: RelayProp
  data: any
  section: string
  citySlug: string
}

export class EventSection extends React.Component<Props> {
  viewAllPressed = () => {
    const { citySlug, section } = this.props
    SwitchBoard.presentNavigationViewController(this, `/city/${citySlug}/${section}`)
  }

  renderEvents = () => {
    const { data } = this.props
    let finalShowsForPreviewBricks
    const eligibleForBrick = data.filter(s => !s.isStubShow && !!s.cover_image && !!s.cover_image.url)
    finalShowsForPreviewBricks = eligibleForBrick.slice(0, 2)

    if (!!finalShowsForPreviewBricks) {
      return finalShowsForPreviewBricks.map(event => {
        return (
          <Box key={event.id}>
            <Event event={event} relay={this.props.relay} />
          </Box>
        )
      })
    }
  }

  render() {
    const { data, title } = this.props
    return (
      <>
        <Box my={2} px={2}>
          <Serif size="8">{title}</Serif>
        </Box>
        {this.renderEvents()}
        {data.length > 2 && (
          <Box px={2} mb={2}>
            <CaretButton onPress={() => this.viewAllPressed()} text={`View all ${data.length} shows`} />
          </Box>
        )}
      </>
    )
  }
}
