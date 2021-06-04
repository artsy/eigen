import { Input } from "lib/Components/Input/Input"
import { TouchableRow } from "lib/Components/TouchableRow"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { act } from "react-test-renderer"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider, useSelectedOptionsDisplay } from "../../ArtworkFilterStore"
import { CustomPriceInput, PriceRangeOptionsScreen } from "../PriceRangeOptions"
import { getEssentialProps } from "./helper"

describe("CustomPriceInput", () => {
  it("renders without error", () => {
    const tree = renderWithWrappers(<CustomPriceInput onChange={jest.fn()} {...getEssentialProps()} />)
    expect(extractText(tree.root)).toEqual("to")
  })

  it("renders the initialValue", () => {
    const tree = renderWithWrappers(
      <CustomPriceInput initialValue={{ min: 444, max: 99999 }} onChange={jest.fn()} {...getEssentialProps()} />
    )
    expect(extractText(tree.root)).toEqual("444to99999")
  })

  it("calls onChange with the min/max when either is updated", () => {
    const handleChange = jest.fn()
    const tree = renderWithWrappers(<CustomPriceInput onChange={handleChange} {...getEssentialProps()} />)

    const [minInput, maxInput] = tree.root.findAllByType(Input)

    act(() => {
      minInput.props.onChangeText("777")
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenLastCalledWith({ min: 777, max: "*" })

    act(() => {
      maxInput.props.onChangeText("12345")
    })

    expect(handleChange).toHaveBeenCalledTimes(2)
    expect(handleChange).toHaveBeenLastCalledWith({ min: 777, max: 12345 })
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
        <Text>{JSON.stringify(selected)}</Text>
        <PriceRangeOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const getTree = () => {
    return renderWithWrappers(
      <ArtworkFiltersStoreProvider initialData={INITIAL_DATA}>
        <MockPriceRangeOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const tree = getTree()
    const text = extractText(tree.root)

    expect(text).toContain("All")
    expect(text).toContain("$50,000+")
    expect(text).toContain("$10,000–50,000")
    expect(text).toContain("$5,000–10,000")
    expect(text).toContain("$1,000–5,000")
    expect(text).toContain("$0–1,000")
    expect(text).toContain("Custom price")
  })

  it("dispatches a custom price", () => {
    const tree = getTree()
    const options = tree.root.findAllByType(TouchableRow)
    const customPriceOption = options.find((node) => extractText(node) === "Custom price")!

    // Tap the Custom price option to display the inputs
    act(() => {
      customPriceOption.props.onPress()
    })

    const [minInput, maxInput] = tree.root.findAllByType(Input)

    // Input min and max
    act(() => {
      minInput.props.onChangeText("1111")
      maxInput.props.onChangeText("98765")
    })

    expect(extractText(tree.root.findAllByType(Text)[0])).toContain(
      `{"displayText":"$1,111–98,765","paramValue":"1111-98765","paramName":"priceRange"}`
    )
  })
})
