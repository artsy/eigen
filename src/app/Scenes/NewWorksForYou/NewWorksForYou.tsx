import { Flex, Skeleton, SkeletonBox, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouGridQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouGrid"
import { NewWorksForYouListQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouList"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { times } from "lodash"
import { MotiView } from "moti"
import { Suspense } from "react"
import { isTablet } from "react-native-device-info"

export const SCREEN_TITLE = "New Works for You"
export const PAGE_SIZE = 100
export const RECOMMENDATION_MODEL_EXPERIMENT_NAME = "eigen-new-works-for-you-recommendations-model"
export const DEFAULT_RECS_MODEL_VERSION = "C"

export interface NewWorksForYouScreenProps {
  maxWorksPerArtist: number
  version: string
}

interface NewWorksForYouQueryRendererProps {
  utm_medium?: string
  maxWorksPerArtist?: number
  version?: string
}

export const NewNewWorksForYouQR: React.FC<NewWorksForYouScreenProps> = ({
  version,
  maxWorksPerArtist,
}) => {
  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  if (newWorksForYouViewOption === "list") {
    return <NewWorksForYouListQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
  }

  if (newWorksForYouViewOption === "grid") {
    return <NewWorksForYouGridQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
  }

  return null
}

export const NewWorksForYouQueryRenderer: React.FC<NewWorksForYouQueryRendererProps> = ({
  utm_medium,
  maxWorksPerArtist = 3,
  version: versionProp,
}) => {
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")
  const experiment = useExperimentVariant("onyx_new_works_for_you_feed")

  const isReferredFromEmail = utm_medium === "email"

  // Use the version specified in the URL or no version if the screen is opened from the email.
  const version =
    isReferredFromEmail && versionProp ? versionProp?.toUpperCase() : DEFAULT_RECS_MODEL_VERSION

  if (
    // The feed is not optimised for tablets yet.
    !isTablet() &&
    // Release only when ready for release!
    enableNewWorksForYouFeed &&
    // Release only when the experiment is enabled.
    experiment.enabled &&
    // Show only if the experiment payload is "gridAndList".
    experiment.payload !== "gridOnly"
  ) {
    return (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 300 }}
      >
        <NewNewWorksForYouQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
      </MotiView>
    )
  }

  return (
    <Suspense fallback={<NewWorksForYouPlaceholder defaultViewOption="grid" />}>
      <NewWorksForYouGridQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
    </Suspense>
  )
}

export const NewWorksForYouPlaceholder: React.FC<{ defaultViewOption?: ViewOption }> = ({
  defaultViewOption,
}) => {
  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  const viewOption = defaultViewOption ?? newWorksForYouViewOption

  return (
    <Skeleton>
      <Spacer y={4} />
      <Flex flexDirection="row">
        <Flex my={2} px={2}>
          <SkeletonText variant="lg-display">New Works For You</SkeletonText>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <SkeletonText variant="xs" mt={1}>
              XX Artworks
            </SkeletonText>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
      {viewOption === "grid" ? (
        <PlaceholderGrid />
      ) : (
        <Flex width="100%" px={2}>
          {times(4).map((i) => (
            <Flex key={i} mt={1} mb={2}>
              <Flex>
                <SkeletonBox key={i} width="100%" height={400} />
              </Flex>
              <Spacer y={1} />
              <SkeletonText>David Hockey</SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>Mercy from the Virtues H9-13 </SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>Berg Contemporary</SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>£38,000</SkeletonText>
            </Flex>
          ))}
        </Flex>
      )}
    </Skeleton>
  )
}
