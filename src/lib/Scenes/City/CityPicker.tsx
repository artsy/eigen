import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { dimensions, screen } from "lib/data/ScreenSizes/screenSizes"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import React, { Component } from "react"
import { Dimensions, NativeModules, ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { cityList as cities } from "./cities"

interface Props {
  selectedCity: string
}

interface State {
  selectedCity: string
}

const cityList = cities.map(city => city.name)
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
        <ScrollView>
          <Box mt={2} ml={2}>
            <Sans size="3" weight="medium">
              Select a city
            </Sans>
          </Box>
          {cityList.map((city, i) => (
            <Box key={i} mx={2}>
              <TouchableOpacity onPress={() => this.selectCity(city, i)}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {this.handleCityList(screenHeight, city)}
                  {selectedCity === city && <CircleWhiteCheckIcon width={26} height={26} />}
                </Flex>
              </TouchableOpacity>
              <Separator />
            </Box>
          ))}
        </ScrollView>
        <LogoContainer>
          <Flex flexDirection="row" py={1} alignItems="center">
            <Logo source={require("../../../../Pod/Assets/assets/images/BMW-logo.jpg")} />
            {this.handleLogo(screenHeight)}
          </Flex>
        </LogoContainer>
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
  margin-top: ${space(4)};
  margin-bottom: ${space(4)};
  margin-left: ${space(2)};
  margin-right: ${space(2)};
  flex-direction: column;
`
const LogoContainer = styled.View`
  width: 100%;
  flex: 2;
`
