import { NavigationContainer, NavigationProp } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { AvatarStep } from "app/Scenes/CompleteMyProfile/AvatarStep"
import { ChangesSummary } from "app/Scenes/CompleteMyProfile/ChangesSummary"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Header } from "app/Scenes/CompleteMyProfile/Header"
import { IdentityVerificationStep } from "app/Scenes/CompleteMyProfile/IdentityVerificationStep"
import { LocationStep } from "app/Scenes/CompleteMyProfile/LocationStep"
import { ProfessionStep } from "app/Scenes/CompleteMyProfile/ProfessionStep"
import { useCompleteMyProfileSteps } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { LocationWithDetails } from "app/utils/googleMaps"
import { FC, useEffect } from "react"

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

const CompleteMyProfileNavigator: FC = () => {
  const { steps: _steps } = useCompleteMyProfileSteps()
  const setSteps = CompleteMyProfileStore.useStoreActions((actions) => actions.setSteps)
  const steps = CompleteMyProfileStore.useStoreState((state) => state.steps)

  useEffect(() => {
    if (steps === "loading" && _steps !== "loading") {
      setSteps(_steps)
    }
  }, [_steps])

  console.log("steps", { steps, _steps })

  if (steps === "loading") {
    return null
  }

  return (
    <NavigationContainer independent>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: () => <Header />,
          headerMode: "float",
        }}
      >
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
    <CompleteMyProfileStore.Provider>
      <CompleteMyProfileNavigator />
    </CompleteMyProfileStore.Provider>
  )
}
