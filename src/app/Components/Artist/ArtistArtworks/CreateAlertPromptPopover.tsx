import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useShouldShowPrompt } from "app/Components/Artist/ArtistArtworks/hooks/useShouldShowPrompt"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

export const CreateAlertPromptPopover: React.FC<{}> = ({ children }) => {
  const { promptState } = GlobalStore.useAppState((state) => state.createAlertPrompt)
  const { dismissPrompt, updateTimesShown } = GlobalStore.actions.createAlertPrompt

  const shouldShowPrompt = useShouldShowPrompt(promptState)

  useEffect(() => {
    if (shouldShowPrompt) {
      updateTimesShown()
    }
  }, [])

  const handleDismiss = () => {
    dismissPrompt()
  }

  return (
    <Popover
      visible={shouldShowPrompt}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      variant="dark"
      placement="bottom"
      title={
        <Text variant="xs" color="white100" fontWeight="bold">
          Searching for a particular artwork?
        </Text>
      }
      content={
        <Text variant="xs" color="white100">
          Create an alert and we’ll let you know when there’s a match.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
