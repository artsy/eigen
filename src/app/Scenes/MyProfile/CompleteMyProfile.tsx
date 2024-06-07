import { NavigationContainer, NavigationProp } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  CompleteMyProfileProvider,
  useCompleteMyProfileContext,
} from "app/Scenes/MyProfile/CompleteMyProfileProvider"
import { MyProfileCompleteAvatar } from "app/Scenes/MyProfile/MyProfileCompleteAvatar"
import { MyProfileCompleteIdentityVerification } from "app/Scenes/MyProfile/MyProfileCompleteIdentityVerification"
import { MyProfileCompleteLocation } from "app/Scenes/MyProfile/MyProfileCompleteLocation"
import { MyProfileCompleteProfession } from "app/Scenes/MyProfile/MyProfileCompleteProfession"
import { Route } from "app/Scenes/MyProfile/hooks/useProfileCompletion"

export type CompleteMyProfileNavigationStack = NavigationProp<{
  CompleteMyProfileLocation: NavigationPayload
  CompleteMyProfileProfession: NavigationPayload
  CompleteMyProfileAvatar: NavigationPayload
  CompleteMyProfileIdentityVerification: NavigationPayload
}>

export type NavigationPayload = Partial<Record<Route, { field: string; value: string | boolean }>>

/**
 * Each page will have the option to call a mutation hook responsible for:
 *  - packing the payloads for the mutation input
 *  - calling the mutation
 *     - mutation will spread the fragments of other data used in the UI
 *     - do not the refetch monster passed down in other routes of MyProfile
 *     - avatar image needs to be local commited to the relay store bc it updates async in Gravity
 *  - handling errors and loading state
 */

const Stack = createStackNavigator()

const CompleteMyProfileNavigator = () => {
  const { steps } = useCompleteMyProfileContext()

  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        {/* Only render in the tree the relevant screens */}
        {!!steps?.includes("LOCATION") && (
          <Stack.Screen name="CompleteMyProfileLocation" component={MyProfileCompleteLocation} />
        )}

        {!!steps?.includes("PROFESSION") && (
          <Stack.Screen
            name="CompleteMyProfileProfession"
            component={MyProfileCompleteProfession}
          />
        )}

        {!!steps?.includes("AVATAR") && (
          <Stack.Screen name="CompleteMyProfileAvatar" component={MyProfileCompleteAvatar} />
        )}

        {!!steps?.includes("IDENTITY_VERIFICATION") && (
          <Stack.Screen
            name="CompleteMyProfileIdentityVerification"
            component={MyProfileCompleteIdentityVerification}
          />
        )}
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
