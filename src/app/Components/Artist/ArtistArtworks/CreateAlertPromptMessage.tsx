import { Button, Message, Text } from "@artsy/palette-mobile"
import { useShouldShowPrompt } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowPrompt"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

interface CreateAlertPromptMessageProps {
  onPress: () => void
}

export const CreateAlertPromptMessage: React.FC<CreateAlertPromptMessageProps> = ({ onPress }) => {
  const { promptState } = GlobalStore.useAppState((state) => state.createAlertPrompt)
  const { updateTimesShown, dontShowCreateAlertPromptAgain, dismissPrompt } =
    GlobalStore.actions.createAlertPrompt

  const { shouldShowPrompt, forcePrompt } = useShouldShowPrompt(promptState)

  useEffect(() => {
    if (shouldShowPrompt) {
      updateTimesShown()
    }
  }, [])

  if (shouldShowPrompt) {
    return (
      <Message
        title="Searching for a particular artwork?"
        titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
        text="Create an Alert and we’ll let you know when there’s a match."
        variant="dark"
        IconComponent={() => {
          return (
            <>
              <Button
                variant="outline"
                size="small"
                onPress={() => {
                  dismissPrompt()
                  dontShowCreateAlertPromptAgain()
                  onPress()
                }}
              >
                Create Alert
              </Button>
              {!!forcePrompt && (
                <Text variant="xs" color="pink">
                  timesShown: {promptState.timesShown}
                </Text>
              )}
            </>
          )
        }}
        iconPosition="bottom"
        showCloseButton
        onClose={() => {
          dismissPrompt()
        }}
      />
    )
  } else {
    return <></>
  }
}
