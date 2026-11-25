import { toShippingAnswers } from "app/Scenes/Sell/utils/shippingAnswers"

describe("toShippingAnswers", () => {
  it("passes specific answers through", () => {
    expect(
      toShippingAnswers({ packaging: "ROLLED", packer: "SELLER", delivery: "DROP_OFF" })
    ).toEqual({ packaging: "ROLLED", packer: "SELLER", courierHandoff: "SELLER_DROPOFF" })
    expect(
      toShippingAnswers({ packaging: "FRAMED", packer: "COURIER", delivery: "COLLECTION" })
    ).toEqual({ packaging: "FRAMED", packer: "COURIER", courierHandoff: "COURIER_PICKUP" })
  })

  it("saves “Open to both” as no preference", () => {
    expect(
      toShippingAnswers({ packaging: "EITHER", packer: "EITHER", delivery: "EITHER" })
    ).toEqual({
      packaging: "NO_PREFERENCE",
      packer: "NO_PREFERENCE",
      courierHandoff: "NO_PREFERENCE",
    })
  })
})
