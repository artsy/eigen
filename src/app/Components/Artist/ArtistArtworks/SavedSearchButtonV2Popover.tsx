import { useIsFocused } from "@react-navigation/native"
import { CreateAlertPromptPopover } from "app/Components/Artist/ArtistArtworks/CreateAlertPromptPopover"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { GlobalStore } from "app/store/GlobalStore"

export const SavedSearchButtonV2Popover: React.FC<{ shouldShowCreateAlertPrompt?: boolean }> = ({
  children,
  shouldShowCreateAlertPrompt,
}) => {
  const {
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()

  const isOnboardingFinished =
    isFocused &&
    // make sure threre is no active onboarding popover on the screen
    !activePopover

  if (isOnboardingFinished && shouldShowCreateAlertPrompt) {
    return <CreateAlertPromptPopover>{children}</CreateAlertPromptPopover>
  }

  return <ProgressiveOnboardingSaveAlert>{children}</ProgressiveOnboardingSaveAlert>
}
