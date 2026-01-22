import { Button, Flex, Text } from "@artsy/palette-mobile"
import { useSpringValue } from "app/Scenes/LiveSale/hooks/useSpringValue"
import { Animated } from "react-native"
import type { LotState } from "app/Scenes/LiveSale/types/liveAuction"

interface LiveLotCarouselCardProps {
  lot: LotState
  isFocused: boolean
  onBidPress: (lotId: string) => void
}

const getBidButtonText = (lot: LotState): string => {
  if (lot.derivedState.biddingStatus === "Complete") {
    return lot.derivedState.soldStatus === "Sold" ? "Sold" : "Passed"
  }
  return "Place Bid"
}

const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toLocaleString()}`
}

export const LiveLotCarouselCard: React.FC<LiveLotCarouselCardProps> = ({
  lot,
  isFocused,
  onBidPress,
}) => {
  const scale = useSpringValue(isFocused ? 1.0 : 0.85)
  const opacity = useSpringValue(isFocused ? 1.0 : 0.6)

  const isBidDisabled = lot.derivedState.biddingStatus !== "Open"

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale }],
        opacity,
      }}
      collapsable={false}
    >
      <Flex flex={1} bg="white100" borderRadius={8} overflow="hidden" mx={1}>
        {/* Placeholder for artwork image */}
        <Flex
          height={300}
          bg="black5"
          alignItems="center"
          justifyContent="center"
          borderBottomWidth={1}
          borderBottomColor="black10"
        >
          <Text variant="lg-display" color="black60">
            Lot {lot.lotId}
          </Text>
          <Text variant="xs" color="black60" mt={1}>
            {/* TODO: Add artwork image when GraphQL data available */}
            Image placeholder
          </Text>
        </Flex>

        {/* Lot info - only show when focused */}
        {!!isFocused && (
          <Flex p={2} gap={2}>
            {/* Asking price */}
            <Flex>
              <Text variant="xs" color="black60">
                Current Ask
              </Text>
              <Text variant="lg-display">{formatPrice(lot.derivedState.askingPriceCents)}</Text>
            </Flex>

            {/* Status info */}
            <Flex flexDirection="row" gap={2} flexWrap="wrap">
              <Flex px={1} py={0.5} bg="black5" borderRadius={4}>
                <Text variant="xs" color="black60">
                  {lot.derivedState.biddingStatus}
                </Text>
              </Flex>

              {lot.derivedState.soldStatus !== "ForSale" && (
                <Flex
                  px={1}
                  py={0.5}
                  bg={lot.derivedState.soldStatus === "Sold" ? "green10" : "orange10"}
                  borderRadius={4}
                >
                  <Text
                    variant="xs"
                    color={lot.derivedState.soldStatus === "Sold" ? "green100" : "orange100"}
                  >
                    {lot.derivedState.soldStatus}
                  </Text>
                </Flex>
              )}

              <Flex px={1} py={0.5} bg="black5" borderRadius={4}>
                <Text variant="xs" color="black60">
                  Reserve: {lot.derivedState.reserveStatus}
                </Text>
              </Flex>
            </Flex>

            {/* Online bid count */}
            <Text variant="xs" color="black60">
              {lot.derivedState.onlineBidCount} online{" "}
              {lot.derivedState.onlineBidCount === 1 ? "bid" : "bids"}
            </Text>

            {/* Bid button */}
            <Button onPress={() => onBidPress(lot.lotId)} disabled={isBidDisabled} block haptic>
              {getBidButtonText(lot)}
            </Button>

            {/* TODO placeholders for missing data */}
            <Text variant="xs" color="black30" mt={1}>
              Artist name, lot title, and estimate range will be added when GraphQL data is
              available
            </Text>
          </Flex>
        )}
      </Flex>
    </Animated.View>
  )
}
