interface ConversationOrder {
  buyerAction?: string | null
  impulseConversationId?: string | null
}

/**
 * Picks the order the inbox CTA acts on.
 *
 * `collectorOrdersConnection` returns every order the buyer has on the
 * conversation's artwork (from any conversation, newest created first) and can
 * contain null nodes. Keep only this conversation's orders, like the legacy
 * stitched `orderConnection` did, and prefer the one waiting on the buyer.
 */
export const findActiveConversationOrder = <T extends ConversationOrder | null | undefined>(
  orders: ReadonlyArray<T>,
  conversationId: string | null | undefined
): NonNullable<T> | undefined => {
  if (!conversationId) return undefined

  const conversationOrders = orders.filter(
    (order): order is NonNullable<T> => order?.impulseConversationId === conversationId
  )

  return conversationOrders.find((order) => order.buyerAction) ?? conversationOrders[0]
}
