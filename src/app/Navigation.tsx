import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useRegisterNativeModules } from "app/AppRegistry"
import { MainTabs } from "app/apps/MainTabs"
import { SearchRouter, SearchRoutes } from "app/apps/Search/searchRoutes"
import { GlobalStore } from "app/store/GlobalStore"
import { Text, View } from "react-native"

// Define the type for your root stack navigation, if needed
export type OtherRoutes = {
  Login: undefined
  MainTabs: undefined
}

export type NavigationRoutes = SearchRoutes & OtherRoutes

// Create a stack navigator
export const StackNav = createNativeStackNavigator<NavigationRoutes>()

const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logged Out - Here is where we should show login</Text>
    </View>
  )
}

const AuthRouter: React.FC<{
  isLoggedIn: boolean
}> = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <StackNav.Group>
        <StackNav.Screen name="Login" component={LoginScreen} />
      </StackNav.Group>
    )
  }
  return null
}

const Main2 = () => {
  useRegisterNativeModules()
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)

  return (
    <NavigationContainer>
      <StackNav.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="MainTabs"
      >
        {AuthRouter({ isLoggedIn })}
        {!!isLoggedIn && onboardingState === "complete" && (
          <>
            <StackNav.Screen name="MainTabs" component={MainTabs} />
          </>
        )}
        {SearchRouter()}
      </StackNav.Navigator>
    </NavigationContainer>
  )
}

export default Main2
