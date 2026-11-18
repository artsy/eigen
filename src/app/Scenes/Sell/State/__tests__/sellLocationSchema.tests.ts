import {
  sellAuctionLocationSchema,
  sellMarketplaceShippingSchema,
} from "app/Scenes/Sell/State/sellLocationSchema"

const LOCATION = { address: { internalID: "address-1" }, phoneNumber: "555 0100" }
const SHIPPING = { packaging: "FRAMED", packer: "COURIER", delivery: "EITHER" }

describe("sellAuctionLocationSchema", () => {
  it("passes with an address and a phone number", () => {
    expect(sellAuctionLocationSchema.isValidSync(LOCATION)).toBe(true)
  })

  it("needs an address", () => {
    expect(sellAuctionLocationSchema.isValidSync({ ...LOCATION, address: null })).toBe(false)
  })

  it("needs a phone number that isn’t only spaces", () => {
    expect(sellAuctionLocationSchema.isValidSync({ ...LOCATION, phoneNumber: "  " })).toBe(false)
  })
})

describe("sellMarketplaceShippingSchema", () => {
  it("passes with the location and all three shipping answers", () => {
    expect(sellMarketplaceShippingSchema.isValidSync({ ...LOCATION, ...SHIPPING })).toBe(true)
  })

  it.each(["packaging", "packer", "delivery"])("needs %s", (field) => {
    expect(
      sellMarketplaceShippingSchema.isValidSync({ ...LOCATION, ...SHIPPING, [field]: null })
    ).toBe(false)
  })

  it("needs the location too", () => {
    expect(
      sellMarketplaceShippingSchema.isValidSync({ ...SHIPPING, phoneNumber: "555 0100" })
    ).toBe(false)
  })
})
