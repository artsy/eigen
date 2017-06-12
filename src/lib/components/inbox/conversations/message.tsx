import * as React from "react"

import { BodyText, MetadataText, SmallHeadline } from "../typography"

import styled from "styled-components/native"
import colors from "../../../../data/colors"

const VerticalLayout = styled.View`
  flex-direction: column
  flex: 1
`

const HorizontalLayout = styled.View`
  flex-direction: row
`

const Container = styled(HorizontalLayout)`
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

const Header = styled(HorizontalLayout)`
  alignSelf: stretch
  marginBottom: 10
`

const TextContainer = styled(VerticalLayout)`
  marginLeft: 10
`

const SenderName = styled(SmallHeadline)`
  marginRight: 10
`

interface Props {
  message: {
    senderName: string
    time: string
    body: string
  }
}

export default class Message extends React.Component<Props, any> {
  render() {
    return (
      <Container>
        <Avatar />
        <TextContainer>
          <Header>
            <SenderName>{this.props.message.senderName}</SenderName>
            <MetadataText>{this.props.message.time}</MetadataText>
          </Header>
          <BodyText>{this.props.message.body}</BodyText>
        </TextContainer>
      </Container>
    )
  }
}
