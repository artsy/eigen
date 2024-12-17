import { AppModule, ModuleDescriptor, routes } from "app/Navigation/routes"
import { uniqBy } from "lodash"

/**
 * Modules is a record of all the modules in the app
 * The key difference between this and the routes array is that two routes can lead to the same
 * module screen. However modules are all unique
 */
export const modules: Record<AppModule, ModuleDescriptor<AppModule>> = uniqBy(
  routes,
  "name"
).reduce((acc, value) => ({ ...acc, [value.name]: value }), {} as any)

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
