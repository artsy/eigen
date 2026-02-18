import { ChevronDownIcon, MoreIcon, ShareIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, Screen, Touchable } from "@artsy/palette-mobile"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { useSavesSummaryToast } from "app/Scenes/InfiniteDiscovery/hooks/useSavesSummaryToast"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import RNShare from "react-native-share"

interface InfiniteDiscoveryHeaderProps {
  topArtwork?: InfiniteDiscoveryArtwork
}

export const InfiniteDiscoveryHeader: React.FC<InfiniteDiscoveryHeaderProps> = ({ topArtwork }) => {
  useSavesSummaryToast()
  const negativeSignalsEnabled = useFeatureFlag("AREnabledDiscoverDailyNegativeSignals")
  const track = useInfiniteDiscoveryTracking()
  const { setMoreInfoSheetVisible } = GlobalStore.actions.infiniteDiscovery
  const hideRightButton = !topArtwork || !topArtwork.slug || !topArtwork.title
  const rightButtonLabel = negativeSignalsEnabled ? "More information" : "Share Artwork"

  const handleExitPressed = () => {
    track.tappedExit()
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
            <ChevronDownIcon />
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
