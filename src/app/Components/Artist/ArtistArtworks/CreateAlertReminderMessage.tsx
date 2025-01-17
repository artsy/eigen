import {
  ActionType,
  ContextModule,
  CreateAlertReminderMessageViewed,
  OwnerType,
} from "@artsy/cohesion"
import { Button, Message } from "@artsy/palette-mobile"
import { useShouldShowReminder } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowReminder"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { useTracking } from "react-tracking"

interface CreateAlertReminderMessageProps {
  onPress: () => void
}

export const CreateAlertReminderMessage: React.FC<CreateAlertReminderMessageProps> = ({
  onPress,
}) => {
  const tracking = useTracking()
  const { reminderState } = GlobalStore.useAppState((state) => state.createAlertReminder)
  const { updateTimesShown, dontShowCreateAlertReminderAgain, dismissReminder } =
    GlobalStore.actions.createAlertReminder

  const { shouldShowReminder } = useShouldShowReminder(reminderState)

  useEffect(() => {
    if (shouldShowReminder) {
      updateTimesShown()
      tracking.trackEvent(tracks.createAlertReminderMessageViewed())
    }
  }, [])

  if (shouldShowReminder) {
    return (
      <Message
        title="Searching for a particular artwork?"
        titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
        text="Create an Alert and we’ll let you know when there’s a match."
        variant="dark"
        IconComponent={() => {
          return (
            <Button
              variant="outline"
              size="small"
              onPress={() => {
                dismissReminder()
                dontShowCreateAlertReminderAgain()
                onPress()
              }}
            >
              Create Alert
            </Button>
          )
        }}
        iconPosition="bottom"
        showCloseButton
        onClose={() => {
          dismissReminder()
        }}
      />
    )
  } else {
    return <></>
  }
}

const tracks = {
  createAlertReminderMessageViewed: (): CreateAlertReminderMessageViewed => ({
    action: ActionType.createAlertReminderMessageViewed,
    context_screen: OwnerType.artist,
    context_module: ContextModule.artistArtworksCreateAlertReminderMessage,
  }),
}
