import { within } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../ArtworkFilterStore"
import { MockFilterScreen } from "../FilterTestHelper"
import { GalleriesAndInstitutionsOptionsScreen } from "./GalleriesAndInstitutionsOptions"
import { getEssentialProps } from "./helper"

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
    sizeMetric: "cm",
  }

  const MockGalleriesAndInstitutionsScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <GalleriesAndInstitutionsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      const { getByText } = renderWithWrappersTL(
        <MockGalleriesAndInstitutionsScreen initialData={initialState} />
      )

      expect(getByText("Musée Picasso Paris"))
      expect(getByText("Gagosian"))
      expect(getByText("Tate"))
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
      const { getByText } = renderWithWrappersTL(<MockFilterScreen initialState={state} />)

      expect(within(getByText("Galleries & Institutions")).getByText("• 1")).toBeTruthy()
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const { getAllByA11yState } = renderWithWrappersTL(
        <MockGalleriesAndInstitutionsScreen initialData={state} />
      )

      const options = getAllByA11yState({ checked: true })

      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent("Musée Picasso Paris")
    })
  })
})
