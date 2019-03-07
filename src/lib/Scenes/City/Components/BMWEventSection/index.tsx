import { Box, color, Sans, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
  data: any
  sponsoredContent: { introText: string; artGuideUrl: string }
}

export class BMWEventSection extends React.Component<Props> {
  renderEvents = events => {
    return events.map((event, i) => {
      if (i < 2) {
        return (
          <Box key={i} mb={1}>
            <Event event={event} />
          </Box>
        )
      }
    })
  }

  getArtGuidePressed = artGuideUrl => {
    SwitchBoard.presentNavigationViewController(this, artGuideUrl)
  }

  viewAllBmwShows = () => {
    // FIXME: link to all BMW shows
    console.log("viewAllBmwShows")
  }

  render() {
    const {
      data,
      sponsoredContent: { introText, artGuideUrl },
    } = this.props
    return (
      <>
        <Box my={2} px={2}>
          <Serif size="8">{this.props.title}</Serif>
        </Box>
        <Box mb={2} px={2}>
          <Sans weight="medium" size="3">
            Presented by BMW
          </Sans>
          <Box mt={1}>
            <Serif size="3" color={color("black60")}>
              {introText}
            </Serif>
          </Box>
        </Box>
        <Box mb={3} px={2}>
          <CaretButton onPress={() => this.getArtGuidePressed(artGuideUrl)} text="Get the BMW Art Guide" />
        </Box>
        {this.renderEvents(data)}
        {data.length > 2 && (
          <Box px={2} mb={2}>
            <Sans weight="medium" size="3">
              <CaretButton onPress={() => this.viewAllBmwShows()} text={`View all ${data.length} shows`} />
            </Sans>
          </Box>
        )}
      </>
    )
  }
}
