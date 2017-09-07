import moment from "moment"
import * as React from "react"
import { View } from "react-native"
import Hyperlink from "react-native-hyperlink"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import colors from "../../../../data/colors"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import DottedLine from "../../DottedLine"
import { BodyText, FromSignatureText, MetadataText, SmallHeadline } from "../Typography"
import Avatar from "./Avatar"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"
import InvoicePreview from "./Preview/InvoicePreview"

const VerticalLayout = styled.View`
  flex-direction: column;
  flex: 1;
`

const HorizontalLayout = styled.View`flex-direction: row;`

const Container = styled(View)`
  padding-left: 20;
  padding-right: 20;
`

const Content = styled(HorizontalLayout)`
  align-self: stretch;
  margin-top: 15;
  margin-bottom: 10;
`

const Header = styled(HorizontalLayout)`
  align-self: stretch;
  margin-bottom: 10;
`

const TextContainer = styled(VerticalLayout)`
  margin-left: 10;
`

const SenderName = styled(SmallHeadline)`
  marginRight: 6
  font-size: 11.5
`

const FromSignature = styled(FromSignatureText)`
  marginTop: 10
`

interface TimeStampProps {
  pending: boolean
}

const TimeStamp = styled(MetadataText)`
  font-size: 11.5
  color: ${(p: TimeStampProps) => (p.pending ? colors["yellow-bold"] : colors["gray-medium"])}
`

const Seperator = styled(DottedLine)`
  padding-left: 20;
  padding-right: 20;
`

const PreviewContainer = styled.View`margin-bottom: 10;`

interface Props extends RelayProps {
  senderName: string
  initials?: string
  artworkPreview?: JSX.Element
  showPreview?: JSX.Element
  firstMessage: boolean
  index: number
  initialText: string
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
          <PreviewContainer key={attachment.id}>
            <ImagePreview attachment={attachment as any} onSelected={previewAttachment} />
          </PreviewContainer>
        )
      }
      if (attachment.content_type === "application/pdf") {
        return (
          <PreviewContainer key={attachment.id}>
            <PDFPreview attachment={attachment as any} onSelected={previewAttachment} />
          </PreviewContainer>
        )
      }
    })
  }

  renderBody() {
    const { message, firstMessage, initialText } = this.props
    const isSent = !!message.created_at
    const body = firstMessage ? initialText : message.body

    const onLinkPress = url => {
      return SwitchBoard.presentNavigationViewController(this, url)
    }

    const linkStyle = {
      color: "#0645ad",
    }

    return (
      <Hyperlink onPress={onLinkPress} linkStyle={linkStyle}>
        <BodyText disabled={!isSent}>
          {body}
        </BodyText>
      </Hyperlink>
    )
  }

  render() {
    const { artworkPreview, initials, message, senderName, showPreview } = this.props
    const isPending = !message.created_at

    const fromName = message.from.name
    const fromEmail = message.from.email

    const fromSignature = fromName ? `${fromName} · ${fromEmail}` : fromEmail

    let previewInvoice
    if (message.invoice) {
      previewInvoice = () => {
        SwitchBoard.presentNavigationViewController(this, message.invoice.payment_url)
      }
    }
    return (
      <Container>
        <Content>
          <Avatar isUser={message.is_from_user} initials={initials} />
          <TextContainer>
            <Header>
              <SenderName disabled={isPending}>
                {senderName}
              </SenderName>
              {
                <TimeStamp pending={isPending}>
                  {isPending ? "pending" : moment(message.created_at).fromNow(true)}
                </TimeStamp>
              }
            </Header>
            {artworkPreview &&
              <PreviewContainer>
                {artworkPreview}
              </PreviewContainer>}

            {showPreview &&
              <PreviewContainer>
                {showPreview}
              </PreviewContainer>}

            {message.invoice &&
              <PreviewContainer>
                <InvoicePreview invoice={message.invoice} onSelected={previewInvoice} />
              </PreviewContainer>}

            {this.renderAttachmentPreviews(message.attachments)}

            {this.renderBody()}

            {!message.is_from_user &&
              <FromSignature>
                {fromSignature}
              </FromSignature>}
          </TextContainer>
        </Content>
        {this.props.index !== 0 && <Seperator />}
      </Container>
    )
  }
}

export default createFragmentContainer(
  Message,
  graphql`
    fragment Message_message on Message {
      body
      created_at
      is_from_user
      from {
        name
        email
      }
      invoice {
        payment_url
        ...InvoicePreview_invoice
      }
      attachments {
        id
        content_type
        download_url
        file_name
        ...ImagePreview_attachment
        ...PDFPreview_attachment
      }
    }
  `
)

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
