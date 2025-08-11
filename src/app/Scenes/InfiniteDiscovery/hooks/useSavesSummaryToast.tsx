import { LinkText } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useToast } from "app/Components/Toast/toastHook"
import { useInfiniteDiscoveryTracking } from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscoveryTracking"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { pluralize } from "app/utils/pluralize"
import { useCallback, useEffect } from "react"

export const useSavesSummaryToast = () => {
  const { addListener } = useNavigation()
  const toast = useToast()
  const savedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.savedArtworksCount
  )
  const track = useInfiniteDiscoveryTracking()

  const showSavedCountToast = useCallback(() => {
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
  }, [toast, savedArtworksCount, track])

  useEffect(() => {
    const unsubscribe = addListener("beforeRemove", showSavedCountToast)

    return unsubscribe
  }, [addListener, showSavedCountToast])

  return { showSavedCountToast }
}
