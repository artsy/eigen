import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { dimensions, screen } from "lib/data/ScreenSizes/screenSizes"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import { Schema, screenTrack } from "lib/utils/track"
import React, { Component } from "react"
import { Dimensions, NativeModules, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { cityList as cities } from "./cities"

interface Props {
  selectedCity: string
}

interface State {
  selectedCity: string
}

const cityList = cities.map(city => city.name)

@screenTrack(() => ({
  context_screen: Schema.PageNames.CityPicker,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: "",
  context_screen_owner_id: "",
}))
export class CityPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedCity: props.selectedCity,
    }
  }

  selectCity(city: string, index: number) {
    this.setState({ selectedCity: city })
    NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryUserSelectedCity", { cityIndex: index })
    this.setState({ selectedCity: null })
  }

  handleLogo(screenHeight) {
    return (
      // @ts-ignore
      <Sans size={dimensions(screenHeight)[screen(screenHeight)].logoFontSize} weight="medium" ml={2} mt={2}>
        Presented in Partnership with BMW
      </Sans>
    )
  }

  handleCityList(screenHeight, city) {
    return (
      <Serif
        mt={2}
        // @ts-ignore
        size={dimensions(screenHeight)[screen(screenHeight)].cityFontSize}
        lineHeight={dimensions(screenHeight)[screen(screenHeight)].lineHeight}
      >
        {city}
      </Serif>
    )
  }

  render() {
    const { selectedCity } = this.state
    const { height: screenHeight } = Dimensions.get("window")

    return (
      <Overlay>
        <Flex flexDirection="column" alignContent="stretch">
          <Box ml={2}>
            <Sans size="3" weight="medium">
              Shows and fairs by city
            </Sans>
          </Box>
          {cityList.map((city, i) => (
            <Box key={i} mx={2}>
              <TouchableOpacity onPress={() => this.selectCity(city, i)}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {this.handleCityList(screenHeight, city)}
                  {selectedCity === city && (
                    <Box mb={2}>
                      <CircleWhiteCheckIcon width={26} height={26} />
                    </Box>
                  )}
                </Flex>
              </TouchableOpacity>
              <Separator />
            </Box>
          ))}
          <LogoContainer>
            <Flex flexDirection="row" py={1} alignItems="center">
              <Logo source={require("../../../../Pod/Assets/assets/images/BMW-logo.jpg")} />
              {this.handleLogo(screenHeight)}
            </Flex>
          </LogoContainer>
        </Flex>
      </Overlay>
    )
  }
}

const Logo = styled.Image`
  height: 32;
  width: 32;
  margin-top: ${space(1)};
`
const Overlay = styled.View`
  flex: 1;
  background-color: ${color("white100")};
  margin-top: ${space(2)};
  margin-bottom: ${space(4)};
  margin-left: ${space(2)};
  margin-right: ${space(2)};
  flex-direction: column;
`
const LogoContainer = styled(Flex)`
  width: 100%;
  margin-top: ${space(3)};
  margin-left: ${space(0.3)};
`
