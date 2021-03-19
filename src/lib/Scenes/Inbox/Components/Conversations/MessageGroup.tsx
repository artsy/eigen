import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Message_message } from "__generated__/Message_message.graphql"
import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import moment from "moment"
import { Flex, Spacer } from "palette"

import { OrderUpdate_event } from "__generated__/OrderUpdate_event.graphql"
import { navigate } from "lib/navigation/navigate"
import { Message } from "./Message"
import { OrderUpdateFragmentContainer } from "./OrderUpdate"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"
import { TimeSince } from "./TimeSince"

const SubjectContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
`
type Item = NonNullable<NonNullable<Messages_conversation["items"]>[0]>["item"]

export type DisplayableMessage = OrderUpdate_event | Message_message
interface MessageGroupProps {
  group: DisplayableMessage[]
  conversationId: string
  subjectItem: Item
}

const isMessageArray = (items: DisplayableMessage[]): items is Message_message[] => {
  return items[0].__typename === "Message"
}

const orderEvents = ["CommerceOfferSubmittedEvent", "CommerceOrderStateChangedEvent"]
const isRelevantEvent = (item: DisplayableMessage): item is OrderUpdate_event => {
  return item.__typename !== "Message" && orderEvents.includes(item.__typename)
}

const IndividualMessage: React.FC<{
  subjectItem?: any
  isLastMessage: boolean
  conversationId: string
  message: Message_message
  nextMessage?: Message_message
  isSameDay: boolean
}> = ({ message, nextMessage, subjectItem, conversationId, isLastMessage, isSameDay }) => {
  const senderChanges = !!nextMessage && nextMessage.isFromUser !== message.isFromUser
  const spaceAfter = senderChanges || isLastMessage ? 2 : 0.5
  return (
    <React.Fragment>
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
          showTimeSince={!!(message.createdAt && isSameDay && isLastMessage)}
          conversationId={conversationId!}
        />
      )}
      <Spacer mb={spaceAfter} />
    </React.Fragment>
  )
}

export class MessageGroup extends React.Component<MessageGroupProps> {
  render() {
    const { group } = this.props
    const firstItem = group[0]
    if (!firstItem) {
      return null
    }
    // Events come as a single item in an array
    if (isRelevantEvent(firstItem)) {
      return <OrderUpdateFragmentContainer event={firstItem as any} />
    }
    if (isMessageArray(group)) {
      return (
        <View>
          <TimeSince style={{ alignSelf: "center" }} time={firstItem.createdAt} exact mb={1} />
          {[...group].reverse().map((message: Message_message, messageIndex: number) => {
            const { subjectItem, conversationId } = this.props
            const messageKey = `message-${messageIndex}`
            return (
              <IndividualMessage
                subjectItem={subjectItem}
                conversationId={conversationId}
                isLastMessage={messageIndex === group.length - 1}
                key={messageKey}
                message={message}
                nextMessage={group[messageIndex + 1]}
                isSameDay={moment(firstItem.createdAt!).isSame(moment(), "day")}
              />
            )
          })}
        </View>
      )
    }
  }
}
