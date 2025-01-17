import { Button, Message } from "@artsy/palette-mobile"
import { useShouldShowReminder } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowReminder"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

interface CreateAlertReminderMessageProps {
  onPress: () => void
}

export const CreateAlertReminderMessage: React.FC<CreateAlertReminderMessageProps> = ({
  onPress,
}) => {
  const { reminderState } = GlobalStore.useAppState((state) => state.createAlertReminder)
  const { updateTimesShown, dontShowCreateAlertReminderAgain, dismissReminder } =
    GlobalStore.actions.createAlertReminder

  const { shouldShowReminder } = useShouldShowReminder(reminderState)

  useEffect(() => {
    if (shouldShowReminder) {
      updateTimesShown()
      // track
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
