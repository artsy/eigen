import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { UpdateMyProfileInput } from "__generated__/useUpdateMyProfileMutation.graphql"
import { useToast } from "app/Components/Toast/toastHook"
import {
  CompleteMyProfileNavigationRoutes,
  CompleteMyProfileNavigationStack,
  Routes,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import {
  ProgressState,
  CompleteMyProfileStore,
} from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { getNextRoute } from "app/Scenes/CompleteMyProfile/hooks/useCompleteMyProfileSteps"
import { navigate as artsyNavigate } from "app/system/navigation/navigate"
import { useUpdateMyProfile } from "app/utils/mutations/useUpdateMyProfile"
import { useMemo } from "react"

// Hook responsible for navigating between the steps of the profile completion process
// and saving the user's progress
export const useCompleteProfile = () => {
  const setIsLoading = CompleteMyProfileStore.useStoreActions((actions) => actions.setIsLoading)
  const isLoading = CompleteMyProfileStore.useStoreState((state) => state.isLoading)
  const steps = CompleteMyProfileStore.useStoreState((state) => state.steps)
  const progressState = CompleteMyProfileStore.useStoreState((state) => state.progressState)
  const progressStateWithoutUndefined = CompleteMyProfileStore.useStoreState(
    (state) => state.progressStateWithoutUndefined
  )
  const { navigate, goBack: _goBack, canGoBack } = useNavigation<CompleteMyProfileNavigationStack>()
  const { name } = useRoute<RouteProp<CompleteMyProfileNavigationRoutes, Routes>>()
  const [updateProfile] = useUpdateMyProfile()
  const { show } = useToast()

  const nextRoute = getNextRoute(name, steps)

  const goNext = () => {
    if (nextRoute === "none" || isLoading) {
      return
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

    setIsLoading(true)

    const input = filterMutationInputFields({
      ...progressStateWithoutUndefined,
    })

    // navigates to my-profile if no changes
    if (Object.values(input).length === 0) {
      artsyNavigate("/my-profile")
      return
    }

    updateProfile({
      variables: { input },
      onCompleted: (_, errors) => {
        if (errors) {
          show("An error occurred", "bottom")
          console.error("error", errors)
          setIsLoading(false)
          return
        }
        artsyNavigate("/my-profile")
      },
      updater: (store) => {
        // Gemini takes some time to process the image, so we update the iconUrl in the store manually
        // to give the user the impression that the image was updated instantly
        if (input.iconUrl && progressState.iconUrl) {
          store
            .getRoot()
            ?.getLinkedRecord("me")
            ?.getOrCreateLinkedRecord("icon", "Image")
            ?.setValue(progressState.iconUrl.localPath, `url(version:"thumbnail")`)
        }
      },
      onError: (error) => {
        show("An error occurred", "bottom")
        console.error("error", error)
        setIsLoading(false)
      },
    })
  }

  return {
    goBack,
    goNext,
    progress,
    currentStep,
    lastStep: steps.length - 1,
    saveAndExit,
    route: name,
    nextRoute,
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
