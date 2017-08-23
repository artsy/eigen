import moment from "moment"
import * as React from "react"
import * as Relay from "react-relay/classic"

import { BodyText, FromSignatureText, MetadataText, SmallHeadline } from "../Typography"

import Avatar from "./Avatar"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"

import InvoicePreview from "./Preview/InvoicePreview"

import styled from "styled-components/native"
import colors from "../../../../data/colors"

import SwitchBoard from "../../../NativeModules/SwitchBoard"

const VerticalLayout = styled.View`
  flex-direction: column;
  flex: 1;
`

const HorizontalLayout = styled.View`flex-direction: row;`

const Container = styled(HorizontalLayout)`
  align-self: stretch;
  margin-top: 15;
  margin-bottom: 10;
  margin-left: 20;
  margin-right: 20;
`

const Header = styled(HorizontalLayout)`
  align-self: stretch;
  margin-bottom: 10;
`

const TextContainer = styled(VerticalLayout)`
  margin-left: 10;
`

const SenderName = styled(SmallHeadline)`
  marginRight: 3
  font-size: 11.5
`

const FromSignature = styled(FromSignatureText)`
  marginTop: 10
`

const TimeStamp = styled(MetadataText)`
  font-size: 11.5
`

const ArtworkPreviewContainer = styled.View`margin-bottom: 10;`

const ImagePreviewContainer = styled.View`margin-bottom: 10;`

const PDFPreviewContainer = styled.View`margin-bottom: 10;`

const InvoicePreviewContainer = styled.View`margin-bottom: 10;`

interface Props extends RelayProps {
  senderName: string
  initials?: string
  artworkPreview?: JSX.Element
  showPreview?: JSX.Element
  relay?: Relay.RelayProp
}

export class Message extends React.Component<Props, any> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"]) {
    // This function does not use the arrow syntax, because it shouldn’t be force bound to this component. Instead, it
    // gets bound to the AttachmentPreview component instance that’s touched, so we can pass `this` to `findNodeHandle`.
    const previewAttachment = function(attachmentID) {
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
    const { artworkPreview, initials, message, senderName, showPreview } = this.props
    const isSent = this.props.relay ? !this.props.relay.hasOptimisticUpdate(message) : true

    const fromName = message.from.name
    const fromEmail = message.from.email

    const fromSignature = fromName ? `${fromName} · ${fromEmail}` : fromEmail
    return (
      <Container>
        <Avatar isUser={message.is_from_user} initials={initials} />
        <TextContainer>
          <Header>
            <SenderName>
              {senderName}
            </SenderName>
            {isSent &&
              <TimeStamp>
                {moment(message.created_at).fromNow(true)}
              </TimeStamp>}
          </Header>
          {artworkPreview &&
            <ArtworkPreviewContainer>
              {artworkPreview}
            </ArtworkPreviewContainer>}

          {showPreview &&
            <ArtworkPreviewContainer>
              {showPreview}
            </ArtworkPreviewContainer>}

          {message.invoice &&
            <InvoicePreviewContainer>
              <InvoicePreview invoice={message.invoice} />
            </InvoicePreviewContainer>}

          {this.renderAttachmentPreviews(message.attachments)}

          <BodyText disabled={!isSent}>
            {message.body}
          </BodyText>

          {!message.is_from_user &&
            <FromSignature>
              {fromSignature}
            </FromSignature>}
        </TextContainer>
      </Container>
    )
  }
}

export default Relay.createContainer(Message, {
  fragments: {
    message: () => Relay.QL`
      fragment on Message {
        body
        created_at
        is_from_user
        from {
          name
          email
        }
        invoice {
          ${InvoicePreview.getFragment("invoice")}
        }
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
    body: string | null
    created_at: string | null
    is_from_user: boolean
    invoice: any | null
    from: {
      name: string | null
      email: string
    }
    attachments: Array<{
      id: string
      content_type: string
      download_url: string
    }>
  }
}
