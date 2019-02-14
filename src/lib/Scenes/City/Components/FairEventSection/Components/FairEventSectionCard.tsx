import { Box, color, Flex, Sans, space } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import moment from "moment"
import React, { Component } from "react"
import { Dimensions, Image } from "react-native"
import styled from "styled-components/native"

interface Props {
  fair: any
}

export class FairEventSectionCard extends Component<Props> {
  render() {
    const {
      fair: { image, name, profile, start_at, end_at },
    } = this.props

    return (
      <>
        <Container>
          {image && <BackgroundImage imageURL={image.url} />}
          <Overlay />
          <Flex flexDirection="column" px={2}>
            {profile && <Logo source={{ uri: profile.icon.url }} />}
          </Flex>
          <Box p={2} style={{ position: "absolute", bottom: 0, left: 0 }}>
            <Flex flexDirection="column" flexGrow={1}>
              <Sans size="3t" weight="medium" color="white">
                {name}
              </Sans>
              <Sans size="3" color="white">
                {moment(start_at).format("MMM Do")} - {moment(end_at).format("MMM Do")}
              </Sans>
            </Flex>
          </Box>
        </Container>
      </>
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
