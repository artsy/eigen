import { getOrderStatus } from "app/utils/getOrderStatus"

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
    expect(getOrderStatus("PAYMENT_FAILED")).toBe("payment failed")
  })
  it("returns empty string ('') for order states that are not displayed", () => {
    expect(getOrderStatus("ABANDONED")).toBe("")
    expect(getOrderStatus("PENDING")).toBe("")
  })
})
