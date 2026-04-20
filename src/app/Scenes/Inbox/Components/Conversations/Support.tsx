import { ActionType, ContextModule, OwnerType, TappedVisitHelpCenter } from "@artsy/cohesion"
import { HelpIcon } from "@artsy/icons/native"
import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useTracking } from "react-tracking"

interface SupportProps {
  conversationID: string
}

export const Support: React.FC<SupportProps> = ({ conversationID }) => {
  const { trackEvent } = useTracking()

  return (
    <Flex flexDirection="column" p={2} key="support-section">
      <Text variant="sm-display" mb={1} weight="medium">
        Support
      </Text>
      <RouterLink
        to="https://support.artsy.net/s/topic/0TO3b000000UevEGAS/contacting-a-gallery"
        onPress={() => {
          trackEvent(tracks.tappedVisitHelpCenter(conversationID))
        }}
      >
        <Flex mb={1} alignItems="center" flexDirection="row">
          <HelpIcon mr={1} />
          <Text variant="sm">Inquiries FAQ</Text>
        </Flex>
      </RouterLink>
    </Flex>
  )
}

const tracks = {
  tappedVisitHelpCenter: (conversationID: string): TappedVisitHelpCenter => ({
    action: ActionType.tappedVisitHelpCenter,
    context_module: ContextModule.conversations,
    context_screen_owner_id: conversationID,
    context_screen_owner_type: OwnerType.conversation,
    destination_screen_owner_type: OwnerType.articles,
    destination_screen_owner_slug: "0TO3b000000UevEGAS/contacting-a-gallery",
    flow: "Inquiry",
  }),
}
