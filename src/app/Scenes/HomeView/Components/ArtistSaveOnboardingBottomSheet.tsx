import { Button, Flex, Image, useSpace, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useScreenDimensions } from "app/utils/hooks"
import { useState } from "react"
import { Platform } from "react-native"
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
  const [currentPage, setCurrentPage] = useState(0)
  const space = useSpace()
  const color = useColor()
  const { width: screenWidth } = useScreenDimensions()
  const numberOfPages = 2
  const barWidth = (screenWidth - 40) / numberOfPages

  const handleButtonPress = () => {
    if (currentPage === 0) {
      setCurrentPage(1)
    } else {
      onDismiss()
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
          {currentPage === 0 ? (
            // PAGE 1: Artists + Favorites
            <>
              {/* Artist Images - Overlapping Circles */}
              <Flex flexDirection="row" justifyContent="center" alignItems="center">
                {artists.slice(0, 3).map((artist, index) => (
                  <Flex
                    key={artist.id}
                    style={{
                      marginLeft: index > 0 ? -16 : 0,
                      zIndex: artists.length - index,
                    }}
                  >
                    <Image
                      src={artist.imageUrl}
                      width={64}
                      height={64}
                      style={{ borderRadius: 32 }}
                    />
                  </Flex>
                ))}
              </Flex>

              <Spacer y={2} />

              {/* Title */}
              <Text variant="lg-display" textAlign="center">
                Your followed artists are saved to Favorites.
              </Text>

              <Spacer y={1} />

              {/* Body Text */}
              <Text variant="sm" color="black60" textAlign="center">
                Find them anytime in the Favorites tab at the bottom of your screen.
              </Text>

              <Spacer y={2} />

              {/* Nav bar image placeholder */}
              <Flex
                height={60}
                backgroundColor="black10"
                justifyContent="center"
                alignItems="center"
              >
                <Text variant="xs" color="black60">
                  [Nav Bar Image Placeholder]
                </Text>
              </Flex>
            </>
          ) : (
            // PAGE 2: Alerts Notification
            <>
              <Spacer y={4} />

              {/* Title */}
              <Text variant="lg-display" textAlign="center">
                We'll let you know when new works arrive.
              </Text>

              <Spacer y={1} />

              {/* Body */}
              <Text variant="sm" color="black60" textAlign="center">
                When a new work by an artist you follow is added to Artsy, you'll see a notification
                on the Alerts icon at the top of your For You page.
              </Text>

              <Spacer y={2} />

              {/* Search bar image placeholder */}
              <Flex
                height={60}
                backgroundColor="black10"
                justifyContent="center"
                alignItems="center"
              >
                <Text variant="xs" color="black60">
                  [Search Bar Image Placeholder]
                </Text>
              </Flex>

              <Spacer y={2} />
            </>
          )}

          {/* Page indicator - horizontal bars */}
          <Flex flexDirection="row" justifyContent="center" mb={2}>
            {Array.from(Array(numberOfPages).keys()).map((index) => (
              <Flex
                key={index}
                style={{
                  height: 1,
                  width: barWidth - space(1),
                  marginRight: index < numberOfPages - 1 ? space(1) : 0,
                  borderRadius: 2,
                  backgroundColor: color("mono100"),
                  opacity: currentPage === index ? 1 : 0.2,
                }}
              />
            ))}
          </Flex>

          {/* CTA Button */}
          <Button block onPress={handleButtonPress}>
            {currentPage === 0 ? "Next" : "View For You"}
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
