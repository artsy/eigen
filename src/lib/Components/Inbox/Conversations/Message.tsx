import * as React from "react"
import * as Relay from "react-relay"

import { BodyText, MetadataText, SmallHeadline } from "../Typography"

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

const ArtworkPreviewContainer = styled.View`
  marginBottom: 10
`

interface Props extends RelayProps {
  senderName: string
  artworkPreview?: JSX.Element
}

export class Message extends React.Component<Props, any> {
  render() {
    return (
      <Container>
        <Avatar />
        <TextContainer>
          <Header>
            <SenderName>{this.props.senderName}</SenderName>
            <MetadataText>{this.props.message.created_at}</MetadataText>
          </Header>
          {this.props.artworkPreview && <ArtworkPreviewContainer>{this.props.artworkPreview}</ArtworkPreviewContainer>}
          <BodyText>{this.props.message.raw_text.split("\n\nAbout")[0]}</BodyText>
        </TextContainer>
      </Container>
    )
  }
}

export default Relay.createContainer(Message, {
  initialVariables: {},
  fragments: {
    message: () => Relay.QL`
      fragment on MessageType {
        raw_text
        created_at
      }
    `,
  },
})

interface RelayProps {
  message: {
    raw_text: string
    created_at: string
  }
}
