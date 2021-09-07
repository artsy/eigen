import { OrderHistoryRow_order } from "__generated__/OrderHistoryRow_order.graphql"

export type OrderHistoryRowLineItem = NonNullable<
  NonNullable<NonNullable<OrderHistoryRow_order["lineItems"]>["edges"]>[0]
>["node"]

export function getTrackingUrl(orderLineItem: OrderHistoryRowLineItem): string | undefined {
  const trackingId = orderLineItem?.fulfillments?.edges?.[0]?.node?.trackingId
  const trackingNumber = orderLineItem?.shipment?.trackingNumber
  const trackingUrl = orderLineItem?.shipment?.trackingUrl
  let result

  if (trackingUrl) {
    result = trackingUrl
  } else if (trackingNumber || trackingId) {
    result = `https://google.com/search?q=${trackingNumber || trackingId}`
  }

  return result
}
