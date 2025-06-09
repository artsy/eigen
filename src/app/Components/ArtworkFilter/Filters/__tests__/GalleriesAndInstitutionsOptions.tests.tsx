import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { GalleriesAndInstitutionsOptionsScreen } from "app/Components/ArtworkFilter/Filters/GalleriesAndInstitutionsOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Galleries and Institutions Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "PARTNER",
        counts: [
          {
            name: "Musée Picasso Paris",
            count: 36,
            value: "musee-picasso-paris",
          },
          {
            name: "Gagosian",
            count: 33,
            value: "gagosian",
          },
          {
            name: "Tate",
            count: 11,
            value: "tate",
          },
        ],
      },
    ],
    appliedFilters: [],
    applyFilters: false,
    counts: {
      total: null,
      followedArtists: null,
    },
    filterType: "artwork",
    previouslyAppliedFilters: [],
    selectedFilters: [],
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const MockGalleriesAndInstitutionsScreen = ({
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
        <GalleriesAndInstitutionsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      renderWithWrappers(<MockGalleriesAndInstitutionsScreen initialData={initialState} />)

      expect(screen.getByText("Musée Picasso Paris")).toBeOnTheScreen()
      expect(screen.getByText("Gagosian")).toBeOnTheScreen()
      expect(screen.getByText("Tate")).toBeOnTheScreen()
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Musée Picasso Paris",
          paramName: FilterParamName.partnerIDs,
          paramValue: ["musee-picasso-paris"],
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Galleries & Institutions • 1")).toBeOnTheScreen()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockGalleriesAndInstitutionsScreen initialData={state} />)

      const options = screen.getAllByTestId("multi-select-option-button")

      expect(options[0]).toHaveTextContent("Musée Picasso Paris")
    })
  })
})
