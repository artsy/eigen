import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Message_message$data } from "__generated__/Message_message.graphql"
import { Messages_conversation$data } from "__generated__/Messages_conversation.graphql"
import moment from "moment"
import { Flex, Spacer } from "palette"

import { OrderUpdate_event$data } from "__generated__/OrderUpdate_event.graphql"
import { navigate } from "app/navigation/navigate"
import { Message } from "./Message"
import { OrderUpdateFragmentContainer } from "./OrderUpdate"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"
import { TimeSince } from "./TimeSince"

const SubjectContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
`
type Item = NonNullable<NonNullable<Messages_conversation$data["items"]>[0]>["item"]

export type DisplayableMessage = OrderUpdate_event$data | Message_message$data
interface MessageGroupProps {
  group: DisplayableMessage[]
  conversationId: string
  subjectItem: Item
  isLastMessage: boolean
}

const isMessageArray = (items: DisplayableMessage[]): items is Message_message$data[] => {
  return items[0].__typename === "Message"
}

const relevantEvents = ["CommerceOfferSubmittedEvent", "CommerceOrderStateChangedEvent"]
const isRelevantEventArray = (items: DisplayableMessage[]): items is OrderUpdate_event$data[] => {
  const firstItem = items[0]
  return firstItem?.__typename !== "Message" && relevantEvents.includes(firstItem.__typename)
}

const IndividualMessage: React.FC<{
  isLastMessage: boolean
  conversationId: string
  message: Message_message$data
  nextMessage?: Message_message$data
  isSameDay: boolean
}> = ({ message, nextMessage, conversationId, isLastMessage, isSameDay }) => {
  const senderChanges = !!nextMessage && nextMessage.isFromUser !== message.isFromUser
  const spaceAfter = senderChanges || isLastMessage ? 2 : 0.5
  return (
    <React.Fragment>
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

const InitialMessage: React.FC<{
  subjectItem?: any
  createdAt?: string | null
}> = ({ subjectItem, createdAt = null }) => {
  return (
    <>
      <SubjectContainer>
        {subjectItem?.__typename === "Artwork" && (
          <ArtworkPreview artwork={subjectItem} onSelected={() => navigate(subjectItem.href!)} />
        )}
        {subjectItem?.__typename === "Show" && (
          <ShowPreview show={subjectItem} onSelected={() => navigate(subjectItem.href!)} />
        )}
      </SubjectContainer>
      {!!createdAt && <TimeSince style={{ alignSelf: "center" }} time={createdAt} exact mb={1} />}
    </>
  )
}

export class MessageGroup extends React.Component<MessageGroupProps> {
  render() {
    const { group, conversationId, isLastMessage, subjectItem } = this.props
    if (group[0].__typename === "%other") {
      return null
    }

    // Events come as a single item in an array
    if (isRelevantEventArray(group)) {
      const onlyEvent = group[0]
      return (
        <>
          {!!isLastMessage && (
            <InitialMessage subjectItem={subjectItem} createdAt={onlyEvent.createdAt} />
          )}
          <OrderUpdateFragmentContainer event={onlyEvent as any} conversationId={conversationId} />
        </>
      )
    }
    if (isMessageArray(group)) {
      const firstItem = group[0]
      return (
        <>
          <View>
            {!isLastMessage && (
              <TimeSince style={{ alignSelf: "center" }} time={firstItem.createdAt} exact mb={1} />
            )}
            {[...group].reverse().map((message: Message_message$data, messageIndex: number) => {
              const messageKey = `message-${messageIndex}`
              return (
                <IndividualMessage
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

          {!!isLastMessage && (
            <InitialMessage subjectItem={subjectItem} createdAt={firstItem.createdAt} />
          )}
        </>
      )
    }
    return null
  }
}
