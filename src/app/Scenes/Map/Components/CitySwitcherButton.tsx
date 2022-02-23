import Spinner from "app/Components/Spinner"
import ChevronIcon from "app/Icons/ChevronIcon"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { Box, ClassTheme, Flex, Sans } from "palette"
import React, { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
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
  isLoading: boolean
  sponsoredContentUrl?: string
}

export class CitySwitcherButton extends Component<Props> {
  render() {
    const { city, isLoading, sponsoredContentUrl } = this.props
    return isLoading || city ? (
      <ClassTheme>
        {({ color }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.props.onPress) {
                this.props.onPress()
              }
              LegacyNativeModules.ARNotificationsManager.postNotificationName(
                "ARLocalDiscoveryOpenCityPicker",
                {
                  ...(sponsoredContentUrl && { sponsoredContentUrl }),
                }
              )
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
                  <Sans size="3t" weight="medium" ml={3}>
                    {city.name}
                  </Sans>
                  <Box ml={2} mr={3}>
                    <ChevronIcon
                      initialDirection="down"
                      // @ts-ignore
                      color={color("black100")}
                      width={20}
                      height={20}
                    />
                  </Box>
                </>
              ) : (
                <Flex alignItems="center" justifyContent="center" flexGrow={1}>
                  <Spinner
                    spinnerColor="black60"
                    style={{ backgroundColor: "transparent" }}
                    size="medium"
                  />
                </Flex>
              )}
            </Background>
          </TouchableWithoutFeedback>
        )}
      </ClassTheme>
    ) : null
  }
}
