import { Button, Flex, Image, Join, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
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
  // Platform specific code for the bottom sheet
  // due to being rendered differently on android vs ios
  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}

  return (
    <AutomountedBottomSheetModal
      enableDynamicSizing
      visible={visible}
      name="ArtistSaveOnboardingBottomSheet"
      onDismiss={onDismiss}
    >
      <BottomSheetView style={bottomSheetViewStyles}>
        <Flex mb={4} mx={2} alignItems="center">
          <Join separator={<Spacer y={2} />}>
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

            {/* Title */}
            <Text variant="lg-display" textAlign="center">
              Your followed artists are saved to Favorites.
            </Text>

            {/* Body Text */}
            <Text variant="sm" color="mono60" textAlign="center">
              Find them anytime in the Favorites tab at the bottom of your screen.
            </Text>

            {/* CTA Button */}
            <Button block onPress={onDismiss}>
              View For You
            </Button>
          </Join>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
