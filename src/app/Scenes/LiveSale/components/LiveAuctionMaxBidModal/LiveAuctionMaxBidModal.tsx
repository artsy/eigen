import { Button, Flex, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
import { computeBidAmounts } from "app/Scenes/LiveSale/utils/bidIncrements"
import { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, Modal, SafeAreaView } from "react-native"

interface LiveAuctionMaxBidModalProps {
  lotId: string
  visible: boolean
  onDismiss: () => void
}

const formatAmount = (cents: number, currencySymbol: string): string =>
  `${currencySymbol}${(cents / 100).toLocaleString()}`

export const LiveAuctionMaxBidModal: React.FC<LiveAuctionMaxBidModalProps> = ({
  lotId,
  visible,
  onDismiss,
}) => {
  const { lots, pendingBids, placeBid, bidIncrements, currencySymbol } = useLiveAuction()
  const color = useColor()

  const lot = lots.get(lotId)
  const askingPriceCents = lot?.derivedState.askingPriceCents ?? 0

  const amounts = useMemo(
    () => computeBidAmounts(askingPriceCents, bidIncrements),
    // Snapshot amounts when the modal opens — asking price shouldn't change mid-selection
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, bidIncrements]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<FlatList>(null)

  // Reset selection whenever the modal opens
  useEffect(() => {
    if (visible) {
      setSelectedIndex(0)
    }
  }, [visible])

  // Watch the pending bid for this lot
  const lotPendingBid = useMemo(
    () => Array.from(pendingBids.values()).find((bid) => bid.lotId === lotId),
    [pendingBids, lotId]
  )

  const isPending = lotPendingBid?.status === "pending"
  const isSuccess = lotPendingBid?.status === "success"
  const isError = lotPendingBid?.status === "error"

  // Auto-dismiss on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(onDismiss, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onDismiss])

  const handleConfirm = () => {
    const amount = amounts[selectedIndex]
    if (amount !== undefined) {
      placeBid(lotId, amount, true)
    }
  }

  const renderStatusContent = () => {
    if (isSuccess) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center" p={4}>
          <Text variant="lg-display" textAlign="center">
            Max Bid Placed
          </Text>
          <Text variant="sm" color={color("mono60")} textAlign="center" mt={1}>
            You're currently the highest bidder
          </Text>
        </Flex>
      )
    }

    if (isError) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center" p={4}>
          <Text variant="lg-display" textAlign="center" color={color("red100")}>
            Bid Failed
          </Text>
          <Text variant="sm" color={color("mono60")} textAlign="center" mt={1}>
            {lotPendingBid?.error ?? "An error occurred. Please try again."}
          </Text>
          <Flex mt={4} width="100%">
            <Button block variant="fillDark" onPress={() => setSelectedIndex(0)}>
              Try Again
            </Button>
          </Flex>
        </Flex>
      )
    }

    return null
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Flex flex={1} justifyContent="flex-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <SafeAreaView style={{ backgroundColor: color("mono0") }}>
          <Flex
            bg={color("mono0")}
            borderTopLeftRadius={16}
            borderTopRightRadius={16}
            overflow="hidden"
            maxHeight={520}
          >
            {/* Header */}
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              px={2}
              pt={2}
              pb={1}
            >
              <Text variant="md" weight="medium">
                Place Max Bid
              </Text>
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onDismiss}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text variant="sm" color={color("mono60")}>
                  Cancel
                </Text>
              </Touchable>
            </Flex>

            <Flex height={1} bg={color("mono10")} mx={2} />

            {isPending || isSuccess || isError ? (
              renderStatusContent()
            ) : (
              <>
                <Text variant="xs" color={color("mono60")} px={2} pt={2} pb={1}>
                  Select your maximum bid
                </Text>

                <FlatList
                  ref={listRef}
                  data={amounts}
                  keyExtractor={(item) => String(item)}
                  style={{ maxHeight: 320 }}
                  renderItem={({ item, index }) => {
                    const isSelected = index === selectedIndex
                    return (
                      <Touchable
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => setSelectedIndex(index)}
                      >
                        <Flex
                          flexDirection="row"
                          justifyContent="space-between"
                          alignItems="center"
                          px={2}
                          py="10px"
                          bg={isSelected ? color("mono5") : color("mono0")}
                        >
                          <Text
                            variant="md"
                            weight={isSelected ? "medium" : "regular"}
                            color={isSelected ? color("mono100") : color("mono60")}
                          >
                            {formatAmount(item, currencySymbol)}
                          </Text>
                          {!!isSelected && (
                            <Text variant="sm" color={color("mono100")}>
                              ✓
                            </Text>
                          )}
                        </Flex>
                      </Touchable>
                    )
                  }}
                />

                <Flex p={2}>
                  <Button block haptic variant="fillDark" onPress={handleConfirm}>
                    Place Max Bid{" "}
                    {amounts[selectedIndex] !== undefined
                      ? formatAmount(amounts[selectedIndex], currencySymbol)
                      : ""}
                  </Button>
                </Flex>
              </>
            )}
          </Flex>
        </SafeAreaView>
      </Flex>
    </Modal>
  )
}
