import { Flex, Box, Text, Image, useScreenDimensions, Spacer } from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeader_artist$data } from "__generated__/ArtistHeader_artist.graphql"
import { isPad } from "app/utils/hardware"
import { LayoutChangeEvent, ViewProps } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

export const ARTIST_HEADER_HEIGHT = 156
const ARTIST_IMAGE_TABLET_HEIGHT = 375
const ARTIST_HEADER_SCROLL_MARGIN = 100

interface Props {
  artist: ArtistHeader_artist$data
  relay: RelayProp
  onLayout?: ViewProps["onLayout"]
}

export const ArtistHeader: React.FC<Props> = ({ artist, onLayout }) => {
  const { width } = useScreenDimensions()
  const { updateScrollYOffset } = useScreenScrollContext()
  const isTablet = isPad()

  const getBirthdayString = () => {
    const birthday = artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  const descriptiveString = (artist.nationality || "") + getBirthdayString()

  const bylineRequired = artist.nationality || artist.birthday

  const imageSize = isTablet ? ARTIST_IMAGE_TABLET_HEIGHT : width

  const handleOnLayout = ({ nativeEvent, ...rest }: LayoutChangeEvent) => {
    if (nativeEvent.layout.height > 0) {
      updateScrollYOffset(nativeEvent.layout.height - ARTIST_HEADER_SCROLL_MARGIN)
      onLayout?.({ nativeEvent, ...rest })
    }
  }

  return (
    <Flex pointerEvents="none" onLayout={handleOnLayout}>
      {!!artist.coverArtwork?.image?.url && (
        <>
          <Image
            accessibilityLabel={`${artist.name} cover image`}
            src={artist.coverArtwork.image.url}
            aspectRatio={width / imageSize}
            width={width}
            height={imageSize}
            style={{ alignSelf: "center" }}
          />
          <Spacer y={2} />
        </>
      )}
      <Box px={2} pb={1}>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text variant="lg">{artist.name}</Text>
            {!!bylineRequired && (
              <Text variant="lg" color="black60">
                {descriptiveString}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(ArtistHeader, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      name
      nationality
      birthday
      coverArtwork {
        image {
          url(version: "large")
        }
      }
    }
  `,
})
