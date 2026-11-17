import { SellSavedAddress, sellLocationStoreModel } from "app/Scenes/Sell/State/SellLocationStore"
import { createStore } from "easy-peasy"

const ADDRESS: SellSavedAddress = {
  internalID: "address-1",
  name: "Collector",
  addressLine1: "401 Broadway",
  addressLine2: null,
  city: "New York",
  region: "NY",
  postalCode: "10013",
  country: "US",
  isDefault: true,
  phoneNumber: "555 0100",
}

describe("SellLocationStore", () => {
  it("fills an empty phone number from the address, but keeps one already typed", () => {
    const store = createStore(sellLocationStoreModel)

    store.getActions().setAddress(ADDRESS)
    expect(store.getState().phoneNumber).toBe("555 0100")

    store.getActions().setPhoneNumber("555 0199")
    store.getActions().setAddress({ ...ADDRESS, phoneNumber: "555 0123" })
    expect(store.getState().phoneNumber).toBe("555 0199")
  })

  it("needs an address for the location", () => {
    const store = createStore(sellLocationStoreModel)
    expect(store.getState().locationComplete).toBe(false)

    store.getActions().setAddress(ADDRESS)
    expect(store.getState().locationComplete).toBe(true)
  })

  it("needs all three shipping answers", () => {
    const store = createStore(sellLocationStoreModel)

    store.getActions().setPackaging("FRAMED")
    store.getActions().setPacker("COURIER")
    expect(store.getState().shippingComplete).toBe(false)

    store.getActions().setDelivery("EITHER")
    expect(store.getState().shippingComplete).toBe(true)
  })
})
