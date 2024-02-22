import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Text, View } from "react-native"

// Define the type for your root stack navigation, if needed
export type RootStackParamList = {
  NavStackTest: undefined // Add other routes as necessary
}

// Create a stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>()

const NavStackTest = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>NavStack Test</Text>
    </View>
  )
}

const Main2 = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="NavStackTest" component={NavStackTest} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main2
