import { Box, color, Flex, Serif } from "@artsy/palette"
import React, { Component } from "react"
import styled from "styled-components/native"

export class City extends Component {
  render() {
    return (
      <Box>
        <Flex py={3} alignItems="center">
          <Handle />
        </Flex>
        <Box px={3}>
          <Serif size="8">All Events</Serif>
        </Box>
      </Box>
    )
  }
}

const Handle = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${color("black30")};
`
