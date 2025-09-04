import { NavigationContainer } from "@react-navigation/native"
import { StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { internal_navigationRef } from "app/Navigation/Navigation"

export const NavigationTestsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <NavigationContainer ref={internal_navigationRef}>
      <StackNavigator.Navigator>
        <StackNavigator.Screen name="Home">{() => children}</StackNavigator.Screen>
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}
