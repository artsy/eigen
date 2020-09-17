import { Message_message } from "__generated__/Message_message.graphql"
import { Box, BoxProps, color, Flex, Sans, Spacer } from "palette"
import React from "react"
import { Dimensions, View } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import Hyperlink from "react-native-hyperlink"
import { createFragmentContainer } from "react-relay"
import styled from "styled-components"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import Avatar from "./Avatar"
import { FileDownloadFragmentContainer as FileDownload } from "./Preview/Attachment/FileDownload"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import { PDFPreview } from "./Preview/Attachment/PDFPreview"
import { TimeSince } from "./TimeSince"

import { graphql } from "relay-runtime"
import { Schema, Track, track as _track } from "../../../utils/track"

const isPad = Dimensions.get("window").width > 700

const MessageBox = styled(Box)`
  border-radius: 15;
  padding: 10px;
`

const PreviewContainer = styled(View)`
  ${isPad ? "width: 295;" : ""};
`

const linkStyle = {
  color: color("purple100"),
  textDecorationLine: "underline",
}

interface Props extends Omit<BoxProps, "color"> {
  message: Message_message
  initials?: string
  showTimeSince?: boolean
  showAvatar?: boolean
  conversationId: string
}

const track: Track<Props> = _track

@track()
export class Message extends React.Component<Props> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"], backgroundColor: "black100" | "black10") {
    // This function does not use the arrow syntax, because it shouldn’t be force bound to this component. Instead, it
    // gets bound to the AttachmentPreview component instance that’s touched, so we can pass `this` to `findNodeHandle`.
    // @ts-ignore STRICTNESS_MIGRATION
    const previewAttachment = function (this: React.Component<any, any>, attachmentID) {
      // @ts-ignore STRICTNESS_MIGRATION
      const attachment = attachments.find(({ internalID }) => internalID === attachmentID)
      SwitchBoard.presentMediaPreviewController(
        this,
        // @ts-ignore STRICTNESS_MIGRATION
        attachment.downloadURL,
        // @ts-ignore STRICTNESS_MIGRATION
        attachment.contentType,
        // @ts-ignore STRICTNESS_MIGRATION
        attachment.internalID
      )
    }

    // @ts-ignore STRICTNESS_MIGRATION
    return attachments.map((attachment, index) => {
      const isImage = attachment?.contentType?.startsWith("image")
      const isPDF = attachment?.contentType === "application/pdf"
      return (
        <MessageBox bg={backgroundColor} style={{ width: "100%" }} mb={index === attachments!.length - 1 ? 0 : 0.5}>
          {// @ts-ignore STRICTNESS_MIGRATION
          !!isImage && (
            // @ts-ignore STRICTNESS_MIGRATION
            <PreviewContainer key={attachment.id}>
              <ImagePreview attachment={attachment as any} onSelected={previewAttachment} />
            </PreviewContainer>
          )}
          {// @ts-ignore STRICTNESS_MIGRATION
          !!isPDF && (
            // @ts-ignore STRICTNESS_MIGRATION
            <PreviewContainer key={attachment.id}>
              <PDFPreview attachment={attachment as any} onSelected={previewAttachment} />
            </PreviewContainer>
          )}
          { !isImage && !isPDF && !!attachment?.id && (
            <PreviewContainer key={attachment.id}>
              <FileDownload attachment={attachment} />
            </PreviewContainer>
          )}
        </MessageBox>
      )
    })
  }

  @track((props) => ({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.ConversationLink,
    owner_type: Schema.OwnerEntityTypes.Conversation,
    owner_id: props.conversationId,
  }))
  // @ts-ignore STRICTNESS_MIGRATION
  onLinkPress(url) {
    return SwitchBoard.presentNavigationViewController(this, url)
  }

  render() {
    const { message, initials, showAvatar, showTimeSince, ...boxProps } = this.props
    const { isFromUser, body } = message
    const bgColor = isFromUser ? "black100" : "black10"
    const textColor = isFromUser ? "white100" : "black100"
    const alignSelf = isFromUser ? "flex-end" : undefined
    const alignAttachments = isFromUser ? "flex-end" : "flex-start"
    return (
      <>
        <Flex
          maxWidth="66.67%"
          flexDirection="row"
          style={{
            alignSelf,
          }}
        >
          {!isFromUser && (
            <Box {...boxProps} width={46} mr={10}>
              {!!showAvatar && (
                <Avatar
                  isUser={message.isFromUser as any /* STRICTNESS_MIGRATION */}
                  initials={initials as any /* STRICTNESS_MIGRATION */}
                />
              )}
            </Box>
          )}
          <Flex style={{ flexDirection: "column", alignItems: alignAttachments, flexGrow: 1, flex: 1 }}>
            <MessageBox {...boxProps} bg={bgColor}>
              <Hyperlink onPress={this.onLinkPress.bind(this)} linkStyle={linkStyle}>
                <Sans size="4" color={textColor}>
                  {body}
                </Sans>
              </Hyperlink>
            </MessageBox>
            {!!message.attachments?.length && <Spacer mb={0.5} />}
            {this.renderAttachmentPreviews(message.attachments, bgColor)}
          </Flex>
        </Flex>
        {showTimeSince && <TimeSince time={message.createdAt} style={{ alignSelf }} mt={0.5} />}
      </>
    )
  }
}

export default createFragmentContainer(Message, {
  message: graphql`
    fragment Message_message on Message {
      body
      createdAt
      internalID
      isFromUser
      isFirstMessage
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
