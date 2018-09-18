import { BorderBox, Box, color, Sans, Separator } from "@artsy/palette"
import { InvertedButton } from "lib/Components/Buttons"
import { Video } from "lib/Components/Video"
import { Fonts } from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import styled from "styled-components/native"

const Container = styled.View`
  padding: 20px;
`

export class MarketingHeader extends Component {
  handleTap = () => {
    Switchboard.presentNavigationViewController(this, "http://www.artsy.net/collect2")
  }

  render() {
    return (
      <Container>
        <BorderBox p={0} width="100%" height="160px" background={color("black5")} style={{ overflow: "hidden" }}>
          <Video
            source={{
              uri: "https://d3vpvtm3t56z1n.cloudfront.net/videos/9172018-bn-banner-xl.mp4",
            }}
            size={{
              width: 515,
              height: 160,
            }}
          />
        </BorderBox>

        <Box my={2}>
          <Sans size="3">
            Buying art on Artsy is easier than ever before. Our most in-demand works are now available for instant
            purchase, with simple checkout and hassle-free shipping.
          </Sans>
        </Box>

        <InvertedButton
          text="Browse works"
          onPress={this.handleTap}
          style={{
            width: 130,
            borderRadius: 2,
            borderColor: "transparent",
          }}
          textStyle={{
            color: "white",
            fontFamily: Fonts.Unica77LLMedium,
            fontSize: 14,
            textShadowColor: "white",
          }}
          key="1"
        />

        <Box mt={4} mb={-3}>
          <Separator />
        </Box>
      </Container>
    )
  }
}
