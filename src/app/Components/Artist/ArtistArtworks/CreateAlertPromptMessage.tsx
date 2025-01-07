import { Button, Message } from "@artsy/palette-mobile"
import { useShouldShowPrompt } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowPrompt"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

interface CreateAlertPromptMessageProps {
  onPress: () => void
  shouldShowCreateAlertPrompt: boolean
}

export const CreateAlertPromptMessage: React.FC<CreateAlertPromptMessageProps> = ({
  onPress,
  shouldShowCreateAlertPrompt,
}) => {
  const { promptState } = GlobalStore.useAppState((state) => state.createAlertPrompt)
  const { dismissPrompt, updateTimesShown } = GlobalStore.actions.createAlertPrompt

  const shouldShowPrompt = useShouldShowPrompt(promptState) && shouldShowCreateAlertPrompt

  useEffect(() => {
    if (shouldShowPrompt) {
      updateTimesShown()
    }
  }, [])

  const handleDismiss = () => {
    dismissPrompt()
  }

  const handleOnPress = () => {
    handleDismiss()
    onPress()
  }

  if (shouldShowPrompt) {
    return (
      <Message
        title="Searching for a particular artwork?"
        titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
        text="Create an Alert and we’ll let you know when there’s a match."
        variant="dark"
        IconComponent={() => {
          return (
            <Button variant="outline" size="small" onPress={handleOnPress}>
              Create Alert
            </Button>
          )
        }}
        iconPosition="bottom"
        showCloseButton
        onClose={handleDismiss}
      />
    )
  } else {
    return <></>
  }
}
