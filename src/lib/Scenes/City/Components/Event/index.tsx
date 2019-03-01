import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Button from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import { dateRange } from "lib/utils/dateFormatter"
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
    const { url } = cover_image
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
              {dateRange(start_at, end_at)}
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
