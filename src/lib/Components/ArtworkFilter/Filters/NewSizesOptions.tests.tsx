import { fireEvent } from "@testing-library/react-native"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { ReactTestInstance } from "react-test-renderer"
import { FilterArray, FilterParamName } from "../ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider, useSelectedOptionsDisplay } from "../ArtworkFilterStore"
import { getEssentialProps } from "./helper"
import { NewSizesOptionsScreen } from "./NewSizesOptions"

// Helpers
const getFilters = (element: ReactTestInstance) => {
  return JSON.parse(extractText(element)) as FilterArray
}

const getFilterOptionByName = (filters: FilterArray, filterName: FilterParamName) => {
  return filters.find((filter) => filter.paramName === filterName)
}

const getSizesFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.sizes)
}

const getWidthFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.width)
}

const getHeightFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.height)
}

describe("NewSizesOptionsScreen", () => {
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

  const MockSizesOptionsScreen = () => {
    const selected = useSelectedOptionsDisplay()
    return (
      <>
        <Text testID="debug">{JSON.stringify(selected)}</Text>
        <NewSizesOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const TestRenderer = ({ initialData = INITIAL_DATA }: { initialData?: ArtworkFiltersState } = {}) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <MockSizesOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const { getByText, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Small (under 16in)")).toBeTruthy()
    expect(getByText("Medium (16in – 40in)")).toBeTruthy()
    expect(getByText("Large (over 40in)")).toBeTruthy()

    // Custom inputs
    expect(getByA11yLabel("Minimum Width Input")).toBeTruthy()
    expect(getByA11yLabel("Maximum Width Input")).toBeTruthy()
    expect(getByA11yLabel("Minimum Height Input")).toBeTruthy()
    expect(getByA11yLabel("Maximum Height Input")).toBeTruthy()
  })

  it("single option can be selected", () => {
    const { getByText, getByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Small (under 16in)"))

    const filters = getFilters(getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    expect(getByA11yState({ checked: true })).toHaveTextContent("Small (under 16in)")
    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "Small (under 16in)",
      paramValue: ["SMALL"],
    })
  })

  it("multiple options can be selected", () => {
    const { getByText, getAllByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Small (under 16in)"))
    fireEvent.press(getByText("Large (over 40in)"))

    const filters = getFilters(getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    expect(getAllByA11yState({ checked: true })[0]).toHaveTextContent("Small (under 16in)")
    expect(getAllByA11yState({ checked: true })[1]).toHaveTextContent("Large (over 40in)")
    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "Small (under 16in), Large (over 40in)",
      paramValue: ["SMALL", "LARGE"],
    })
  })

  it("correctly select/unselect the same option", () => {
    const { getByText, queryByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Small (under 16in)"))
    fireEvent.press(getByText("Small (under 16in)"))

    const filters = getFilters(getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    expect(queryByA11yState({ checked: true })).toBeFalsy()
    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "All",
      paramValue: [],
    })
  })

  describe("Custom Size", () => {
    it("should select the custom size option when a custom value is specified", () => {
      const { getByA11yLabel, getByA11yState } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      expect(getByA11yState({ checked: true })).toHaveTextContent("Custom Size")
    })

    it("should keep custom values if a predefined value is selected", () => {
      const { getByA11yLabel, getByDisplayValue, getByText } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum Width Input"), "10")
      fireEvent.press(getByText("Small (under 16in)"))

      expect(getByDisplayValue("5")).toBeTruthy()
      expect(getByDisplayValue("10")).toBeTruthy()
    })

    it("should keep the previously selected option if a custom value is entered", () => {
      const { getByText, getByA11yLabel, getAllByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.press(getByText("Small (under 16in)"))
      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const sizesFilter = getSizesFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)

      expect(getAllByA11yState({ checked: true })).toHaveLength(2)
      expect(sizesFilter).toEqual({
        paramName: "sizes",
        displayText: "Small (under 16in)",
        paramValue: ["SMALL"],
      })
      expect(widthFilter).toEqual({
        paramName: "width",
        displayText: "5-*",
        paramValue: "5-*",
      })
    })

    it("returns width option with minimum value", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter).toBeUndefined()
    })

    it("returns width option with maximum value", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Maximum Width Input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("*-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns width option with minimum and maximum values", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum Width Input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns height option with minimum value", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Height Input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("5-*")
      expect(widthFilter).toBeUndefined()
    })

    it("returns height option with maximum value", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Maximum Height Input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("*-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns height option with minimum and maximum values", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Height Input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum Height Input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("5-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns width option with minimum value and height option with maximum value", () => {
      const { getByTestId, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum Height Input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter?.paramValue).toBe("*-10")
    })
  })
})
