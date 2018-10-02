import { BorderBox, Box, color, Sans, Separator } from "@artsy/palette"
import { InvertedButton } from "lib/Components/Buttons"
import { Video } from "lib/Components/Video"
import { Fonts } from "lib/data/fonts"
import Switchboard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"

// TODO: After /collect2 reaches 100% redirect in A/B replace with: https://artsy.net/collect?acquireable=true
const CollectUrl = "https://artsy.net/collect?split_test[new_collect_page]=new&acquireable=true"

export class MarketingHeader extends Component {
  handleTap = () => {
    Switchboard.presentNavigationViewController(this, CollectUrl)
  }

  render() {
    const { width } = Dimensions.get("window")

    return (
      <Container>
        <BorderBox p={0} width="100%" height="220px" background={color("black5")} style={{ overflow: "hidden" }}>
          <Video
            source={require("../videos/9172018-bn-banner-xs.mp4")}
            resizeMode="cover"
            size={{ width, height: 220 }}
          />
        </BorderBox>

        <Box my={2}>
          <Sans size="3">In-demand artworks, available to buy now</Sans>
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

const Container = styled.View`
  padding: 20px;
`
