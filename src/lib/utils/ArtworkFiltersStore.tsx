import React, { createContext, useReducer } from "react"

const initialState = {
  filterCount: 0,
}
const store = createContext(initialState)
const { Provider, Consumer } = store

const ArtworkFilterGlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((filterState, action) => {
    switch (action.type) {
      case "incrementFilter": // how to make this receive a parameter????
        const updatedFilterCount = filterState.filterCount + 1
        console.log("TCL: ArtworkFilterGlobalStateProvider -> filterState.filterCount", filterState.filterCount)
        console.log("TCL: ArtworkFilterGlobalStateProvider -> updatedFilterCount", updatedFilterCount)
        return updatedFilterCount
      case "getFilterCount":
        console.log("TCL: ArtworkFilterGlobalStateProvider -> filterState.filterCount", filterState.filterCount)
        return filterState?.filterCount || 1000
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, Consumer, ArtworkFilterGlobalStateProvider }
