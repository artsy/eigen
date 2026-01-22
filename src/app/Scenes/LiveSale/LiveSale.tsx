import { CloseIcon, MoreIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Spinner, Text, Touchable } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useState } from "react"
import { LiveSaleProvider } from "./LiveSaleProvider"
import { LiveLotCarousel } from "./components/LiveLotCarousel/LiveLotCarousel"
import { LiveSaleDebugView } from "./components/LiveSaleDebugView"
import { useLiveAuction } from "./hooks/useLiveAuction"

interface LiveSaleProps {
  slug: string
}

// Inner component that uses the live auction context
const LiveSaleContent: React.FC = () => {
  const { saleName, showDisconnectWarning, isOnHold, onHoldMessage } = useLiveAuction()
  const [showDebugView, setShowDebugView] = useState(false)
  const showDebugButton = useDevToggle("DTShowLiveSaleDebugButton")

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
        rightElements={
          __DEV__ || !!showDebugButton ? (
            <Touchable
              accessibilityRole="button"
              accessibilityLabel="Debug Info"
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={() => setShowDebugView(true)}
            >
              <MoreIcon />
            </Touchable>
          ) : undefined
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

        {/* Live Lot Carousel */}
        <Flex flex={1}>
          <LiveLotCarousel />
        </Flex>
      </Flex>

      {/* Debug View Modal */}
      {!!(__DEV__ || !!showDebugButton) && (
        <LiveSaleDebugView visible={showDebugView} onDismiss={() => setShowDebugView(false)} />
      )}
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
