import { OwnerType } from "@artsy/cohesion"
import { FullWidthIcon, GridIcon, Screen } from "@artsy/palette-mobile"
import { NewWorksFromGalleriesYouFollowQR } from "app/Scenes/NewWorksFromGalleriesYouFollow/Components/NewWorksFromGalleriesYouFollow"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiPressable } from "moti/interactions"
import { useEffect } from "react"
import { isTablet } from "react-native-device-info"

const SCREEN_TITLE = "New Works from Galleries You Follow"
const ICON_SIZE = 26

export const NewWorksFromGalleriesYouFollowScreen: React.FC = () => {
  const enableArtworksFeedView = useFeatureFlag("AREnableArtworksFeedView")
  const forceShowNewWorksForYouFeed = useDevToggle("DTForceShowNewWorksForYouScreenFeed")

  const experiment = useExperimentVariant("onyx_new_works_for_you_feed")

  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

  useEffect(() => {
    experiment.trackExperiment({
      context_owner_type: OwnerType.newWorksFromGalleriesYouFollow,
    })
  }, [])

  const showToggleViewOptionIcon =
    !isTablet() &&
    enableArtworksFeedView &&
    experiment.enabled &&
    (experiment.variant === "experiment" || forceShowNewWorksForYouFeed)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksFromGalleriesYouFollow })}
    >
      <Screen>
        <Screen.AnimatedHeader
          onBack={goBack}
          title={SCREEN_TITLE}
          rightElements={
            showToggleViewOptionIcon ? (
              <MotiPressable
                onPress={() => {
                  setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
                }}
                style={{ top: 5 }}
              >
                {defaultViewOption === "grid" ? (
                  <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
                ) : (
                  <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
                )}
              </MotiPressable>
            ) : undefined
          }
        />
        <Screen.StickySubHeader title={SCREEN_TITLE} />
        <Screen.Body fullwidth>
          <NewWorksFromGalleriesYouFollowQR />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
