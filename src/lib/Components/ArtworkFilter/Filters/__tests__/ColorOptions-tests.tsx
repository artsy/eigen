import { aggregationForFilter, Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { ColorContainer, ColorOptionsScreen } from "../ColorOptions"
import { ColorSwatch } from "../ColorSwatch"
import { getEssentialProps } from "./helper"

describe("Color options screen", () => {
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

  const initialState: ArtworkFiltersState = {
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

  const selectedColorOptions = (componentTree: ReactTestRenderer) => {
    const colorSwatches = componentTree.root.findAllByType(ColorSwatch)
    const selectedOption = colorSwatches.filter((item) => item.props.selected)
    return selectedOption
  }

  const MockColorScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <ColorOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const aggregation = aggregationForFilter(FilterParamName.color, mockAggregations)

  it("shows the correct number of color options", () => {
    const tree = renderWithWrappers(
      <MockColorScreen aggregations={mockAggregations} {...getEssentialProps()} initialData={initialState} />
    )

    // Counts returned + extra black and white option
    expect(tree.root.findAllByType(ColorSwatch)).toHaveLength(aggregation!.counts.length + 1)
  })

  describe("selecting a color filter", () => {
    it("displays a color filter option when selected", () => {
      const injectedState: ArtworkFiltersState = {
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

      const component = renderWithWrappers(<MockColorScreen {...getEssentialProps()} initialData={injectedState} />)

      const selectedOption = selectedColorOptions(component)[0]
      expect(selectedOption.props.colorOption).toMatch(aggregation!.counts[0].name)
    })

    it("allows only one color option to be selected when several are tapped", () => {
      const injectedState: ArtworkFiltersState = {
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

      const tree = renderWithWrappers(<MockColorScreen {...getEssentialProps()} initialData={injectedState} />)

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
      const injectedState: ArtworkFiltersState = {
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

      const tree = renderWithWrappers(<MockColorScreen {...getEssentialProps()} initialData={injectedState} />)

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
