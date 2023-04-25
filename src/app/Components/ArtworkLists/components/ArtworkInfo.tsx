import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"

const ARTWORK_IMAGE_SIZE = 50

export const ArtworkInfo = () => {
  const { state } = useArtworkListsContext()
  const artwork = state.artwork!

  const getArtistNames = () => {
    if (!artwork.artistNames) {
      return "Artist Unavailable"
    }

    return artwork.artistNames
  }

  return (
    <Flex flexDirection="row" alignItems="center">
      <Box width={ARTWORK_IMAGE_SIZE} height={ARTWORK_IMAGE_SIZE} bg="black15" />
      <Spacer x={1} />
      <Box>
        <Text variant="sm-display" numberOfLines={1}>
          {getArtistNames()}
        </Text>
        <Text variant="sm" color="black60" numberOfLines={2}>
          <Text variant="sm" color="black60" italic>
            {artwork.title}
          </Text>
          {artwork.year && `, ${artwork.year}`}
        </Text>
      </Box>
    </Flex>
  )
}
