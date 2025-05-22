import { Box, Flex, Text } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import ChevronIcon from "app/Components/Icons/ChevronIcon"
import Spinner from "app/Components/Spinner"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { City } from "app/Scenes/Map/types"
import { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

// Because it will raise errors in VS Code
const shadowProps = `
shadow-radius: 6;
shadow-color: black;
shadow-opacity: 0.3;
`

const Background = styled(Flex)`
  background: ${themeGet("colors.background")};
  height: 40px;
  border-radius: 20px;
  ${shadowProps};
`

interface Props {
  onPress?: () => void
  city: City
  isLoading: boolean
}

export class CitySwitcherButton extends Component<Props> {
  render() {
    const { city, isLoading } = this.props
    return isLoading || city ? (
      <ThemeAwareClassTheme>
        {({}) => (
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.props.onPress) {
                this.props.onPress()
              }
              LegacyNativeModules.ARNotificationsManager.postNotificationName(
                "ARLocalDiscoveryOpenCityPicker",
                {}
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
                  <Text variant="sm" weight="medium" ml={4}>
                    {city.name}
                  </Text>
                  <Box ml={2} mr={4}>
                    <ChevronIcon initialDirection="down" color="mono100" width={20} height={20} />
                  </Box>
                </>
              ) : (
                <Flex alignItems="center" justifyContent="center" flexGrow={1}>
                  <Spinner
                    spinnerColor="mono60"
                    style={{ backgroundColor: "transparent" }}
                    size="medium"
                  />
                </Flex>
              )}
            </Background>
          </TouchableWithoutFeedback>
        )}
      </ThemeAwareClassTheme>
    ) : null
  }
}
