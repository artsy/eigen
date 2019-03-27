import { Box, color, Flex, Sans, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Fair } from "lib/Scenes/Map/types"
import React, { Component } from "react"
import { Dimensions, Image, TouchableWithoutFeedback } from "react-native"
import styled from "styled-components/native"

interface Props {
  fair: Fair
}

export class FairEventSectionCard extends Component<Props> {
  handleTap() {
    const path = `${this.props.fair.id}?entity=fair`
    SwitchBoard.presentNavigationViewController(this, path)
  }

  render() {
    const {
      fair: { image, name, profile, exhibition_period },
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <Container>
          {!!image && <BackgroundImage imageURL={image.url} />}
          <Overlay />
          <Flex flexDirection="column" px={2}>
            {!!profile && <Logo source={{ uri: profile.icon.url }} />}
          </Flex>
          <Box p={2} style={{ position: "absolute", bottom: 0, left: 0 }}>
            <Flex flexDirection="column" flexGrow={1}>
              <Sans size="3t" weight="medium" color="white">
                {name}
              </Sans>
              {!!exhibition_period && (
                <Sans size="3" color="white">
                  {exhibition_period}
                </Sans>
              )}
            </Flex>
          </Box>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

const BackgroundImage = styled(OpaqueImageView)`
  background: ${color("black60")};
  position: absolute;
  height: 100%;
  width: 100%;
`

const Container = styled(Box)`
  width: ${Dimensions.get("window").width / 2 + 50};
  height: 310;
  position: relative;
  overflow: hidden;
  background: ${color("black60")};
`

// Set background color of overlay based on logo color
const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

const Logo = styled(Image)`
  width: 100;
  height: 100;
  background-color: transparent;
  margin-bottom: ${space(1)};
  /* stylelint-disable */
  tint-color: white;
`
