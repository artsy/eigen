import { useScreenDimensions } from "@artsy/palette-mobile"
import { AppModule, modules } from "app/AppRegistry"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { View } from "react-native"

export type SharedRoutesParams = { [key in AppModule]: undefined }

export const SharedRoutes = () => {
  return (
    <TabStackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        if (module.type === "react" && module.Component && !module.options.isRootViewForTabName) {
          return (
            <TabStackNavigator.Screen
              key={moduleName}
              name={moduleName as keyof SharedRoutesParams}
              options={{
                presentation: module.options.alwaysPresentModally ? "fullScreenModal" : "card",

                ...module.options.screenOptions,
              }}
              children={(props) => {
                const params = props.route.params as {} | {}
                return (
                  <ScreenWrapper fullBleed={module.options.fullBleed}>
                    <module.Component {...params} {...props} />
                  </ScreenWrapper>
                )
              }}
            />
          )
        }
        return null
      })}
    </TabStackNavigator.Group>
  )
}

interface PageWrapperProps {
  fullBleed?: boolean
}

const ScreenWrapper: React.FC<PageWrapperProps> = ({ fullBleed, children }) => {
  const safeAreaInsets = useScreenDimensions().safeAreaInsets
  const paddingTop = fullBleed ? 0 : safeAreaInsets.top
  return <View style={{ flex: 1, paddingTop }}>{children}</View>
}
