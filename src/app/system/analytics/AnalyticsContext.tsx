import { ScreenOwnerType } from "@artsy/cohesion"
import { FC, createContext, useContext } from "react"

export interface AnalyticsContextProps {
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
}

const AnalyticsContext = createContext<AnalyticsContextProps>({})

export const AnalyticsContextProvider: FC<AnalyticsContextProps> = ({ children, ...rest }) => {
  return <AnalyticsContext.Provider value={rest}>{children}</AnalyticsContext.Provider>
}

export const useAnalyticsContext = () => {
  return useContext(AnalyticsContext)
}
