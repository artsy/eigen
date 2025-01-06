import { useIsFocused } from "@react-navigation/native"
import { CreateAlertPromptPopover } from "app/Components/Artist/ArtistArtworks/CreateAlertPromptPopover"
import { ProgressiveOnboardingSaveAlert } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingSaveAlert"
import { GlobalStore } from "app/store/GlobalStore"

export const SavedSearchButtonV2Popover: React.FC<{ shouldShowCreateAlertPrompt?: boolean }> = ({
  children,
  shouldShowCreateAlertPrompt,
}) => {
  const {
    //  isDismissed,
    // dismissed,
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const isFocused = useIsFocused()

  const isCreateAlertReminderDisplayable =
    isFocused &&
    // isDismissed("alert-create").status &&
    // we only show the createAlertPromptPopover if the onboarding is completed
    // isDismissed("save-highlight").status &&
    // make sure threre is no active onboarding popover on the screen
    !activePopover

  console.log(
    "[LOGD] isCreateAlertReminderDisplayable = ",
    shouldShowCreateAlertPrompt,
    isCreateAlertReminderDisplayable
  )

  // TODO: would be great if we can tell if the onboarding is finished
  // or if the onboarding only on this screen is finished
  if (isCreateAlertReminderDisplayable && shouldShowCreateAlertPrompt) {
    return <CreateAlertPromptPopover>{children}</CreateAlertPromptPopover>
  }

  return <ProgressiveOnboardingSaveAlert>{children}</ProgressiveOnboardingSaveAlert>
}
