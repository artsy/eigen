import { Box, color, Flex, Sans } from "@artsy/palette"
import Spinner from "lib/Components/Spinner"
import ChevronIcon from "lib/Icons/ChevronIcon"
import React, { Component } from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"
import { City } from "../types"

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

interface Props {
  onPress?: () => void
  city: City
  sponsoredContentUrl?: string
}

export class CitySwitcherButton extends Component<Props> {
  render() {
    const { city, sponsoredContentUrl } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress()
          }
          NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryOpenCityPicker", {
            ...(sponsoredContentUrl && { sponsoredContentUrl }),
          })
        }}
      >
        <Background
          flexDirection="row"
          alignItems="center"
          style={
            {
              shadowOffset: { height: 0, width: 0 },
              width: city ? "auto" : 40,
            } as any
          }
        >
          {city ? (
            <>
              {" "}
              <Sans size="3t" weight="medium" ml={3}>
                {city.name}
              </Sans>
              <Box ml={2} mr={3}>
                <ChevronIcon initialDirection="down" color={color("black100")} width={20} height={20} />
              </Box>
            </>
          ) : (
            <Flex alignItems="center" justifyContent="center" flexGrow={1}>
              <Spinner
                spinnerColor={color("black60")}
                style={{ backgroundColor: "transparent" }}
                size={{ width: 16, height: 16 }}
              />
            </Flex>
          )}
        </Background>
      </TouchableWithoutFeedback>
    )
  }
}
