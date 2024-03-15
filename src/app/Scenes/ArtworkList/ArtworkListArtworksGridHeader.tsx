import { Flex, Separator, Text } from "@artsy/palette-mobile"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { ArtworkListShareability } from "app/Scenes/ArtworkList/ArtworkListShareability"
import { ArtworkListTitle } from "app/Scenes/ArtworkList/ArtworkListTitle"
import { FC } from "react"

interface ArtworkListArtworksGridHeaderProps {
  title: string
  artworksCount: number
  shareableWithPartners: boolean
  onSortButtonPress: () => void
}

export const ArtworkListArtworksGridHeader: FC<ArtworkListArtworksGridHeaderProps> = ({
  title,
  artworksCount,
  shareableWithPartners,
  onSortButtonPress,
}) => {
  return (
    <Flex>
      <ArtworkListTitle title={title} />
      <ArtworkListShareability shareableWithPartners={shareableWithPartners} />
      <Separator borderColor="black10" mt={1} />
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text ml={2} variant="xs" color="black60">
          {artworksCount} {artworksCount === 1 ? "Artwork" : "Artworks"}
        </Text>

        <ArtworksFilterHeader
          onFilterPress={onSortButtonPress}
          title="Sort"
          selectedFiltersCount={0}
          showSeparator={false}
        />
      </Flex>
    </Flex>
  )
}
