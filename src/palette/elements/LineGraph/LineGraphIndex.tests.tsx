import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { LineGraphHeader } from "./LineGraphHeader"
import { LineGraphStore, LineGraphStoreProvider } from "./LineGraphStore"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"

jest.unmock("react-relay")

describe("LineGraphIndex", () => {
  let storeInstance: ReturnType<typeof LineGraphStore.useStore>

  const LineGraphStoreConsumer = () => {
    storeInstance = LineGraphStore.useStore()
    return null
  }

  const getWrapper = () => {
    return (
      <LineGraphStoreProvider
        initialData={{
          totalLots: 50,
          averagePrice: "USD $12,586",
          availableMediums: _AVAILABLE_MEDIUMS,
        }}
      >
        <LineGraphHeader />
        {/* Since we can't use hooks inside the tests because they need to be inside
        a functional component, we are using this trick to get an instance of the store */}
        <LineGraphStoreConsumer />
      </LineGraphStoreProvider>
    )
  }
  it("returns the average auction price and the number of lots when no value is selected", () => {
    const { getByText } = renderWithWrappersTL(getWrapper())
    expect(getByText("USD $12,586")).toBeTruthy()
    // We are not testing for the duration and the months since the logic might change
    expect(getByText(/50 lots/)).toBeTruthy()
  })

  it("returns the average auction price and the number of lots when no value is selected", async () => {
    const { getByText } = renderWithWrappersTL(getWrapper())
    storeInstance
      .getActions()
      .setActiveIndex({ year: 2020, numberOfLots: 26, averagePrice: "USD $100" })

    await flushPromiseQueue()
    expect(getByText("USD $100")).toBeTruthy()
    expect(getByText("26 lots in 2020")).toBeTruthy()
  })
})
