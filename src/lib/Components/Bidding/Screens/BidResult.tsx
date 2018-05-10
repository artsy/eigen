import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import { Icon20 } from "../Elements/Icon"
import { Sans12, Serif16, SerifSemibold18 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { CenteringContainer, Container } from "../Components/Containers"
import { Divider } from "../Components/Divider"
import { MarkdownRenderer } from "../Components/MarkdownRenderer"
import { Timer } from "../Components/Timer"

// import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { BidResult_sale_artwork } from "__generated__/BidResult_sale_artwork.graphql"

// interface MinimumNextBid {
//   display: string
//   cents: number
// }

interface BidResultProps {
  sale_artwork: BidResult_sale_artwork
  winning: boolean
  message_header?: string
  message_description_md?: string
}

class BidResult extends React.Component<BidResultProps> {
  render() {
    console.log(this.props)
    if (this.props.winning) {
      return (
        <BiddingThemeProvider>
          <CenteringContainer>
            <View>
              <TopOffset>
                <Icon20 m={2} source={require("../../../../../images/circle-check-green.png")} />
                <SerifSemibold18 mb={4}>You're the highest bidder</SerifSemibold18>

                <Sans12 color="black60">Time left</Sans12>
                <Timer timeLeftInMilliseconds={1000 * 60 * 20} />
              </TopOffset>
            </View>
          </CenteringContainer>
        </BiddingThemeProvider>
      )
    } else {
      return (
        <BiddingThemeProvider>
          <Container>
            <CenteringContainer>
              <Icon20 m={2} source={require("../../../../../images/circle-x-red.png")} />
              <SerifSemibold18 mb={4}>{this.props.message_header}</SerifSemibold18>
              <MarkdownRenderer>{this.props.message_description_md}</MarkdownRenderer>

              <Sans12 color="black60">Time left</Sans12>
              <Timer timeLeftInMilliseconds={1000 * 60 * 20} />

              <Divider mt={5} mb={4} />

              <Serif16>Current bid</Serif16>
              <SerifSemibold18>{this.props.sale_artwork.current_bid.display}</SerifSemibold18>
            </CenteringContainer>

            <Button text="Bid again" onPress={() => null} />
          </Container>
        </BiddingThemeProvider>
      )
    }
  }
}

const TopOffset = styled.View`
  top: -50%;
  align-items: center;
`

export const BidResultScreen = createFragmentContainer(
  BidResult,
  graphql`
    fragment BidResult_sale_artwork on SaleArtwork {
      current_bid {
        amount
        cents
        display
      }
    }
  `
)
