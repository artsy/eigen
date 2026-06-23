import { Button, Flex, Image, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useState, useRef } from "react"
import { Platform } from "react-native"
import PagerView, { PagerViewOnPageScrollEvent } from "react-native-pager-view"
import { DummyArtist } from "./dummyArtistData"

interface ArtistSaveOnboardingBottomSheetProps {
  visible: boolean
  onDismiss: () => void
  artists: DummyArtist[]
}

export const ArtistSaveOnboardingBottomSheet = ({
  visible,
  onDismiss,
  artists,
}: ArtistSaveOnboardingBottomSheetProps) => {
  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}
  const [activeStep, setActiveStep] = useState(0)
  const pagerViewRef = useRef<PagerView>(null)
  const color = useColor()
  const numberOfPages = 2

  const handleButtonPress = () => {
    if (activeStep === 0) {
      pagerViewRef.current?.setPage(1)
    } else {
      onDismiss()
    }
  }

  const handleIndexChange = (e: PagerViewOnPageScrollEvent) => {
    if (e.nativeEvent.position !== undefined && e.nativeEvent.position !== -1) {
      setActiveStep(e.nativeEvent.position)
    }
  }

  return (
    <AutomountedBottomSheetModal
      enableDynamicSizing
      visible={visible}
      name="ArtistSaveOnboardingBottomSheet"
      onDismiss={onDismiss}
    >
      <BottomSheetView style={bottomSheetViewStyles}>
        <Flex mb={4} mx={2} alignItems="center">
          <PagerView
            style={{ width: "100%", height: 320 }}
            initialPage={0}
            onPageScroll={handleIndexChange}
            ref={pagerViewRef}
            pageMargin={0}
            overdrag={false}
            offscreenPageLimit={1}
          >
            {/* PAGE 1: Artists + Favorites */}
            <Flex key="page-0" alignItems="center" width="100%">
              {/* Artist Images - Overlapping Circles */}
              <Spacer y={2} />
              <Flex flexDirection="row" justifyContent="center" alignItems="center">
                {artists.slice(0, 3).map((artist, index) => (
                  <Flex
                    key={artist.id}
                    style={{
                      marginLeft: index > 0 ? -10 : 0,
                      zIndex: artists.length - index,
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

              <Spacer y={2} />

              {/* Title */}
              <Text variant="sm-display" weight="medium" textAlign="center">
                Your followed artists are saved to Favorites.
              </Text>

              <Spacer y={1} />

              {/* Body Text */}
              <Text variant="xs" color="black60" textAlign="center">
                Find them anytime in the Favorites tab at the bottom of your screen.
              </Text>

              <Spacer y={2} />

              {/* Nav bar image */}

              <Image
                src="https://files.artsy.net/images/nav-bar.png"
                height={75}
                aspectRatio={350 / 75}
                resizeMode="contain"
              />
            </Flex>

            {/* PAGE 2: Alerts Notification */}
            <Flex key="page-1" alignItems="center" width="100%">
              {/* Artist Images - Overlapping Circles */}
              <Spacer y={2} />
              <Flex flexDirection="row" justifyContent="center" alignItems="center">
                {artists.slice(0, 3).map((artist, index) => (
                  <Flex
                    key={artist.id}
                    style={{
                      marginLeft: index > 0 ? -10 : 0,
                      zIndex: artists.length - index,
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

              <Spacer y={2} />

              {/* Title */}
              <Text variant="sm-display" weight="medium" textAlign="center">
                We'll let you know when new works arrive.
              </Text>

              <Spacer y={1} />

              {/* Body */}
              <Text variant="xs" color="black60" textAlign="center">
                When a new work by an artist you follow is added to Artsy, you'll see a notification
                on the Alerts icon at the top of your For You page.
              </Text>

              <Spacer y={2} />

              {/* Search bar image */}
              <Image
                src="https://files.artsy.net/images/search-bar.png"
                height={75}
                aspectRatio={350 / 75}
                resizeMode="contain"
              />

              <Spacer y={2} />
            </Flex>
          </PagerView>

          {/* Page indicator */}
          <Flex flexDirection="row" justifyContent="center" mb={2} gap={0.5} py={0.5}>
            {Array.from(Array(numberOfPages).keys()).map((index) => (
              <Flex
                key={index}
                flex={1}
                height={1}
                borderRadius={2}
                backgroundColor={activeStep === index ? color("mono60") : "#d9d9d9"}
              />
            ))}
          </Flex>

          {/* CTA Button */}
          <Button block onPress={handleButtonPress}>
            {activeStep === 0 ? "Next" : "View For You"}
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
