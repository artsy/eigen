import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Button from "lib/Components/Buttons/InvertedButton"
import OpaqueImageView from "lib/Components/OpaqueImageView"
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
      exhibition_period: string
      cover_image: {
        url: string
      }
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
    const { name, exhibition_period, partner, cover_image } = node
    const { name: partnerName } = partner
    return (
      <Box mb={2} px={2}>
        {cover_image &&
          cover_image.url && (
            <Box mb={2}>
              <OpaqueImageView imageURL={cover_image.url} height={145} />
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
            {exhibition_period && (
              <Sans size="2" color={color("black60")}>
                {exhibition_period}
              </Sans>
            )}
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
