import { AppModule, modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const registerSharedRoutes = () => {
  return (
    <StackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        // The module needs to be a defined react module
        if (
          module.type === "react" &&
          module.Component &&
          // The module should not be a root view for a tab
          !module.options.isRootViewForTabName &&
          // The module is not an restricted to a specific tab
          !module.options.onlyShowInTabName
        ) {
          return registerScreen({
            name: moduleName as AppModule,
            module: module,
          })
        }
        return null
      })}
    </StackNavigator.Group>
  )
}
