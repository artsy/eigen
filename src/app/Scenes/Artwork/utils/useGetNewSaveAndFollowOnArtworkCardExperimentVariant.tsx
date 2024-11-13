import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const useGetNewSaveAndFollowOnArtworkCardExperimentVariant = (
  experimentName: EXPERIMENT_NAME,
  numColumns?: number | undefined
) => {
  const enableNewSaveAndFollowOnArtworkCard = useFeatureFlag(
    "AREnableNewSaveAndFollowOnArtworkCard"
  )

  const newSaveAndFollowOnArtworkCardExperiment = useExperimentVariant(experimentName)
  const enabled = newSaveAndFollowOnArtworkCardExperiment.enabled
  const variant = newSaveAndFollowOnArtworkCardExperiment.variant

  let enableShowOldSaveCTA = false
  let enableNewSaveCTA = false
  let enableNewSaveAndFollowCTAs = false
  let positionCTAs: "row" | "column" = "row"

  if (!enabled || !enableNewSaveAndFollowOnArtworkCard)
    return {
      enabled,
      enableShowOldSaveCTA,
      enableNewSaveCTA,
      enableNewSaveAndFollowCTAs,
      positionCTAs,
    }

  if (variant === "variant-a") {
    enableShowOldSaveCTA = true
    positionCTAs = "row"
  } else if (variant === "variant-b") {
    enableNewSaveCTA = true
    if (!!numColumns && numColumns !== 1) {
      positionCTAs = "column"
    } else {
      positionCTAs = "row"
    }
  } else if (variant === "variant-c") {
    enableNewSaveAndFollowCTAs = true
    if (!!numColumns && numColumns !== 1) {
      positionCTAs = "column"
    } else {
      positionCTAs = "row"
    }
  }

  return {
    enabled,
    enableShowOldSaveCTA,
    enableNewSaveCTA,
    enableNewSaveAndFollowCTAs,
    positionCTAs,
  }
}
