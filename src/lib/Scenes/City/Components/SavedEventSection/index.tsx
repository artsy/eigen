import { Box, color, Flex, Sans } from "@artsy/palette"
import PinSavedOff from "lib/Icons/PinSavedOff"
import PinSavedOn from "lib/Icons/PinSavedOn"
import React, { Component } from "react"
import { Image } from "react-native"
import styled from "styled-components/native"

export class SavedEventSection extends Component<any> {
  render() {
    const { data } = this.props
    const hasSaves = data.length > 0
    const hasSavesComponent = (
      <>
        <PinSavedOn width={30} height={30} />
        <Sans size="3t" ml={1}>
          {data.length} saved events
        </Sans>
      </>
    )

    const hasNoSavesComponent = (
      <>
        <Flex flexDirection="row" alignItems="center">
          <PinSavedOff width={30} height={30} />
          <Flex ml={1}>
            <Sans size="3t" color="black60" weight="medium">
              No saved events
            </Sans>
            <Sans size="3t" color="black60">
              Save a show or fair to find it later
            </Sans>
          </Flex>
        </Flex>
      </>
    )

    return (
      <>
        <Box mx={2}>
          <Flex flexDirection="row" py={1} m={1} alignItems="center">
            <Logo source={require("../../../../../../images/BMW-logo.jpg")} />
            <Sans size="3" weight="medium" ml={1}>
              Presented in Partnership with BMW
            </Sans>
          </Flex>
        </Box>
        <Box mx={2} mb={1}>
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
