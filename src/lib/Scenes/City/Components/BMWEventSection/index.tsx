import { Box, color, Sans, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { Event } from "lib/Scenes/City/Components/Event"
import React from "react"

export interface Props {
  title: string
  data: any
  cityName: string
}

const renderEvents = events => {
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

const getArtGuidePressed = () => {
  // FIXME: link to art guide
  console.log("getArtGuidePressed")
}

export const BMWEventSection: React.SFC<Props> = (props: Props) => {
  const { data, cityName } = props
  return (
    <>
      <Box my={2} px={2}>
        <Serif size="8">{props.title}</Serif>
      </Box>
      <Box mb={2} px={2}>
        <Sans weight="medium" size="3">
          Presented by BMW
        </Sans>
        <Box mt={1}>
          <Serif size="3" color={color("black60")}>
            {`The BMW Art Guide is your go-to-guide to discover private collections of modern and contemporary art which are accessible to the public. Please see below for collections in ${cityName}.`}
          </Serif>
        </Box>
      </Box>
      <Box mb={3} px={2}>
        <CaretButton onPress={() => getArtGuidePressed()} text="Get the BMW Art Guide" />
      </Box>
      {renderEvents(data)}
      {data.length > 2 && (
        <Box px={2} mb={2}>
          <Sans weight="medium" size="3">
            <CaretButton onPress={() => getArtGuidePressed()} text={`View all ${data.length} shows`} />
          </Sans>
        </Box>
      )}
    </>
  )
}
