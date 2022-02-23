import { fireEvent } from "@testing-library/react-native"
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

    it("should clear custom values in filters when the custom size option is unselected", () => {
      const { getByA11yLabel, getByA11yState, getByTestId } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.press(getByA11yState({ checked: true }))

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
      const { getByA11yLabel, queryByA11yState } = renderWithWrappersTL(<TestRenderer />)

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      expect(queryByA11yState({ checked: true })).toBeTruthy()

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "")
      expect(queryByA11yState({ checked: true })).toBeFalsy()
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

      expect(getAllByA11yState({ checked: true })).toHaveLength(1)
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

      expect(queryAllByA11yState({ checked: true })).toHaveLength(0)
    })

    it('should clear selected custom values if "Clear" button is pressed', () => {
      const { getByText, getByA11yLabel, queryAllByA11yState } = renderWithWrappersTL(
        <TestRenderer />
      )

      fireEvent.changeText(getByA11yLabel("Minimum Width Input"), "5")
      fireEvent.press(getByText("Clear"))

      expect(queryAllByA11yState({ checked: true })).toHaveLength(0)
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

    expect(getCustomValues(filters)).toEqual({
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

    expect(getCustomValues(filters)).toEqual({
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
