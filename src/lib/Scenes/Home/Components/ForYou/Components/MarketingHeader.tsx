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
        <BorderBox p={0} width="100%" height="220px" background={color("black5")} style={{ overflow: "hidden" }}>
          <Video />
        </BorderBox>

        <Box my={2}>
          <Sans size="3">Introducing a new way to buy on Artsy</Sans>
        </Box>

        {/* TODO: Port Reaction <Button variant='...' /> API over */}
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

        <Box mt={4}>
          <Separator />
        </Box>
      </Container>
    )
  }
}
