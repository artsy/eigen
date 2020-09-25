import moment from "moment"
import React from "react"
import { Dimensions, NativeModules, View } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import Hyperlink from "react-native-hyperlink"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

import DottedLine from "lib/Components/DottedLine"
import colors from "lib/data/colors"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { BodyText, FromSignatureText, MetadataText, SmallHeadline } from "../Typography"
import Avatar from "./Avatar"
import { FileDownloadFragmentContainer as FileDownload } from "./Preview/Attachment/FileDownload"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"

import { Schema, Track, track as _track } from "../../../utils/track"

import { Message_message } from "__generated__/Message_message.graphql"
import { compact } from "lodash"

const isPad = Dimensions.get("window").width > 700

const VerticalLayout = styled.View`
  flex-direction: column;
  flex: 1;
`

const HorizontalLayout = styled.View`
  flex-direction: row;
`

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
  margin-top: 7;
`

const SenderName = styled(SmallHeadline)`
  margin-right: 6;
  font-size: 11.5;
`

const FromSignature = styled(FromSignatureText)`
  margin-top: 10;
`

interface TimeStampProps {
  pending: boolean
}

const TimeStamp = styled(MetadataText)`
  font-size: 11.5;
  color: ${(p: TimeStampProps) => (p.pending ? colors["yellow-bold"] : colors["gray-medium"])};
`

const Seperator = styled(DottedLine)`
  padding-left: 20;
  padding-right: 20;
`

const PreviewContainer = styled.View`
  ${isPad ? "width: 295;" : ""};
  margin-bottom: 10;
`

interface Props {
  message: Message_message
  senderName: string
  initials?: string
  artworkPreview?: JSX.Element
  showPreview?: JSX.Element
  firstMessage: boolean
  index: number
  initialText: string
  conversationId: string
}

const track: Track<Props> = _track

@track()
export class Message extends React.Component<Props> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"]) {
    // reactNodeHandle is passed to the native side to decide which UIView to show the
    // download progress bar on.
    const previewAttachment = (reactNodeHandle: number, attachmentID: string) => {
      const attachment = compact(attachments).find(({ internalID }) => internalID === attachmentID)!
      NativeModules.ARScreenPresenterModule.presentMediaPreviewController(
        reactNodeHandle,
        attachment.downloadURL,
        attachment.contentType,
        attachment.internalID
      )
    }

    return compact(attachments).map((attachment) => {
      if (attachment.contentType.startsWith("image")) {
        return (
          <PreviewContainer key={attachment.id}>
            <ImagePreview attachment={attachment as any} onSelected={previewAttachment} />
          </PreviewContainer>
        )
      } else if (attachment.contentType === "application/pdf") {
        return (
          <PreviewContainer key={attachment.id}>
            <PDFPreview attachment={attachment as any} onSelected={previewAttachment} />
          </PreviewContainer>
        )
      } else if (attachment?.id) {
        return (
          <PreviewContainer key={attachment.id}>
            <FileDownload attachment={attachment} />
          </PreviewContainer>
        )
      }
    })
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationLink,
    owner_type: Schema.OwnerEntityTypes.Conversation,
    owner_id: props.conversationId,
  }))
  onLinkPress(url: string) {
    return SwitchBoard.presentNavigationViewController(this, url)
  }

  renderBody() {
    const { message, firstMessage, initialText } = this.props
    const isSent = !!message.created_at
    const body = firstMessage ? initialText : message.body

    const linkStyle = {
      color: colors["purple-regular"],
      textDecorationLine: "underline",
    }

    return (
      <Hyperlink onPress={this.onLinkPress.bind(this)} linkStyle={linkStyle}>
        <BodyText disabled={!isSent}>{body}</BodyText>
      </Hyperlink>
    )
  }

  render() {
    const { artworkPreview, initials, message, senderName, showPreview } = this.props
    const isPending = !message.created_at

    // @ts-ignore STRICTNESS_MIGRATION
    const fromName = message.from.name
    return (
      <Container>
        <Content>
          <Avatar
            isUser={message.is_from_user as any /* STRICTNESS_MIGRATION */}
            initials={initials as any /* STRICTNESS_MIGRATION */}
          />
          <TextContainer>
            <Header>
              <SenderName disabled={isPending}>{senderName}</SenderName>
              {
                <TimeStamp pending={isPending}>
                  {isPending
                    ? "pending"
                    : moment(
                        // @ts-ignore STRICTNESS_MIGRATION
                        message.created_at
                      ).fromNow(true) + " ago"}
                </TimeStamp>
              }
            </Header>
            {!!artworkPreview && <PreviewContainer>{artworkPreview}</PreviewContainer>}

            {!!showPreview && <PreviewContainer>{showPreview}</PreviewContainer>}

            {this.renderAttachmentPreviews(message.attachments)}

            {this.renderBody()}

            {!!(!message.is_from_user && fromName) && <FromSignature>{fromName}</FromSignature>}
          </TextContainer>
        </Content>
        {this.props.index !== 0 && <Seperator />}
      </Container>
    )
  }
}

export default createFragmentContainer(Message, {
  message: graphql`
    fragment Message_message on Message {
      body
      created_at: createdAt
      is_from_user: isFromUser
      from {
        name
        email
      }
      attachments {
        id
        internalID
        contentType
        downloadURL
        fileName
        ...ImagePreview_attachment
        ...PDFPreview_attachment
        ...FileDownload_attachment
      }
    }
  `,
})
