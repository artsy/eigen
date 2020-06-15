import { Box, CheckIcon, Theme } from "@artsy/palette"
import { FilterParamName, FilterType, InitialState } from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { extractText } from "lib/tests/extractText"
import React, { Dispatch } from "react"
import { act, create, ReactTestRenderer } from "react-test-renderer"
import { FakeNavigator as MockNavigator } from "../../../../lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { OptionListItem } from "../../../../lib/Components/FilterModal"
import {
  Aggregations,
  ArtworkFilterContext,
  ArtworkFilterContextState,
  FilterActions,
  reducer,
} from "../../../utils/ArtworkFiltersStore"
import { MediumOptionsScreen } from "../MediumOptions"
import { InnerOptionListItem, SingleSelectOptionListItemRow } from "../SingleSelectOption"

describe("Medium Options Screen", () => {
  let state: ArtworkFilterContextState
  let mockNavigator: MockNavigator

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
    }
  })

  const aggregations: Aggregations = [
    {
      slice: "MEDIUM",
      counts: [
        {
          name: "Prints",
          count: 2956,
          value: "prints",
        },
        {
          name: "Design",
          count: 513,
          value: "design",
        },
        {
          name: "Sculpture",
          count: 277,
          value: "sculpture",
        },
        {
          name: "Work on Paper",
          count: 149,
          value: "work-on-paper",
        },
        {
          name: "Painting",
          count: 145,
          value: "painting",
        },
        {
          name: "Drawing",
          count: 83,
          value: "drawing",
        },
        {
          name: "Jewelry",
          count: 9,
          value: "jewelry",
        },
        {
          name: "Photography",
          count: 4,
          value: "photography",
        },
      ],
    },
    {
      slice: "COLOR",
      counts: [
        {
          count: 10,
          value: "some-value",
          name: "some-name",
        },
      ],
    },
  ]

  const MockMediumScreen = ({ initialState }: InitialState) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
            aggregations,
          }}
        >
          <MediumOptionsScreen navigator={mockNavigator as any} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  const selectedMediumOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter(item => item.findAllByType(Box).length > 0)[0]
    return selectedOption
  }

  it("renders the correct number of medium options", () => {
    const tree = create(<MockMediumScreen initialState={state} />)

    // Counts returned + all option
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(9)
  })

  it("adds an all option", () => {
    const tree = create(<MockMediumScreen initialState={state} />)
    const firstRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[0]
    expect(extractText(firstRow)).toContain("All")
  })

  describe("selecting a Medium filter", () => {
    it("displays the default medium if no selected filters", () => {
      const component = create(<MockMediumScreen initialState={state} />)
      const selectedOption = selectedMediumOption(component)
      expect(extractText(selectedOption)).toContain("All")
    })

    it("displays a medium filter option when selected", () => {
      state = {
        selectedFilters: [
          {
            filterType: FilterType.medium,
            paramName: FilterParamName.medium,
            paramValue: "photography",
            displayText: "Photography",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const component = create(<MockMediumScreen initialState={state} />)
      const selectedOption = selectedMediumOption(component)
      expect(extractText(selectedOption)).toContain("Photography")
    })

    it("allows only one medium filter to be selected at a time", () => {
      const initialState: ArtworkFilterContextState = {
        selectedFilters: [
          {
            filterType: FilterType.medium,
            paramName: FilterParamName.medium,
            paramValue: "sculpture",
            displayText: "Sculpture",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
      }

      const tree = create(<MockMediumScreen initialState={initialState} />)

      const selectedRow = tree.root.findAllByType(SingleSelectOptionListItemRow)[3]
      expect(extractText(selectedRow)).toEqual("Sculpture")
      expect(selectedRow.findAllByType(CheckIcon)).toHaveLength(1)
    })

    it("allows only one medium filter to be selected at a time when several medium options are tapped", () => {
      const dispatch: Dispatch<FilterActions> = () => {
        return {
          type: "selectFilters",
          payload: {
            displayText: "All",
            paramName: FilterParamName.medium,
            filterType: FilterType.medium,
          },
        }
      }
      const mediumScreen = create(
        <Theme>
          <ArtworkFilterContext.Provider
            value={{
              state,
              aggregations,
              dispatch,
            }}
          >
            <MediumOptionsScreen navigator={mockNavigator as any} />
          </ArtworkFilterContext.Provider>
        </Theme>
      ).root

      const firstMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[0]
      const secondMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[1]
      const thirdMediumOptionInstance = mediumScreen.findAllByType(SingleSelectOptionListItemRow)[3]
      const selectedOptionIcon = mediumScreen.findAllByType(CheckIcon)

      act(() => firstMediumOptionInstance.props.onPress())
      act(() => secondMediumOptionInstance.props.onPress())
      act(() => thirdMediumOptionInstance.props.onPress())

      expect(selectedOptionIcon).toHaveLength(1)
    })
  })
})
