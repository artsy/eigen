import {
  CommerceBuyerOfferActionEnum,
  CommerceOrderDisplayStateEnum,
} from "__generated__/OrderHistoryRow_order.graphql"

export function getOrderStatus(
  displayState: CommerceOrderDisplayStateEnum | CommerceBuyerOfferActionEnum
): string {
  switch (displayState) {
    case "SUBMITTED":
      return "pending"
    case "APPROVED":
      return "confirmed"
    case "FULFILLED":
      return "delivered"
    case "REFUNDED":
      return "refunded"
    case "PROCESSING":
      return "processing"
    case "PROCESSING_APPROVAL":
      return "payment processing"
    case "IN_TRANSIT":
      return "in transit"
    case "CANCELED":
      return "canceled"
    case "PAYMENT_FAILED":
      return "payment failed"
    case "OFFER_RECEIVED":
      return "counteroffer received"
    default:
      return ""
  }
}
