import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import {
  Aggregations,
  ArtworkFilterContext,
  ArtworkFilterContextState,
  reducer,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { aggregationForFilter, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ColorContainer, ColorOptionsScreen } from "../ColorOptions"
import { ColorSwatch } from "../ColorSwatch"
import { getEssentialProps } from "./helper"

describe("Color options screen", () => {
  let state: ArtworkFilterContextState

  const mockAggregations: Aggregations = [
    {
      slice: "COLOR",
      counts: [
        {
          name: "black-and-white",
          count: 2956,
          value: "black-and-white",
        },
        {
          name: "darkorange",
          count: 513,
          value: "darkorange",
        },
        {
          name: "lightblue",
          count: 277,
          value: "lightblue",
        },
        {
          name: "yellow",
          count: 149,
          value: "yellow",
        },
        {
          name: "violet",
          count: 145,
          value: "violet",
        },
      ],
    },
  ]

  const selectedColorOptions = (componentTree: ReactTestRenderer) => {
    const colorSwatches = componentTree.root.findAllByType(ColorSwatch)
    const selectedOption = colorSwatches.filter((item) => item.props.selected)
    return selectedOption
  }

  const MockColorScreen = ({ initialState }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <ColorOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  beforeEach(() => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  const aggregation = aggregationForFilter(FilterParamName.color, mockAggregations)

  it("shows the correct number of color options", () => {
    const tree = renderWithWrappers(
      <MockColorScreen initialState={state} aggregations={mockAggregations} {...getEssentialProps()} />
    )
    // Counts returned + extra black and white option
    expect(tree.root.findAllByType(ColorSwatch)).toHaveLength(aggregation!.counts.length + 1)
  })

  describe("selecting a color filter", () => {
    it("displays a color filter option when selected", () => {
      state = {
        selectedFilters: [
          {
            paramName: FilterParamName.color,
            paramValue: aggregation!.counts[0].value,
            displayText: aggregation!.counts[0].name,
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      const component = renderWithWrappers(<MockColorScreen initialState={state} {...getEssentialProps()} />)
      const selectedOption = selectedColorOptions(component)[0]
      expect(selectedOption.props.colorOption).toMatch(aggregation!.counts[0].name)
    })

    it("allows only one color option to be selected when several are tapped", () => {
      state = {
        selectedFilters: [
          {
            paramName: FilterParamName.color,
            paramValue: aggregation!.counts[0].value,
            displayText: aggregation!.counts[0].name,
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      const tree = renderWithWrappers(<MockColorScreen initialState={state} {...getEssentialProps()} />)

      const firstOptionInstance = tree.root.findAllByType(ColorContainer)[0]
      const secondOptionInstance = tree.root.findAllByType(ColorContainer)[1]
      const thirdOptionInstance = tree.root.findAllByType(ColorContainer)[2]

      act(() => firstOptionInstance.props.onPress())
      act(() => secondOptionInstance.props.onPress())
      act(() => thirdOptionInstance.props.onPress())

      const selectedOptions = selectedColorOptions(tree)
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0].props.colorOption).toMatch(aggregation!.counts[2].name)
    })

    it("deselects color option on second tap", () => {
      state = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      const tree = renderWithWrappers(<MockColorScreen initialState={state} {...getEssentialProps()} />)

      const secondOptionInstance = tree.root.findAllByType(ColorContainer)[1]

      act(() => secondOptionInstance.props.onPress())

      const selectedOptions = selectedColorOptions(tree)
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0].props.colorOption).toMatch(aggregation!.counts[0].name)

      act(() => secondOptionInstance.props.onPress())

      const afterSecondTapOptions = selectedColorOptions(tree)
      expect(afterSecondTapOptions).toHaveLength(0)
    })
  })
})
