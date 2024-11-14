import { AppModule, modules as allModules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { AuthenticatedRoutesStack } from "app/Navigation/AuthenticatedRoutes/Tabs"
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
const nonModalModules = Object.entries(modules).filter(([_, module]) => !isModalScreen(module))

export const registerSharedRoutes = () => {
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

export const registerSharedModalRoutes = () => {
  return (
    <AuthenticatedRoutesStack.Group screenOptions={{ presentation: "modal" }}>
      {modalModules.map(([moduleName, module]) => {
        return registerScreen({
          name: moduleName as AppModule,
          module: module,
        })
      })}
    </AuthenticatedRoutesStack.Group>
  )
}
