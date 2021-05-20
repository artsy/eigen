import { OptionListItem as FilterModalOptionListItem } from "lib/Components/ArtworkFilter"
import { OptionListItem as MultiSelectOptionListItem } from "../MultiSelectOption"

import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { MockFilterScreen } from "../../__tests__/FilterTestHelper"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "../../ArtworkFilterStore"
import { MaterialsTermsOptionsScreen } from "../MaterialsTermsOptions"
import { getEssentialProps } from "./helper"

describe("Materials Options Screen", () => {
  const initialState: ArtworkFiltersState = {
    aggregations: [
      {
        slice: "MATERIALS_TERMS",
        counts: [
          {
            count: 44,
            name: "Acrylic",
            value: "acrylic"
          },
          {
            count: 30,
            name: "Canvas",
            value: "canvas"
          },
          {
            count: 26,
            name: "Metal",
            value: "metal"
          },
        ]
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
      const tree = renderWithWrappers(<MockMaterialsTermsOptionsScreen initialData={initialState} />)

      expect(tree.root.findAllByType(MultiSelectOptionListItem)).toHaveLength(3)

      const items = tree.root.findAllByType(MultiSelectOptionListItem)
      expect(items.map(extractText)).toEqual(["Acrylic", "Canvas", "Metal"])
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

    it("displays a comma-separated list of the selected filters on the filter modal screen", () => {
      const tree = renderWithWrappers(<MockFilterScreen initialState={state} />)

      const items = tree.root.findAllByType(FilterModalOptionListItem)
      const item = items.find((i) => extractText(i).startsWith("Material"))

      expect(item).not.toBeUndefined()
      if (item) {
        expect(extractText(item)).toContain("Acrylic")
      }
    })

    it("toggles selected filters 'ON' and unselected filters 'OFF", async () => {
      const tree = renderWithWrappers(<MockMaterialsTermsOptionsScreen initialData={state} />)

      const options = tree.root.findAllByType(Check)

      expect(options[0].props.selected).toBe(true)
      expect(options[1].props.selected).toBe(false)
      expect(options[2].props.selected).toBe(false)
    })
  })
})
