import { Box, Flex, Sans } from "@artsy/palette"
import React, { createContext, useContext, useReducer } from "react"
import { color } from "styled-system"

const ArtworkFilterContext = React.createContext({ color: "black" })
const { Provider, Consumer } = ArtworkFilterContext
const initialState = { filterCount: 0 }

function dispatch(filterState, action) {
  switch (action.type) {
    case "incrementFilter":
      return { filterCount: filterState.filterCount + 1 }
    case "decrementFilter":
      return { filterCount: filterState.filterCount - 1 }
    case "resetFilter":
      return { filterCount: 0 }

      throw new Error()
  }
}
export const ArtworkFilterContextProvider: React.FC = ({}) => {
  // const initialFilterState = {
  //   ...initialArtworkFilterState,
  //   ...paramsToCamelCase(filters),
  // }

  // const [artworkFilterState, dispatch] = useReducer(
  //   artworkFilterReducer,
  //   initialFilterState
  // )

  return <ArtworkFilterContext.Provider value={{ color: "black" }}>{children}</ArtworkFilterContext.Provider>
}

// export function FilterCounter() {
//   const [state, dispatch] = useReducer(reducer, initialState)
//   return state.filterCount
// }

// export const FilterContext = React.createContext({
//   filterCount: 0,
//   setFilterCount: (currentFilterCount: number, filterCount: number) => {
//     return currentFilterCount + filterCount
//   },
// })

// const [state, dispatch] = useReducer(reducer, updatedFilters, currentFilters)

function FilterArtworkApplyCount() {
  return (
    <FilterContext.Consumer>
      {({ filterCount }) => (
        <Button onPress={null} block width={100} variant="secondaryOutline">
          {filterCount > 0 ? "Apply" + " (" + filterCount + ")" : "Apply"}
        </Button>
      )}
    </FilterContext.Consumer>
  )
}

export default FilterArtworkApplyCount
