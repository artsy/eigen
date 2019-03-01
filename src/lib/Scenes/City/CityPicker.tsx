import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import React, { Component } from "react"
import { NativeModules, ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import { cityList as cities } from "./cities"

interface State {
  selectedCity: string
}

const cityList = cities.map(city => city.name)
export class CityPicker extends Component<{}, State> {
  state = {
    selectedCity: null,
  }

  selectCity(city: string, index: number) {
    this.setState({ selectedCity: city })
    NativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryUserSelectedCity", { cityIndex: index })
  }

  render() {
    const { selectedCity } = this.state

    return (
      <Overlay>
        <ScrollView>
          <Box mt={2} ml={2}>
            <Sans size="3" weight="medium">
              Select a city
            </Sans>
          </Box>
          {cityList.map((city, i) => (
            <Box key={i} mt={2} mx={2}>
              <TouchableOpacity onPress={() => this.selectCity(city, i)}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                  <Serif size="8" lineHeight={45}>
                    {city}
                  </Serif>
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
            <Sans size="3" weight="medium" ml={1} mt={1}>
              Presented in Partnership with BMW
            </Sans>
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
  border-radius: 25;
  flex-direction: column;
`
const LogoContainer = styled.View`
  margin-left: ${space(2)};
  margin-right: ${space(2)};
`
