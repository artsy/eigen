import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
import { useMemo, useRef, useState } from "react"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { LiveLotCarouselCard } from "./LiveLotCarouselCard"

export const LiveLotCarousel: React.FC = () => {
  const { lots, placeBid } = useLiveAuction()
  const [selectedLotIndex, setSelectedLotIndex] = useState(0)
  const pagerViewRef = useRef<PagerView>(null)

  // Convert Map to sorted array
  const lotsArray = useMemo(() => {
    const arr = Array.from(lots.values())
    return arr.sort((a, b) => {
      // Sort by lot ID (numeric)
      const numA = parseInt(a.lotId.replace(/\D/g, ""), 10)
      const numB = parseInt(b.lotId.replace(/\D/g, ""), 10)
      return numA - numB
    })
  }, [lots])

  const handlePageScroll = (e: PagerViewOnPageScrollEvent) => {
    // Avoid updating when position is -1 (iOS overdrag on first page)
    if (e.nativeEvent.position !== undefined && e.nativeEvent.position !== -1) {
      setSelectedLotIndex(e.nativeEvent.position)
    }
  }

  const handleBidPress = (lotId: string) => {
    // Find the lot to get asking price
    const lot = lotsArray.find((l) => l.lotId === lotId)
    if (lot) {
      placeBid(lotId, lot.derivedState.askingPriceCents, false)
    }
  }

  // Loading state
  if (lotsArray.length === 0) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
        <Text variant="sm" color="black60" mt={2}>
          Loading lots...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex flex={1}>
      <PagerView
        style={{ flex: 1 }}
        orientation="horizontal"
        overdrag
        pageMargin={-60}
        initialPage={0}
        onPageScroll={handlePageScroll}
        ref={pagerViewRef}
      >
        {lotsArray.map((lot, index) => (
          <Flex key={lot.lotId} collapsable={false}>
            <LiveLotCarouselCard
              lot={lot}
              isFocused={index === selectedLotIndex}
              onBidPress={handleBidPress}
            />
          </Flex>
        ))}
      </PagerView>
    </Flex>
  )
}
