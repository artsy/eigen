import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { EntityPreview } from "app/Components/ArtworkLists/components/EntityPreview"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import { FC } from "react"

interface ArtworkInfoProps {
  artwork: ArtworkEntity
}

export const ArtworkInfo: FC<ArtworkInfoProps> = ({ artwork }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <EntityPreview imageURL={artwork.imageURL} />

      <Spacer x={1} />

      <Flex flex={1}>
        {!!artwork.artistNames && (
          <Text variant="sm-display" numberOfLines={1}>
            {artwork.artistNames}
          </Text>
        )}

        <Text variant="sm" color="black60" numberOfLines={1}>
          <Text variant="sm" color="black60" italic>
            {artwork.title}
          </Text>
          {!!artwork.year && `, ${artwork.year}`}
        </Text>
      </Flex>
    </Flex>
  )
}
