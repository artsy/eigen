import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"

export const getInitialNavigationState = (
  initialStep: SubmitArtworkScreen,
  skipSteps?: SubmitArtworkScreen[]
) => {
  const availableSteps = ARTWORK_FORM_STEPS.filter((step) => !(skipSteps || []).includes(step))

  if (availableSteps.includes(initialStep)) {
    return {
      routes: ARTWORK_FORM_STEPS.slice(0, ARTWORK_FORM_STEPS.indexOf(initialStep) + 1).map(
        (routeName) => ({
          name: routeName,
        })
      ),
    }
  }

  return undefined
}
