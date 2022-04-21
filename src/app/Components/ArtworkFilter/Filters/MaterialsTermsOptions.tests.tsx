import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../ArtworkFilterStore"
import { MockFilterScreen } from "../FilterTestHelper"
import { getEssentialProps } from "./helper"
import { MaterialsTermsOptionsScreen } from "./MaterialsTermsOptions"

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
    sizeMetric: "cm",
  }

  const MockMaterialsTermsOptionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <MaterialsTermsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      const { getByText } = renderWithWrappersTL(
        <MockMaterialsTermsOptionsScreen initialData={initialState} />
      )

      expect(getByText("Acrylic")).toBeTruthy()
      expect(getByText("Canvas")).toBeTruthy()
      expect(getByText("Metal")).toBeTruthy()
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
      const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={state} />)

      expect(within(getByText("Material")).getByText("• 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(
        <MockMaterialsTermsOptionsScreen initialData={state} />
      )
      const options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("Acrylic")
    })
  })
})
