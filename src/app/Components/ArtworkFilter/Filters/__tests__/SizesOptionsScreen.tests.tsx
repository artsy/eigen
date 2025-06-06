import { fireEvent, screen } from "@testing-library/react-native"
import {
  FilterArray,
  FilterData,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import {
  checkIsEmptyCustomValues,
  CustomSize,
  getCustomValues,
  SizesOptionsScreen,
} from "app/Components/ArtworkFilter/Filters/SizesOptionsScreen"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { ReactTestInstance } from "react-test-renderer"

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
    showFilterArtworksModal: false,
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
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <MockSizesOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Small (under 16in)")).toBeTruthy()
    expect(screen.getByText("Medium (16in – 40in)")).toBeTruthy()
    expect(screen.getByText("Large (over 40in)")).toBeTruthy()

    // Custom inputs
    expect(screen.getByLabelText("Minimum Width Input")).toBeTruthy()
    expect(screen.getByLabelText("Maximum Width Input")).toBeTruthy()
    expect(screen.getByLabelText("Minimum Height Input")).toBeTruthy()
    expect(screen.getByLabelText("Maximum Height Input")).toBeTruthy()
  })

  it("single option can be selected", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.press(screen.getByText("Small (under 16in)"))

    const filters = getFilters(screen.getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options[0]).toHaveTextContent("Small (under 16in)")
    expect(options[1]).toHaveTextContent("Medium (16in – 40in)")
    expect(options[2]).toHaveTextContent("Large (over 40in)")
    expect(options[3]).toHaveTextContent("Custom Size")

    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)

    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "Small (under 16in)",
      paramValue: ["SMALL"],
    })
  })

  it("multiple options can be selected", () => {
    renderWithWrappers(<TestRenderer />)

    fireEvent.press(screen.getByText("Small (under 16in)"))
    fireEvent.press(screen.getByText("Large (over 40in)"))

    const filters = getFilters(screen.getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options[0]).toHaveTextContent("Small (under 16in)")
    expect(options[1]).toHaveTextContent("Medium (16in – 40in)")
    expect(options[2]).toHaveTextContent("Large (over 40in)")
    expect(options[3]).toHaveTextContent("Custom Size")

    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", true)
    expect(checkboxes[3]).toHaveProp("selected", false)

    expect(sizesFilter).toEqual({
      paramName: "sizes",
      displayText: "Small (under 16in), Large (over 40in)",
      paramValue: ["SMALL", "LARGE"],
    })
  })

  it("correctly select/unselect the same option", () => {
    renderWithWrappers(<TestRenderer />)

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options).toHaveLength(4)
    expect(checkboxes).toHaveLength(4)

    expect(options[0]).toHaveTextContent("Small (under 16in)")
    expect(options[1]).toHaveTextContent("Medium (16in – 40in)")
    expect(options[2]).toHaveTextContent("Large (over 40in)")
    expect(options[3]).toHaveTextContent("Custom Size")

    expect(checkboxes[0]).toHaveProp("selected", false)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)

    fireEvent.press(screen.getByText("Small (under 16in)"))
    // ensures that the checked elements are the selected filter and one radio button
    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)

    fireEvent.press(screen.getByText("Small (under 16in)"))

    const filters = getFilters(screen.getByTestId("debug"))
    const sizesFilter = getSizesFilterOption(filters)

    // ensures that the checked element is one radio button
    expect(checkboxes[0]).toHaveProp("selected", false)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)

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
      renderWithWrappers(<TestRenderer />)

      expect(screen.getByLabelText("in")).toBeTruthy()
      expect(screen.getByLabelText("in")).toHaveProp("accessibilityState", { checked: true })

      expect(screen.getByText("Small (under 16in)")).toBeTruthy()
      expect(screen.getByText("Medium (16in – 40in)")).toBeTruthy()
      expect(screen.getByText("Large (over 40in)")).toBeTruthy()

      // makes sure that "cm" appears in the screen only once for the radio button
      expect(screen.queryAllByText("cm")).toHaveLength(1)

      fireEvent.press(screen.getByLabelText("cm"))

      expect(screen.getByLabelText("in")).toHaveProp("accessibilityState", { checked: false })
      expect(screen.getByLabelText("cm")).toHaveProp("accessibilityState", { checked: true })

      expect(screen.queryByText("Small (under 16in)")).toBeFalsy()
      expect(screen.queryByText("Medium (16in – 40in)")).toBeFalsy()
      expect(screen.queryByText("Large (over 40in)")).toBeFalsy()

      expect(screen.getByText("Small (under 40cm)")).toBeTruthy()
      expect(screen.getByText("Medium (40cm – 100cm)")).toBeTruthy()
      expect(screen.getByText("Large (over 100cm)")).toBeTruthy()

      // makes sure that "in" appears in the screen only once for the radio button
      expect(screen.queryAllByText("in")).toHaveLength(1)
    })
  })

  describe("Custom Size", () => {
    it("should select the custom size option when a custom value is specified", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", true)
    })

    it("should clear custom values in filters when the custom size option is unselected", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      fireEvent.press(screen.getAllByRole("checkbox")[0])

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)

      expect(widthFilter?.paramValue).toBeUndefined()
    })

    it("should restore the previous custom values when the custom size options is selected again", () => {
      renderWithWrappers(<TestRenderer />)
      let filters
      let widthFilter

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      fireEvent.press(screen.getByText("Custom Size"))
      filters = getFilters(screen.getByTestId("debug"))
      widthFilter = getWidthFilterOption(filters)
      expect(widthFilter?.paramValue).toBeUndefined()

      fireEvent.press(screen.getByText("Custom Size"))
      filters = getFilters(screen.getByTestId("debug"))
      widthFilter = getWidthFilterOption(filters)
      expect(widthFilter?.paramValue).toBe("5-*")
    })

    it("should unselect the custom size option when custom inputs are empty", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options[3]).toHaveTextContent("Custom Size")

      expect(checkboxes[3]).toHaveProp("selected", true)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "")
      // ensures that the checked element is one radio button
      expect(checkboxes[3]).toHaveProp("selected", false)
    })

    it("should keep custom inputs filled in if a predefined value is selected", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")
      fireEvent.changeText(screen.getByLabelText("Maximum Width Input"), "10")
      fireEvent.press(screen.getByText("Small (under 16in)"))

      expect(screen.getByDisplayValue("5")).toBeTruthy()
      expect(screen.getByDisplayValue("10")).toBeTruthy()
    })

    it("should clear the previously selected option if a custom value is entered", () => {
      renderWithWrappers(<TestRenderer />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options[0]).toHaveTextContent("Small (under 16in)")
      expect(options[1]).toHaveTextContent("Medium (16in – 40in)")
      expect(options[2]).toHaveTextContent("Large (over 40in)")
      expect(options[3]).toHaveTextContent("Custom Size")

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", false)

      fireEvent.press(screen.getByText("Small (under 16in)"))

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", false)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", true)

      const filters = getFilters(screen.getByTestId("debug"))
      const sizesFilter = getSizesFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)

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
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter).toBeUndefined()
    })

    it("returns width option with maximum value", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Maximum Width Input"), "10")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("*-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns width option with minimum and maximum values", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")
      fireEvent.changeText(screen.getByLabelText("Maximum Width Input"), "10")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns height option with minimum value", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Height Input"), "5")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("5-*")
      expect(widthFilter).toBeUndefined()
    })

    it("returns height option with maximum value", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Maximum Height Input"), "10")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("*-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns height option with minimum and maximum values", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Height Input"), "5")
      fireEvent.changeText(screen.getByLabelText("Maximum Height Input"), "10")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(heightFilter?.paramValue).toBe("5-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns width option with minimum value and height option with maximum value", () => {
      renderWithWrappers(<TestRenderer />)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")
      fireEvent.changeText(screen.getByLabelText("Maximum Height Input"), "10")

      const filters = getFilters(screen.getByTestId("debug"))
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter?.paramValue).toBe("*-10")
    })
  })

  describe("Clear button", () => {
    it('should not display "Clear" if nothing is selected', () => {
      renderWithWrappers(<TestRenderer />)

      expect(screen.queryByText("Clear")).toBeFalsy()
    })

    it('should clear selected predefined values if "Clear" button is pressed', () => {
      renderWithWrappers(<TestRenderer />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      fireEvent.press(screen.getByText("Small (under 16in)"))

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", false)

      fireEvent.press(screen.getByText("Clear"))

      expect(options[0]).toHaveTextContent("Small (under 16in)")

      // only one of unit radio buttons is selected
      expect(checkboxes[0]).toHaveProp("selected", false)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
      expect(checkboxes[3]).toHaveProp("selected", false)
    })

    it('should clear selected custom values if "Clear" button is pressed', () => {
      renderWithWrappers(<TestRenderer />)

      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options[3]).toHaveTextContent("Custom Size")
      expect(checkboxes[3]).toHaveProp("selected", false)

      fireEvent.changeText(screen.getByLabelText("Minimum Width Input"), "5")

      expect(checkboxes[3]).toHaveProp("selected", true)

      fireEvent.press(screen.getByText("Clear"))

      // only one of unit radio buttons is selected
      expect(checkboxes[3]).toHaveProp("selected", false)
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
