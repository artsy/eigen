import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import React, { Component } from "react"
import { Modal, ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface State {
  overlayVisible: boolean
  selectedCity: string
}

interface Props {
  overlayVisible: boolean
}

const cityList = ["New York", "Los Angeles", "London", "Berlin", "Paris", "Hong Kong"]
export class CityPicker extends Component<Props, State> {
  state = {
    overlayVisible: null,
    selectedCity: null,
  }

  _mounted = null

  componentDidMount() {
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
  }

  selectCity(city) {
    const isCityPickerMounted = this._mounted

    this.setState({ selectedCity: city })

    // checks that comp is mounted before calling timeout method here to prevent timer
    // from firing after component is unmounted
    if (isCityPickerMounted) {
      setTimeout(() => {
        this.setState({ overlayVisible: false })
      }, 1000)
    }
  }

  render() {
    const { overlayVisible, selectedCity } = this.state

    return (
      <Modal visible={overlayVisible} animationType="slide" transparent={true}>
        <Overlay>
          <ScrollView>
            <Box mt={2} ml={2}>
              <Sans size="3" weight="medium">
                Select a city
              </Sans>
            </Box>
            {cityList.map((city, i) => (
              <Box key={i} mt={2} mx={2}>
                <TouchableOpacity onPress={() => this.selectCity(city)}>
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
      </Modal>
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
