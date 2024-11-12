export const getNewSaveAndFollowOnArtworkCardExperimentVariant = (
  enabled: boolean,
  variant: string
) => {
  let enableShowOldSaveCTA = false
  let enableNewSaveCTA = false
  let enableNewSaveAndFollowCTAs = false

  if (!enabled)
    return {
      enableShowOldSaveCTA,
      enableNewSaveCTA,
      enableNewSaveAndFollowCTAs,
    }

  if (variant === "variant-a") {
    enableShowOldSaveCTA = true
  } else if (variant === "variant-b") {
    enableNewSaveCTA = true
  } else if (variant === "variant-c") {
    enableNewSaveAndFollowCTAs = true
  }

  return {
    enableShowOldSaveCTA,
    enableNewSaveCTA,
    enableNewSaveAndFollowCTAs,
  }
}
