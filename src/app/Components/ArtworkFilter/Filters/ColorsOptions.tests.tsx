import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act, ReactTestRenderer } from "react-test-renderer"
import { COLORS, ColorsOptionsScreen } from "./ColorsOptions"
import { ColorsSwatch } from "./ColorsSwatch"
import { getEssentialProps } from "./helper"

describe("Colors options screen", () => {
  const []: Aggregations = []

  const initialState: ArtworkFiltersState = {
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
    sizeMetric: "cm",
  }

  const selectedColorOptions = (componentTree: ReactTestRenderer) => {
    const colorSwatches = componentTree.root.findAllByType(ColorsSwatch)
    const selectedOption = colorSwatches.filter((item) => item.props.selected)
    return selectedOption
  }

  const MockColorScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <ColorsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("shows the correct number of color options", () => {
    const tree = renderWithWrappersLEGACY(
      <MockColorScreen aggregations={[]} {...getEssentialProps()} initialData={initialState} />
    )

    expect(tree.root.findAllByType(ColorsSwatch)).toHaveLength(COLORS.length)
  })

  describe("selecting a color filter", () => {
    it("displays a color filter option when selected", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.colors,
            paramValue: [COLORS[0].value],
            displayText: COLORS[0].name,
          },
        ],
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
        sizeMetric: "cm",
      }

      const component = renderWithWrappersLEGACY(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      const selectedOption = selectedColorOptions(component)[0]
      expect(selectedOption.props.name).toMatch(COLORS[0].name)
    })

    it("allows multiple color options to be selected when several are tapped", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.colors,
            paramValue: COLORS[0].value,
            displayText: COLORS[0].name,
          },
        ],
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
        sizeMetric: "cm",
      }

      const tree = renderWithWrappersLEGACY(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      const firstOptionInstance = tree.root.findAllByType(ColorsSwatch)[0]
      const secondOptionInstance = tree.root.findAllByType(ColorsSwatch)[1]
      const thirdOptionInstance = tree.root.findAllByType(ColorsSwatch)[2]

      act(() => firstOptionInstance.props.onPress())
      act(() => secondOptionInstance.props.onPress())
      act(() => thirdOptionInstance.props.onPress())

      const selectedOptions = selectedColorOptions(tree)
      expect(selectedOptions).toHaveLength(3)
      expect(selectedOptions.map((option) => option.props.name)).toEqual([
        COLORS[0].name,
        COLORS[1].name,
        COLORS[2].name,
      ])
    })

    it("deselects color option on second tap", () => {
      const injectedState: ArtworkFiltersState = {
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
        sizeMetric: "cm",
      }

      const tree = renderWithWrappersLEGACY(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      const secondOptionInstance = tree.root.findAllByType(ColorsSwatch)[1]

      act(() => secondOptionInstance.props.onPress())

      const selectedOptions = selectedColorOptions(tree)
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0].props.name).toMatch(COLORS[1].name)

      act(() => secondOptionInstance.props.onPress())

      const afterSecondTapOptions = selectedColorOptions(tree)
      expect(afterSecondTapOptions).toHaveLength(0)
    })
  })
})
