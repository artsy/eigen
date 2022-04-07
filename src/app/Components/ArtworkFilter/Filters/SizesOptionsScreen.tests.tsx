import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Text } from "react-native"
import { ReactTestInstance } from "react-test-renderer"
import { FilterArray, FilterData, FilterParamName } from "../ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  useSelectedOptionsDisplay,
} from "../ArtworkFilterStore"
import { getEssentialProps } from "./helper"
import {
  checkIsEmptyCustomValues,
  CustomSize,
  getCustomValues,
  SizesOptionsScreen,
} from "./SizesOptionsScreen"

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

describe("SizesOptionsScreen", () => {
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
    sizeMetric: "in",
  }

  const MockSizesOptionsScreen = () => {
    const selected = useSelectedOptionsDisplay()
    return (
      <>
        <Text testID="debug">{JSON.stringify(selected)}</Text>
        <SizesOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const TestRenderer = ({
    initialData = INITIAL_DATA,
  }: { initialData?: ArtworkFiltersState } = {}) => {
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
    const { getByText, getAllByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Small (under 16in)"))

    const filters = getFilters(getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    expect(getAllByA11yState({ checked: true })[0]).toHaveTextContent("Small (under 16in)")
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
    const { getByText, queryAllByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getByText("Small (under 16in)"))
    // ensures that the checked elements are the selected filter and one radio button
    expect(queryAllByA11yState({ checked: true })).toHaveLength(2)

    fireEvent.press(getByText("Small (under 16in)"))

    const filters = getFilters(getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    // ensures that the checked element is one radio button
    expect(queryAllByA11yState({ checked: true })).toHaveLength(1)
    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "All",
      paramValue: [],
    })
  })

  describe("Metric Radio Buttons", () => {
    it("should convert successfully the predefined sizes and placeholders on metric change", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: { metric: "in" },
      })
      const { queryByText, queryAllByText, getByA11yLabel } = renderWithWrappersTL(<TestRenderer />)

      expect(getByA11yLabel("in")).toBeTruthy()
      expect(getByA11yLabel("in")).toHaveProp("accessibilityState", { checked: true })

      expect(queryByText("Small (under 16in)")).toBeTruthy()
      expect(queryByText("Medium (16in – 40in)")).toBeTruthy()
      expect(queryByText("Large (over 40in)")).toBeTruthy()

      // makes sure that "cm" appears in the screen only once for the radio button
      expect(queryAllByText("cm")).toHaveLength(1)

      fireEvent.press(getByA11yLabel("cm"))

      expect(getByA11yLabel("in")).toHaveProp("accessibilityState", { checked: false })
      expect(getByA11yLabel("cm")).toHaveProp("accessibilityState", { checked: true })

      expect(queryByText("Small (under 16in)")).toBeFalsy()
      expect(queryByText("Medium (16in – 40in)")).toBeFalsy()
      expect(queryByText("Large (over 40in)")).toBeFalsy()

      expect(queryByText("Small (under 40cm)")).toBeTruthy()
      expect(queryByText("Medium (40cm – 100cm)")).toBeTruthy()
      expect(queryByText("Large (over 100cm)")).toBeTruthy()

      // makes sure that "in" appears in the screen only once for the radio button
      expect(queryAllByText("in")).toHaveLength(1)
    })
  })

  describe("Custom Size", () => {
    it("should select the custom size option when a custom value is specified", () => {
      const { getByA11yLabel, getAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      expect(getAllByA11yState({ checked: true })[0]).toHaveTextContent("Custom Size")
    })

    it("should clear custom values in filters when the custom size option is unselected", () => {
      const { getByA11yLabel, getAllByA11yState, getByTestId } = renderWithWrappersTL(
        <TestRenderer />
      )

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.press(getAllByA11yState({ checked: true })[0])

      const filters = getFilters(getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)

      expect(widthFilter?.paramValue).toBeUndefined()
    })

    it("should restore the previous custom values when the custom size options is selected again", () => {
      const { getByA11yLabel, getByText, getByTestId } = renderWithWrappersTL(<TestRenderer />)
      let filters
      let widthFilter

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      fireEvent.press(getByText("Custom Size"))
      filters = getFilters(getByTestId("debug"))
      widthFilter = getWidthFilterOption(filters)
      expect(widthFilter?.paramValue).toBeUndefined()

      fireEvent.press(getByText("Custom Size"))
      filters = getFilters(getByTestId("debug"))
      widthFilter = getWidthFilterOption(filters)
      expect(widthFilter?.paramValue).toBe("5-*")
    })

    it("should unselect the custom size option when custom inputs are empty", () => {
      const { getByA11yLabel, queryAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      expect(queryAllByA11yState({ checked: true })[0]).toBeTruthy()

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "")
      // ensures that the checked element is one radio button
      expect(queryAllByA11yState({ checked: true })).toHaveLength(1)
    })

    it("should keep custom inputs filled in if a predefined value is selected", () => {
      const { getByA11yLabel, getByDisplayValue, getByText } = renderWithWrappersTL(
        <TestRenderer />
      )

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum Width Input"), "10")
      fireEvent.press(getByText("Small (under 16in)"))

      expect(getByDisplayValue("5")).toBeTruthy()
      expect(getByDisplayValue("10")).toBeTruthy()
    })

    it("should clear the previously selected option if a custom value is entered", () => {
      const { getByText, getByA11yLabel, getAllByA11yState, getByTestId } = renderWithWrappersTL(
        <TestRenderer />
      )

      fireEvent.press(getByText("Small (under 16in)"))
      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const sizesFilter = getSizesFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)

      expect(getAllByA11yState({ checked: true })).toHaveLength(2)
      expect(sizesFilter).toEqual({
        paramName: "sizes",
        displayText: "All",
        paramValue: [],
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

  describe("Clear button", () => {
    it('should not display "Clear" if nothing is selected', () => {
      const { queryByText } = renderWithWrappersTL(<TestRenderer />)

      expect(queryByText("Clear")).toBeFalsy()
    })

    it('should clear selected predefined values if "Clear" button is pressed', () => {
      const { getByText, queryAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.press(getByText("Small (under 16in)"))
      fireEvent.press(getByText("Clear"))

      // only one of unit radio buttons is selected
      expect(queryAllByA11yState({ checked: true })).toHaveLength(1)
    })

    it('should clear selected custom values if "Clear" button is pressed', () => {
      const { getByText, getByA11yLabel, queryAllByA11yState } = renderWithWrappersTL(
        <TestRenderer />
      )

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.press(getByText("Clear"))

      // only one of unit radio buttons is selected
      expect(queryAllByA11yState({ checked: true })).toHaveLength(1)
    })
  })
})

describe("checkIsEmptyCustomValues", () => {
  it("should return true when all values are empty", () => {
    const customValues: CustomSize = {
      width: {
        min: "*",
        max: "*",
      },
      height: {
        min: "*",
        max: "*",
      },
    }

    expect(checkIsEmptyCustomValues(customValues)).toBeTrue()
  })

  it("should return false when only height values are empty", () => {
    const customValues: CustomSize = {
      width: {
        min: 5,
        max: 10,
      },
      height: {
        min: "*",
        max: "*",
      },
    }

    expect(checkIsEmptyCustomValues(customValues)).toBeFalse()
  })

  it("should return false when only width values are empty", () => {
    const customValues: CustomSize = {
      width: {
        min: "*",
        max: "*",
      },
      height: {
        min: 15,
        max: 20,
      },
    }

    expect(checkIsEmptyCustomValues(customValues)).toBeFalse()
  })

  it("should return false when all values are filled", () => {
    const customValues: CustomSize = {
      width: {
        min: 5,
        max: 10,
      },
      height: {
        min: 15,
        max: 20,
      },
    }

    expect(checkIsEmptyCustomValues(customValues)).toBeFalse()
  })
})

describe("getCustomValues", () => {
  it("should correctly convert custom size filters", () => {
    const filters: FilterData[] = [
      {
        displayText: "5-10",
        paramName: FilterParamName.width,
        paramValue: "5-10",
      },
      {
        displayText: "15-20",
        paramName: FilterParamName.height,
        paramValue: "15-20",
      },
    ]

    expect(getCustomValues(filters, "in")).toEqual({
      width: {
        min: 5,
        max: 10,
      },
      height: {
        min: 15,
        max: 20,
      },
    })
  })

  it("should return default value if incorrect value is passed in custom size filter", () => {
    const filters: FilterData[] = [
      {
        displayText: "hello-10",
        paramName: FilterParamName.width,
        paramValue: "hello-10",
      },
      {
        displayText: "15-world",
        paramName: FilterParamName.height,
        paramValue: "15-world",
      },
    ]

    expect(getCustomValues(filters, "in")).toEqual({
      width: {
        min: "*",
        max: 10,
      },
      height: {
        min: 15,
        max: "*",
      },
    })
  })
})
