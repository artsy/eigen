import { OwnerType } from "@artsy/cohesion"
import {
  Flex,
  FullWidthIcon,
  GridIcon,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouGridQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouGrid"
import { NewWorksForYouListQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouList"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { MotiPressable } from "moti/interactions"
import { useEffect } from "react"
import { LayoutAnimation } from "react-native"
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
const ICON_SIZE = 26

export const NewWorksForYouQueryRenderer: React.FC<NewWorksForYouQueryRendererProps> = ({
  utm_medium,
  maxWorksPerArtist = 3,
  version: versionProp,
}) => {
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")
  const forceShowNewWorksForYouFeed = useDevToggle("DTForceShowNewWorksForYouScreenFeed")

  const experiment = useExperimentVariant("onyx_new_works_for_you_feed")

  const isReferredFromEmail = utm_medium === "email"

  // Use the version specified in the URL or no version if the screen is opened from the email.
  const version =
    isReferredFromEmail && versionProp ? versionProp?.toUpperCase() : DEFAULT_RECS_MODEL_VERSION

  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  const setNewWorksForYouViewOption = GlobalStore.actions.userPrefs.setNewWorksForYouViewOption

  useEffect(() => {
    experiment.trackExperiment({
      context_owner_type: OwnerType.newWorksForYou,
    })
  }, [])

  const showToggleViewOptionIcon =
    !isTablet() &&
    enableNewWorksForYouFeed &&
    experiment.enabled &&
    (experiment.variant === "experiment" || forceShowNewWorksForYouFeed)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <Screen>
        <Screen.AnimatedHeader
          onBack={goBack}
          title="New Works For You"
          rightElements={
            showToggleViewOptionIcon ? (
              <MotiPressable
                onPress={() => {
                  setNewWorksForYouViewOption(newWorksForYouViewOption === "list" ? "grid" : "list")
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                }}
                style={{ top: 5 }}
              >
                {newWorksForYouViewOption === "grid" ? (
                  <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
                ) : (
                  <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
                )}
              </MotiPressable>
            ) : undefined
          }
        />
        <Screen.StickySubHeader title="New Works For You" />
        <Screen.Body fullwidth>
          {newWorksForYouViewOption === "list" && showToggleViewOptionIcon ? (
            <NewWorksForYouGridQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
          ) : (
            <NewWorksForYouListQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
          )}
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const NewWorksForYouPlaceholder: React.FC<{ defaultViewOption?: ViewOption }> = ({
  defaultViewOption,
}) => {
  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")
  const viewOption = defaultViewOption ?? newWorksForYouViewOption

  return (
    <Skeleton>
      <Flex flexDirection="row">
        <Flex my={2} px={2}>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <SkeletonText variant="xs" mt={1}>
              XX Artworks
            </SkeletonText>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
      {viewOption === "grid" || !enableNewWorksForYouFeed ? (
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
