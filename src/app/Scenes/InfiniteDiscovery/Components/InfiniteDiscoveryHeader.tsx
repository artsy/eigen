import { ChevronDownIcon, MoreIcon, ShareIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Text, Touchable } from "@artsy/palette-mobile"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
// import { useSavesSummaryToast } from "app/Scenes/InfiniteDiscovery/hooks/useSavesSummaryToast" — suppressed while animation prototype is active
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React from "react"
import { DeviceEventEmitter, StyleSheet } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import RNShare from "react-native-share"

interface InfiniteDiscoveryHeaderProps {
  topArtwork?: InfiniteDiscoveryArtwork
}

export const InfiniteDiscoveryHeader: React.FC<InfiniteDiscoveryHeaderProps> = ({ topArtwork }) => {
  // useSavesSummaryToast() — suppressed while animation prototype is active
  const negativeSignalsEnabled = useFeatureFlag("AREnabledDiscoverDailyNegativeSignals")
  const track = useInfiniteDiscoveryTracking()
  const { setMoreInfoSheetVisible } = GlobalStore.actions.infiniteDiscovery

  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )
  // Ref keeps the subscription closure from going stale without re-subscribing
  const savedArtworksCountRef = React.useRef(savedArtworksCount)
  savedArtworksCountRef.current = savedArtworksCount

  const [badgeCount, setBadgeCount] = React.useState(0)
  const badgeScale = useSharedValue(1)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener("infiniteDiscovery:chevronTouch", () => {
      setBadgeCount(savedArtworksCountRef.current)
      badgeScale.set(() =>
        withSequence(withTiming(1.4, { duration: 120 }), withTiming(1, { duration: 120 }))
      )
    })
    return () => sub.remove()
  }, [])

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.get() }] }))
  const hideRightButton = !topArtwork || !topArtwork.slug || !topArtwork.title
  const rightButtonLabel = negativeSignalsEnabled ? "More information" : "Share Artwork"

  const handleExitPressed = () => {
    track.tappedExit()
    if (savedArtworksCount > 0) {
      GlobalStore.actions.infiniteDiscovery.setHasPendingCompletionAnimation(true)
    }
    goBack()
  }

  const handleSharePressed = () => {
    if (!topArtwork || !topArtwork.slug || !topArtwork.title) {
      return
    }

    track.tappedShare(topArtwork.internalID, topArtwork.slug, "artwork")

    const url = getShareURL(
      `/artwork/${topArtwork.slug}?utm_content=discover-daily-share&utm_medium=product-share`
    )
    const message = `View ${topArtwork.title} on Artsy`

    RNShare.open({
      title: topArtwork.title,
      message: message + "\n" + url,
      failOnCancel: false,
    })
      .then((result) => {
        if (result.success) {
          track.share(topArtwork.internalID, topArtwork.slug, result.message)
        }
      })
      .catch((error) => {
        console.error("InfiniteDiscovery.tsx", error)
      })
  }

  const handleOnRightButtonPressed = () => {
    if (negativeSignalsEnabled && topArtwork) {
      track.tappedMore(topArtwork?.internalID, topArtwork?.slug)
      setMoreInfoSheetVisible(true)
    } else {
      handleSharePressed()
    }
  }

  return (
    <Flex mb={1}>
      <Screen.Header
        title="Discover Daily"
        leftElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Exit Discover Daily"
            onPress={handleExitPressed}
            testID="close-icon"
            hitSlop={DEFAULT_HIT_SLOP}
            haptic
          >
            {badgeCount === 0 ? (
              <ChevronDownIcon />
            ) : (
              <Animated.View style={[styles.badge, badgeStyle]}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </Animated.View>
            )}
          </Touchable>
        }
        hideRightElements={hideRightButton}
        rightElements={
          <Touchable
            accessibilityRole="button"
            accessibilityLabel={rightButtonLabel}
            onPress={handleOnRightButtonPressed}
            testID="top-right-icon"
            hitSlop={DEFAULT_HIT_SLOP}
            haptic
          >
            {negativeSignalsEnabled ? (
              <MoreIcon width={24} height={24} />
            ) : (
              <ShareIcon width={24} height={24} />
            )}
          </Touchable>
        }
      />
    </Flex>
  )
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1023D7", // brand blue from palette tokens
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
})
