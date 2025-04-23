import { useColor } from "@artsy/palette-mobile"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationIndependentTree,
  StackActions,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { View } from "react-native"

type StackScreens = {
  screen: ScreenProps
}

const Stack = createNativeStackNavigator<StackScreens>()
interface ScreenProps {
  Component: React.ComponentType<any>
  props: object
  navigator: NavigatorIOS
}

export interface NavigatorIOSPushArgs {
  component: React.ComponentType<any>
  title?: string
  passProps?: object
}

type ScreenWrapperProps = StackScreenProps<
  {
    screen: ScreenProps
  },
  "screen"
>

const ScreenWrapper: React.FC<ScreenWrapperProps> = (props) => {
  const color = useColor()
  return (
    <View style={{ flex: 1, backgroundColor: color("mono0") }}>
      <props.route.params.Component
        {...props.route.params.props}
        navigator={props.route.params.navigator}
      />
    </View>
  )
}

/**
 * @deprecated Please use react-navigation instead
 */
class NavigatorIOS extends React.Component<{
  initialRoute: { component: React.ComponentType<any>; passProps?: object }
}> {
  navigator: NavigationContainerRef<any> | null = null
  push(args: NavigatorIOSPushArgs) {
    const props: ScreenProps = {
      Component: args.component,
      props: args.passProps ?? {},
      navigator: this,
    }
    this.navigator?.dispatch(StackActions.push("screen", props))
  }
  pop() {
    this.navigator?.dispatch(StackActions.pop())
  }
  popToTop() {
    this.navigator?.dispatch(StackActions.popToTop())
  }
  render() {
    const initialScreenParams: ScreenProps = {
      Component: this.props.initialRoute.component,
      props: this.props.initialRoute.passProps ?? {},
      navigator: this,
    }
    return (
      <NavigationIndependentTree>
        <NavigationContainer ref={(ref) => (this.navigator = ref)}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              component={ScreenWrapper}
              name="screen"
              initialParams={initialScreenParams}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
    )
  }
}

export default NavigatorIOS
