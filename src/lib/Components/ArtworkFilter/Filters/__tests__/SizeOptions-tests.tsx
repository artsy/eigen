import { fireEvent } from "@testing-library/react-native"
import { FilterArray, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { ReactTestInstance } from "react-test-renderer"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider, useSelectedOptionsDisplay } from "../../ArtworkFilterStore"
import { SizeOptionsScreen } from "../SizeOptions"
import { getEssentialProps } from "./helper"

// Helpers
const getFilters = (element: ReactTestInstance) => {
  return JSON.parse(extractText(element)) as FilterArray
}

const getFilterOptionByName = (filters: FilterArray, filterName: FilterParamName) => {
  return filters.find((filter) => filter.paramName === filterName)
}

const getSizeFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.size)
}

const getWidthFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.width)
}

const getHeightFilterOption = (filters: FilterArray) => {
  return getFilterOptionByName(filters, FilterParamName.height)
}

describe("SizeOptions", () => {
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
        <SizeOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const getTree = ({ initialData = INITIAL_DATA }: { initialData?: ArtworkFiltersState } = {}) => {
    return renderWithWrappersTL(
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <MockPriceRangeOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const { getByText } = getTree()

    expect(getByText("All")).toBeTruthy()
    expect(getByText("Small (under 16in)")).toBeTruthy()
    expect(getByText("Medium (16in – 40in)")).toBeTruthy()
    expect(getByText("Large (over 40in)")).toBeTruthy()
    expect(getByText("Custom Size")).toBeTruthy()
  })

  it("selects an option", () => {
    const { getByText, getByA11yState } = getTree()

    fireEvent.press(getByText("Small (under 16in)"))

    expect(extractText(getByA11yState({ selected: true }))).toBe("Small (under 16in)")
  })

  describe("Custom Size", () => {
    it("returns the default filter option if width and height are not specified", () => {
      const { getByTestId, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getWidthFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("All")
      expect(sizeFilter?.paramValue).toBe("*-*")
      expect(widthFilter).toBeUndefined()
      expect(heightFilter).toBeUndefined()
    })

    it("returns the custom filter option if only minimum width is specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter).toBeUndefined()
    })

    it("returns the custom filter option if only maximum width is specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Maximum width input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(widthFilter?.paramValue).toBe("*-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns the custom filter option if minimum and maximum width are specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum width input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(widthFilter?.paramValue).toBe("5-10")
      expect(heightFilter).toBeUndefined()
    })

    it("returns the custom filter option if only minimum height is specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum height input"), "5")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(heightFilter?.paramValue).toBe("5-*")
      expect(widthFilter).toBeUndefined()
    })

    it("returns the custom filter option if only maximum height is specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Maximum height input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(heightFilter?.paramValue).toBe("*-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns the custom filter option if maximum and maximum height are specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum height input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum height input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(heightFilter?.paramValue).toBe("5-10")
      expect(widthFilter).toBeUndefined()
    })

    it("returns the custom filter option if minimum width and the maximum height are specified", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "5")
      fireEvent.changeText(getByA11yLabel("Maximum height input"), "10")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)
      const widthFilter = getWidthFilterOption(filters)
      const heightFilter = getHeightFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Custom Size")
      expect(sizeFilter?.paramValue).toBe("0-*")
      expect(widthFilter?.paramValue).toBe("5-*")
      expect(heightFilter?.paramValue).toBe("*-10")
    })

    it("returns the default filter option if nothing is specified in width or height", () => {
      const { getByTestId, getByA11yLabel, getByText } = getTree()

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "5")

      const prevFilters = getFilters(getByTestId("debug"))
      const prevSizeFilter = getSizeFilterOption(prevFilters)

      expect(prevSizeFilter?.paramValue).toBe("0-*")

      fireEvent.changeText(getByA11yLabel("Minimum width input"), "")

      const currentFilters = getFilters(getByTestId("debug"))
      const currentSizeFilter = getSizeFilterOption(currentFilters)

      expect(currentSizeFilter?.paramValue).toBe("*-*")
    })

    it("returns the previously applied filter option if the invalid custom values are specified", () => {
      const option: FilterData = {
        displayText: "Small (under 40cm)",
        paramValue: "*-16.0",
        paramName: FilterParamName.size,
      }
      const { getByTestId, getByA11yLabel, getByText } = getTree({
        initialData: {
          ...INITIAL_DATA,
          appliedFilters: [option],
          previouslyAppliedFilters: [option],
        },
      })

      fireEvent.press(getByText("Custom Size"))
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "5")
      fireEvent.changeText(getByA11yLabel("Minimum width input"), "")

      const filters = getFilters(getByTestId("debug"))
      const sizeFilter = getSizeFilterOption(filters)

      expect(sizeFilter?.displayText).toBe("Small (under 40cm)")
      expect(sizeFilter?.paramValue).toBe("*-16.0")
    })
  })
})
