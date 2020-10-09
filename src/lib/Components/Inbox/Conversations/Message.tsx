import { Message_message } from "__generated__/Message_message.graphql"

import { BoxProps, color, Flex, Sans, Spacer } from "palette"
import React from "react"
import { NativeModules, View } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import Hyperlink from "react-native-hyperlink"
import { createFragmentContainer } from "react-relay"
import styled from "styled-components/native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { FileDownloadFragmentContainer as FileDownload } from "./Preview/Attachment/FileDownload"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"
import { TimeSince } from "./TimeSince"

import { graphql } from "relay-runtime"
import { Schema, Track, track as _track } from "../../../utils/track"

import { compact } from "lodash"

const AttachmentContainer = styled(Flex)`
  border-radius: 15px;
`

const linkStyle = {
  color: color("purple100"),
  textDecorationLine: "underline",
}

interface Props extends Omit<BoxProps, "color"> {
  message: Message_message
  showTimeSince?: boolean
  conversationId: string
}

const track: Track<Props> = _track

@track()
export class Message extends React.Component<Props> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"], backgroundColor: "black100" | "black10") {
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

    return compact(attachments).map((attachment, index) => {
      const isImage = attachment?.contentType?.startsWith("image")
      const isPDF = attachment?.contentType === "application/pdf"
      return (
        <AttachmentContainer
          bg={backgroundColor}
          width="100%"
          p={1}
          flex={1}
          mb={index === attachments!.length - 1 ? 0 : 0.5}
        >
          {!!isImage && (
            <View key={attachment.id}>
              <ImagePreview attachment={attachment} onSelected={previewAttachment} />
            </View>
          )}
          {!!isPDF && (
            <View key={attachment.id}>
              <PDFPreview attachment={attachment} onSelected={previewAttachment} />
            </View>
          )}
          {!isImage && !isPDF && !!attachment?.id && (
            <View key={attachment.id}>
              <FileDownload attachment={attachment} />
            </View>
          )}
        </AttachmentContainer>
      )
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

  render() {
    const { message, showTimeSince, ...boxProps } = this.props
    const { isFromUser, body } = message
    const bgColor = isFromUser ? "black100" : "black10"
    const textColor = isFromUser ? "white100" : "black100"
    const alignSelf = isFromUser ? "flex-end" : undefined
    const alignAttachments = isFromUser ? "flex-end" : "flex-start"
    return (
      <>
        <Flex
          maxWidth="66.67%"
          flexDirection="column"
          alignItems={alignAttachments}
          flexGrow={1}
          flex={1}
          style={{ alignSelf }}
        >
          <AttachmentContainer {...boxProps} flex={1} bg={bgColor} p={1}>
            <Hyperlink onPress={this.onLinkPress.bind(this)} linkStyle={linkStyle}>
              <Sans size="4" color={textColor}>
                {body}
              </Sans>
            </Hyperlink>
          </AttachmentContainer>
          {!!message.attachments?.length && <Spacer mb={0.5} />}
          {this.renderAttachmentPreviews(message.attachments, bgColor)}
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
        ...PDFPreview_attachment
        ...ImagePreview_attachment
        ...FileDownload_attachment
      }
    }
  `,
})
