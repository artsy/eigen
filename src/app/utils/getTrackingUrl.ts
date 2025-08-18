import { OrderHistoryRow_order$data } from "__generated__/OrderHistoryRow_order.graphql"
import { ExtractNodeType } from "app/utils/relayHelpers"

export type OrderHistoryRowLineItem = ExtractNodeType<OrderHistoryRow_order$data["lineItems"]>

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
