import { OwnerType } from "@artsy/cohesion"
import { FullWidthIcon, GridIcon } from "@artsy/icons/native"
import { Screen } from "@artsy/palette-mobile"
import { NewWorksFromGalleriesYouFollowQR } from "app/Scenes/NewWorksFromGalleriesYouFollow/Components/NewWorksFromGalleriesYouFollow"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { MotiPressable } from "moti/interactions"

const SCREEN_TITLE = "New Works from Galleries You Follow"
const ICON_SIZE = 26

export const NewWorksFromGalleriesYouFollowScreen: React.FC = () => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksFromGalleriesYouFollow })}
    >
      <Screen>
        <Screen.AnimatedHeader
          onBack={goBack}
          title={SCREEN_TITLE}
          rightElements={
            <MotiPressable
              onPress={() => {
                setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
              }}
              style={{ top: 5 }}
            >
              {defaultViewOption === "grid" ? (
                <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
              ) : (
                <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
              )}
            </MotiPressable>
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
