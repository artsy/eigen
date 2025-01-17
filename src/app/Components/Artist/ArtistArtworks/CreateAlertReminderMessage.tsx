import {
  ActionType,
  ContextModule,
  CreateAlertReminderMessageViewed,
  OwnerType,
} from "@artsy/cohesion"
import { Button, Message } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { useTracking } from "react-tracking"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40
export const DAYS = 1000 * 60 * 60 * 24
const MAX_TIMES_SHOWN = 2

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

  const shouldShowReminder =
    /**
     * show the reminder max 2 times with an interval of 7 days
     */
    reminderState.timesShown <= MAX_TIMES_SHOWN &&
    Date.now() - reminderState.dismissDate >= 7 * DAYS

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
