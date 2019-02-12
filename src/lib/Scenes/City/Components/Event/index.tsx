import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import Button from "lib/Components/Buttons/InvertedButton"
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
  event: { title: string; dates: string; partnerName: string }
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
    const { title, dates, partnerName } = this.props.event
    return (
      <Box mb={2} px={4}>
        <Flex flexDirection="row" flexWrap="nowrap" justifyContent="space-between">
          <TextContainer mb={4}>
            <Sans size="3" weight="medium">
              {partnerName}
            </Sans>
            <Serif size="3t">{title}</Serif>
            <Sans size="2" color={color("black60")}>
              {dates}
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
