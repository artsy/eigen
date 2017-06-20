import * as React from "react"

import { BodyText, MetadataText, SmallHeadline } from "../Typography"

import Avatar from "./Avatar"

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
  alignSelf: stretch
  marginTop: 15
  marginBottom: 10
  marginLeft: 20
  marginRight: 20

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

const ArtworkPreviewContainer = styled.View`
  marginBottom: 10
`

interface Props {
  message: {
    senderName: string
    time: string
    body: string
  }
  artworkPreview?: JSX.Element
}

export default class Message extends React.Component<Props, any> {
  render() {
    return (
      <Container>
        <Avatar isUser={true} senderName={this.props.message.senderName} />
        <TextContainer>
          <Header>
            <SenderName>{this.props.message.senderName}</SenderName>
            <MetadataText>{this.props.message.time}</MetadataText>
          </Header>
          {this.props.artworkPreview && <ArtworkPreviewContainer>{this.props.artworkPreview}</ArtworkPreviewContainer>}
          <BodyText>{this.props.message.body.split("\n\nAbout")[0]}</BodyText>
        </TextContainer>
      </Container>
    )
  }
}
