import { OrderHistoryRowLineItem } from "./getTrackingUrl"

export type OrderState = "APPROVED" | "CANCELED" | "FULFILLED" | "REFUNDED" | "SUBMITTED"
export type ShipmentStatus = "PENDING" | "CONFIRMED" | "COLLECTED" | "IN_TRANSIT" | "COMPLETED" | "CANCELED"

enum ORDER_STATUSES {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Delivered = "Delivered",
  Canceled = "Canceled",
  Refunded = "Refunded",
}

enum SHIPMENT_STATUSES {
  Processing = "Processing",
  InTransit = "In transit",
  Delivered = "Delivered",
  Canceled = "Canceled",
}

const orderStatusesMap = {
  SUBMITTED: ORDER_STATUSES.Pending,
  APPROVED: ORDER_STATUSES.Confirmed,
  FULFILLED: ORDER_STATUSES.Delivered,
  CANCELLED: ORDER_STATUSES.Canceled,
  REFUNDED: ORDER_STATUSES.Refunded,
  PENDING: SHIPMENT_STATUSES.Processing,
  CONFIRMED: SHIPMENT_STATUSES.Processing,
  COLLECTED: SHIPMENT_STATUSES.InTransit,
  IN_TRANSIT: SHIPMENT_STATUSES.InTransit,
  COMPLETED: SHIPMENT_STATUSES.Delivered,
  CANCELED: SHIPMENT_STATUSES.Canceled,
}

export function getOrderStatus(orderLineItem: OrderHistoryRowLineItem, orderState: OrderState): string {
  if (orderState === "CANCELED" || orderState === "REFUNDED" || !orderLineItem?.shipment?.status) {
    return orderStatusesMap[orderState].toLowerCase()
  }

  const shipment: ShipmentStatus = orderLineItem.shipment.status.toUpperCase() as ShipmentStatus

  return orderStatusesMap[shipment].toLowerCase()
}
