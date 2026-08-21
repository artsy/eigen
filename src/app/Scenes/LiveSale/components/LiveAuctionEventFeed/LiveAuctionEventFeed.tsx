import { Flex, Text } from "@artsy/palette-mobile"
import { LiveAuctionEventFeedRow } from "app/Scenes/LiveSale/components/LiveAuctionEventFeed/LiveAuctionEventFeedRow"
import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
import { useLiveAuctionEventFeed } from "app/Scenes/LiveSale/hooks/useLiveAuctionEventFeed"

interface Props {
  lotId: string
}

export const LiveAuctionEventFeed: React.FC<Props> = ({ lotId }) => {
  const { currentLotId } = useLiveAuction()
  const events = useLiveAuctionEventFeed(lotId)

  if (lotId !== currentLotId) return null

  if (events.length === 0) {
    return (
      <Flex py={1}>
        <Text variant="xs" color="mono60" textAlign="center">
          No activity yet
        </Text>
      </Flex>
    )
  }

  return (
    <Flex>
      {events.map((event) => (
        <LiveAuctionEventFeedRow key={event.id} event={event} />
      ))}
    </Flex>
  )
}
