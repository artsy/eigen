import { Message_message$data } from "__generated__/Message_message.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
import { Schema, Track, track as _track } from "app/utils/track"
import { compact } from "lodash"
import { BoxProps, ClassTheme, Flex, Spacer, Text } from "palette"
import React from "react"
import { View } from "react-native"
import Hyperlink from "react-native-hyperlink"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"
import styled from "styled-components/native"
import { FileDownloadFragmentContainer as FileDownload } from "./Preview/Attachment/FileDownload"
import ImagePreview from "./Preview/Attachment/ImagePreview"
import PDFPreview from "./Preview/Attachment/PDFPreview"
import { TimeSince } from "./TimeSince"

const AttachmentContainer = styled(View)`
  border-radius: 15px;
  padding: 10px;
`

interface Props extends Omit<BoxProps, "color"> {
  message: Message_message$data
  showTimeSince?: boolean
  conversationId: string
}

const track: Track<Props> = _track

@track()
export class Message extends React.Component<Props> {
  renderAttachmentPreviews(attachments: Props["message"]["attachments"], backgroundColor: string) {
    // reactNodeHandle is passed to the native side to decide which UIView to show the
    // download progress bar on.
    const previewAttachment = (reactNodeHandle: number, attachmentID: string) => {
      const attachment = compact(attachments).find(({ internalID }) => internalID === attachmentID)!
      LegacyNativeModules.ARTNativeScreenPresenterModule.presentMediaPreviewController(
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
          style={{
            backgroundColor,
            flex: 1,
            marginBottom: index === attachments!.length - 1 ? 0 : 5,
            width: "100%",
          }}
          key={attachment.internalID}
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
    return navigate(url)
  }

  render() {
    const { message, showTimeSince } = this.props
    const { isFromUser, body } = message
    const textColor = isFromUser ? "white100" : "black100"
    const alignSelf = isFromUser ? "flex-end" : undefined
    const alignAttachments = isFromUser ? "flex-end" : "flex-start"
    return (
      <ClassTheme>
        {({ color }) => {
          const backgroundColor = color(isFromUser ? "black100" : "black10")
          return (
            <>
              <Flex
                maxWidth="66.67%"
                alignItems={alignAttachments}
                flexDirection="column"
                style={{ alignSelf }}
              >
                <AttachmentContainer
                  style={{
                    backgroundColor: color(isFromUser ? "black100" : "black10"),
                  }}
                >
                  <Hyperlink
                    onPress={this.onLinkPress.bind(this)}
                    linkStyle={{
                      color: color("blue100"),
                      textDecorationLine: "underline",
                    }}
                  >
                    <Text variant="sm" color={textColor}>
                      {body}
                    </Text>
                  </Hyperlink>
                </AttachmentContainer>
                {!!message.attachments?.length && <Spacer mb={0.5} />}
                {this.renderAttachmentPreviews(message.attachments, backgroundColor)}
              </Flex>
              {!!showTimeSince && (
                <TimeSince time={message.createdAt} style={{ alignSelf }} mt={0.5} />
              )}
            </>
          )
        }}
      </ClassTheme>
    )
  }
}

export default createFragmentContainer(Message, {
  message: graphql`
    fragment Message_message on Message {
      __typename
      body
      createdAt
      internalID
      isFromUser
      isFirstMessage
      from {
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
