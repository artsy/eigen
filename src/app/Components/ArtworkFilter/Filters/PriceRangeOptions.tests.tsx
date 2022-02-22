import { fireEvent } from "@testing-library/react-native"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  useSelectedOptionsDisplay,
} from "../ArtworkFilterStore"
import { getEssentialProps } from "./helper"
import { Range } from "./helpers"
import { PriceRangeOptionsScreen } from "./PriceRangeOptions"

import { Input } from "palette"

const DEFAULT_RANGE: Range = {
  min: "*",
  max: "*",
}

describe("CustomPriceInput", () => {
  it("renders without error", () => {
    renderWithWrappersTL(
      <Input value={DEFAULT_RANGE} onChange={jest.fn()} {...getEssentialProps()} />
    )
  })

  it("renders the min value", () => {
    const { getByTestId } = renderWithWrappersTL(
      <Input
        testID="price-min-input"
        value={{ min: 444, max: 99999 }}
        onChange={jest.fn()}
        {...getEssentialProps()}
      />
    )

    expect(getByTestId("price-min-input").props.value.min).toBe(444)
  })

  it("renders the max value", () => {
    const { getByTestId } = renderWithWrappersTL(
      <Input
        testID="price-max-input"
        value={{ min: 444, max: 99999 }}
        onChange={jest.fn()}
        {...getEssentialProps()}
      />
    )

    expect(getByTestId("price-max-input").props.value.max).toBe(99999)
  })

  it("calls onChange with the min when it is updated", () => {
    const handleChange = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <Input
        testID="price-min-input"
        value={DEFAULT_RANGE}
        onChangeText={handleChange}
        {...getEssentialProps()}
      />
    )

    fireEvent.changeText(getByTestId("price-min-input"), "777")

    expect(handleChange).toHaveBeenCalledWith("777")
  })

  it("calls onChange with the max when it is updated", () => {
    const handleChange = jest.fn()
    const { getByTestId } = renderWithWrappersTL(
      <Input
        testID="price-max-input"
        value={DEFAULT_RANGE}
        onChangeText={handleChange}
        {...getEssentialProps()}
      />
    )

    fireEvent.changeText(getByTestId("price-max-input"), "12345")

    expect(handleChange).toHaveBeenLastCalledWith("12345")
  })
})

describe("PriceRangeOptions", () => {
  const INITIAL_DATA: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
  }

  const MockPriceRangeOptionsScreen = () => {
    const selected = useSelectedOptionsDisplay()
    return (
      <>
        <Text testID="debug">{JSON.stringify(selected)}</Text>
        <PriceRangeOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const getTree = () => {
    return renderWithWrappersTL(
      <ArtworkFiltersStoreProvider initialData={INITIAL_DATA}>
        <MockPriceRangeOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const { getByText } = getTree()

    expect(getByText("Choose Your Price")).toBeTruthy()
    expect(getByText("$50,000+")).toBeTruthy()
    expect(getByText("$10,000–50,000")).toBeTruthy()
    expect(getByText("$5,000–10,000")).toBeTruthy()
    expect(getByText("$1,000–5,000")).toBeTruthy()
    expect(getByText("$0–1,000")).toBeTruthy()
  })

  it("renders the min and max input by default", () => {
    const { getByTestId } = getTree()

    expect(getByTestId("price-min-input")).toBeTruthy()
    expect(getByTestId("price-max-input")).toBeTruthy()
  })

  it("custom price values should not be cleared if a predefined value is selected", () => {
    const { getByTestId, getByText } = getTree()
    const minInput = getByTestId("price-min-input")
    const maxInput = getByTestId("price-max-input")

    fireEvent.changeText(minInput, "1000")
    fireEvent.changeText(maxInput, "5000")
    fireEvent.press(getByText("$10,000–50,000"))

    expect(minInput.props.value).toBe("1000")
    expect(maxInput.props.value).toBe("5000")
  })

  it("dispatches a custom price", () => {
    const { getByTestId } = getTree()

    fireEvent.changeText(getByTestId("price-min-input"), "1111")
    fireEvent.changeText(getByTestId("price-max-input"), "98765")

    expect(extractText(getByTestId("debug"))).toContain(
      `{"displayText":"$1,111–98,765","paramValue":"1111-98765","paramName":"priceRange"}`
    )
  })

  it("dispatches the last entered price", () => {
    const { getByTestId, getByText } = getTree()

    fireEvent.changeText(getByTestId("price-min-input"), "1111")
    fireEvent.press(getByText("$10,000–50,000"))
    fireEvent.changeText(getByTestId("price-min-input"), "2222")

    expect(extractText(getByTestId("debug"))).toContain(
      `{"displayText":"$2,222+","paramValue":"2222-*","paramName":"priceRange"}`
    )
  })

  it("dispatches the last selected price", () => {
    const { getByTestId, getByText } = getTree()

    fireEvent.press(getByText("$10,000–50,000"))
    fireEvent.press(getByText("$1,000–5,000"))

    expect(extractText(getByTestId("debug"))).toContain(
      `{"displayText":"$1,000–5,000","paramValue":"1000-5000","paramName":"priceRange"}`
    )
  })

  it('should display the "clear" button if a custom price is entered', () => {
    const { getByTestId, getByText } = getTree()

    fireEvent.changeText(getByTestId("price-min-input"), "1111")

    expect(getByText("Clear")).toBeTruthy()
  })

  it('should display the "clear" button if a predefined value is selected', () => {
    const { getByText } = getTree()

    fireEvent.press(getByText("$10,000–50,000"))

    expect(getByText("Clear")).toBeTruthy()
  })

  it('should not display the "clear" button if the default value is selected', () => {
    const { queryByText, getByText } = getTree()

    fireEvent.press(getByText("$10,000–50,000"))
    fireEvent.press(getByText("Choose Your Price"))

    expect(queryByText("Clear")).toBeNull()
  })

  it('selected value should be cleared when the "clear" button is pressed', () => {
    const { getByTestId, getByText } = getTree()
    const minInput = getByTestId("price-min-input")

    fireEvent.changeText(minInput, "1111")
    fireEvent.press(getByText("Clear"))

    expect(minInput.props.value).toBeUndefined()
  })
})
