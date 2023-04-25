import { Flex, useSpace, NoImageIcon, Box, Spacer, Text } from "@artsy/palette-mobile"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"

const NO_ICON_SIZE = 18
const IMAGE_SIZE = 78
const IMAGE_OFFSET = "2px"

export const SavedArtworksList = () => {
  const space = useSpace()
  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingVertical: space(2) }}>
      <Box>
        <Flex flexDirection="row">
          <ArtworkNoImage />
          <Spacer x={IMAGE_OFFSET} />
          <ArtworkNoImage />
        </Flex>

        <Spacer y={IMAGE_OFFSET} />

        <Flex flexDirection="row">
          <ArtworkNoImage />
          <Spacer x={IMAGE_OFFSET} />
          <ArtworkNoImage />
        </Flex>
        <Spacer y={1} />
        <Text variant="xs">Saved Artworks</Text>
        <Text variant="xs" color="black60">
          0 Artworks
        </Text>
      </Box>
    </StickyTabPageScrollView>
  )
}

const ArtworkNoImage = () => {
  return (
    <Flex
      bg="black5"
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      justifyContent="center"
      alignItems="center"
      borderWidth={1}
      borderColor="black15"
    >
      <NoImageIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="black60" />
    </Flex>
  )
}
