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
import { isModalScreen } from "app/Navigation/Utils/isModalScreen"
import { goBack } from "app/system/navigation/navigate"
import { Platform } from "react-native"
import { isTablet } from "react-native-device-info"

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
        orientation: !isTablet() ? "portrait" : "default",
        headerShown: module.options.screenOptions?.headerShown ?? true,
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
        gestureEnabled: true,
        headerShadowVisible: Platform.OS === "ios",
        headerTitleStyle: {
          fontFamily: THEMES.v3.fonts.sans.regular,
          ...THEMES.v3.textTreatments["sm-display"],
          ...((module.options.screenOptions?.headerTitleStyle as {} | undefined) ?? {}),
        },
      }}
      children={(screenProps) => {
        const params = screenProps.route.params || {}

        const hidesBottomTabs = module.options.hidesBottomTabs || isModalScreen(module)

        return (
          <ScreenWrapper hidesBottomTabs={hidesBottomTabs}>
            <module.Component {...params} {...{ ...screenProps }} />
          </ScreenWrapper>
        )
      }}
    />
  )
}

export interface ScreenWrapperProps {
  readonly hidesBottomTabs?: boolean
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  hidesBottomTabs = false,
  children,
}) => {
  // We don't have the bottom tabs context on modal screens
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tabBarHeight = hidesBottomTabs ? 0 : useBottomTabBarHeight()

  return (
    <Flex
      flex={1}
      style={{
        paddingBottom: hidesBottomTabs ? 0 : tabBarHeight,
      }}
    >
      {children}
    </Flex>
  )
}
