import { SubmitArtworkScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"

export const getInitialNavigationState = ({
  initialStep,
  skippedSteps,
  steps,
}: {
  initialStep: SubmitArtworkScreen
  skippedSteps: SubmitArtworkScreen[]
  steps: SubmitArtworkScreen[]
}) => {
  const availableSteps = steps.filter((step) => !skippedSteps.includes(step))

  if (availableSteps.includes(initialStep)) {
    return {
      routes: availableSteps.slice(0, availableSteps.indexOf(initialStep) + 1).map((routeName) => ({
        name: routeName,
      })),
    }
  }

  return undefined
}
