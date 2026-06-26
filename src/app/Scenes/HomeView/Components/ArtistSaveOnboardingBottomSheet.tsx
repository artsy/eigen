import { Button, Flex, Image, Spacer, Text } from "@artsy/palette-mobile"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { PaginationBars } from "app/Scenes/InfiniteDiscovery/Components/PaginationBars"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState, useRef, useCallback, useEffect } from "react"
import { Platform } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"

interface DummyArtist {
  id: string
  name: string
  imageUrl: string
}

const DUMMY_FOLLOWED_ARTISTS: DummyArtist[] = [
  {
    id: "1",
    name: "Artist 1",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/8YQ9RcIGqoKC0ftglHMBeQ/large.jpg",
  },
  {
    id: "2",
    name: "Artist 2",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/fEdSbiBZs9MJftHqjyW3sA/square140.png",
  },
  {
    id: "3",
    name: "Artist 3",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/ENomMxabvEP15hIKHt5jmw/wide.jpg",
  },
]

export const ArtistSaveOnboardingBottomSheet = () => {
  const showFollowedArtistSummaryBottomSheet = GlobalStore.useAppState(
    (state) => state.onboarding.showFollowedArtistSummaryBottomSheet
  )
  const isExperienceOnboardingEnabled = useFeatureFlag("AREnableExperienceBasedOnboarding")
  const [isVisible, setIsVisible] = useState(false)

  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}
  const [activeStep, setActiveStep] = useState(0)
  const pagerViewRef = useRef<PagerView>(null)
  const numberOfPages = 2

  useEffect(() => {
    if (showFollowedArtistSummaryBottomSheet && isExperienceOnboardingEnabled) {
      setIsVisible(true)
    }
  }, [showFollowedArtistSummaryBottomSheet, isExperienceOnboardingEnabled])

  const handleDismiss = () => {
    setIsVisible(false)
    GlobalStore.actions.onboarding.setShowFollowedArtistSummaryBottomSheet(false)
  }

  const handleButtonPress = () => {
    if (activeStep === 0) {
      pagerViewRef.current?.setPage(1)
    } else {
      handleDismiss()
    }
  }

  const handleIndexChange = (e: PagerViewOnPageScrollEvent) => {
    if (e.nativeEvent.position !== undefined && e.nativeEvent.position !== -1) {
      setActiveStep(e.nativeEvent.position)
    }
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        style={[props.style, { backgroundColor: "rgb(229,229,229)" }]}
      />
    ),
    []
  )

  if (!isVisible) {
    return null
  }

  return (
    <AutomountedBottomSheetModal
      enableDynamicSizing
      visible={isVisible}
      name="ArtistSaveOnboardingBottomSheet"
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={bottomSheetViewStyles}>
        <Flex mb={4} mx={2} alignItems="center">
          <Spacer y={1} />

          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            {DUMMY_FOLLOWED_ARTISTS.slice(0, 3).map((artist, index) => (
              <Flex
                key={artist.id}
                style={{
                  marginLeft: index > 0 ? -10 : 0,
                  zIndex: index,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.35,
                  shadowRadius: 6,
                  elevation: 8,
                }}
              >
                <Image
                  src={artist.imageUrl}
                  width={75}
                  height={75}
                  style={{ borderRadius: 37.5 }}
                />
              </Flex>
            ))}
          </Flex>

          <PagerView
            style={{ width: "100%", height: 200 }}
            initialPage={0}
            onPageScroll={handleIndexChange}
            ref={pagerViewRef}
            pageMargin={0}
            overdrag={false}
            offscreenPageLimit={1}
          >
            {/* Page 1 */}
            <Flex key="page-0" alignItems="center" width="100%">
              <Spacer y={2} />

              <Text variant="sm-display" weight="medium" textAlign="center">
                Your followed artists are saved to Favorites.
              </Text>

              <Spacer y={1} />

              <Text variant="xs" color="mono60" textAlign="center">
                Find them anytime in the Favorites tab at the bottom of your screen.
              </Text>

              <Spacer y={2} />

              <Image
                src="https://files.artsy.net/images/nav-bar.png"
                height={75}
                width={350}
                resizeMode="contain"
              />
            </Flex>

            {/* Page 2 */}
            <Flex key="page-1" alignItems="center" width="100%">
              <Spacer y={2} />

              <Text variant="sm-display" weight="medium" textAlign="center">
                We'll let you know when new works arrive.
              </Text>

              <Spacer y={1} />

              <Text variant="xs" color="mono60" textAlign="center">
                When a new work by an artist you follow is added to Artsy, you'll see a notification
                on the Alerts icon at the top of your For You page.
              </Text>

              <Spacer y={1} />

              <Image
                src="https://files.artsy.net/images/search-bar.png"
                height={75}
                width={350}
                resizeMode="contain"
              />
            </Flex>
          </PagerView>

          <Flex mb={2} py={0.5}>
            <PaginationBars currentIndex={activeStep} length={numberOfPages} />
          </Flex>

          <Button block onPress={handleButtonPress}>
            {activeStep === 0 ? "Next" : "View For You"}
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
