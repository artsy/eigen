import { getOrderStatus } from "../getOrderStatus"

describe(getOrderStatus, () => {
  let mockLineItem: any
  describe("without shipment status", () => {
    mockLineItem = { shipment: null }
    it("returns correct statuses", () => {
      expect(getOrderStatus(mockLineItem, "SUBMITTED")).toBe("pending")
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("confirmed")
      expect(getOrderStatus(mockLineItem, "FULFILLED")).toBe("delivered")
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
    })
  })

  describe("with shipment status", () => {
    it("returns correct statuses", () => {
      mockLineItem = { shipment: { status: "pending" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("processing")
      mockLineItem = { shipment: { status: "confirmed" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("processing")
      mockLineItem = { shipment: { status: "collected" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("in transit")
      mockLineItem = { shipment: { status: "in_transit" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("in transit")
      mockLineItem = { shipment: { status: "completed" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("delivered")
      mockLineItem = { shipment: { status: "canceled" } }
      expect(getOrderStatus(mockLineItem, "APPROVED")).toBe("canceled")
    })
  })

  describe("CANCELED/REFUNDED order states", () => {
    it("CANCELED overrides any shipment status", () => {
      mockLineItem = { shipment: { status: "pending" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      mockLineItem = { shipment: { status: "confirmed" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      mockLineItem = { shipment: { status: "collected" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      mockLineItem = { shipment: { status: "in_transit" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      mockLineItem = { shipment: { status: "completed" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
      mockLineItem = { shipment: { status: "canceled" } }
      expect(getOrderStatus(mockLineItem, "CANCELED")).toBe("canceled")
    })

    it("REFUNDED overrides any shipment status", () => {
      mockLineItem = { shipment: { status: "pending" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
      mockLineItem = { shipment: { status: "confirmed" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
      mockLineItem = { shipment: { status: "collected" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
      mockLineItem = { shipment: { status: "in_transit" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
      mockLineItem = { shipment: { status: "completed" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
      mockLineItem = { shipment: { status: "canceled" } }
      expect(getOrderStatus(mockLineItem, "REFUNDED")).toBe("refunded")
    })
  })
})
