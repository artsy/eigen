import { Message_message } from "__generated__/Message_message.graphql"
import { OrderUpdate_event } from "__generated__/OrderUpdate_event.graphql"
import moment from "moment"
export interface ConversationItem {
  __typename: string
  createdAt?: string | null
  isFromUser?: boolean | null
}

// const getMessages = () => {}

// const getOrderUpdates = () => {}

// const combineAndSortConversationItems = (messages, updates) => {}

/**
 * Combines messages into groups of messages sent by the same party and
 * separated out into different groups if sent across multiple days
 */
export const groupMessages = <T extends ConversationItem[]>(messages: T): T[] => {
  if (messages.length === 0) {
    return []
  }
  // Make a copy of messages
  const remainingMessages = [...messages]
  const groups = [[remainingMessages.pop()!]]
  while (remainingMessages.length > 0) {
    const lastGroup = groups[groups.length - 1]
    const lastMessage = lastGroup[lastGroup.length - 1]
    const currentMessage = remainingMessages.pop()!

    const lastMessageCreatedAt = moment(lastMessage?.createdAt as string)
    const currentMessageCreatedAt = moment(currentMessage?.createdAt as string)
    const sameDay = lastMessageCreatedAt.isSame(currentMessageCreatedAt, "day")

    const today = currentMessageCreatedAt.isSame(moment(), "day")

    const isMessage = (message: ConversationItem) => message.__typename === "Message"

    if (!isMessage(currentMessage) || (isMessage(currentMessage) && !isMessage(lastMessage))) {
      groups.push([currentMessage])
    } else if (sameDay && !today && lastMessage.__typename === "Message") {
      lastGroup.push(currentMessage)
    } else if (!today) {
      groups.push([currentMessage])
    } else if (lastMessage?.isFromUser !== currentMessage?.isFromUser) {
      groups.push([currentMessage])
    } else if (!sameDay && today) {
      groups.push([currentMessage])
    } else {
      lastGroup.push(currentMessage)
    }
  }
  return groups
}
