import * as React from "react"

type Action = { type: "show" } | { type: "hide" }

type Dispatch = (action: Action) => void

interface State {
  visible: boolean
}
interface ToggleBottomTabProviderProps {
  children: React.ReactNode
}

const ToggleBottomTabStateContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function toggleBottomTabReducer(_state: State, action: Action) {
  switch (action.type) {
    case "show": {
      return { visible: true }
    }
    case "hide": {
      return { visible: false }
    }
  }
}

function ToggleBottomTabProvider({ children }: ToggleBottomTabProviderProps) {
  const [state, dispatch] = React.useReducer(toggleBottomTabReducer, { visible: false })
  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch }
  return (
    <ToggleBottomTabStateContext.Provider value={value}>
      {children}
    </ToggleBottomTabStateContext.Provider>
  )
}

function useToggleBottomTab() {
  const context = React.useContext(ToggleBottomTabStateContext)
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider")
  }
  return context
}

export { ToggleBottomTabProvider, useToggleBottomTab }
