import { createContext, useContext } from "react"

export type PageableScreenEntity = {
  Component: JSX.Element
  name: string
}

export interface PageableScreensContextValue {
  activeScreenIndex: number
  activeScreen: PageableScreenEntity
}

export const PageableScreensContext = createContext(null as unknown as PageableScreensContextValue)

export const usePageableScreensContext = () => {
  const context = useContext<PageableScreensContextValue>(PageableScreensContext)

  // FIXME: Uncomment once we launch pageable screens view
  // if (!context) {
  //   throw new Error("usePageableScreensContext must be inside PageableScreensContext.Provider")
  // }

  return context
}
