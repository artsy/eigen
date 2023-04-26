import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkEntity } from "app/Components/ArtworkLists/ArtworkListsContext"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { FC } from "react"

const ARTWORK_IMAGE_SIZE = 50

interface ArtworkInfoProps {
  artwork: ArtworkEntity
}

export const ArtworkInfo: FC<ArtworkInfoProps> = ({ artwork }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      {/* TODO: Use reusable artwork list image component */}
      {artwork.imageURL ? (
        <OpaqueImageView
          width={ARTWORK_IMAGE_SIZE}
          height={ARTWORK_IMAGE_SIZE}
          imageURL={artwork.imageURL}
        />
      ) : (
        <Box width={ARTWORK_IMAGE_SIZE} height={ARTWORK_IMAGE_SIZE} bg="black15" />
      )}

      <Spacer x={1} />

      <Box>
        {!!artwork.artistNames && (
          <Text variant="sm-display" numberOfLines={1}>
            {artwork.artistNames}
          </Text>
        )}

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
