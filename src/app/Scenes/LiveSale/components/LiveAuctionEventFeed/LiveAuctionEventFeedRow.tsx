import { useColor, Flex, Text } from "@artsy/palette-mobile"
import type { LiveAuctionFeedEvent } from "app/Scenes/LiveSale/types/liveAuction"

interface Props {
  event: LiveAuctionFeedEvent
}

const useRowColor = (event: LiveAuctionFeedEvent): string => {
  const color = useColor()

  if (event.isCancelled || event.isPending) return color("mono60")

  switch (event.kind) {
    case "lotOpen":
      return color("purple100")
    case "finalCall":
      return color("orange100")
    case "warning":
      return color("yellow100")
    case "closed":
      return color("mono100")
    case "bid":
      if (event.isMine && !event.isTopBid) return color("red100")
      return color("mono100")
  }
}

export const LiveAuctionEventFeedRow: React.FC<Props> = ({ event }) => {
  const rowColor = useRowColor(event)
  const textDecoration = event.isCancelled ? "line-through" : undefined

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      py={0.5}
      borderBottomWidth={1}
      borderBottomStyle="dotted"
      borderBottomColor="mono30"
    >
      <Text variant="xs" color={rowColor} style={{ textDecorationLine: textDecoration }}>
        {event.title}
      </Text>
      {!!event.subtitle && (
        <Text variant="xs" color={rowColor} style={{ textDecorationLine: textDecoration }}>
          {event.subtitle}
        </Text>
      )}
    </Flex>
  )
}
