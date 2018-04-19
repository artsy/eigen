import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Fonts } from "../../../data/fonts"
import Serif from "../../Text/Serif"
import { Button } from "../Components/Button"
import { Container } from "../Components/Container"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"

interface BidResultProps {
  winning: boolean
}

export class BidResult extends React.Component<BidResultProps> {
  render() {
    if (this.props.winning) {
      return (
        <CenteringContainer>
          <View>
            <TopOffset>
              <Icon source={require("../../../../../images/circle-check-green.png")} />
              <Title>You're the highest bidder</Title>

              <TimeLeft>Time left</TimeLeft>
              <Timer timeLeftInMilliseconds={1000 * 60 * 20} />
            </TopOffset>
          </View>
        </CenteringContainer>
      )
    } else {
      return (
        <Container>
          <CenteringContainer>
            <Icon source={require("../../../../../images/circle-x-red.png")} />
            <Title>Your bid wasn’t high enough</Title>

            <StyledText>Another bidder placed a higher max bid or the same max bid before you did.</StyledText>
            <StyledText>Increase your max bid to take the lead.</StyledText>

            <TimeLeft>Time left</TimeLeft>
            <Timer timeLeftInMilliseconds={1000 * 60 * 20} />

            <Divider />

            <Serif>Current bid</Serif>
            <Title>$45,000</Title>
          </CenteringContainer>

          <Button text="Bid again" onPress={() => null} />
        </Container>
      )
    }
  }
}

const TopOffset = styled.View`
  top: -50%;
  align-items: center;
`

const CenteringContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const Icon = styled.Image`
  width: 20px;
  height: 20px;
  margin: 10px;
`

const StyledText = styled.Text`
  margin: 10px;
  font-family: ${Fonts.GaramondRegular};
  font-size: 16px;
  text-align: center;
  color: #666666;
`

const TimeLeft = styled.Text`
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
`

const Divider = styled.View`
  border-bottom-color: #e5e5e5;
  border-bottom-width: 1px;
  margin: 30px 0 20px;
  width: 100%;
`
