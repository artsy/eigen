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

type DisplayableMessage = OrderUpdate_event | Message_message
interface MessageGroupProps {
  group: DisplayableMessage[]
  conversationId: string
  subjectItem: Item
}

const isMessage = (item: DisplayableMessage): item is Message_message => {
  return item.__typename === "Message"
}
export class MessageGroup extends React.Component<MessageGroupProps> {
  render() {
    // console.warn(
    //   this.props.group.map((item) => ({ createdAt: item.createdAt, type: item.__typename, body: item.body }))
    // )
    const orderEvents = ["CommerceOfferSubmittedEvent", "CommerceOrderStateChangedEvent"]
    const firstItem = this.props?.group[0]
    const isOrderEvent = "__typename" in firstItem && orderEvents.includes(firstItem.__typename)
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

          // if ("__typename" in message && orderEvents.includes(message.__typename)) {
          // if (orderEvents.includes(message.__typename)) {
          // maybe bug-prone to do this check
          // return (
          //   <React.Fragment key={`orderupdate-${messageIndex}`}>
          //     <OrderUpdate event={message} showTimeSince />
          //     <Spacer mb={2} />
          //   </React.Fragment>
          // )
          // } else {
          //   return null
          // }
          // } else {
          // const isOrderEvent = "__typename" in message && orderEvents.includes(message.__typename)
          // const isMessage = !isOrderEvent

          const nextMessage = group[messageIndex + 1]
          const senderChanges =
            !!nextMessage && "isFromUser" in nextMessage && nextMessage.isFromUser !== message.isFromUser
          const lastMessageInGroup = messageIndex === group.length - 1
          const spaceAfter = senderChanges || lastMessageInGroup ? 2 : 0.5
          const today = moment((group[0] as any).createdAt).isSame(moment(), "day")
          return (
            <React.Fragment key={messageKey}>
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
              {!!isOrderEvent && <OrderUpdateFragmentContainer event={message as OrderUpdate_event} />}
              <Spacer mb={spaceAfter} />
            </React.Fragment>
          )
        })}
      </View>
    )
  }
}
