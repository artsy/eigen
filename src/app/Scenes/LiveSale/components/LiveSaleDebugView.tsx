import { BackButton, DEFAULT_HIT_SLOP, Flex, Text, useColor } from "@artsy/palette-mobile"
import { useLiveAuction } from "app/Scenes/LiveSale/hooks/useLiveAuction"
import { Modal, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface LiveSaleDebugViewProps {
  visible: boolean
  onDismiss: () => void
}

export const LiveSaleDebugView: React.FC<LiveSaleDebugViewProps> = ({ visible, onDismiss }) => {
  const {
    saleName,
    currentLotId,
    lots,
    isConnected,
    showDisconnectWarning,
    isOnHold,
    onHoldMessage,
    operatorConnected,
    pendingBids,
    credentials,
    artworkMetadata,
  } = useLiveAuction()

  const color = useColor()
  const insets = useSafeAreaInsets()
  const currentLot = currentLotId ? lots.get(currentLotId) : null

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      backdropColor={color("mono0")}
    >
      <Flex pt={`${insets.top}px`} mx={2} mb={2} height={50} backgroundColor={color("mono0")}>
        <Flex flexDirection="row" justifyContent="space-between" height={30} mb={1}>
          <BackButton onPress={onDismiss} showX={true} hitSlop={DEFAULT_HIT_SLOP} />
        </Flex>
      </Flex>

      <Flex flex={1} px={2} pb={`${insets.bottom}px`} backgroundColor={color("mono0")}>
        <ScrollView>
          {/* Sale Info */}
          <Flex mb={2} mt={2}>
            <Text variant="sm-display" mb={1}>
              Sale Information
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Name: {saleName}
            </Text>
          </Flex>

          {/* Connection Status */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Connection Status
            </Text>
            <Flex flexDirection="row" alignItems="center" mb={1}>
              <Flex
                width={8}
                height={8}
                borderRadius={4}
                bg={isConnected ? "green100" : "red100"}
                mr={1}
              />
              <Text variant="sm" color={color("mono60")}>
                {isConnected ? "Connected" : "Disconnected"}
              </Text>
            </Flex>
            <Text variant="sm" color={color("mono60")}>
              Show Disconnect Warning: {showDisconnectWarning ? "Yes" : "No"}
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Sale On Hold: {isOnHold ? "Yes" : "No"}
            </Text>
            {!!onHoldMessage && (
              <Text variant="sm" color={color("mono60")}>
                Hold Message: {onHoldMessage}
              </Text>
            )}
            <Text variant="sm" color={color("mono60")}>
              Operator: {operatorConnected ? "Connected" : "Disconnected"}
            </Text>
          </Flex>

          {/* Credentials */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Bidder Credentials
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Paddle Number: {credentials.paddleNumber || "Not registered"}
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Bidder ID: {credentials.bidderId || "N/A"}
            </Text>
          </Flex>

          {/* Current Lot Info */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Current Lot (from WebSocket)
            </Text>
            {currentLot ? (
              <Flex p={2} bg={color("mono5")} borderRadius={4}>
                <Text variant="sm" color={color("mono60")} mb={1}>
                  Lot ID: {currentLot.lotId}
                </Text>
                <Text variant="sm" color={color("mono60")} mb={1}>
                  Status: {currentLot.derivedState.biddingStatus} -{" "}
                  {currentLot.derivedState.soldStatus}
                </Text>
                <Text variant="sm" color={color("mono60")} mb={1}>
                  Reserve: {currentLot.derivedState.reserveStatus}
                </Text>
                <Text variant="sm" color={color("mono60")} mb={1}>
                  Asking Price: ${(currentLot.derivedState.askingPriceCents / 100).toLocaleString()}
                </Text>
                <Text variant="sm" color={color("mono60")} mb={1}>
                  Online Bids: {currentLot.derivedState.onlineBidCount}
                </Text>
                <Text variant="sm" color={color("mono60")}>
                  Total Events: {currentLot.eventHistory.length}
                </Text>
              </Flex>
            ) : (
              <Text variant="sm" color={color("mono60")}>
                No current lot
              </Text>
            )}
          </Flex>

          {/* Stats */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Statistics
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Total Lots: {lots.size}
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Artwork Metadata Entries: {artworkMetadata.size}
            </Text>
            <Text variant="sm" color={color("mono60")}>
              Pending Bids: {pendingBids.size}
            </Text>
          </Flex>

          {/* Pending Bids */}
          {pendingBids.size > 0 && (
            <Flex mb={2}>
              <Text variant="sm-display" mb={1}>
                Pending Bids
              </Text>
              {Array.from(pendingBids.entries()).map(([key, bid]) => (
                <Flex key={key} p={1} bg={color("mono5")} mb={1} borderRadius={4}>
                  <Text variant="xs" color={color("mono60")}>
                    Lot {bid.lotId}: ${(bid.amountCents / 100).toLocaleString()} - {bid.status}
                    {!!bid.error && ` (${bid.error})`}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}

          {/* Sample Lot IDs */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Sample Lot IDs (first 5)
            </Text>
            {Array.from(lots.keys())
              .slice(0, 5)
              .map((lotId) => (
                <Text key={lotId} variant="xs" color={color("mono60")}>
                  {lotId}
                </Text>
              ))}
          </Flex>

          {/* Sample Artwork Metadata Keys */}
          <Flex mb={2}>
            <Text variant="sm-display" mb={1}>
              Sample Artwork Metadata Keys (first 5)
            </Text>
            {Array.from(artworkMetadata.keys())
              .slice(0, 5)
              .map((key) => (
                <Text key={key} variant="xs" color={color("mono60")}>
                  {key}
                </Text>
              ))}
          </Flex>
        </ScrollView>
      </Flex>
    </Modal>
  )
}
