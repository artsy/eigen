import {
  ArrowLeftIcon,
  CloseIcon,
  DEFAULT_HIT_SLOP,
  Flex,
  THEMES,
  Touchable,
} from "@artsy/palette-mobile"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ModuleDescriptor } from "app/AppRegistry"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { isHeaderShown } from "app/Navigation/Utils/isHeaderShown"
import { isModalScreen } from "app/Navigation/Utils/isModalScreen"
import { ICON_HEIGHT } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { goBack } from "app/system/navigation/navigate"
import { Platform } from "react-native"
import { isTablet } from "react-native-device-info"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const StackNavigator = createNativeStackNavigator<AuthenticatedRoutesParams>()

type StackNavigatorScreenProps = {
  name: keyof AuthenticatedRoutesParams
  module: ModuleDescriptor
} & Omit<React.ComponentProps<typeof StackNavigator.Screen>, "component" | "getComponent">

export const registerScreen: React.FC<StackNavigatorScreenProps> = ({ name, module, ...props }) => {
  return (
    <StackNavigator.Screen
      {...props}
      name={name}
      key={name}
      options={{
        presentation: isModalScreen(module) ? "fullScreenModal" : "card",
        headerShown: isHeaderShown(module),
        orientation: !isTablet() ? "portrait" : "default",
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
        headerTitleAlign: "center",
        ...module.options.screenOptions,
        headerShadowVisible: Platform.OS === "ios",
        headerTitleStyle: {
          fontFamily: THEMES.v3.fonts.sans.regular,
          ...THEMES.v3.textTreatments["sm-display"],
          ...((module.options.screenOptions?.headerTitleStyle as {} | undefined) ?? {}),
        },
      }}
      children={(screenProps) => {
        const params = screenProps.route.params || {}
        const isFullBleed =
          module.options.fullBleed ??
          // when no header is visible, we want to make sure we are bound by the insets
          module.options.screenOptions?.headerShown ??
          isHeaderShown(module)

        const hidesBottomTabs = module.options.hidesBottomTabs || isModalScreen(module)

        return (
          <ScreenWrapper fullBleed={isFullBleed} hidesBottomTabs={hidesBottomTabs}>
            <module.Component {...params} {...{ ...screenProps }} />
          </ScreenWrapper>
        )
      }}
    />
  )
}

export interface ScreenWrapperProps {
  fullBleed?: boolean
  readonly hidesBottomTabs?: boolean
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  fullBleed = false,
  hidesBottomTabs = false,
  children,
}) => {
  const safeAreaInsets = useSafeAreaInsets()
  // We don't have the bottom tabs context on modal screens
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabBarHeight = hidesBottomTabs ? 0 : useBottomTabBarHeight()

  const padding = fullBleed
    ? {
        paddingBottom: hidesBottomTabs ? 0 : tabBarHeight,
      }
    : {
        // Bottom inset + bottom tabs height - bottom tabs border
        paddingBottom: hidesBottomTabs ? 0 : safeAreaInsets.bottom + ICON_HEIGHT - 2,
        paddingTop: safeAreaInsets.top,
        paddingRight: safeAreaInsets.right,
        paddingLeft: safeAreaInsets.left,
      }

  return (
    <Flex
      flex={1}
      style={{
        ...padding,
      }}
    >
      {children}
    </Flex>
  )
}
