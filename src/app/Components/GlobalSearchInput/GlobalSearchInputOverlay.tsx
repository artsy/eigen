import { OwnerType } from "@artsy/cohesion"
import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import {
  Box,
  Button,
  Flex,
  RoundSearchInput,
  Spacer,
  Text,
  Touchable,
  useSpace,
} from "@artsy/palette-mobile"
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
// Imperative navigation is required here — we navigate after the async image upload
// resolves, so RouterLink (declarative) can't be used.
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { Suspense, useCallback, useEffect, useState } from "react"
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

const GlobalSearchInputOverlayContent: React.FC<{
  query: string
  onScrollBeginDrag?: () => void
}> = ({ query, onScrollBeginDrag }) => {
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
            onScrollBeginDrag={onScrollBeginDrag}
            onRetry={() => {
              refetch({ term: query, skipSearchQuery: false })
            }}
          />
        </>
      ) : (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={onScrollBeginDrag}
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
  const [isFooterExpanded, setIsFooterExpanded] = useState(true)
  const [uploadingSource, setUploadingSource] = useState<"camera" | "library" | null>(null)
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

  // Collapse the prompt to its title once the user starts typing; expand it again when the
  // query is cleared. It's never hidden — the title stays with a chevron to re-expand.
  useEffect(() => {
    setIsFooterExpanded(!query)
  }, [query])

  // Also collapse it as soon as the user starts scrolling the results/recent searches.
  const collapseFooter = useCallback(() => setIsFooterExpanded(false), [])

  const uploadAndSearchByImage = async (
    imagePath: string | undefined,
    source: "camera" | "library"
  ) => {
    if (!imagePath) {
      return
    }

    // Uploading to S3 can take a few seconds — show a loading state so the user has feedback.
    setUploadingSource(source)
    try {
      const { key, bucket } = await uploadImageToS3(imagePath)
      hideModal()
      navigate("/image-search-results", {
        passProps: { s3Key: key, s3Bucket: bucket },
      })
    } catch (error) {
      console.error("Failed to upload image to S3", error)
    } finally {
      setUploadingSource(null)
    }
  }

  const handleTakePhoto = async () => {
    try {
      // `cropping` lets the user crop the shot before we search with it;
      // `freeStyleCropEnabled` allows a free-form crop rectangle instead of a locked square.
      const photo = await ImagePicker.openCamera({
        mediaType: "photo",
        cropping: true,
        freeStyleCropEnabled: true,
      })
      await uploadAndSearchByImage(photo.path, "camera")
    } catch (error) {
      // User cancelled the camera or denied permission — no-op
    }
  }

  const handleAddImage = async () => {
    try {
      // Pick from the gallery with a free-form crop step before we search with the image.
      const photo = await ImagePicker.openPicker({
        mediaType: "photo",
        cropping: true,
        freeStyleCropEnabled: true,
      })
      await uploadAndSearchByImage(photo.path, "library")
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
              <GlobalSearchInputOverlayContent query={query} onScrollBeginDrag={collapseFooter} />
            </Suspense>
          </Flex>

          {/* The image-search prompt is always present (never fully hidden). It shows in full
           before searching, and collapses to just its title once the user starts typing — the
           chevron lets them re-expand. KeyboardStickyView keeps it above the keyboard; the
           negative `closed` offset lifts it above the bottom tab bar when the keyboard folds. */}
          <KeyboardStickyView offset={{ closed: -(BOTTOM_TABS_HEIGHT + insets.bottom) }}>
            <Box backgroundColor="blue10" px={2} py={1}>
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Text fontWeight="bold">See it? Search it.</Text>

                <Touchable
                  accessibilityRole="button"
                  accessibilityLabel={isFooterExpanded ? "Collapse" : "Expand"}
                  onPress={() => setIsFooterExpanded((expanded) => !expanded)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {isFooterExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
                </Touchable>
              </Flex>

              {!!isFooterExpanded && (
                <>
                  <Text pt={0.5} pb={1}>
                    Take a photo or upload an image to find the piece that matches the mood.
                  </Text>
                  <Flex flexDirection="row">
                    <Flex flex={1}>
                      <Button
                        block
                        variant="fillDark"
                        onPress={handleTakePhoto}
                        loading={uploadingSource === "camera"}
                        disabled={!!uploadingSource}
                      >
                        Take a photo
                      </Button>
                    </Flex>

                    <Spacer x={1} />

                    <Flex flex={1}>
                      <Button
                        block
                        variant="fillDark"
                        onPress={handleAddImage}
                        loading={uploadingSource === "library"}
                        disabled={!!uploadingSource}
                      >
                        Add an image
                      </Button>
                    </Flex>
                  </Flex>
                </>
              )}
            </Box>
          </KeyboardStickyView>
        </Flex>
      </Animated.View>
    </Portal>
  )
}
