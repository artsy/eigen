import { Box, Text } from "@artsy/palette-mobile"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { Event } from "app/Scenes/City/Components/Event/Event"
import { navigate } from "app/system/navigation/navigate"
import React from "react"

export interface Props {
  title: string
  data: any
  section: string
  citySlug: string
}

export class EventSection extends React.Component<Props> {
  viewAllPressed = () => {
    const { citySlug, section } = this.props
    navigate(`/city/${citySlug}/${section}`)
  }

  renderEvents = () => {
    const { data } = this.props
    const eligibleForBrick = data.filter(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      (s) => !s.isStubShow && !!s.cover_image && !!s.cover_image.url
    )
    const finalShowsForPreviewBricks = eligibleForBrick.slice(0, 2)

    if (!!finalShowsForPreviewBricks) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return finalShowsForPreviewBricks.map((event) => {
        return (
          <Box key={event.id}>
            <Event event={event} />
          </Box>
        )
      })
    }
  }

  render() {
    const { data, title } = this.props
    return (
      <>
        <Box my={2}>
          <Text variant="lg-display">{title}</Text>
        </Box>
        {this.renderEvents()}
        {data.length > 2 && (
          <Box mb={2}>
            <CaretButton
              onPress={() => this.viewAllPressed()}
              text={`View all ${data.length} shows`}
            />
          </Box>
        )}
      </>
    )
  }
}
