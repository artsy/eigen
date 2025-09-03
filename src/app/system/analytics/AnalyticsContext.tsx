import { ScreenOwnerType } from "@artsy/cohesion"
import { FC, createContext, useContext } from "react"

export interface AnalyticsContextProps {
  contextModule?: string
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreenOwnerType?: ScreenOwnerType
}

const AnalyticsContext = createContext<AnalyticsContextProps>({})

export const AnalyticsContextProvider: FC<React.PropsWithChildren<AnalyticsContextProps>> = ({
  children,
  ...rest
}) => {
  return <AnalyticsContext.Provider value={rest}>{children}</AnalyticsContext.Provider>
}

export const useAnalyticsContext = () => {
  return useContext(AnalyticsContext)
}
