import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { COLORS, ColorsOptionsScreen } from "app/Components/ArtworkFilter/Filters/ColorsOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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

  const selectedColorOptions = () =>
    COLORS.filter((color) => !!screen.queryByTestId(`check-icon-${color.name}`))

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

  it("shows the correct number of color options", async () => {
    await renderWithWrappers(
      <MockColorScreen aggregations={[]} {...getEssentialProps()} initialData={initialState} />
    )

    expect(screen.getAllByTestId(/^color-swatch-/)).toHaveLength(COLORS.length)
    COLORS.forEach((color) => {
      expect(screen.getByText(color.name)).toBeOnTheScreen()
    })
  })

  describe("selecting a color filter", () => {
    it("displays a color filter option when selected", async () => {
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

      await renderWithWrappers(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      const selectedOption = selectedColorOptions()[0]
      expect(selectedOption.name).toMatch(COLORS[0].name)
    })

    it("allows multiple color options to be selected when several are tapped", async () => {
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

      await renderWithWrappers(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      await fireEvent.press(screen.getByText(COLORS[0].name))
      await fireEvent.press(screen.getByText(COLORS[1].name))
      await fireEvent.press(screen.getByText(COLORS[2].name))

      const selectedOptions = selectedColorOptions()
      expect(selectedOptions).toHaveLength(3)
      expect(selectedOptions.map((option) => option.name)).toEqual([
        COLORS[0].name,
        COLORS[1].name,
        COLORS[2].name,
      ])
    })

    it("deselects color option on second tap", async () => {
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

      await renderWithWrappers(
        <MockColorScreen {...getEssentialProps()} initialData={injectedState} />
      )

      await fireEvent.press(screen.getByText(COLORS[1].name))

      const selectedOptions = selectedColorOptions()
      expect(selectedOptions).toHaveLength(1)
      expect(selectedOptions[0].name).toMatch(COLORS[1].name)

      await fireEvent.press(screen.getByText(COLORS[1].name))

      const afterSecondTapOptions = selectedColorOptions()
      expect(afterSecondTapOptions).toHaveLength(0)
    })
  })
})
