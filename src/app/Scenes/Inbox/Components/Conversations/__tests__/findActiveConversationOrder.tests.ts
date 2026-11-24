import { findActiveConversationOrder } from "app/Scenes/Inbox/Components/Conversations/utils/findActiveConversationOrder"

describe("findActiveConversationOrder", () => {
  const order = (overrides: {
    internalID: string
    buyerAction?: string | null
    impulseConversationId?: string | null
  }) => ({
    buyerAction: null,
    impulseConversationId: "conversation-id",
    ...overrides,
  })

  it("returns the first order from the conversation", () => {
    const orders = [order({ internalID: "a" }), order({ internalID: "b" })]

    expect(findActiveConversationOrder(orders, "conversation-id")?.internalID).toEqual("a")
  })

  it("ignores orders from other conversations or with no conversation", () => {
    const orders = [
      order({ internalID: "other", impulseConversationId: "other-id" }),
      order({ internalID: "none", impulseConversationId: null }),
      order({ internalID: "mine" }),
    ]

    expect(findActiveConversationOrder(orders, "conversation-id")?.internalID).toEqual("mine")
  })

  it("prefers an order waiting on the buyer over a newer one", () => {
    const orders = [
      order({ internalID: "newer" }),
      order({ internalID: "countered", buyerAction: "OFFER_RECEIVED" }),
    ]

    expect(findActiveConversationOrder(orders, "conversation-id")?.internalID).toEqual("countered")
  })

  it("skips null nodes", () => {
    const orders = [null, undefined, order({ internalID: "a" })]

    expect(findActiveConversationOrder(orders, "conversation-id")?.internalID).toEqual("a")
  })

  it("returns undefined without a conversation id or matching orders", () => {
    const orders = [order({ internalID: "a" })]

    expect(findActiveConversationOrder(orders, null)).toBeUndefined()
    expect(findActiveConversationOrder(orders, undefined)).toBeUndefined()
    expect(findActiveConversationOrder(orders, "other-id")).toBeUndefined()
    expect(findActiveConversationOrder([], "conversation-id")).toBeUndefined()
  })
})
