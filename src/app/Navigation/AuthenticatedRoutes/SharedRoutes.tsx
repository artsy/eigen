import {
  ArrowLeftIcon,
  DEFAULT_HIT_SLOP,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { AppModule, modules } from "app/AppRegistry"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { goBack } from "app/system/navigation/navigate"
import { View } from "react-native"

export const SharedRoutes = (): JSX.Element => {
  return (
    <TabStackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        if (module.type === "react" && module.Component && !module.options.isRootViewForTabName) {
          return (
            <TabStackNavigator.Screen
              key={moduleName}
              name={moduleName as AppModule}
              options={{
                presentation: module.options.alwaysPresentModally ? "fullScreenModal" : "card",
                headerShown:
                  !module.options.hidesBackButton && !module.options.hasOwnModalCloseButton,
                ...module.options.screenOptions,
                headerLeft: () => {
                  return (
                    <Touchable
                      onPress={() => {
                        goBack()
                      }}
                      underlayColor="transparent"
                      hitSlop={DEFAULT_HIT_SLOP}
                    >
                      <ArrowLeftIcon fill="onBackgroundHigh" />
                    </Touchable>
                  )
                },
                headerTitle: "",
              }}
              children={(props) => {
                const params = props.route.params || {}
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

export interface ScreenWrapperProps {
  fullBleed?: boolean
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ fullBleed, children }) => {
  const safeAreaInsets = useScreenDimensions().safeAreaInsets
  const paddingTop = fullBleed ? 0 : safeAreaInsets.top
  return <View style={{ flex: 1, paddingTop }}>{children}</View>
}
