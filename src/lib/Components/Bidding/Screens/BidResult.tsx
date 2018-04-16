import React from "react"
import styled from "styled-components/native"

import { View } from "react-native"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"

interface BidResultProps {
  winning: boolean
}

export class BidResult extends React.Component<BidResultProps> {
  render() {
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

const TimeLeft = styled.Text`
  font-size: 12px;
  color: #666666;
  margin-top: 10px;
`
