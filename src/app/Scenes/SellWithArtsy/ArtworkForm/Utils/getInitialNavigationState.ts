import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"

export const getInitialNavigationState = (initialStep: SubmitArtworkScreen) => {
  if (ARTWORK_FORM_STEPS.includes(initialStep)) {
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
