import { getOrderStatus } from "./getOrderStatus"

describe(getOrderStatus, () => {
  it("returns human-readable versions of order states", () => {
    expect(getOrderStatus("SUBMITTED")).toBe("pending")
    expect(getOrderStatus("APPROVED")).toBe("confirmed")
    expect(getOrderStatus("FULFILLED")).toBe("delivered")
    expect(getOrderStatus("CANCELED")).toBe("canceled")
    expect(getOrderStatus("REFUNDED")).toBe("refunded")
    expect(getOrderStatus("PROCESSING")).toBe("processing")
    expect(getOrderStatus("PROCESSING_APPROVAL")).toBe("payment processing")
    expect(getOrderStatus("IN_TRANSIT")).toBe("in transit")
    expect(getOrderStatus("CANCELED")).toBe("canceled")
  })
  it("returns 'unknown' for order states that are not displayed", () => {
    expect(getOrderStatus("ABANDONED")).toBe("unknown")
    expect(getOrderStatus("PENDING")).toBe("unknown")
  })
})
