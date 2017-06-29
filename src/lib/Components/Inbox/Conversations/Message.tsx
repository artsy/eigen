import * as moment from "moment"
import * as React from "react"
import * as Relay from "react-relay"

import { BodyText, MetadataText, SmallHeadline } from "../Typography"

import ImagePreview from "./Previews/ImagePreview"
import PDFPreview from "./Previews/PDFPreview"

import styled from "styled-components/native"
import colors from "../../../../data/colors"

const VerticalLayout = styled.View`
  flex-direction: column
  flex: 1
`

const HorizontalLayout = styled.View`flex-direction: row;`

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

const ArtworkPreviewContainer = styled.View`marginBottom: 10;`

const ImagePreviewContainer = styled.View`marginBottom: 10;`

const PDFPreviewContainer = styled.View`
  marginBottom: 10
`

interface Props extends RelayProps {
  senderName: string
  artworkPreview?: JSX.Element
}

export class Message extends React.Component<Props, any> {
  render() {
    const date = moment(this.props.message.created_at).fromNow(true)
    const attachments = this.props.message.attachments
    let hasImageAttachment
    let hasPDFAttachment
    if (attachments.length > 0) {
      hasImageAttachment = attachments[0].content_type === "image/jpeg"
      hasPDFAttachment = attachments[0].content_type === "application/pdf"
    }

    return (
      <Container>
        <Avatar />
        <TextContainer>
          <Header>
            <SenderName>
              {this.props.senderName}
            </SenderName>
            <MetadataText>
              {date}
            </MetadataText>
          </Header>
          {this.props.artworkPreview && <ArtworkPreviewContainer>{this.props.artworkPreview}</ArtworkPreviewContainer>}
          {hasImageAttachment &&
            <ImagePreviewContainer>
              <ImagePreview imageAttachment={attachments[0]} />
            </ImagePreviewContainer>}
          {hasPDFAttachment &&
            <PDFPreviewContainer>
              <PDFPreview pdfAttachment={attachments[0]} />
            </PDFPreviewContainer>}
          <BodyText>{this.props.message.raw_text.split("\n\nAbout")[0]}</BodyText>
        </TextContainer>
      </Container>
    )
  }
}

export default Relay.createContainer(Message, {
  fragments: {
    message: () => Relay.QL`
      fragment on MessageType {
        raw_text
        created_at
        is_from_user
        attachments {
          content_type
          download_url
          file_name
        }
      }
    `,
  },
})

interface RelayProps {
  message: {
    raw_text: string | null
    created_at: string | null
    is_from_user: boolean
    attachments: Array<
      {
        content_type: string
        download_url: string
        file_name: string
      }
    >
  }
}
