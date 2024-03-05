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
  Text,
} from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouArtworksQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouArtworks"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { usePlaceholderView } from "app/utils/masonryHelpers/viewOptionHelpers"
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

  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

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
                  setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                }}
              >
                {defaultViewOption === "grid" ? (
                  <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
                ) : (
                  <GridIcon height={ICON_SIZE} width={ICON_SIZE} top="2px" />
                )}
              </MotiPressable>
            ) : undefined
          }
        />
        {/* <Screen.StickySubHeader title="New Works For You" /> */}
        <Screen.Body fullwidth>
          <NewWorksForYouArtworksQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const NewWorksForYouPlaceholder: React.FC<{ defaultViewOption?: ViewOption }> = ({}) => {
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")

  const placeholderView = usePlaceholderView("onyx_new_works_for_you_feed")

  return (
    <Skeleton>
      <Flex flexDirection="row">
        <Flex px={2}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text variant="lg-display">New Works for You</Text>

            <SkeletonText variant="xs" mt={2}>
              XX Artworks
            </SkeletonText>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
      {!enableNewWorksForYouFeed || placeholderView === "grid" ? (
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
