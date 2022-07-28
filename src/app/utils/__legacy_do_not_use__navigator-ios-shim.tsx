import { NavigationContainer, NavigationContainerRef, StackActions } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { View } from "react-native"

const Stack = createNativeStackNavigator()
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

const ScreenWrapper: React.FC<{ route: { params: ScreenProps } }> = (props) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <props.route.params.Component
        {...props.route.params.props}
        navigator={props.route.params.navigator}
      />
    </View>
  )
}

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
      <NavigationContainer ref={(ref) => (this.navigator = ref)} independent>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            component={ScreenWrapper}
            name="screen"
            initialParams={initialScreenParams}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default NavigatorIOS
