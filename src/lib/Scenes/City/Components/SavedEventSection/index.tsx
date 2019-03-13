import { Box, color, Flex, Sans } from "@artsy/palette"
import ChevronIcon from "lib/Icons/ChevronIcon"
import PinSavedOff from "lib/Icons/PinSavedOff"
import PinSavedOn from "lib/Icons/PinSavedOn"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

export interface Props {
  data: any
  citySlug: string
}

export class SavedEventSection extends Component<any> {
  handleTap = () => {
    SwitchBoard.presentNavigationViewController(this, `/city-save/${this.props.citySlug}`)
  }

  navigateToBMWArtGuide() {
    SwitchBoard.presentNavigationViewController(this, "https://www.bmw-arts-design.com/bmw_art_guide")
  }

  render() {
    const { data } = this.props
    const hasSaves = data.length > 0
    const hasSavesComponent = (
      <TouchableWithoutFeedback onPress={this.handleTap}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex flexDirection="row" alignItems="center">
            <PinSavedOn pinWidth={30} pinHeight={30} />
            <Sans size="3t" weight="medium" ml={24}>
              {data.length > 1 ? data.length + " saved events" : data.length + " saved event"}
            </Sans>
          </Flex>
          <ChevronIcon color="black" />
        </Flex>
      </TouchableWithoutFeedback>
    )

    const hasNoSavesComponent = (
      <>
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOff width={30} height={30} />
          <Flex ml={24}>
            <Sans size="3t" color="black60" weight="medium">
              No saved events
            </Sans>
            <Sans size="3t" color="black60">
              Save a show to find it later
            </Sans>
          </Flex>
        </Flex>
      </>
    )

    return (
      <>
        <Box mx={2} pb={3}>
          <Flex flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={() => this.navigateToBMWArtGuide()}>
              <Flex flexDirection="row">
                <Logo source={require("../../../../../../images/BMW-logo.jpg")} />
                <Sans size="3" ml={1}>
                  Presented in Partnership with BMW
                </Sans>
              </Flex>
            </TouchableOpacity>
          </Flex>
        </Box>
        <Box mx={2} mb={2}>
          <SavedBox p={1}>{hasSaves ? hasSavesComponent : hasNoSavesComponent}</SavedBox>
        </Box>
      </>
    )
  }
}

const SavedBox = styled(Box)`
  border-radius: 2px;
  border-width: 1px;
  border-color: ${color("black30")};
`

const Logo = styled(Image)`
  width: 32px;
  height: 32px;
`
