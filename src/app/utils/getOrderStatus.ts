import { CommerceOrderDisplayStateEnum } from "__generated__/OrderDetailsHeader_info.graphql"

const orderStatusesMap = {
  SUBMITTED: "Pending",
  APPROVED: "Confirmed",
  FULFILLED: "Delivered",
  REFUNDED: "Refunded",
  PROCESSING: "Processing",
  PROCESSING_APPROVAL: "Payment processing",
  IN_TRANSIT: "In transit",
  CANCELED: "Canceled",
}

export function getOrderStatus(displayState: CommerceOrderDisplayStateEnum) {
  switch (displayState) {
    case "SUBMITTED":
    case "APPROVED":
    case "FULFILLED":
    case "REFUNDED":
    case "PROCESSING":
    case "PROCESSING_APPROVAL":
    case "IN_TRANSIT":
    case "CANCELED":
      return orderStatusesMap[displayState].toLowerCase()
    default:
      return "unknown"
  }
}
