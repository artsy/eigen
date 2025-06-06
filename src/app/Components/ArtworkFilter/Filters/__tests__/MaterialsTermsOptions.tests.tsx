import { screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { MockFilterScreen } from "app/Components/ArtworkFilter/FilterTestHelper"
import { MaterialsTermsOptionsScreen } from "app/Components/ArtworkFilter/Filters/MaterialsTermsOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Materials Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "MATERIALS_TERMS",
        counts: [
          {
            count: 44,
            name: "Acrylic",
            value: "acrylic",
          },
          {
            count: 30,
            name: "Canvas",
            value: "canvas",
          },
          {
            count: 26,
            name: "Metal",
            value: "metal",
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

  const MockMaterialsTermsOptionsScreen = ({
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
        <MaterialsTermsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      renderWithWrappers(<MockMaterialsTermsOptionsScreen initialData={initialState} />)

      expect(screen.getByText("Acrylic")).toBeOnTheScreen()
      expect(screen.getByText("Canvas")).toBeOnTheScreen()
      expect(screen.getByText("Metal")).toBeOnTheScreen()
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Acrylic",
          paramName: FilterParamName.materialsTerms,
          paramValue: ["acrylic"],
        },
      ],
    }

    it("displays the number of the selected filters on the filter modal screen", () => {
      renderWithWrappers(<MockFilterScreen initialState={state} />)

      expect(screen.getByText("Material • 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      renderWithWrappers(<MockMaterialsTermsOptionsScreen initialData={state} />)
      const options = screen.getAllByTestId("multi-select-option-button")
      const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

      expect(options).toHaveLength(3)

      expect(options[0]).toHaveTextContent("Acrylic")
      expect(options[1]).toHaveTextContent("Canvas")
      expect(options[2]).toHaveTextContent("Metal")

      expect(checkboxes[0]).toHaveProp("selected", true)
      expect(checkboxes[1]).toHaveProp("selected", false)
      expect(checkboxes[2]).toHaveProp("selected", false)
    })
  })
})
