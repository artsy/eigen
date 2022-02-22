import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"
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
    <Flex mt={3} mx={2}>
      <Text variant="md" textAlign="center" fontWeight="normal">
        {headerText}
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
