import { popToRoot } from "app/navigation/navigate"
import { Box, Button, Spacer, Text } from "palette"

export const ConsignmentInquiryFormAbandonEdit: React.FC<{ onDismiss: () => void }> = ({
  onDismiss,
}) => {
  return (
    <Box px={2}>
      <Text variant="lg-display" mb={2}>
        Leave without sending message?
      </Text>
      <Text color="black60" variant="sm-display" mb={4}>
        Your message to the Sell with Artsy specialists will not been sent.
      </Text>
      <Button onPress={() => popToRoot()} block variant="fillDark" size="large">
        Leave Without Sending
      </Button>
      <Spacer m={1} />
      <Button onPress={onDismiss} block variant="outline" size="large">
        Continue Editing Message
      </Button>
    </Box>
  )
}
