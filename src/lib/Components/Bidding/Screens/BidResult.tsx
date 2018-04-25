import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Icon20 } from "../Elements/Icon"
import { Sans12, Serif16, SerifSemibold18 } from "../Elements/Typography"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { CenteringContainer, Container } from "../Components/Containers"
import { Divider } from "../Components/Divider"
import { Timer } from "../Components/Timer"

interface BidResultProps {
  winning: boolean
}

export class BidResult extends React.Component<BidResultProps> {
  render() {
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
              <SerifSemibold18 mb={4}>Your bid wasn’t high enough</SerifSemibold18>

              <StyledText maxWidth={280}>
                Another bidder placed a higher max bid or the same max bid before you did.
              </StyledText>
              <StyledText>Increase your max bid to take the lead.</StyledText>

              <Sans12 color="black60">Time left</Sans12>
              <Timer timeLeftInMilliseconds={1000 * 60 * 20} />

              <Divider mt={5} mb={4} />

              <Serif16>Current bid</Serif16>
              <SerifSemibold18>$45,000</SerifSemibold18>
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

const StyledText = props => <Serif16 mb={5} textAlign="center" color="black60" {...props} />
