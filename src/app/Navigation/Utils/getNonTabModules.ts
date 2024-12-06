import { modules } from "app/Navigation/routes"

export const nonTabModules = Object.fromEntries(
  Object.entries(modules).filter(([_, module]) => {
    return (
      // The module should not be a root view for a tab
      !module.options?.isRootViewForTabName &&
      // The module is not an restricted to a specific tab
      !module.options?.onlyShowInTabName
    )
  })
)
