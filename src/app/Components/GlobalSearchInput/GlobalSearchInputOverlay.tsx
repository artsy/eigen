import { OwnerType } from "@artsy/cohesion"
import { Box, Button, Flex, RoundSearchInput, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { Portal } from "@gorhom/portal"
import { useNavigation } from "@react-navigation/native"
import { GlobalSearchInputOverlayEmptyState } from "app/Components/GlobalSearchInput/GlobalSearchInputOverlayEmptyState"
import { useSearch } from "app/Components/GlobalSearchInput/useSearch"
import { DEFAULT_SCREEN_ANIMATION_DURATION } from "app/Components/constants"
import { BOTTOM_TABS_HEIGHT } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { RecentSearches } from "app/Scenes/Search/RecentSearches"
import { SEARCH_INPUT_PLACEHOLDER, shouldStartSearching } from "app/Scenes/Search/Search"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { useRecentSearches } from "app/Scenes/Search/SearchModel"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { SearchResults } from "app/Scenes/Search/SearchResults"
import { SEARCH_PILLS } from "app/Scenes/Search/constants"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { requestPhotos } from "app/utils/requestPhotos"
import { Suspense, useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import ImagePicker from "react-native-image-crop-picker"
import { KeyboardController, KeyboardStickyView } from "react-native-keyboard-controller"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql } from "react-relay"

export const globalSearchInputOverlayQuery = graphql`
  query GlobalSearchInputOverlayQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
  }
`

const GlobalSearchInputOverlayContent: React.FC<{ query: string }> = ({ query }) => {
  const space = useSpace()
  const {
    data,
    isSelected,
    handlePillPress,
    searchPillsRef,
    selectedPill,
    searchProviderValues,
    isLoading,
    refetch,
  } = useSearch({ query })

  const recentSearches = useRecentSearches()

  return (
    <SearchContext.Provider value={searchProviderValues}>
      {shouldStartSearching(query) && !!data.viewer ? (
        <>
          <Box mb={1}>
            <SearchPills
              viewer={data.viewer}
              ref={searchPillsRef}
              pills={SEARCH_PILLS}
              onPillPress={handlePillPress}
              isSelected={isSelected}
              isLoading={isLoading}
            />
          </Box>
          <SearchResults
            selectedPill={selectedPill}
            query={query}
            onRetry={() => {
              refetch({ term: query, skipSearchQuery: false })
            }}
          />
        </>
      ) : (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: space(2),
            paddingBottom: space(6),
          }}
        >
          {recentSearches.length ? <RecentSearches /> : <GlobalSearchInputOverlayEmptyState />}
        </ScrollView>
      )}
    </SearchContext.Provider>
  )
}

export const GlobalSearchInputOverlay: React.FC<{
  ownerType: OwnerType
  visible: boolean
  hideModal: () => void
}> = ({ hideModal, ownerType, visible }) => {
  const [query, setQuery] = useState("")
  const [shouldRender, setShouldRender] = useState(false)
  const insets = useSafeAreaInsets()
  const { goBack, canGoBack } = useNavigation()
  const opacity = useSharedValue(0)

  useBackHandler(() => {
    if (!!canGoBack()) {
      goBack()
      return true
    }

    if (visible) {
      hideModal()
      return true
    }

    return false
  })

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      opacity.value = withTiming(1, { duration: DEFAULT_SCREEN_ANIMATION_DURATION })
    } else {
      KeyboardController.dismiss()
      opacity.value = withTiming(0, { duration: DEFAULT_SCREEN_ANIMATION_DURATION }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false)
        }
      })
      setQuery("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const handleTakePhoto = async () => {
    try {
      await ImagePicker.openCamera({ mediaType: "photo" })
      // TODO: pass the captured photo to the image search flow
    } catch (error) {
      // User cancelled the camera or denied permission — no-op
    }
  }

  const handleAddImage = async () => {
    try {
      await requestPhotos(false)
      // TODO: pass the selected image to the image search flow
    } catch (error) {
      // User cancelled the photo picker — no-op
    }
  }

  if (!shouldRender) {
    return null
  }

  return (
    <Portal hostName={`${ownerType}-SearchOverlay`}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        {/* Use paddingTop (not `top`) so the container stays full-screen height and its
         bottom edge isn't pushed off-screen, which was cropping the footer below. */}
        <Flex flex={1} backgroundColor="mono0" style={{ paddingTop: insets.top }}>
          <Flex px={2} mt={2}>
            <RoundSearchInput
              placeholder={SEARCH_INPUT_PLACEHOLDER}
              accessibilityHint="Search artists, artworks, galleries etc."
              accessibilityLabel="Search artists, artworks, galleries etc."
              maxLength={55}
              numberOfLines={1}
              onChangeText={setQuery}
              autoFocus
              multiline={false}
              onLeftIconPress={() => {
                hideModal()
              }}
            />
          </Flex>

          <Spacer y={2} />

          {/* Bound the content to the available space so it lays out above the footer,
           which reserves the footer's height in normal flow (no overlap, no crop). */}
          <Flex flex={1}>
            <Suspense fallback={null}>
              <GlobalSearchInputOverlayContent query={query} />
            </Suspense>
          </Flex>

          {/* KeyboardStickyView lifts the footer above the keyboard while it's open. When
           the keyboard is folded/dismissed the negative `closed` offset lifts the footer
           above the absolutely-positioned bottom tab bar (BOTTOM_TABS_HEIGHT + safe area),
           which would otherwise cover it, so the buttons stay visible in both states.
           */}
          <KeyboardStickyView offset={{ closed: -(BOTTOM_TABS_HEIGHT + insets.bottom) }}>
            <Box backgroundColor="blue10" px={2} py={1}>
              <Text fontWeight="bold" mb={0.5}>
                See it? Search it.
              </Text>
              <Text pb={1}>
                Take a photo or upload an image to find the piece that matches the mood.
              </Text>
              <Flex flexDirection="row">
                <Flex flex={1}>
                  <Button block variant="fillDark" onPress={handleTakePhoto}>
                    Take a photo
                  </Button>
                </Flex>

                <Spacer x={1} />

                <Flex flex={1}>
                  <Button block variant="fillDark" onPress={handleAddImage}>
                    Upload an image
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </KeyboardStickyView>
        </Flex>
      </Animated.View>
    </Portal>
  )
}
