import { Box, color, Flex, Sans, Separator, Serif, Theme } from "@artsy/palette"
import { cityList } from "lib/Scenes/City/cities"
import React, { Component } from "react"
import { Image, Modal, PixelRatio, ScrollView, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"

// import { BucketKey, BucketResults } from "../Map/Bucket"
// import { FiltersBar } from "../Map/Components/FiltersBar"
// import { EventEmitter } from "../Map/EventEmitter"
// import { Tab } from "../Map/types"
// import { AllEvents } from "./Components/AllEvents"

// const isOverlayVisible = true // @TODO: add logic to check if current location + if user has saved city already

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

  // componentDidUpdate() {
  // Use EventEmitter to do a pub sub to the MapContainer to save the user's geolocation in localStorage and publish it to MapContainer
  // to handle user not having to select city everytime they visit the Map view
  // }

  closeOverlay() {
    console.log("overlay closed")
    // @TODO: Handle logic for closing modal and saving current city in state
  }

  selectCity() {
    this.setState({ overlayVisible: false })
  }

  render() {
    const { overlayVisible } = this.state

    return (
      <CityOverlayContainer>
        <Modal visible={overlayVisible} animationType="slide" transparent={false}>
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
                    <Image
                      style={{ height: 32, width: 32 }}
                      source={require("../../../../Pod/Assets/assets/images/BMW-logo.jpg")}
                    />
                    <Sans size="3" weight="medium" ml={1} mt={0.5}>
                      Presented in Partnership with BMW
                    </Sans>
                  </Flex>
                </Box>
              </Box>
            </ScrollView>
          </Overlay>
        </Modal>
      </CityOverlayContainer>
    )
  }
}

const Overlay = styled.View`
  /* width: ${PixelRatio.getPixelSizeForLayoutSize(155)}; */
  /* height: ${PixelRatio.getPixelSizeForLayoutSize(155)};  */
  flex: 1;
  background-color: red;
  /* border-radius: 25; */
`
const CityOverlayContainer = styled.View`
  /* width: ${PixelRatio.getPixelSizeForLayoutSize(75)}; */
  /* height: ${PixelRatio.getPixelSizeForLayoutSize(155)}; */
  /* flex: 1; */
  background-color: green;
  /* border-radius: 25; */
`
