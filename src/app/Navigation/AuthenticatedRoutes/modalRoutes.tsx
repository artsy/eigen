import { AppModule, nonTabModules } from "app/AppRegistry"
import { registerScreen } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { AuthenticatedRoutesStack } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { isModalScreen } from "app/Navigation/Utils/isModalScreen"

const modalModules = Object.entries(nonTabModules).filter(([_, module]) => isModalScreen(module))

/**
 * This represents the screens that are presented **always** modally
 */
export const modalRoutes = () => {
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
