import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Button from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import moment from "moment"
import React from "react"
import styled from "styled-components/native"

const ButtonWrapper = styled(Box)`
  height: 34;
  width: 98;
`

const TextContainer = styled(Box)`
  width: 200;
`

interface Props {
  event: {
    node: {
      name: string
      __id: string
      id: string
      cover_image: {
        url: string
      }
      end_at: string
      start_at: string
      partner: {
        name: string
      }
    }
  }
}

interface State {
  eventSaved: boolean
}

export const formatDuration = (startAt, endAt) => {
  const momentStartAt = moment(startAt)
  const momentEndAt = moment(endAt)
  if (momentStartAt.dayOfYear() === momentEndAt.dayOfYear() && momentStartAt.year() === momentEndAt.year()) {
    // duration is a time range within a single day
    return `${momentStartAt.format("MMM D")}`
  } else if (momentStartAt.month() === momentEndAt.month()) {
    // duration is a time range within same month
    return `${momentStartAt.format("MMM D")} - ` + momentEndAt.format("D")
  } else {
    // duration spans more than one day
    return `${momentStartAt.format("MMM D")} - ` + momentEndAt.format("MMM D")
  }
}

export class Event extends React.Component<Props, State> {
  state = {
    eventSaved: false,
  }

  handleSaveChange = () => {
    console.log("handleSaveChange")
  }

  render() {
    const { node } = this.props.event
    const { name, start_at, end_at, partner, cover_image } = node
    const { name: partnerName } = partner
    const url = cover_image ? cover_image.url : null
    return (
      <Box mb={2} px={2}>
        {url && (
          <Box mb={2}>
            <OpaqueImageView imageURL={url} height={145} />
          </Box>
        )}
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <TextContainer mb={2}>
            <Sans size="3" weight="medium" numberOfLines={1} ellipsizeMode="tail">
              {partnerName}
            </Sans>
            <Serif size="3t" numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Serif>
            <Sans size="2" color={color("black60")}>
              {formatDuration(start_at, end_at)}
            </Sans>
          </TextContainer>
          <ButtonWrapper>
            <Button text="Save" selected={this.state.eventSaved} onPress={this.handleSaveChange}>
              Save
            </Button>
          </ButtonWrapper>
        </Flex>
      </Box>
    )
  }
}
