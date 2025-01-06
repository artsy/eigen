import { Button, Message } from "@artsy/palette-mobile"

interface CreateAlertPromptMessageProps {
  onPress: () => void
  shouldShowCreateAlertPrompt?: boolean
}

export const CreateAlertPromptMessage: React.FC<CreateAlertPromptMessageProps> = ({
  onPress,
  shouldShowCreateAlertPrompt,
}) => {
  if (!shouldShowCreateAlertPrompt) {
    return <></>
  }

  return (
    <Message
      title="Searching for a particular artwork?"
      titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
      text="Create an Alert and we’ll let you know when there’s a match."
      variant="dark"
      IconComponent={() => {
        return (
          <Button variant="outline" size="small" onPress={onPress}>
            Create Alert
          </Button>
        )
      }}
      iconPosition="bottom"
      showCloseButton
    />
  )
}
