import { Box, color, Flex, Sans } from "@artsy/palette"
import ChevronIcon from "lib/Icons/ChevronIcon"
import React, { Component } from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

// Because it will raise errors in VS Code
const shadowProps = `
shadow-radius: 6;
shadow-color: black;
shadow-opacity: 0.3;
`

const Background = styled(Flex)`
  background: white;
  height: 40;
  border-radius: 20;
  ${shadowProps};
`

export class CitySwitcherButton extends Component<any> {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryOpenCityPicker", {})}
      >
        <Background
          flexDirection="row"
          alignItems="center"
          style={
            {
              shadowOffset: { height: 0, width: 0 },
            } as any
          }
        >
          <Sans size="3t" weight="medium" ml={3}>
            {this.props.city.name}
          </Sans>
          <Box ml={2} mr={3}>
            <ChevronIcon initialDirection="down" color={color("black100")} width={20} height={20} />
          </Box>
        </Background>
      </TouchableWithoutFeedback>
    )
  }
}
