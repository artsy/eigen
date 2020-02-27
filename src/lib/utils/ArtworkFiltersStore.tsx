import React, { createContext, Dispatch, Reducer, useReducer } from "react"

const initialState: ArtworkFilterContextState = {
  filterCount: 0,
}

interface ArtworkFilterContextState {
  filterCount: number
}

export interface ResetFilterCount {
  type: "resetFilterCount"
}

// for incrementing single option only filters
interface UpdateFilterCount {
  type: "updateFilterCount"
  payload: number
}

// for decrementing selected filters
interface DecrementFilterCount {
  type: "decrementFilterCount"
  payload: number
}

// for incrementing multiple option filters
interface IncrementFilterCount {
  type: "incrementFilterCount"
  payload: number
}

type FilterActions = ResetFilterCount | UpdateFilterCount | DecrementFilterCount | IncrementFilterCount

interface ArtworkFilterContext {
  state: ArtworkFilterContextState
  dispatch: Dispatch<FilterActions>
}

export const ArtworkFilterContext = createContext<ArtworkFilterContext>(null)

export const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<ArtworkFilterContextState, FilterActions>>((filterState, action) => {
    let currentFilterCount
    switch (action.type) {
      case "resetFilterCount":
        return { filterCount: 0 }
      case "updateFilterCount":
        return { filterCount: action.payload }
      case "decrementFilterCount":
        currentFilterCount = action.payload
        return { filterCount: currentFilterCount - 1 }
      case "incrementFilterCount":
        currentFilterCount = action.payload
        return { filterCount: currentFilterCount + 1 }
    }
  }, initialState)

  return <ArtworkFilterContext.Provider value={{ state, dispatch }}>{children}</ArtworkFilterContext.Provider>
}
