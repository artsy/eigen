import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeader_artist$key } from "__generated__/ArtistHeader_artist.graphql"
import { LayoutChangeEvent, ViewProps } from "react-native"
export const ARTIST_HEADER_HEIGHT = 156
export const ARTIST_IMAGE_PHONE_HEIGHT = 320
export const ARTIST_IMAGE_PHONE_ASPECT_RATIO = 1.17
export const ARTIST_IMAGE_TABLET_HEIGHT = 375
const ARTIST_HEADER_SCROLL_MARGIN = 100

interface Props {
  artist: ArtistHeader_artist$key
  onLayoutChange?: ViewProps["onLayout"]
}

export const ArtistHeaderSimplified: React.FC<Props> = ({ artist, onLayoutChange }) => {
  const { updateScrollYOffset } = useScreenScrollContext()

  const descriptiveString = "artistData.formattedNationalityAndBirthday"

  const bylineRequired = true

  const hasVerifiedRepresentatives = true

  const handleOnLayout = ({ nativeEvent, ...rest }: LayoutChangeEvent) => {
    console.log("[SCRULL]: ArtistHeader onLayout", nativeEvent.layout.height)
    if (nativeEvent.layout.height > 0) {
      updateScrollYOffset(nativeEvent.layout.height - ARTIST_HEADER_SCROLL_MARGIN)
      onLayoutChange?.({ nativeEvent, ...rest })
    }
  }

  return (
    <Flex pointerEvents="box-none" onLayout={handleOnLayout}>
      <Flex pointerEvents="none" backgroundColor="purple" height={250}>
        <Text>Some Text</Text>
        <Spacer y={2} />
      </Flex>
      {/* <Box px={2} pointerEvents="none">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text variant="lg-display">artistData.name</Text>
            {!!bylineRequired && (
              <Text variant="lg-display" color="mono60">
                {descriptiveString}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {!!hasVerifiedRepresentatives && (
        <Flex pointerEvents="box-none">
          <Flex pointerEvents="none" px={2}>
            <Text pt={2} pb={1} variant="sm" color="mono60">
              Featured representation
            </Text>
          </Flex>
        </Flex>
      )}

      <Spacer y={2} /> */}
    </Flex>
  )
}
