import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { AppModule } from "app/Navigation/routes"
import { isModalScreen } from "app/Navigation/utils/isModalScreen"
import { nonTabModules } from "app/Navigation/utils/modules"

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
