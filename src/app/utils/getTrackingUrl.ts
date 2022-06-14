import { OrderHistoryRow_order$data } from "__generated__/OrderHistoryRow_order.graphql"
import { TrackOrderSection_section$data } from "__generated__/TrackOrderSection_section.graphql"

export type OrderHistoryRowLineItem = NonNullable<
  NonNullable<NonNullable<OrderHistoryRow_order$data["lineItems"]>["edges"]>[0]
>["node"]

export type OrderDetailsTrackOrderSectionLineItem = NonNullable<
  NonNullable<NonNullable<TrackOrderSection_section$data["lineItems"]>["edges"]>[0]
>["node"]

export function getTrackingUrl(
  orderLineItem: OrderHistoryRowLineItem | OrderDetailsTrackOrderSectionLineItem
): string | undefined {
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
