import { Box, color, Flex, Sans, Separator, Serif, space } from "@artsy/palette"
import { cityList } from "lib/Scenes/City/cities"
import React, { Component } from "react"
import { Modal, ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components/native"

interface State {
  overlayVisible: boolean
}

interface Props {
  overlayVisible: boolean
}

export class CityOverlay extends Component<Props, State> {
  state = {
    overlayVisible: null,
  }
  selectionView: any = null

  selectCity() {
    this.setState({ overlayVisible: false })
  }

  render() {
    const { overlayVisible } = this.state

    return (
      <Modal visible={overlayVisible} animationType="slide" transparent={true}>
        <Overlay>
          <ScrollView>
            <Box>
              <Box mt={2} ml={2}>
                <Sans size="3t">Select a city</Sans>
              </Box>
              {cityList.map((city, i) => (
                <Box key={i} mt={2} mx={2}>
                  <TouchableOpacity onPress={() => this.selectCity()}>
                    <Flex
                      flexDirection="row"
                      ref={el => {
                        if (el) {
                          this.selectionView = el as any
                        }
                      }}
                    >
                      <Serif size="10">{city.name}</Serif>
                    </Flex>
                  </TouchableOpacity>
                  <Separator />
                </Box>
              ))}
              <Box mx={2}>
                <Flex flexDirection="row" py={1} alignItems="flex-start">
                  <Logo
                    style={{ height: 32, width: 32 }}
                    source={require("../../../../Pod/Assets/assets/images/BMW-logo.jpg")}
                  />
                  <Sans size="3" weight="medium" ml={1} mt={1}>
                    Presented in Partnership with BMW
                  </Sans>
                </Flex>
              </Box>
            </Box>
          </ScrollView>
        </Overlay>
      </Modal>
    )
  }
}

const Logo = styled.Image`
  height: 32;
  width: 32;
  margin-top: ${space(0.3)};
`
const Overlay = styled.View`
  flex: 1;
  background-color: ${color("white100")};
  margin-top: ${space(4)};
  margin-bottom: ${space(4)};
  margin-left: ${space(2)};
  margin-right: ${space(2)};
  border-radius: 25;
`
