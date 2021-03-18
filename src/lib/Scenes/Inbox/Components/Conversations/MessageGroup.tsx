import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

import { Message_message } from "__generated__/Message_message.graphql"
import { Messages_conversation } from "__generated__/Messages_conversation.graphql"
import moment from "moment"
import { Flex, Spacer } from "palette"

import { OrderUpdate_event, OrderUpdate_event$key } from "__generated__/OrderUpdate_event.graphql"
import { navigate } from "lib/navigation/navigate"
import { Message } from "./Message"
import { OrderUpdateFragmentContainer } from "./OrderUpdate"
import ArtworkPreview from "./Preview/ArtworkPreview"
import ShowPreview from "./Preview/ShowPreview"
import { TimeSince } from "./TimeSince"
import { ArtworkPreview_artwork } from "__generated__/ArtworkPreview_artwork.graphql"
import { ShowPreview_show } from "__generated__/ShowPreview_show.graphql"

const SubjectContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-end;
`
type Item = NonNullable<NonNullable<Messages_conversation["items"]>[0]>["item"]

type DisplayableMessage = OrderUpdate_event | Message_message
interface MessageGroupProps {
  group: DisplayableMessage[]
  conversationId: string
  subjectItem: Item
}

const isMessage = (item: DisplayableMessage): item is Message_message => {
  return item.__typename === "Message"
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
  nextMessage?: DisplayableMessage
  isSameDay: boolean
}> = ({ message, nextMessage, subjectItem, conversationId, isLastMessage, isSameDay }) => {
  const senderChanges = !!(nextMessage && isMessage(nextMessage)) && nextMessage.isFromUser !== message.isFromUser
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
          key={message.internalID}
          showTimeSince={!!(message.createdAt && isSameDay && isLastMessage)}
          conversationId={conversationId!}
        />
      )}
      <Spacer mb={spaceAfter} />
    </React.Fragment>
  )
}

const IndividualEvent: React.FC<{ event: any }> = ({ event }) => {
  return (
    <React.Fragment>
      <OrderUpdateFragmentContainer event={event} />
      <Spacer mb={2} />
    </React.Fragment>
  )
}

export class MessageGroup extends React.Component<MessageGroupProps> {
  render() {
    const firstItem = this.props?.group[0]
    if (!firstItem) {
      return null
    }

    return (
      <View>
        {!!isMessage(firstItem) && (
          <TimeSince style={{ alignSelf: "center" }} time={firstItem.createdAt} exact mb={1} />
        )}
        {[...this.props.group].reverse().map((message: DisplayableMessage, messageIndex: number) => {
          const { group, subjectItem, conversationId } = this.props
          const messageKey = `message-${messageIndex}`
          if (isMessage(message)) {
            return (
              <IndividualMessage
                subjectItem={subjectItem as Exclude<typeof subjectItem, { __typename: "%other" }>}
                conversationId={conversationId}
                isLastMessage={messageIndex === group.length - 1}
                key={messageKey}
                message={message}
                nextMessage={group[messageIndex + 1]}
                isSameDay={moment((firstItem as any).createdAt).isSame(moment(), "day")}
              />
            )
          } else if (isRelevantEvent(message)) {
            return <IndividualEvent key={messageKey} event={message} />
          }
          return null
        })}
      </View>
    )
  }
}
