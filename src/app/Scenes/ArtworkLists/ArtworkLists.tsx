import { Flex, useSpace, Box, Spacer, Text } from "@artsy/palette-mobile"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkNoImage } from "app/Scenes/ArtworkLists/ArtworkNoImage"

const IMAGE_OFFSET = "2px"

export const ArtworkLists = () => {
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
