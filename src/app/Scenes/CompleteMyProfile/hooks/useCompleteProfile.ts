import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { UpdateMyProfileInput } from "__generated__/useUpdateMyProfileMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import {
  CompleteMyProfileNavigationRoutes,
  CompleteMyProfileNavigationStack,
  Routes,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import {
  ROUTE_ACTION_TYPES,
  ProgressState,
  CompleteMyProfileStore,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { getNextRoute } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { useUpdateMyProfile } from "app/Scenes/CompleteMyProfile/hooks/useUpdateMyProfile"
import { navigate as artsyNavigate } from "app/system/navigation/navigate"
import { useEffect, useMemo, useState } from "react"

export const useCompleteProfile = <T extends ProgressState[keyof ProgressState]>() => {
  const [field, setField] = useState<T>()
  const steps = CompleteMyProfileStore.useStoreState((state) => state.steps)
  const progressState = CompleteMyProfileStore.useStoreState((state) => state.progressState)
  const progressStateWithoutUndefined = CompleteMyProfileStore.useStoreState(
    (state) => state.progressStateWithoutUndefined
  )
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )
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
  const progress = useMemo(
    () => (currentStep / (steps.length - 1)) * 100,
    [currentStep, steps.length]
  )

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
    const input = filterMutationInputFields({
      // order matters, first the context state then the hook field state
      ...progressStateWithoutUndefined,
      ...fieldKeyValue,
    })

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

type StateNormalizedForMutation = Pick<UpdateMyProfileInput, "location" | "profession" | "iconUrl">

const filterMutationInputFields = (progressState: ProgressState): StateNormalizedForMutation => {
  return Object.keys(progressState).reduce((acc, key) => {
    // iconUrl state is an object with localPath and geminiUrl, needs more handling than the other fields
    if (key === "iconUrl") {
      return { ...acc, iconUrl: progressState["iconUrl"]?.geminiUrl }
    }
    // filter out the isIdentityVerified field for the mutation
    if (key !== "isIdentityVerified") {
      return { ...acc, [key]: progressState[key as keyof ProgressState] }
    }

    return acc
  }, {})
}
