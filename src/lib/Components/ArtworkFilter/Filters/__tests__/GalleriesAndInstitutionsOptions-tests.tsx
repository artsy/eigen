import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"

import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { MockFilterScreen } from "../../__tests__/FilterTestHelper"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../../ArtworkFilterStore"
import { GalleriesAndInstitutionsOptionsScreen } from "../GalleriesAndInstitutionsOptions"
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
      const tree = renderWithWrappers(<MockGalleriesAndInstitutionsScreen initialData={initialState} />)

      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(3)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["Musée Picasso Paris", "Gagosian", "Tate"])
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

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Galleries and institutions"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("Musée Picasso Paris")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const tree = renderWithWrappers(<MockGalleriesAndInstitutionsScreen initialData={state} />)

      const options = tree.root.findAllByType(Check)

      expect(options[0].props.selected).toBe(true)
      expect(options[1].props.selected).toBe(false)
      expect(options[2].props.selected).toBe(false)
    })
  })
})
