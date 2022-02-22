import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Message_message } from "__generated__/Message_message.graphql"
import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import moment from "moment"
import { Flex, Spacer, Text } from "palette"

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

const relevantEvents = ["CommerceOfferSubmittedEvent", "CommerceOrderStateChangedEvent"]
const isRelevantEventArray = (items: DisplayableMessage[]): items is OrderUpdate_event[] => {
  const firstItem = items[0]
  return firstItem?.__typename !== "Message" && relevantEvents.includes(firstItem.__typename)
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
        <>
          <Flex bg="black5" p={2} m={1} mb={3}>
            <Text color="black60" variant="sm">
              Be Protected by The Artsy Guarantee
            </Text>
            <Text color="black60" variant="xs" my={0.5}>
              To remain eligible for our buyer protections:{" "}
            </Text>
            <Text color="black60" variant="xs">
              • Keep all communications on Artsy
            </Text>
            <Text color="black60" variant="xs">
              • Never type sensitive information into this chat
            </Text>
            <Text color="black60" variant="xs">
              • Complete your purchase with Artsy’s secure checkout
            </Text>
          </Flex>
          <SubjectContainer>
            {subjectItem?.__typename === "Artwork" && (
              <ArtworkPreview
                artwork={subjectItem}
                onSelected={() => navigate(subjectItem.href!)}
              />
            )}
            {subjectItem?.__typename === "Show" && (
              <ShowPreview show={subjectItem} onSelected={() => navigate(subjectItem.href!)} />
            )}
          </SubjectContainer>
        </>
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
    const { group, conversationId } = this.props

    // Events come as a single item in an array
    if (isRelevantEventArray(group)) {
      const onlyEvent = group[0]
      return (
        <OrderUpdateFragmentContainer event={onlyEvent as any} conversationId={conversationId} />
      )
    }
    if (isMessageArray(group)) {
      const firstItem = group[0]
      return (
        <View>
          <TimeSince style={{ alignSelf: "center" }} time={firstItem.createdAt} exact mb={1} />
          {[...group].reverse().map((message: Message_message, messageIndex: number) => {
            const { subjectItem } = this.props
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
    return null
  }
}
