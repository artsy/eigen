import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useEffect } from "react"

export const CreateAlertPromptPopover: React.FC = ({ children }) => {
  useEffect(() => {
    // track the time of the prompt being shown
  }, [])

  const handleDismiss = () => {
    // handle dismiss
  }

  return (
    <Popover
      visible={true}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      //  onCloseComplete={clearActivePopover}
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
