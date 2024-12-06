import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { nonTabModules } from "app/Navigation/helpers/getNonTabModules"
import { isModalScreen } from "app/Navigation/helpers/isModalScreen"
import { AppModule } from "app/Navigation/routes"

const nonModalModules = Object.entries(nonTabModules).filter(
  ([_, module]) => !isModalScreen(module)
)

/**
 * This represents the screens that can be accessed from any tab.
 * For example the artwork screen and the artist screen can be accessed from any tab
 */
export const sharedRoutes = () => {
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
