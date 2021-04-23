import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"

import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { MockFilterScreen } from "../../__tests__/FilterTestHelper"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../../ArtworkFilterStore"
import { InstitutionOptionsScreen } from "../InstitutionOptions"
import { getEssentialProps } from "./helper"

describe("Institution Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "INSTITUTION",
        counts: [
          {
            name: "Musée Picasso Paris",
            count: 36,
            value: "musee-picasso-paris",
          },
          {
            name: "Fondation Beyeler",
            count: 33,
            value: "fondation-beyeler",
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

  const MockInstitutionScreen = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <InstitutionOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  describe("before any filters are selected", () => {
    it("renders all options present in the aggregation", () => {
      const tree = renderWithWrappers(<MockInstitutionScreen initialData={initialState} />)

      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(3)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["Musée Picasso Paris", "Fondation Beyeler", "Tate"])
    })
  })

  describe("when filters are selected", () => {
    const state: ArtworkFiltersState = {
      ...initialState,
      selectedFilters: [
        {
          displayText: "Musée Picasso Paris",
          paramName: FilterParamName.institution,
          paramValue: ["musee-picasso-paris"],
        },
      ],
    }

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Institution"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("Musée Picasso Paris")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const tree = renderWithWrappers(<MockInstitutionScreen initialData={state} />)

      const options = tree.root.findAllByType(Check)

      expect(options[0].props.selected).toBe(true)
      expect(options[1].props.selected).toBe(false)
      expect(options[2].props.selected).toBe(false)
    })
  })
})
