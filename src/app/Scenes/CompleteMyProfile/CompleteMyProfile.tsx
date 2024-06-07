import { NavigationContainer, NavigationProp } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AvatarStep } from "app/Scenes/CompleteMyProfile/AvatarStep"
import { ChangesSummary } from "app/Scenes/CompleteMyProfile/ChangesSummary"
import {
  CompleteMyProfileProvider,
  useCompleteMyProfileContext,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import { LocationStep } from "app/Scenes/CompleteMyProfile/LocationStep"
import { ProfessionStep } from "app/Scenes/CompleteMyProfile/ProfessionStep"
import { LocationWithDetails } from "app/utils/googleMaps"

export type CompleteMyProfileNavigationStack = NavigationProp<CompleteMyProfileNavigationRoutes>

export type CompleteMyProfileNavigationRoutes = {
  LocationStep: undefined
  ProfessionStep: undefined
  AvatarStep: undefined
  IdentityVerificationStep: undefined
  ChangesSummary: undefined
}

export type Routes = keyof CompleteMyProfileNavigationRoutes

export type NavigationPayloadField = {
  field: string
  value: string | boolean | Partial<LocationWithDetails>
}

const Stack = createStackNavigator()

const CompleteMyProfileNavigator = () => {
  const { steps } = useCompleteMyProfileContext()

  return (
    <NavigationContainer independent>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Only renders the relevant screens */}
        {!!steps?.includes("LocationStep") && (
          <Stack.Screen name="LocationStep" component={LocationStep} />
        )}

        {!!steps?.includes("ProfessionStep") && (
          <Stack.Screen name="ProfessionStep" component={ProfessionStep} />
        )}

        {!!steps?.includes("AvatarStep") && (
          <Stack.Screen name="AvatarStep" component={AvatarStep} />
        )}

        {!!steps?.includes("IdentityVerificationStep") && (
          <Stack.Screen name="IdentityVerificationStep" component={IdentityVerificationStep} />
        )}

        <Stack.Screen name="ChangesSummary" component={ChangesSummary} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export const CompleteMyProfile = () => {
  return (
    <CompleteMyProfileProvider>
      <CompleteMyProfileNavigator />
    </CompleteMyProfileProvider>
  )
}
