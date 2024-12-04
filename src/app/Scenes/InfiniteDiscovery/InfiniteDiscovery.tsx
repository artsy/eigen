import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import InfiniteDiscoveryHeader from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryHeader"
import InfiniteDiscoveryScreen from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryScreen"

const Stack = createStackNavigator()

export default () => {
  return (
    <InfiniteDiscoveryContext.Provider>
      <NavigationContainer independent>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            header: () => <InfiniteDiscoveryHeader />,
            headerMode: "float",
          }}
        >
          <Stack.Screen name="InfiniteDiscovery" component={InfiniteDiscoveryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </InfiniteDiscoveryContext.Provider>
  )
}
