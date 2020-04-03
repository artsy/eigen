import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { ArtworkFilterContext, ArtworkFilterContextState, reducer } from "lib/utils/ArtworkFiltersStore"
import React from "react"
import { TouchableOpacity } from "react-native"
import { CollectionZeroState } from "../CollectionZeroState"

let state: ArtworkFilterContextState
let props
beforeEach(() => {
  state = {
    selectedFilters: [
      { value: "Price (high to low)", filterType: "sort" },
      { value: "Installation", filterType: "medium" },
    ],
    appliedFilters: [
      { value: "Artwork year (ascending)", filterType: "sort" },
      { value: "Jewelry", filterType: "medium" },
    ],
    previouslyAppliedFilters: [
      { value: "Artwork year (ascending)", filterType: "sort" },
      { value: "Jewelry", filterType: "medium" },
    ],
    applyFilters: false,
  }
  props = {
    clearAllFilters: jest.fn(),
  }
})

afterEach(() => {
  jest.resetAllMocks()
})

describe("Collection Zero State", () => {
  const MockZeroStateScreen = ({ initialState }) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: filterState,
            dispatch,
          }}
        >
          <CollectionZeroState {...props} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }
  it("clears filters in zero state when 'Clear All Filters' is pressed", () => {
    const zeroStateScreen = mount(<MockZeroStateScreen initialState={state} />)

    zeroStateScreen
      .find(TouchableOpacity)
      .props()
      .onPress()

    expect(props.clearAllFilters).toHaveBeenCalled()
  })
})
