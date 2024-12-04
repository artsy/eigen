import { modules as allModules, AppModule } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { isModalScreen } from "app/Navigation/Utils/isModalScreen"

const modules = Object.fromEntries(
  Object.entries(allModules).filter(([_, module]) => {
    return (
      module.type === "react" &&
      module.Component &&
      // The module should not be a root view for a tab
      !module.options.isRootViewForTabName &&
      // The module is not an restricted to a specific tab
      !module.options.onlyShowInTabName
    )
  })
)

const nonModalModules = Object.entries(modules).filter(([_, module]) => !isModalScreen(module))

/**
 * This represents the screens that can be accessed from any tab
 */
export const commonRoutes = () => {
  return (
    <StackNavigator.Group>
      {nonModalModules.map(([moduleName, module]) => {
        return registerScreen({
          name: moduleName as AppModule,
          module: module,
        })
      })}
    </StackNavigator.Group>
  )
}
