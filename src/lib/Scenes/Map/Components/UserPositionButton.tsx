import { Box, color, Flex } from "@artsy/palette"
import Crosshair from "lib/Icons/Crosshair"
import React, { Component } from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

const Background = styled(Flex)`
  background: white;
  height: 40;
  width: 40;
  border-radius: 20;
  shadow-radius: 6;
  shadow-color: black;
  shadow-opacity: 0.3;
  align-content: center;
  align-self: flex-end;
`

interface Props {
  onPress?: () => void
  highlight?: boolean
}

export class UserPositionButton extends Component<Props> {
  render() {
    const { highlight, onPress } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <Background
          alignSelf="flex-end"
          flexDirection="row"
          alignItems="center"
          style={{
            shadowOffset: { height: 0, width: 0 },
          }}
        >
          <Box style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Crosshair width={20} height={20} color={highlight ? color("purple100") : color("black100")} />
          </Box>
        </Background>
      </TouchableOpacity>
    )
  }
}
