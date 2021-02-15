import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Message_message } from "__generated__/Message_message.graphql"
import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import moment from "moment"
import { Flex, Spacer } from "palette"

import { navigate } from "lib/navigation/navigate"
import { Message } from "./Message"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"
import { TimeSince } from "./TimeSince"

const SubjectContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
`
type Item = NonNullable<NonNullable<Messages_conversation["items"]>[0]>["item"]

interface MessageGroupProps {
  group: Message_message[]
  conversationId: string
  subjectItem: Item
}

export class MessageGroup extends React.Component<MessageGroupProps> {
  renderMessage = (message: Message_message, messageIndex: number) => {
    const { group, subjectItem, conversationId } = this.props
    const nextMessage = group[messageIndex + 1]
    const senderChanges = !!nextMessage && nextMessage.isFromUser !== message.isFromUser
    const lastMessageInGroup = messageIndex === group.length - 1
    const spaceAfter = senderChanges || lastMessageInGroup ? 2 : 0.5
    const today = moment(group[0].createdAt as string).isSame(moment(), "day")

    return (
      <React.Fragment key={`message-${message.internalID}`}>
        {!!message.isFirstMessage && (
          <SubjectContainer>
            {subjectItem?.__typename === "Artwork" && (
              <ArtworkPreview artwork={subjectItem} onSelected={() => navigate(subjectItem.href!)} />
            )}
            {subjectItem?.__typename === "Show" && (
              <ShowPreview show={subjectItem} onSelected={() => navigate(subjectItem.href!)} />
            )}
          </SubjectContainer>
        )}
        {!!message.body && (
          <Message
            message={message}
            key={message.internalID}
            showTimeSince={!!(message.createdAt && today && group.length - 1 === messageIndex)}
            conversationId={conversationId!}
          />
        )}
        <Spacer mb={spaceAfter} />
      </React.Fragment>
    )
  }
  render() {
    return (
      <View>
        <TimeSince style={{ alignSelf: "center" }} time={this.props.group[0].createdAt} exact mb="1" />
        {[...this.props.group].reverse().map(this.renderMessage)}
      </View>
    )
  }
}
