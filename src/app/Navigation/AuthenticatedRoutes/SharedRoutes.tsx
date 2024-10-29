import { AppModule, modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SharedRoutes = (): JSX.Element => {
  return (
    <StackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        if (module.type === "react" && module.Component && !module.options.isRootViewForTabName) {
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
