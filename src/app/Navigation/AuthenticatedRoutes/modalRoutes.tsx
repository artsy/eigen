import { modules as allModules, AppModule } from "app/AppRegistry"
import { registerScreen } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { ModalStack } from "app/Navigation/AuthenticatedRoutes/Tabs"
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

const modalModules = Object.entries(modules).filter(([_, module]) => isModalScreen(module))

/**
 * This represents the screens that are presented **always** modally
 */
export const modalRoutes = () => {
  return (
    <ModalStack.Group screenOptions={{ presentation: "modal" }}>
      {modalModules.map(([moduleName, module]) => {
        return registerScreen({
          name: moduleName as AppModule,
          module: module,
        })
      })}
    </ModalStack.Group>
  )
}
