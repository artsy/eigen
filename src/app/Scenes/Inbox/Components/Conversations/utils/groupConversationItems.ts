import { DateTime } from "luxon"
export interface ConversationItem {
  __typename: string
  createdAt?: string | null
  isFromUser?: boolean | null
}

/**
 * Combines messages into groups of messages sent by the same party and
 * separated out into different groups if sent across multiple days
 */
export const groupConversationItems = <T extends ConversationItem>(items: T[]): T[][] => {
  if (items.length === 0) {
    return []
  }
  // Make a copy of messages
  const remainingItems = [...items]
  const firstItem = remainingItems.pop()
  if (!firstItem) return []
  const groups = [[firstItem]]
  while (remainingItems.length > 0) {
    const lastGroup = groups[groups.length - 1]
    const lastItem = lastGroup[lastGroup.length - 1]
    const currentItem = remainingItems.pop()
    if (!currentItem) break

    const lastCreatedAt = DateTime.fromISO(lastItem?.createdAt as string)
    const currentCreatedAt = DateTime.fromISO(currentItem?.createdAt as string)
    const sameDay = lastCreatedAt.hasSame(currentCreatedAt, "day")
    const today = currentCreatedAt.hasSame(DateTime.now(), "day")

    const isMessage = (message: ConversationItem) => message.__typename === "Message"

    if (!isMessage(currentItem) || (isMessage(currentItem) && !isMessage(lastItem))) {
      groups.push([currentItem])
    } else if (sameDay && !today && lastItem.__typename === "Message") {
      lastGroup.push(currentItem)
    } else if (!today) {
      groups.push([currentItem])
    } else if (lastItem?.isFromUser !== currentItem?.isFromUser) {
      groups.push([currentItem])
    } else if (!sameDay && today) {
      groups.push([currentItem])
    } else {
      lastGroup.push(currentItem)
    }
  }
  return groups
}
