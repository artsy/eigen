import { groupConversationItems } from "app/Scenes/Inbox/Components/Conversations/utils/groupConversationItems"
import { DateTime } from "luxon"

const today = DateTime.local()

const userMessageFromToday = {
  __typename: "Message",
  createdAt: today.toISO(),
  isFromUser: true,
}

const partnerMessageFromToday = {
  __typename: "Message",
  createdAt: today.toISO(),
  isFromUser: false,
}

const secondPartnerMessageFromToday = {
  __typename: "Message",
  createdAt: today.plus({ minutes: 1 }).toISO(),
  isFromUser: false,
}

const orderUpdateFromToday = {
  __typename: "CommerceOrderStateChangeEvent",
  createdAt: today.toISO(),
}
const partnerMessageFromYesterday = {
  __typename: "Message",
  createdAt: today.minus({ days: 1, minutes: 3 }).toISO(),
  isFromUser: false,
}

const firstUserMessageFromYesterday = {
  __typename: "Message",
  createdAt: today.minus({ days: 1, minutes: 1 }).toISO(),
  isFromUser: true,
}

const secondUserMessageFromYesterday = {
  __typename: "Message",
  createdAt: today.minus({ days: 1 }).toISO(),
  isFromUser: true,
}

const userMessageFromDayBeforeYesterday = {
  __typename: "Message",
  createdAt: today.minus({ days: 2, minutes: 1 }).toISO(),
  isFromUser: true,
}

describe("groupMessages() helper", () => {
  it("returns an empty array if there are no messages", () => {
    const groupedMessages = groupConversationItems([])
    expect(groupedMessages).toEqual([])
  })

  it("treats each non-message as its own group", () => {
    const items = [userMessageFromToday, orderUpdateFromToday]
    const result = groupConversationItems(items)
    expect(result).toEqual([[orderUpdateFromToday], [userMessageFromToday]])
  })

  it("treats a message following a non-message as the start of a new group", () => {
    const items = [orderUpdateFromToday, userMessageFromToday]
    const result = groupConversationItems(items)
    expect(result).toEqual([[userMessageFromToday], [orderUpdateFromToday]])
  })

  describe("from before today", () => {
    it("groups consecutive messages sent by the same party on the same day", () => {
      const items = [
        firstUserMessageFromYesterday,
        secondUserMessageFromYesterday,
        userMessageFromToday,
      ]
      const result = groupConversationItems(items)
      expect(result).toEqual([
        [userMessageFromToday],
        [secondUserMessageFromYesterday, firstUserMessageFromYesterday],
      ])
    })

    it("separates messages sent on different days", () => {
      const items = [
        userMessageFromDayBeforeYesterday,
        firstUserMessageFromYesterday,
        userMessageFromToday,
      ]
      expect(groupConversationItems(items)).toEqual([
        [userMessageFromToday],
        [firstUserMessageFromYesterday],
        [userMessageFromDayBeforeYesterday],
      ])
    })

    it("combines messages sent from different parties on the same day", () => {
      const items = [
        partnerMessageFromYesterday,
        firstUserMessageFromYesterday,
        secondUserMessageFromYesterday,
      ]

      expect(groupConversationItems(items)).toEqual([
        [
          secondUserMessageFromYesterday,
          firstUserMessageFromYesterday,
          partnerMessageFromYesterday,
        ],
      ])
    })
  })
  describe("from today", () => {
    it("separates messages from different users", () => {
      const items = [partnerMessageFromToday, userMessageFromToday]

      expect(groupConversationItems(items)).toEqual([
        [userMessageFromToday],
        [partnerMessageFromToday],
      ])
    })
    it("separates messages created today from previous days", () => {
      const items = [
        firstUserMessageFromYesterday,
        secondUserMessageFromYesterday,
        userMessageFromToday,
      ]

      expect(groupConversationItems(items)).toEqual([
        [userMessageFromToday],
        [secondUserMessageFromYesterday, firstUserMessageFromYesterday],
      ])
    })
    it("groups consecutive messages sent today by the same party", () => {
      const items = [
        firstUserMessageFromYesterday,
        secondUserMessageFromYesterday,
        partnerMessageFromToday,
        secondPartnerMessageFromToday,
      ]
      expect(groupConversationItems(items)).toEqual([
        [secondPartnerMessageFromToday, partnerMessageFromToday],
        [secondUserMessageFromYesterday, firstUserMessageFromYesterday],
      ])
    })
  })
})
