import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import {
  CompleteMyProfileNavigationRoutes,
  CompleteMyProfileNavigationStack,
  Routes,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import {
  ROUTE_ACTION_TYPES,
  State,
  useCompleteMyProfileContext,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { getNextRoute } from "app/Scenes/CompleteMyProfile/useCompleteMyProfileSteps"
import { useUpdateMyProfile } from "app/Scenes/CompleteMyProfile/useUpdateMyProfile"
import { navigate as artsyNavigate } from "app/system/navigation/navigate"
import { useEffect, useState } from "react"

export const useCompleteProfile = <T extends State[keyof State]>() => {
  const [field, setField] = useState<T>()
  const { steps, setProgressState, progressState } = useCompleteMyProfileContext()
  const { navigate, goBack: _goBack, canGoBack } = useNavigation<CompleteMyProfileNavigationStack>()
  const { name } = useRoute<RouteProp<CompleteMyProfileNavigationRoutes, Routes>>()
  const [updateProfile, isLoading] = useUpdateMyProfile()
  const { show } = useToast()

  const nextRoute = getNextRoute(name, steps)

  const routeField = name !== "ChangesSummary" ? ROUTE_ACTION_TYPES[name] : null

  // pre-populate the field if it exists in the progress state
  useEffect(() => {
    if (!field && routeField && progressState[routeField]) {
      setField(progressState[routeField] as T)
    }
  }, [field, routeField, progressState])

  const goNext = () => {
    if (nextRoute === "none" || isLoading) {
      return
    }

    if (!!routeField) {
      setProgressState({
        type: routeField,
        value: field,
      })
    }

    navigate(nextRoute)
  }

  const currentStep = steps.indexOf(name) + 1
  const progress = (currentStep / (steps.length - 1)) * 100

  const goBack = () => {
    if (isLoading) {
      return
    }

    if (canGoBack()) {
      _goBack()
    } else {
      artsyNavigate("/my-profile")
    }
  }

  const saveAndExit = () => {
    if (isLoading) {
      return
    }

    const fieldKeyValue = routeField ? { [routeField]: field } : {}
    const input: StateNormalizedForMutation = {
      location: progressState.location,
      profession: progressState.profession,
      iconUrl: progressState.iconUrl?.geminiUrl,
      ...fieldKeyValue,
    }

    // navigates to my-profile if no changes
    if (Object.values(input).length === 0) {
      artsyNavigate("/my-profile")
      return
    }

    updateProfile({
      variables: {
        input,
      },
      onCompleted: (_, errors) => {
        if (errors) {
          show("An error occurred", "bottom")
          console.log("error", errors)
          return
        }
        // TODO: manually change the me.icon.url in the store given changes in the profile pic
        artsyNavigate("/my-profile")
      },
      onError: (error) => {
        show("An error occurred", "bottom")
        console.log("error", error)
      },
    })
  }

  const isCurrentRouteDirty = !!field

  return {
    goBack,
    goNext,
    progress,
    currentStep,
    lastStep: steps.length - 1,
    saveAndExit,
    field,
    setField,
    isCurrentRouteDirty,
    route: name,
    nextRoute,
    isLoading,
  }
}

type StateNormalizedForMutation = Pick<State, "location" | "profession"> & { iconUrl?: string }
