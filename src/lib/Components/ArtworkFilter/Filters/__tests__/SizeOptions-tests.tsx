import { FilterData, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { Input } from "lib/Components/Input/Input"
import { TouchableRow } from "lib/Components/TouchableRow"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider, useSelectedOptionsDisplay } from "../../ArtworkFilterStore"
import { SizeOptionsScreen } from "../SizeOptions"
import { getEssentialProps } from "./helper"

type Key = FilterParamName.dimensionRange | FilterParamName.width | FilterParamName.height

describe("SizeOptionsNew", () => {
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
        <SizeOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const getTree = ({ initialData = INITIAL_DATA }: { initialData?: ArtworkFiltersState } = {}) => {
    return renderWithWrappers(
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <MockPriceRangeOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  const getData = (tree: ReactTestRenderer): Record<Key, FilterData> => {
    return JSON.parse(extractText(tree.root.findAllByType(Text)[0]))
      .filter(({ paramName }: FilterData) => {
        return (
          paramName === FilterParamName.dimensionRange ||
          paramName === FilterParamName.width ||
          paramName === FilterParamName.height
        )
      })
      .reduce(
        (acc: Record<Key, FilterData>, filterData: FilterData) => ({
          ...acc,
          [filterData.paramName]: filterData,
        }),
        {}
      )
  }

  it("renders the options", () => {
    const tree = getTree()
    const text = extractText(tree.root)

    expect(text).toContain("All")
    expect(text).toContain("Small (under 16in)")
    expect(text).toContain("Medium (under 16in – 40in)")
    expect(text).toContain("Large (over 40in)")
    expect(text).toContain("Custom size")
  })

  it("selects an option", () => {
    const tree = getTree()

    const options = tree.root.findAllByType(TouchableRow)

    expect(getData(tree).dimensionRange).toEqual({
      paramName: "dimensionRange",
      displayText: "All",
      paramValue: "*-*",
    })

    act(() => {
      options[1].props.onPress()
    })

    expect(getData(tree).dimensionRange).toEqual({
      paramName: "dimensionRange",
      displayText: "Small (under 16in)",
      paramValue: "*-16.0",
    })
  })

  it("selects a custom size range", () => {
    const tree = getTree()

    const options = tree.root.findAllByType(TouchableRow)

    expect(getData(tree).dimensionRange).toEqual({
      paramName: "dimensionRange",
      displayText: "All",
      paramValue: "*-*",
    })

    act(() => {
      // Displays the custom range inputs
      options[4].props.onPress()
    })

    const dimensionRange = {
      displayText: "Custom size",
      paramValue: "0-*",
      paramName: "dimensionRange",
    }

    expect(getData(tree).dimensionRange).toEqual(dimensionRange)

    const [minWidthInput, maxWidthInput, minHeightInput, maxHeightInput] = tree.root.findAllByType(Input)

    act(() => {
      minWidthInput.props.onChangeText("10")
    })

    expect(getData(tree)).toEqual({
      dimensionRange,
      width: {
        displayText: "10-*",
        paramName: "width",
        paramValue: "10-*",
      },
    })

    act(() => {
      maxWidthInput.props.onChangeText("200")
    })

    const width = {
      displayText: "10-200",
      paramName: "width",
      paramValue: "10-200",
    }

    expect(getData(tree)).toEqual({ dimensionRange, width })

    act(() => {
      minHeightInput.props.onChangeText("33")
    })

    expect(getData(tree)).toEqual({
      dimensionRange,
      width,
      height: {
        displayText: "33-*",
        paramName: "height",
        paramValue: "33-*",
      },
    })

    act(() => {
      maxHeightInput.props.onChangeText("101.2")
    })

    expect(getData(tree)).toEqual({
      dimensionRange,
      width,
      height: {
        displayText: "33-101.2",
        paramName: "height",
        paramValue: "33-101.2",
      },
    })
  })

  it("selects a custom size range", () => {
    const tree = getTree()

    const options = tree.root.findAllByType(TouchableRow)

    expect(getData(tree).dimensionRange).toEqual({
      paramName: "dimensionRange",
      displayText: "All",
      paramValue: "*-*",
    })

    act(() => {
      // Displays the custom range inputs
      options[4].props.onPress()
    })

    const [minWidthInput, maxWidthInput] = tree.root.findAllByType(Input)

    act(() => {
      minWidthInput.props.onChangeText("10")
      maxWidthInput.props.onChangeText("200")
    })

    expect(getData(tree)).toEqual({
      dimensionRange: {
        displayText: "Custom size",
        paramValue: "0-*",
        paramName: "dimensionRange",
      },
      width: {
        displayText: "10-200",
        paramName: "width",
        paramValue: "10-200",
      },
    })

    act(() => {
      // Toggle to a preset size bucket
      options[3].props.onPress()
    })

    expect(getData(tree)).toEqual({
      dimensionRange: {
        displayText: "Large (over 40in)",
        paramName: "dimensionRange",
        paramValue: "40.0-*",
      },
    })
  })
})
