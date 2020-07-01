import { Box, Theme } from "@artsy/palette"
import { FilterParamName, InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { create, ReactTestRenderer } from "react-test-renderer"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import { Aggregations, ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFiltersStore"
import { PriceRangeOptionsScreen } from "../PriceRangeOptions"
import { InnerOptionListItem } from "../SingleSelectOption"

const aggregations: Aggregations = [
  {
    slice: "PRICE_RANGE",
    counts: [
      {
        name: "for Sale",
        count: 2028,
        value: "*-*",
      },
      {
        name: "between $10,000 & $50,000",
        count: 598,
        value: "10000-50000",
      },
      {
        name: "between $1,000 & $5,000",
        count: 544,
        value: "1000-5000",
      },
      {
        name: "Under $1,000",
        count: 393,
        value: "*-1000",
      },
      {
        name: "between $5,000 & $10,000",
        count: 251,
        value: "5000-10000",
      },
      {
        name: "over $50,000",
        count: 233,
        value: "50000-*",
      },
    ],
  },
]

describe("Price Range Options Screen", () => {
  let mockNavigator: MockNavigator
  let state: ArtworkFilterContextState

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations,
    }
  })

  const MockPriceRangeScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            dispatch: null as any,
          }}
        >
          <PriceRangeOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedPriceRangeOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(item => item.findAllByType(Box).length > 0)[0]
    return selectedOption
  }

  it("renders the correct number of price range options", () => {
    const tree = create(<MockPriceRangeScreen initialState={state} />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(6)
  })

  it("has an all option", () => {
    const tree = create(<MockPriceRangeScreen initialState={state} />)
    const firstOption = tree.root.findAllByType(OptionListItem)[0]
    expect(extractText(firstOption)).toContain("All")
  })

  describe("selectedPriceRangeOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = create(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("All")
    })

    it("prefers an applied filter over the default filter", () => {
      state = {
        selectedFilters: [],
        appliedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        applyFilters: false,
        aggregations,
      }

      const tree = create(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over the default filter", () => {
      state = {
        selectedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations,
      }

      const component = create(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over an applied filter", () => {
      state = {
        selectedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        appliedFilters: [
          {
            displayText: "$10,000-20,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$10,000-20,000",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "$10,000-20,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$10,000-20,000",
          },
        ],
        applyFilters: false,
        aggregations,
      }

      const tree = create(<MockPriceRangeScreen initialState={state} />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })
  })
})
