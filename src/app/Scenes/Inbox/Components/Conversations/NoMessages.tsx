import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Button } from "app/Components/Button"
import { useTracking } from "react-tracking"

export const NoMessages: React.FC = () => {
  const tracking = useTracking()
  const noMessagesButtonText = " Explore works"

  const handleViewWorks = () => {
    tracking.trackEvent({
      action: ActionType.tappedShowMore,
      context_module: ContextModule.inboxInquiries,
      context_screen_owner_type: OwnerType.inboxInquiries,
      subject: noMessagesButtonText,
    })
    navigate(`/`)
  }

  return (
    <Flex mt={4} mx={2}>
      <Text variant="sm-display" textAlign="center" fontWeight="normal">
        Keep track of your conversations with galleries.
      </Text>
      <Text
        mb={2}
        mt={1}
        mx={4}
        variant="sm"
        textAlign="center"
        fontWeight="normal"
        color="black60"
      >
        Contact galleries to learn more about works you want to collect. Use your inbox to stay on
        top of your inquiries.
      </Text>
      <Flex width="100%" justifyContent="center" flexDirection="row">
        <Button
          variant="fillDark"
          onPress={() => {
            handleViewWorks()
          }}
        >
          {noMessagesButtonText}
        </Button>
      </Flex>
    </Flex>
  )
}
