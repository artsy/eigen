import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { flushPromiseQueue } from "../../../app/tests/flushPromiseQueue"
import { CategoryPill, LineGraphCategoryPicker } from "./LineGraphCategoryPicker"
import { LineGraphStoreProvider } from "./LineGraphStore"
import { _AVAILABLE_MEDIUMS } from "./testHelpers"

jest.unmock("react-relay")

describe(LineGraphCategoryPicker, () => {
  const getWrapper = () => {
    return (
      <LineGraphStoreProvider
        initialData={{
          totalLots: 50,
          averagePrice: "USD $12,586",
          availableMediums: _AVAILABLE_MEDIUMS,
        }}
      >
        <LineGraphCategoryPicker />
      </LineGraphStoreProvider>
    )
  }

  it("renders the list of available mediums", async () => {
    const { getByTestId } = renderWithWrappersTL(getWrapper())
    expect(getByTestId("line-graph-medium-picker")).toBeTruthy()
    expect(getByTestId("line-graph-medium-picker").props.data).toEqual(
      ["All"].concat(_AVAILABLE_MEDIUMS)
    )
  })
})

describe(MediumPill, () => {
  const getWrapper = () => {
    return (
      <LineGraphStoreProvider
        initialData={{
          totalLots: 50,
          averagePrice: "USD $12,586",
          availableMediums: _AVAILABLE_MEDIUMS,
        }}
      >
        <MediumPill medium={_AVAILABLE_MEDIUMS[0]} />
      </LineGraphStoreProvider>
    )
  }

  it("sets the selectedMedium in the store onPress", async () => {
    const { getByText, getByTestId } = renderWithWrappersTL(getWrapper())
    const pillComponent = getByText(_AVAILABLE_MEDIUMS[0])
    expect(pillComponent).toBeTruthy()
    // The text color is grayish when not selected
    expect(pillComponent.props.color).toEqual("#707070")
    fireEvent(getByTestId("line-graph-medium-picker-pill"), "onPress")

    await flushPromiseQueue()

    // The text color is black when selected
    expect(pillComponent.props.color).toEqual("#000000")
  })
})
