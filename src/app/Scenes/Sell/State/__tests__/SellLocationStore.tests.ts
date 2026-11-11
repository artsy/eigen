import { sellLocationStoreModel } from "app/Scenes/Sell/State/SellLocationStore"
import { createStore } from "easy-peasy"

const ADDRESS = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

describe("SellLocationStore", () => {
  it("fills the postal code from the picked address, and keeps a typed one when Google has none", () => {
    const store = createStore(sellLocationStoreModel)

    store.getActions().setPostalCode("10001")
    store.getActions().setAddress(ADDRESS)
    expect(store.getState().postalCode).toBe("10001")

    store.getActions().setAddress({ ...ADDRESS, postalCode: "10013-1234" })
    expect(store.getState().postalCode).toBe("10013")
  })

  it("needs a picked address and a five digit postal code for the location", () => {
    const store = createStore(sellLocationStoreModel)

    store.getActions().setPostalCode("10013")
    expect(store.getState().locationComplete).toBe(false)

    store.getActions().setAddress(ADDRESS)
    expect(store.getState().locationComplete).toBe(true)

    store.getActions().setPostalCode("1001")
    expect(store.getState().locationComplete).toBe(false)
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
