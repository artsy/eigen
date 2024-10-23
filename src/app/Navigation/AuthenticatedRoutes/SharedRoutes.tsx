import {
  ArrowLeftIcon,
  CloseIcon,
  DEFAULT_HIT_SLOP,
  Touchable,
  useTheme,
} from "@artsy/palette-mobile"
import { AppModule, modules } from "app/AppRegistry"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { isHeaderShown } from "app/Navigation/Utils/isHeaderShown"
import { isModalScreen } from "app/Navigation/Utils/isModalScreen"
import { goBack } from "app/system/navigation/navigate"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const SharedRoutes = (): JSX.Element => {
  const { theme } = useTheme()
  return (
    <TabStackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        if (module.type === "react" && module.Component && !module.options.isRootViewForTabName) {
          return (
            <TabStackNavigator.Screen
              key={moduleName}
              name={moduleName as AppModule}
              options={{
                presentation: isModalScreen(module) ? "fullScreenModal" : "card",
                headerShown: isHeaderShown(module),
                headerLeft: ({ canGoBack }) => {
                  if (!canGoBack) {
                    return null
                  }

                  return (
                    <Touchable
                      onPress={() => {
                        goBack()
                      }}
                      underlayColor="transparent"
                      hitSlop={DEFAULT_HIT_SLOP}
                    >
                      {isModalScreen(module) ? (
                        <CloseIcon fill="black100" />
                      ) : (
                        <ArrowLeftIcon fill="onBackgroundHigh" />
                      )}
                    </Touchable>
                  )
                },
                headerTitle: "",
                headerTitleStyle: {
                  fontFamily: theme.fonts.sans.regular,
                  ...theme.textTreatments["sm-display"],
                },
                ...module.options.screenOptions,
              }}
              children={(props) => {
                const params = props.route.params || {}
                const isFullBleed =
                  module.options.fullBleed ??
                  // when no header is visible, we want to make sure we are bound by the insets
                  isHeaderShown(module)
                return (
                  <ScreenWrapper fullBleed={isFullBleed}>
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

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ fullBleed = false, children }) => {
  const safeAreaInsets = useSafeAreaInsets()

  const padding = fullBleed
    ? undefined
    : {
        paddingBottom: safeAreaInsets.bottom,
        paddingTop: safeAreaInsets.top,
        paddingRight: safeAreaInsets.right,
        paddingLeft: safeAreaInsets.left,
      }

  return (
    <View
      style={{
        flex: 1,
        ...padding,
      }}
    >
      {children}
    </View>
  )
}
