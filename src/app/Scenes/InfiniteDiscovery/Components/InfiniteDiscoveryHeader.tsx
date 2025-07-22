import { ChevronDownIcon, MoreIcon, ShareIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Flex, LinkText, Screen, Touchable } from "@artsy/palette-mobile"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { InfiniteDiscoveryArtwork } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { pluralize } from "app/utils/pluralize"
import RNShare from "react-native-share"

interface InfiniteDiscoveryHeaderProps {
  topArtwork?: InfiniteDiscoveryArtwork
}

export const InfiniteDiscoveryHeader: React.FC<InfiniteDiscoveryHeaderProps> = ({ topArtwork }) => {
  const negativeSignalsEnabled = useFeatureFlag("AREnabledDiscoverDailyNegativeSignals")
  const toast = useToast()
  const track = useInfiniteDiscoveryTracking()
  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )
  const { setMoreInfoSheetVisible } = GlobalStore.actions.infiniteDiscovery
  const hideRightButton = !topArtwork || !topArtwork.slug || !topArtwork.title
  const rightButtonLabel = negativeSignalsEnabled ? "More information" : "Share Artwork"

  const handleExitPressed = () => {
    if (savedArtworksCount > 0) {
      toast.show(
        `Nice! You saved ${savedArtworksCount} ${pluralize("artwork", savedArtworksCount)}.`,
        "bottom",
        {
          onPress: () => {
            track.tappedSummary()
            navigate("/favorites/saves")
          },
          backgroundColor: "green100",
          description: (
            <LinkText variant="xs" color="mono0" onPress={() => navigate("/favorites/saves")}>
              Tap to see all of your saved artworks.
            </LinkText>
          ),
          duration: "long",
        }
      )
    }

    track.tappedExit()

    goBack()
  }

  const handleSharePressed = () => {
    if (!topArtwork || !topArtwork.slug || !topArtwork.title) {
      return
    }

    track.tappedShare(topArtwork.internalID, topArtwork.slug)

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
    if (negativeSignalsEnabled) {
      setMoreInfoSheetVisible(true)
    } else {
      handleSharePressed()
    }
  }

  return (
    <Flex zIndex={-100}>
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
