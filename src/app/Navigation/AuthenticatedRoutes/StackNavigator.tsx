import {
  ArrowLeftIcon,
  CloseIcon,
  DEFAULT_HIT_SLOP,
  THEMES,
  Touchable,
} from "@artsy/palette-mobile"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { DEFAULT_SCREEN_ANIMATION_DURATION } from "app/Components/constants"
import { ScreenWrapper } from "app/Navigation/AuthenticatedRoutes/ScreenWrapper"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { AppModule, ModuleDescriptor } from "app/Navigation/routes"
import { isModalScreen } from "app/Navigation/utils/isModalScreen"
import { goBack } from "app/system/navigation/navigate"
import { Platform } from "react-native"
import { isTablet } from "react-native-device-info"

export const StackNavigator = createNativeStackNavigator<AuthenticatedRoutesParams>()

type StackNavigatorScreenProps = {
  name: AppModule
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
        animation: !isModalScreen(module) ? "slide_from_right" : undefined,
        animationDuration: DEFAULT_SCREEN_ANIMATION_DURATION,
        headerShown: module.options?.screenOptions?.headerShown ?? true,
        headerLeft: ({ canGoBack }) => {
          if (!canGoBack) {
            return null
          }

          return (
            <Touchable
              accessibilityRole="button"
              accessibilityLabel={isModalScreen(module) ? "Close modal" : "Go back"}
              accessibilityHint={
                isModalScreen(module)
                  ? "Closes the modal screen"
                  : "Goes back to the previous screen"
              }
              onPress={() => {
                goBack()
              }}
              underlayColor="transparent"
              hitSlop={DEFAULT_HIT_SLOP}
            >
              {isModalScreen(module) ? (
                <CloseIcon fill="mono100" />
              ) : (
                <ArrowLeftIcon fill="mono100" />
              )}
            </Touchable>
          )
        },
        headerTitle: "",
        headerTitleAlign: "center",
        ...module.options?.screenOptions,
        gestureEnabled: true,
        headerShadowVisible: Platform.OS === "ios",
        headerTitleStyle: {
          fontWeight: "400",
          fontFamily: THEMES.v3.fonts.sans.regular,
          ...THEMES.v3.textTreatments["sm-display"],
          ...((module.options?.screenOptions?.headerTitleStyle as {} | undefined) ?? {}),
        },
      }}
      children={(screenProps) => {
        const params = screenProps.route.params || {}

        const hidesBottomTabs = module.options?.hidesBottomTabs || isModalScreen(module)

        return (
          <ScreenWrapper hidesBottomTabs={hidesBottomTabs}>
            <module.Component {...params} {...{ ...screenProps }} />
          </ScreenWrapper>
        )
      }}
    />
  )
}
