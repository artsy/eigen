import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"

export const RECOMMENDED_ARTWORKS_SECTION_ID = "home-view-section-recommended-artworks"
export const NEW_WORKS_FOR_YOU_SECTION_ID = "home-view-section-new-works-for-you"

export const useEnableLiveHomeRecommendations = (): { enabled: boolean } => {
  const { variant } = useExperimentVariant("onyx_artwork-recommendations-refresh-eigen")
  const enabledForGravity = useExperimentFlag("onyx_artwork-recommendations-gravity")

  const enabled = enabledForGravity && variant.enabled && variant.name === "variant"

  return { enabled }
}

export const useEnableLiveNewWorksForYou = (): { enabled: boolean } => {
  const { variant } = useExperimentVariant("onyx_nwfy-refresh-eigen")
  const enabledForGravity = useExperimentFlag("onyx_nwfy-gravity")

  const enabled = enabledForGravity && variant.enabled && variant.name === "experiment"

  return { enabled }
}

export const useLiveHomeViewSectionIDs = (): string[] => {
  const { enabled: enableLiveRecommendations } = useEnableLiveHomeRecommendations()
  const { enabled: enableLiveNewWorksForYou } = useEnableLiveNewWorksForYou()

  const liveSectionIDs: string[] = []

  if (enableLiveRecommendations) {
    liveSectionIDs.push(RECOMMENDED_ARTWORKS_SECTION_ID)
  }

  if (enableLiveNewWorksForYou) {
    liveSectionIDs.push(NEW_WORKS_FOR_YOU_SECTION_ID)
  }

  return liveSectionIDs
}
