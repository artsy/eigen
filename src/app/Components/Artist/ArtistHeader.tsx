import { Flex, Box, Text, Image, useScreenDimensions, Spacer } from "@artsy/palette-mobile"
import { ArtistHeader_artist$data } from "__generated__/ArtistHeader_artist.graphql"
import { formatLargeNumberOfItems } from "app/utils/formatLargeNumberOfItems"
import { isPad } from "app/utils/hardware"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

export const ARTIST_HEADER_HEIGHT = 156
const ARTIST_IMAGE_TABLET_HEIGHT = 375

interface Props {
  artist: ArtistHeader_artist$data
  relay: RelayProp
}

export const ArtistHeader: React.FC<Props> = ({ artist }) => {
  const { width } = useScreenDimensions()
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

  return (
    <>
      {!!artist.coverArtwork?.image?.url && (
        <>
          <Image
            accessibilityLabel={`${artist.name} cover image`}
            src={artist.coverArtwork.image.url}
            pointerEvents="none"
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
              <Text variant="sm" mr={1}>
                {descriptiveString}
              </Text>
            )}
            <Text variant="sm">
              {formatLargeNumberOfItems(artist.counts?.artworks ?? 0, "work")}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(ArtistHeader, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      id
      internalID
      slug
      isFollowed
      name
      nationality
      birthday
      coverArtwork {
        image {
          url(version: "large")
        }
      }
      counts {
        artworks
        follows
      }
    }
  `,
})
