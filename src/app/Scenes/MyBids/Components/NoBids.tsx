import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text, Button } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { useTracking } from "react-tracking"

export const NoBids: React.FC<{ headerText: string }> = ({ headerText }) => {
  const tracking = useTracking()
  const noBidsButtonText = "Explore auctions"

  const handleViewAllAuctions = () => {
    tracking.trackEvent({
      action: ActionType.tappedShowMore,
      context_module: ContextModule.inboxActiveBids,
      context_screen_owner_type: OwnerType.inboxBids,
      subject: noBidsButtonText,
    })
    navigate(`/auctions`)
  }

  return (
    <Flex mt={4} mx={2}>
      <Text variant="sm-display" textAlign="center" fontWeight="normal">
        {headerText}
      </Text>
      <Text mb={2} mt={1} mx={4} variant="sm" textAlign="center" fontWeight="normal" color="mono60">
        Browse and bid in auctions around the world, from online-only sales to benefit auctions—all
        in the Artsy app.
      </Text>
      <Flex width="100%" justifyContent="center" flexDirection="row">
        <Button variant="fillDark" onPress={handleViewAllAuctions}>
          {noBidsButtonText}
        </Button>
      </Flex>
    </Flex>
  )
}
