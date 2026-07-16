import { Avatar, Button, Flex, Image, Spacer, Text } from "@artsy/palette-mobile"
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

export const FollowArtistsOnboardingCompletionBottomSheet = () => {
  const showFollowedArtistSummaryBottomSheet = GlobalStore.useAppState(
    (state) => state.onboarding.showFollowedArtistSummaryBottomSheet
  )
  const followedOnboardingArtists = GlobalStore.useAppState(
    (state) => state.onboarding.followedOnboardingArtists
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
    GlobalStore.actions.onboarding.resetFollowedOnboardingArtists()
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
      name="FollowArtistsOnboardingCompletionBottomSheet"
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={bottomSheetViewStyles}>
        <Flex mb={4} mx={2} alignItems="center">
          <Spacer y={1} />

          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            {followedOnboardingArtists.slice(-3).map((artist, index) => (
              <Flex
                key={artist.internalID}
                backgroundColor="mono0"
                borderRadius={35}
                style={{
                  marginLeft: index > 0 ? -10 : 0,
                  zIndex: index,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Avatar
                  src={artist.imageUrl ?? undefined}
                  blurhash={artist.blurhash}
                  initials={artist.initials ?? undefined}
                  size="sm"
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

              <Text
                variant="xs"
                color="mono60"
                textAlign="center"
                style={{ width: 350, paddingHorizontal: 10 }}
              >
                Find them any time in the Favorites tab at the bottom of your screen.
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

              <Text
                variant="xs"
                color="mono60"
                textAlign="center"
                style={{ width: 350, paddingHorizontal: 10 }}
              >
                When there's a new work by an artist you follow, you'll see a notification at the
                top of your For You page.
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
