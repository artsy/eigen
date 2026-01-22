import { CloseIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { LiveSaleProvider } from "./LiveSaleProvider"
import { LiveLotCarousel } from "./components/LiveLotCarousel/LiveLotCarousel"
import { useLiveAuction } from "./hooks/useLiveAuction"

interface LiveSaleProps {
  slug: string
}

// Inner component that uses the live auction context
const LiveSaleContent: React.FC = () => {
  const {
    saleName,
    lots,
    isConnected,
    showDisconnectWarning,
    isOnHold,
    onHoldMessage,
    operatorConnected,
    pendingBids,
    credentials,
  } = useLiveAuction()

  return (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />

      {/* Disconnect Warning Banner */}
      {!!showDisconnectWarning && (
        <Flex bg="red100" p={2}>
          <Text variant="sm" color="red100" textAlign="center">
            Connection lost. Reconnecting...
          </Text>
        </Flex>
      )}

      {/* Sale On Hold Overlay */}
      {!!isOnHold && (
        <Flex bg="orange100" p={2}>
          <Text variant="sm" color="orange100" textAlign="center">
            {onHoldMessage || "Sale is currently on hold"}
          </Text>
        </Flex>
      )}

      <Flex flex={1} p={2}>
        {/* Sale Header */}
        <Text variant="lg-display" mb={2}>
          {saleName}
        </Text>

        {/* Connection Status */}
        <Flex flexDirection="row" alignItems="center" mb={2}>
          <Flex
            width={8}
            height={8}
            borderRadius={4}
            bg={isConnected ? "green100" : "red100"}
            mr={1}
          />
          <Text variant="xs" color="black60">
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </Flex>

        {/* Credentials Info */}
        <Text variant="sm" color="black60" mb={1}>
          Paddle Number: {credentials.paddleNumber || "Not registered"}
        </Text>
        <Text variant="sm" color="black60" mb={1}>
          Bidder ID: {credentials.bidderId || "N/A"}
        </Text>

        {/* Operator Status */}
        <Text variant="sm" color="black60" mb={2}>
          Operator: {operatorConnected ? "Connected" : "Disconnected"}
        </Text>

        {/* Live Lot Carousel */}
        <Flex flex={1} mt={2}>
          <LiveLotCarousel />
        </Flex>

        {/* Stats */}
        <Flex mt={2} p={2} bg="black5" borderRadius={4}>
          <Text variant="sm" mb={1}>
            Total Lots: {lots.size}
          </Text>
          <Text variant="sm">Pending Bids: {pendingBids.size}</Text>
        </Flex>

        {/* Pending Bids */}
        {pendingBids.size > 0 ? (
          <Flex mt={2}>
            <Text variant="sm" mb={1}>
              Pending Bids:
            </Text>
            {Array.from(pendingBids.entries()).map(([key, bid]) => (
              <Flex key={key} p={1} bg="black5" mb={1} borderRadius={4}>
                <Text variant="xs" color="black60">
                  Lot {bid.lotId}: ${(bid.amountCents / 100).toLocaleString()} - {bid.status}
                  {!!bid.error && ` (${bid.error})`}
                </Text>
              </Flex>
            ))}
          </Flex>
        ) : null}
      </Flex>
    </Screen>
  )
}

// Outer component that wraps with provider
const LiveSaleComponent: React.FC<LiveSaleProps> = ({ slug }) => {
  return (
    <LiveSaleProvider slug={slug}>
      <LiveSaleContent />
    </LiveSaleProvider>
  )
}

export const LiveSale = withSuspense({
  Component: LiveSaleComponent,
  LoadingFallback: () => (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    </Screen>
  ),
  ErrorFallback: () => (
    <Screen>
      <Screen.Header
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Sale"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => goBack()}
          >
            <CloseIcon />
          </Touchable>
        }
      />
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Unable to load auction. Please try again later.</Text>
      </Flex>
    </Screen>
  ),
})
