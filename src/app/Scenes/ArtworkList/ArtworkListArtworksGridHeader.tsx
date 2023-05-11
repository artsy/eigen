import { Flex, Separator, Text } from "@artsy/palette-mobile"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { ArtworkListTitle } from "app/Scenes/ArtworkList/ArtworkListTitle"
import { FC } from "react"

interface ArtworkListArtworksGridHeaderProps {
  title: string
  artworksCount: number
}

export const ArtworkListArtworksGridHeader: FC<ArtworkListArtworksGridHeaderProps> = ({
  title,
  artworksCount,
}) => {
  return (
    <Flex mb={1}>
      <ArtworkListTitle title={title} />
      <Separator borderColor="black10" mt={1} />
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text ml={2} variant="xs" color="black60">
          {artworksCount} {artworksCount === 1 ? "Artwork" : "Artworks"}
        </Text>

        <ArtworksFilterHeader
          onFilterPress={() => console.log("Nothing for now")}
          title="Sort"
          selectedFiltersCount={0}
          showSeparator={false}
        />
      </Flex>
    </Flex>
  )
}
