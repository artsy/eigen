import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { LiveAuctionMaxBidModal } from "app/Scenes/LiveSale/components/LiveAuctionMaxBidModal/LiveAuctionMaxBidModal"
import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useMemo, useRef, useState } from "react"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { LiveLotCarouselCard } from "./LiveLotCarouselCard"

export const LiveLotCarousel: React.FC = () => {
  const { lots, placeBid, artworkMetadata, saleSlug } = useLiveAuction()
  const [selectedLotIndex, setSelectedLotIndex] = useState(0)
  const [maxBidLotId, setMaxBidLotId] = useState<string | null>(null)
  const pagerViewRef = useRef<PagerView>(null)

  // Convert Map to array (preserves order from WebSocket)
  const lotsArray = useMemo(() => {
    const arr = Array.from(lots.values())

    if (__DEV__) {
      console.log("[LiveLotCarousel] Total lots from WebSocket:", lots.size)
      console.log(
        "[LiveLotCarousel] Sample WebSocket lot IDs (UUIDs):",
        Array.from(lots.keys()).slice(0, 5)
      )
      console.log("[LiveLotCarousel] Total artwork metadata entries:", artworkMetadata.size)
      console.log(
        "[LiveLotCarousel] Artwork metadata keys (internalIDs/UUIDs):",
        Array.from(artworkMetadata.keys()).slice(0, 5)
      )

      // Check if keys match (should be true now!)
      const lotIds = new Set(lots.keys())
      const metadataKeys = new Set(artworkMetadata.keys())
      const matchingKeys = Array.from(lotIds).filter((id) => metadataKeys.has(id))
      console.log(
        "[LiveLotCarousel] Matching keys:",
        matchingKeys.length,
        "/",
        lots.size,
        "lots have metadata"
      )
    }

    return arr
  }, [lots, artworkMetadata])

  const handlePageScroll = (e: PagerViewOnPageScrollEvent) => {
    // Avoid updating when position is -1 (iOS overdrag on first page)
    if (e.nativeEvent.position !== undefined && e.nativeEvent.position !== -1) {
      setSelectedLotIndex(e.nativeEvent.position)
    }
  }

  const handleBidPress = (lotId: string, action: "bid" | "registerToBid" | "submitMaxBid") => {
    if (action === "bid") {
      const lot = lotsArray.find((l) => l.lotId === lotId)
      if (lot) {
        placeBid(lotId, lot.derivedState.askingPriceCents, false)
      }
    } else if (action === "registerToBid") {
      navigate(`/auction-registration/${saleSlug}`)
    } else if (action === "submitMaxBid") {
      setMaxBidLotId(lotId)
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
              artworkMetadata={artworkMetadata.get(lot.lotId)}
              isFocused={index === selectedLotIndex}
              onBidPress={(lotId, action) => handleBidPress(lotId, action)}
            />
          </Flex>
        ))}
      </PagerView>

      {!!maxBidLotId && (
        <LiveAuctionMaxBidModal
          lotId={maxBidLotId}
          visible={!!maxBidLotId}
          onDismiss={() => setMaxBidLotId(null)}
        />
      )}
    </Flex>
  )
}
