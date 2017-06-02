import * as React from "react"

import {
  BodyText,
  MetadataText,
  SmallHeadline,
} from "./typography"

import styled from "styled-components/native"
import colors from "../../../data/colors"

const VerticalLayout = styled.View`
  flex-direction: column
  flex: 1
`

const HorizontalLayout = styled.View`
  flex-direction: row
`

const Container = HorizontalLayout.extend`
  flex: 1
  alignSelf: stretch
  marginTop: 15
  marginBottom: 10
`

const Avatar = styled.View`
  height: 20
  width: 20
  borderRadius: 20
  backgroundColor: ${colors["gray-regular"]}
`

const Header = HorizontalLayout.extend`
  alignSelf: stretch
  marginBottom: 10
`

const TextContainer = VerticalLayout.extend`
  marginLeft: 10
`

export default class Message extends React.Component<any, any> {
  render() {
    const senderName = "Patrick Parrish"
    const time = "11:32AM"
    const body = "Hi Katarina, thanks for reaching out with your interest in this great piece by Ian Stell."

    return (
      <Container>
          <Avatar/>
          <TextContainer>
            <Header>
              <SmallHeadline style={{marginRight: 10}}>{senderName}</SmallHeadline>
              <MetadataText>{time}</MetadataText>
            </Header>
            <BodyText>{body}</BodyText>
          </TextContainer>
      </Container>
    )
  }
}
