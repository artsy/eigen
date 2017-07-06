import * as moment from "moment"
import * as React from "react"
import * as Relay from "react-relay"

import { BodyText, MetadataText, SmallHeadline } from "../Typography"

import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"

import styled from "styled-components/native"
import colors from "../../../../data/colors"

import SwitchBoard from "../../../NativeModules/SwitchBoard"

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

const PDFPreviewContainer = styled.View`marginBottom: 10;`

interface Props extends RelayProps {
  partnerName: string
  userName: string
  artworkPreview?: JSX.Element
  relay?: Relay.RelayProp
}

export class Message extends React.Component<Props, any> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"]) {
    const previewAttachment = attachmentID => {
      const attachment = attachments.find(({ id }) => id === attachmentID)
      SwitchBoard.presentMediaPreviewController(this, attachment.download_url, attachment.content_type, attachment.id)
    }

    return attachments.map(attachment => {
      if (attachment.content_type.startsWith("image")) {
        return (
          <ImagePreviewContainer key={attachment.id}>
            <ImagePreview attachment={attachment as any} onSelected={previewAttachment} />
          </ImagePreviewContainer>
        )
      }
      if (attachment.content_type === "application/pdf") {
        return (
          <PDFPreviewContainer key={attachment.id}>
            <PDFPreview attachment={attachment as any} onSelected={previewAttachment} />
          </PDFPreviewContainer>
        )
      }
    })
  }

  render() {
    const { artworkPreview, message, userName, partnerName } = this.props
    const isSent = this.props.relay ? !this.props.relay.hasOptimisticUpdate(message) : true

    return (
      <Container>
        <Avatar />
        <TextContainer>
          <Header>
            <SenderName>
              {message.is_from_user ? userName : partnerName}
            </SenderName>
            {isSent &&
              <MetadataText>
                {moment(message.created_at).fromNow(true)}
              </MetadataText>}
          </Header>
          {artworkPreview &&
            <ArtworkPreviewContainer>
              {artworkPreview}
            </ArtworkPreviewContainer>}

          {this.renderAttachmentPreviews(message.attachments)}

          <BodyText disabled={!isSent}>
            {message.raw_text.split("\n\nAbout")[0]}
          </BodyText>
        </TextContainer>
      </Container>
    )
  }
}

export default Relay.createContainer(Message, {
  fragments: {
    message: () => Relay.QL`
      fragment on Message {
        raw_text
        created_at
        is_from_user
        attachments {
          id
          content_type
          download_url
          file_name
          ${ImagePreview.getFragment("attachment")}
          ${PDFPreview.getFragment("attachment")}
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
    attachments: Array<{
      id: string
      content_type: string
      download_url: string
    }>
  }
}
