import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const useGetNewSaveAndFollowOnArtworkCardExperimentVariant = (
  enabled: boolean,
  variant: string,
  numColumns?: number | undefined
) => {
  const enableNewSaveAndFollowOnArtworkCard = useFeatureFlag(
    "AREnableNewSaveAndFollowOnArtworkCard"
  )

  let enableShowOldSaveCTA = false
  let enableNewSaveCTA = false
  let enableNewSaveAndFollowCTAs = false
  let positionCTAs: "row" | "column" = "row"

  if (!enabled || !enableNewSaveAndFollowOnArtworkCard)
    return {
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
    enableShowOldSaveCTA,
    enableNewSaveCTA,
    enableNewSaveAndFollowCTAs,
    positionCTAs,
  }
}
